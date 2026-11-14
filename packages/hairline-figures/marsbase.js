/**
 * Mars base: four habitat domes on a landing pad, joined by low tunnels. The
 * pointer picks a dome by where it stands on the ground: that dome inflates
 * tall and its neighbours swell a little, staggered from it. At rest the
 * domes stand at uneven heights, the far one bright. The slider is the stagger.
 *
 * The pattern: one of many on a plane, picked by world position (terrain).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 3, FAV = 0;
const DOMES = [[0, 0, 18, 0.85], [46, 0, 13, 0.55], [0, 44, 14, 0.7], [44, 42, 11, 1]];
const TUNNELS = [[16.5, -4, 35, 4], [-4, 16, 4, 32], [42, 12, 48, 32]];
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-30, -30, 0], [66, 62, 0], [66, -30, 0], [-30, 62, 0], [0, 0, PZ + 18 * 1.5], [46, 0, PZ + 16]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-30, -28, 66, 62, 16, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));
  // order back to front by x + y; tunnels sit between the domes they join
  const items = DOMES.map(([x, y, r, f], k) => ({ k, x, y, r, f, z: tween(f), last: NaN }));
  const paint = [["d", 0], ["t", 0], ["t", 1], ["d", 1], ["t", 2], ["d", 2], ["d", 3]];
  for (const [kind, k] of paint) {
    if (kind === "t") {
      const [x0, y0, x1, y1] = TUNNELS[k], [tr, ti] = rings(x0, y0, x1, y1, 3.5, 1);
      put(solid(g), prism(P, front, tr, ti, PZ, PZ + 7));
    } else {
      const it = items[k];
      it.grp = mk("g", {}, g);
      it.dome = mk("path", { class: "sil" }, it.grp);
      it.seam = mk("path", { class: "nf lo" }, it.grp);
      it.hatch = mk("path", { class: "nf" }, it.grp);
    }
  }

  function draw(it, f) {
    if (f === it.last) return;
    it.last = f;
    const H = it.r * f, pts = [];
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * (Math.PI / 2); pts.push(...ringAt(P, disc(it.x, it.y, it.r * Math.cos(t), 32), PZ + H * Math.sin(t))); }
    it.dome.setAttribute("d", poly(hull(pts)));
    const sr = it.r * Math.cos(Math.PI / 6), sz = PZ + H * 0.5;
    it.seam.setAttribute("d", poly(ringAt(P, disc(it.x, it.y, sr, 40), sz)));
    const hz = PZ + H;
    it.hatch.setAttribute("d", poly(hull(ringAt(P, disc(it.x, it.y, it.r * 0.22, 16), hz - 0.5).concat(ringAt(P, disc(it.x, it.y, it.r * 0.22, 16), hz + 1.6)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, PZ + 6);
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.hypot(x - it.x, y - it.y) - it.r; if (d < bd) { bd = d; best = k; } });
    return bd < 10 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), f = a < 0 ? it.f : dd === 0 ? 1.6 : dd === 1 ? it.f + 0.3 : it.f;
      tset(it.z, f, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.dome.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hab " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "marsbase",
  means: "Four habitat domes on a pad joined by tunnels: the dome under the pointer inflates tall and its neighbours swell a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[290, 160], [205, 200], [120, 180], null],
  mount,
});
