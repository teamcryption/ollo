/**
 * Louvred pergola: four posts carrying a frame, and a roof of slats that
 * turn on their long axes. The pointer over the roof opens the slats, the
 * one under it the furthest and the rest a little less, staggered from it.
 * At rest the roof is shut but for one slat standing ajar, bright. The
 * slider is how far the slats open.
 *
 * The pattern: a field of parts turning, spread from the pointer.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, unproj, rad, clamp,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const L = 84, W = 56, H = 52, N = 8, PITCH = L / N, HW = 6.4, FAV = 5, REST = 8, AJAR = 50;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-8, -8, 0], [L + 8, W + 8, 0], [L + 8, -8, 0], [-8, W + 8, 0], [0, 0, H + 8], [L, W, H + 8]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(-8, -8, L + 8, W + 8, 8, 2);
  put(solid(g), prism(P, front, gr, gi, -3, 0));
  const box = (x0, y0, x1, y1, z0, z1) => { const [a, b] = rings(x0, y0, x1, y1, 1.2, 0.6); put(solid(g), prism(P, front, a, b, z0, z1)); };
  // posts, far to near
  for (const [x, y] of [[0, 0], [L, 0], [0, W], [L, W]]) box(x - 2, y - 2, x + 2, y + 2, 0, H - 3);
  // far beams
  box(-3, -3, L + 3, 1, H - 3, H + 3);
  box(-3, -3, 1, W + 3, H - 3, H + 3);

  const slats = [];
  for (let i = 0; i < N; i++) {
    const xc = PITCH * (i + 0.5), body = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
    slats.push({ i, xc, body, face, t: tween(i === FAV ? AJAR : REST), last: NaN });
  }
  // near beams, over the slats' ends
  box(-3, W - 1, L + 3, W + 3, H - 3, H + 3);
  box(L - 1, -3, L + 3, W + 3, H - 3, H + 3);

  function draw(s, A) {
    if (A === s.last) return;
    s.last = A;
    const c = Math.cos(rad(A)), sn = Math.sin(rad(A)), th = 1.3;
    const pt = (u, y, d) => P(s.xc + u * c + d * sn, y, H - u * sn + d * c);
    const top = [pt(-HW, 2, 0), pt(HW, 2, 0), pt(HW, W - 2, 0), pt(-HW, W - 2, 0)];
    const bot = [pt(-HW, 2, -th), pt(HW, 2, -th), pt(HW, W - 2, -th), pt(-HW, W - 2, -th)];
    s.body.setAttribute("d", poly(hull(top.concat(bot))));
    s.face.setAttribute("d", open([top[3], top[0], top[1]]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of slats) { draw(s, tval(s.t, now)); if (!tdone(s.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -6 || x > L + 6 || y < -10 || y > W + 10) return -1;
    return clamp(Math.floor(x / PITCH), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    slats.forEach((s, k) => {
      const d = Math.abs(k - a);
      const to = a < 0 ? (k === FAV ? AJAR : REST) : amp * Math.max(0.45, 1 - 0.14 * d);
      tset(s.t, to, now, from < 0 ? 0 : Math.abs(k - from) * 40);
      s.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a + 1 + "/" + N;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; const a = act; act = -2; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "pergola",
  means: "A pergola roofed with slats: the pointer over the roof turns them open, the one under it furthest, the rest staggered from it.",
  rules: [1, 2, 5, 8],
  range: [40, 70, 88],
  tour: [[191, 110], [151, 91], [250, 140], null],
  mount,
});
