/**
 * French horn: the coiled brass on a horn stand, three rotary valves with
 * their levers on top of the coil, the leadpipe running out to the
 * mouthpiece, and the wide bell flaring from the coil's side. The horn swivels
 * on its stand to point its bell at the pointer. At rest it turns its bell
 * toward the viewer with the bell's rim bright. The slider is how far it can
 * swing from rest.
 */
const { Cam, circ, clamp, fit, hull, open, poly, prism, proj, seg, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const H = 62, A0 = -0.6, MAX = 1.3;
const BELL = [[16, 3.5], [30, 6], [42, 10], [50, 17], [53, 22]];
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const ext = [];
  for (let k = 0; k < 8; k++) { const t = (k / 8) * Math.PI * 2; ext.push([56 * Math.cos(t), 56 * Math.sin(t), H - 30], [40 * Math.cos(t), 40 * Math.sin(t), H + 34]); }
  ext.push([0, 0, 0]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, () => true, circ(22, 48), circ(20.5, 48), 0, 2.5));
  mk("path", { class: "nf sil", d: seg(P(0, 0, 2.5), P(0, 0, H - 28)) }, g);
  const horn = mk("g", {}, g);
  const coil = mk("path", { class: "nf sil" }, horn), inner = mk("path", { class: "nf lo" }, horn);
  const pipe = mk("path", { class: "nf sil" }, horn), mouth = mk("path", {}, horn);
  const valves = [0, 1, 2].map(() => mk("path", { class: "sil" }, horn));
  const levers = mk("path", { class: "nf sil" }, horn);
  const bellG = mk("g", {}, g), bell = mk("path", { class: "sil" }, bellG), rim = mk("path", { class: "nf hi" }, bellG), throat = mk("path", { class: "nf lo" }, bellG);
  const sp = spring(A0);
  let lim = MAX * value, last = NaN, bellFirst = null;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const c = Math.cos(a), s = Math.sin(a);
    const T = (u, v, w) => P(u * c - v * s, u * s + v * c, H + w);
    const loop = (r, v, n = 56) => Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * Math.PI * 2; return T(r * Math.cos(t), v, r * Math.sin(t)); });
    coil.setAttribute("d", [26, 21].map((r, i) => open(loop(r, i * 3 - 1.5))).join(""));
    inner.setAttribute("d", open(loop(16, 3)));
    pipe.setAttribute("d", open([T(-10, 0, 25), T(-24, 0, 20), T(-38, 0, 12), T(-46, 0, 8)]));
    mouth.setAttribute("d", poly(hull(circ(3, 16).map((q) => T(-46, q.u, 8 + q.v)).concat(circ(1.5, 12).map((q) => T(-51, q.u, 7 + q.v))))));
    [-9, 0, 9].forEach((u, i) => valves[i].setAttribute("d", poly(hull(circ(3.6, 18).flatMap((q) => [T(u + q.u, -5, 27 + q.v), T(u + q.u, 5, 27 + q.v)])))));
    levers.setAttribute("d", [-9, 0, 9].map((u) => seg(T(u, 5, 27), T(u - 6, 9, 35))).join(""));
    const ring = (u, r) => circ(r, 40).map((q) => T(u, q.u, -12 + q.v));
    bell.setAttribute("d", poly(hull(BELL.flatMap(([u, r]) => ring(u, r)))));
    rim.setAttribute("d", poly(ring(53, 22)));
    throat.setAttribute("d", poly(ring(53, 13)));
    // the bell is painted after the coil when its axis turns toward the viewer
    const bf = c + s < 0;
    if (bf !== bellFirst) { bellFirst = bf; if (bf) horn.before(bellG); else horn.after(bellG); }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    sp.t = t === null ? A0 : A0 + clamp(wrap(t - A0), -lim, lim);
    read.textContent = t === null ? "rest" : Math.round(((sp.t - A0) * 180) / Math.PI) + "°";
    B.wake();
  }
  let over = null;
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], H - 12), r = Math.hypot(x, y);
      over = r < 8 || r > 110 ? null : Math.atan2(y, x);
      aim(over);
    },
    leave: () => { over = null; aim(null); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(null);
  return { set: (v) => { lim = MAX * v; aim(over); }, destroy: bag.dispose };
}

hairline({
  name: "frenchhorn",
  means: "A French horn on its stand: the coiled brass swivels to point its bell at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.6],
  tour: [[200, 250], [111, 140], [289, 140], null],
  mount,
});
