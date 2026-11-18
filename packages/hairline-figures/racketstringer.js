/**
 * Racket stringer: a stringing machine on its pedestal, the tension head
 * fixed at the back, and on top the turntable with a racket clamped across
 * its mounting bar. The pointer is what the turntable turns to: it swivels
 * on a spring until the racket's head points at the pointer. At rest the
 * racket lies across the frame, its frame bright. The slider is how far the
 * turntable may swing from rest.
 *
 * The pattern: a continuous aim (terrain's spring, on one angle).
 */
const {
  Cam, circ, clamp, facing, fillet, fit, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = rad(-30), ZT = 32, ZR = 38;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const spin = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let M = rad(value);
  const C = Cam(45, 0.5, 4.0);
  const ext = [];
  for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; ext.push([Math.cos(a) * 30, Math.sin(a) * 30, ZR + 3], [Math.cos(a) * 14, Math.sin(a) * 14, 0]); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the foot, the tension head at the back, the column, the turntable
  const [fr, fi] = rings(-14, -14, 14, 14, 5, 1.6);
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  const [tr, ti] = rings(-20, -9, -8, 1, 3, 1.2);
  put(solid(g), prism(P, front, tr, ti, 20, 27));
  mk("path", { d: seg(P(-8, -4, 23.5), P(-3, -4, 23.5)), class: "lo" }, g);
  put(solid(g), prism(P, front, disc(0, 0, 3), disc(0, 0, 2), 3, ZT));
  put(solid(g), prism(P, front, disc(0, 0, 11), disc(0, 0, 9.5), ZT, ZT + 2.5));

  // the turning part: mounting bar, racket, clamps
  const top = mk("g", {}, g);
  const bar = solid(top);
  const frame = mk("path", { class: "sil hi" }, top), bed = mk("path", { class: "nf lo" }, top);
  const strings = mk("path", { class: "lo nf" }, top);
  const clamps = [solid(top), solid(top)];

  const HC = 7, A = 15, Bv = 11.5, T = 2.2;
  const rot = (u, v, a) => [u * Math.cos(a) - v * Math.sin(a), u * Math.sin(a) + v * Math.cos(a)];
  const ell = (a, b, sa, n = 36) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * Math.PI * 2; const [x, y] = rot(HC + a * Math.cos(t), b * Math.sin(t), sa); o.push(P(x, y, ZR)); } return o; };
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const [br, bi] = rings(-24, -2.5, 24, 2.5, 2.4, 0.9);
    put(bar, prism(P, front, spin(br, a), spin(bi, a), ZT + 2.5, ZT + 4.5));
    const hp = (u, v) => { const [x, y] = rot(u, v, a); return P(x, y, ZR); };
    const out = [];
    for (let k = 0; k <= 30; k++) { const t = -(Math.PI - 0.55) + (k / 30) * 2 * (Math.PI - 0.55); out.push(hp(HC + A * Math.cos(t), Bv * Math.sin(t))); }
    out.push(hp(-13, 1.7), hp(-26, 1.7), hp(-26, -1.7), hp(-13, -1.7));
    frame.setAttribute("d", poly(fillet(out, out.map(() => 2))));
    bed.setAttribute("d", poly(ell(A - T, Bv - T, a)));
    let d = "";
    for (let i = -2; i <= 2; i++) {
      const v = i * 3.6, h = (A - T) * Math.sqrt(1 - (v / (Bv - T)) ** 2);
      d += seg(hp(HC - h, v), hp(HC + h, v));
      const u = i * 4.8, w = (Bv - T) * Math.sqrt(1 - (u / (A - T)) ** 2);
      d += seg(hp(HC + u, -w), hp(HC + u, w));
    }
    d += seg(hp(-24, 0), hp(-14, 0));
    strings.setAttribute("d", d);
    [HC - A - 1.5, HC + A + 1.5].forEach((u, k) => {
      const [x, y] = rot(u, 0, a);
      put(clamps[k], prism(P, front, disc(x, y, 1.8, 20), disc(x, y, 1.1, 20), ZT + 4.5, ZR + 2));
    });
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function aim(p) {
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (Math.hypot(x, y) < 4) return;
    let d = Math.atan2(y, x) - REST;
    d = Math.atan2(Math.sin(d), Math.cos(d));
    sp.t = REST + clamp(d, -M, M);
    read.textContent = Math.round(((sp.t - REST) * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { M = rad(v); }, destroy: bag.dispose };
}

hairline({
  name: "racketstringer",
  means: "A racket stringing machine: its turntable swivels on a spring until the clamped racket's head points at the pointer.",
  rules: [1, 3, 5, 8],
  range: [40, 90, 150],
  tour: [[158, 300], [60, 250], [320, 200], null],
  mount,
});
