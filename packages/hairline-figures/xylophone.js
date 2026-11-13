/**
 * Xylophone: ten bars of falling length across two rails on a four-legged
 * stand, two mallets held over them. The pointer plays: the bars near it
 * press down, each on its own spring, the one under it deepest and bright,
 * and a mallet moves over it. At rest a chord is held, its middle bar bright.
 * The slider is the reach, in bars.
 *
 * The pattern: a continuous field (terrain) along one row; the hit is on the
 * plane of the bars' resting tops, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, seg, unproj, spring, stepS,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 10, STEP = 11, BW = 9, BH = 4, DMAX = 6, RY = 12, LEGH = 34, X1 = N * STEP;
const len = (k) => 72 - k * 4.4, cx = (k) => k * STEP + 1 + BW / 2;
const FAV = 3, CHORD = { 2: 0.55, 3: 1, 4: 0.55 }, MZ = BH + 13;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-4, -40, -LEGH], [X1 + 4, 40, -LEGH], [X1 + 4, -40, -LEGH], [-4, 40, -LEGH], [-4, -40, MZ + 26], [X1 + 14, 44, MZ + 26]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1, el = solid(g)) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(el, prism(P, front, o, i, z0, z1)); return el; };

  // the stand: far legs and stretcher, near legs and stretcher, then the two rails
  for (const s of [-1, 1]) {
    for (const x of [3, X1 - 3]) block(x - 1.6, s * RY - 1.6, x + 1.6, s * RY + 1.6, 1.2, 0.5, -LEGH, -4);
    block(3, s * RY - 1, X1 - 3, s * RY + 1, 0.9, 0.4, -LEGH + 7, -LEGH + 9.5);
  }
  block(-2, -RY - 2.2, X1 + 2, -RY + 2.2, 1.6, 0.7, -4, 0);
  block(-2, RY - 2.2, X1 + 2, RY + 2.2, 1.6, 0.7, -4, 0);

  const bars = [];
  for (let k = 0; k < N; k++) {
    const L = len(k), x0 = k * STEP + 1, [ring, inner] = rings(x0, -L / 2, x0 + BW, L / 2, 1.8, 0.8);
    const rest = (CHORD[k] || 0) * DMAX * 0.6;
    bars.push({ k, L, ring, inner, rest, el: solid(g), sp: spring(rest, { eps: 0.02 }), drawn: NaN });
  }

  // two mallets: a round head on a stick; the first follows the chosen bar
  const mallets = [0, 1].map((m) => ({ stick: mk("path", { class: "nf" }, g), head: mk("path", {}, g), at: tween(m ? FAV + 3 : FAV), z: m ? 6 : 0, last: NaN }));
  function drawMallet(ml, idx) {
    if (idx === ml.last) return;
    ml.last = idx;
    const x = idx * STEP + 1 + BW / 2, z = MZ + ml.z, pts = [];
    for (let i = -3; i <= 3; i++) { const t = (i / 3) * (Math.PI / 2); pts.push(...ringAt(P, disc(x, 2, 4.4 * Math.cos(t)), z + 4.4 * Math.sin(t))); }
    ml.head.setAttribute("d", poly(hull(pts)));
    ml.stick.setAttribute("d", seg(P(x, 2, z), P(x + 10, 42, z + 24)));
  }

  function draw(b) {
    const d = clamp(b.sp.x, 0, DMAX);
    if (d === b.drawn) return;
    b.drawn = d;
    put(b.el, prism(P, front, b.ring, b.inner, -d, BH - d));
  }
  const B = register(stage, (dt, now) => {
    let m = false;
    for (const b of bars) { if (stepS(b.sp, dt)) m = true; draw(b); }
    for (const ml of mallets) { drawMallet(ml, tval(ml.at, now)); if (!tdone(ml.at, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    const hit = over ? bars[clamp(Math.floor(over[0] / STEP), 0, N - 1)] : null, a = hit ? hit.k : FAV, now = performance.now();
    for (const b of bars) {
      b.sp.t = !over ? b.rest : b === hit ? DMAX : DMAX * 0.8 * falloff(Math.abs(cx(b.k) - over[0]) / (RAD * STEP));
      b.el.sil.classList.toggle("hi", b.k === a);
    }
    tset(mallets[0].at, a, now, 0);
    tset(mallets[1].at, a > 5 ? a - 3 : a + 3, now, 40);
    read.textContent = hit ? "bar " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], BH);
      over = x > -3 && x < X1 + 3 && Math.abs(y) < 40 ? [clamp(x, 0, X1 - 0.01), y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "xylophone",
  means: "A xylophone on its stand: the bars near the pointer press down, the one under it deepest, a mallet over it.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[166, 120], [177, 155], [230, 195], null],
  mount,
});
