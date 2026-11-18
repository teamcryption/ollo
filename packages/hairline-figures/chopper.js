/**
 * Chopper: a low bike with a fat rear wheel, a teardrop tank over a twin
 * engine and a long raked fork out front under tall ape-hanger bars. The
 * pointer steers it: the bars, the long fork and the front wheel swing round
 * the steering head toward the pointer's side. At rest the headlight is
 * bright and the front sits a little turned. The slider is the steering lock.
 *
 * The pattern: one continuous steering angle on a spring; the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, fit, hull, poly, open, proj, rings, prism, run, circ, seg, unproj, spring, stepS, rad, clamp,
  disposer, mk, pointer, register, solid, put, facing,
} = HL;

const HX = 18, RR = 12, RF = 10, FX = 52, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-46, -10, 0], [64, 10, 0], [-46, 0, 26], [FX, -24, 0], [FX, 24, 0], [HX - 8, -16, 50], [HX - 8, 16, 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const ID = (x, y, z) => P(x, y, z);
  const ring = (T, cx, cz, R, off) => { const o = []; for (let i = 0; i < 32; i++) { const s = (i / 32) * Math.PI * 2; o.push(T(cx + R * Math.cos(s), off, cz + R * Math.sin(s))); } return o; };
  const wheel = (el, hub, T, cx, R, hw) => {
    el.sil.setAttribute("d", poly(hull(ring(T, cx, R, R, -hw).concat(ring(T, cx, R, R, hw)))));
    hub.setAttribute("d", poly(ring(T, cx, R, R - 4.5, hw)));
  };
  const bar = (T, a, b, r) => hull(circ(r, 10).flatMap((q) => [T(a[0] + q.u, a[1] + q.v, a[2]), T(b[0] + q.u, b[1] + q.v, b[2])]));
  const rw = solid(g), rhub = mk("path", { class: "nf lo" }, rw.g);
  wheel(rw, rhub, ID, -32, RR, 4.5);
  const frame = mk("path", { class: "sil", d: [[[-32, 0, RR], [-12, 0, 22]], [[-30, 0, RR], [4, 0, 7]], [[4, 0, 7], [HX + 4, 0, 30]], [[-12, 0, 22], [HX, 0, 34]]].map(([a, b]) => poly(bar(ID, a, b, 1.6))).join("") }, g);
  const [er, ei] = rings(-8, -6, 8, 6, 3, 1.2);
  put(solid(g), prism(P, front, er, ei, 6, 20));
  const tank = solid(g);
  const [tr, ti] = rings(-6, -6, 14, 6, 6, 1.4);
  put(tank, prism(P, front, tr, ti, 27, 34));
  const [sr, si] = rings(-26, -6, -10, 6, 4, 1.2);
  put(solid(g), prism(P, front, sr, si, 21, 24));
  const forkF = mk("path", { class: "sil" }, g);
  const fw = solid(g), fhub = mk("path", { class: "nf lo" }, fw.g);
  const forkN = mk("path", { class: "sil" }, g);
  const bars = mk("path", { class: "nf sil" }, g);
  const lamp = mk("path", { class: "sil" }, g);
  let drawn = NaN;

  function draw(a) {
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a);
    const T = (x, y, z) => P(HX + (x - HX) * c - y * s, (x - HX) * s + y * c, z);
    forkF.setAttribute("d", poly(bar(T, [HX + 2, -4, 34], [FX, -4, RF], 1.3)));
    wheel(fw, fhub, T, FX, RF, 2.6);
    forkN.setAttribute("d", poly(bar(T, [HX + 2, 4, 34], [FX, 4, RF], 1.3)));
    lamp.setAttribute("d", poly(bar(T, [HX + 6, 0, 33], [HX + 8, 0, 33], 3.2)));
    bars.setAttribute("d", seg(T(HX, -4, 35), T(HX - 2, -12, 48)) + seg(T(HX - 2, -12, 48), T(HX - 9, -15, 48)) +
      seg(T(HX, 4, 35), T(HX - 2, 12, 48)) + seg(T(HX - 2, 12, 48), T(HX - 9, 15, 48)));
  }

  const sp = spring(rad(REST));
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  let last = null;
  function aim(k) {
    const on = k !== null;
    sp.t = rad(on ? amp * k : REST);
    lamp.classList.toggle("hi", !on);
    bars.classList.toggle("hi", on);
    fw.sil.classList.toggle("hi", on);
    const deg = Math.round(on ? amp * k : REST);
    read.textContent = on ? (deg < 0 ? "L " : deg > 0 ? "R " : "") + Math.abs(deg) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      last = x > -56 && x < 74 && Math.abs(y) < 40 ? clamp(y / 24, -1, 1) : null;
      aim(last);
    },
    leave: () => { last = null; aim(null); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(sp.x);
  aim(null);
  return { set: (v) => { amp = v; aim(last); }, destroy: bag.dispose };
}

hairline({
  name: "chopper",
  means: "A chopper motorbike: the pointer steers it, the tall bars, long raked fork and front wheel swinging toward its side.",
  rules: [1, 3, 5, 8],
  range: [15, 30, 40],
  tour: [[223, 251], [170, 150], [232, 289], null],
  mount,
});
