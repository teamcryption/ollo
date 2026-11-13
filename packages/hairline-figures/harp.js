/**
 * Harp: a concert harp on its pedestal, a column at the front, a soundboard
 * rising to a curved neck, and twelve strings between them. The pointer
 * plucks: the strings near it bow out and ring, each on its own spring, the
 * one under it most and bright. At rest three strings hang bowed, the middle
 * one bright. The slider is the reach, in strings.
 *
 * The pattern: a continuous field along one row; the hit is each string's
 * rest centre on screen, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 12, X0 = 14, SX = 6, BMAX = 9, FAV = 6, CHORD = { 5: 0.4, 6: 0.8, 7: 0.4 };
const SA = [2.3, 10.1], SB = [89.6, 125.7];
const NECK = [[-2, 148], [40, 136], [70, 142], [98, 128]];
const boardZ = (x) => SA[1] + ((x - SA[0]) * (SB[1] - SA[1])) / (SB[0] - SA[0]);
function neckZ(x) {
  for (let i = 0; i < NECK.length - 1; i++) { const [a, b] = [NECK[i], NECK[i + 1]]; if (x <= b[0]) return a[1] + ((x - a[0]) * (b[1] - a[1])) / (b[0] - a[0]); }
  return NECK[NECK.length - 1][1];
}
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);
const disc = (r, n = 24) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-14, -16, 0], [34, 16, 0], [-14, 16, 0], [34, -16, 0], [0, 0, 158], [98, 0, 132], [50, BMAX + 2, 80]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  /** A beam in the harp's plane from a to b ([x, z]), its rounded section ha × wa at a and hb × wb at b. */
  function beam(a, b, ha, wa, hb, wb, crease) {
    const dx = b[0] - a[0], dz = b[1] - a[1], L = Math.hypot(dx, dz), n = [-dz / L, dx / L];
    const sec = (p, h, w) => rrect(-w, -h, w, h, Math.min(w, h) * 0.6, 4).map((q) => P(p[0] + q.v * n[0], q.u, p[1] + q.v * n[1]));
    const el = solid(g);
    el.sil.setAttribute("d", poly(hull(sec(a, ha, wa).concat(sec(b, hb, wb)))));
    if (crease) el.cr.setAttribute("d", seg(P(a[0] + n[0] * ha, wa * 0.5, a[1] + n[1] * ha), P(b[0] + n[0] * hb, wb * 0.5, b[1] + n[1] * hb)));
    return el;
  }

  // pedestal with two feet, the column, the soundboard, the neck in three pieces, the capital
  const [pr, pi] = rings(-12, -14, 32, 14, 5, 1.6);
  put(solid(g), prism(P, front, pr, pi, 2, 9));
  for (const [x, y] of [[-6, -9], [26, -9], [-6, 9], [26, 9]]) put(solid(g), prism(P, front, circ(2.4, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), circ(1.6, 16).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), 0, 2));
  put(solid(g), prism(P, front, disc(4.4), disc(3.2), 9, 146));
  beam([8, 8], [92, 124], 7, 9, 3, 4, true);
  for (let i = 0; i < NECK.length - 1; i++) beam(NECK[i], NECK[i + 1], 5, 3.6, 5, 3.6, false);
  put(solid(g), prism(P, front, disc(6.2), disc(5), 144, 156));

  const strings = [];
  for (let i = 0; i < N; i++) {
    const x = X0 + i * SX, z0 = boardZ(x), z1 = neckZ(x) - 4.6, rest = (CHORD[i] || 0) * BMAX * 0.5;
    const el = mk("path", { class: "nf" }, g);
    strings.push({ i, x, z0, z1, el, rest, sp: spring(rest, { c: 7, eps: 0.03 }), drawn: NaN, mid: P(x, 0, (z0 + z1) / 2), top: P(x, 0, z1)[1], bot: P(x, 0, z0)[1] });
  }
  // a string rings: its spring is underdamped (c 7) so the bow overshoots and settles, as a plucked string does
  function draw(s) {
    const d = clamp(s.sp.x, -BMAX, BMAX);
    if (d === s.drawn) return;
    s.drawn = d;
    const pts = [];
    for (let j = 0; j <= 10; j++) { const t = j / 10; pts.push(P(s.x, d * Math.sin(Math.PI * t), s.z0 + (s.z1 - s.z0) * t)); }
    s.el.setAttribute("d", open(pts));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const s of strings) { if (stepS(s.sp, dt)) m = true; draw(s); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    for (const s of strings) {
      s.sp.t = over === null ? s.rest : s.i === over ? BMAX : BMAX * 0.8 * falloff(Math.abs(s.i - over) / RAD);
      s.el.classList.toggle("hi", s.i === (over === null ? FAV : over));
    }
    read.textContent = over === null ? "rest" : "string " + (over + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      let best = null, bd = Infinity;
      for (const s of strings) { const d = Math.abs(s.mid[0] - sx); if (d < bd && sy > s.top - 6 && sy < s.bot + 6) { bd = d; best = s.i; } }
      over = bd < 8 ? best : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; if (over !== null) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "harp",
  means: "A concert harp: the strings near the pointer bow out and ring, the one under it most.",
  rules: [1, 3, 5, 8],
  range: [1, 2.5, 4],
  tour: [[177, 142], [218, 145], [253, 135], null],
  mount,
});
