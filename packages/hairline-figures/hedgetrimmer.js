/**
 * Hedge trimmer: the motor body with its rear handle, the front loop handle
 * and the guard, and the long flat blade with its teeth. The pointer across
 * the trimmer is where the cut sweeps: the whole trimmer turns about its rear
 * handle, on a spring. At rest it points straight ahead, the teeth bright.
 * The slider is how far it can sweep.
 */
const {
  Cam, clamp, fit, hull, open, poly, proj, rrect, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = -28, REST = -14, AMP = 50, VMAX = 1.3;
const AX = { z: (u, v, w) => [u, v, w], y: (u, v, w) => [u, w, v], x: (u, v, w) => [w, u, v] };
const PARTS = [
  ["y", -38, 3, -20, 21, -2.5, 2.5, 6, 1],
  ["z", -24, -9, 10, 9, 0, 14, 6, 1.5],
  ["x", -13, 6, 13, 26, 4, 7, 7, 1],
  ["x", -11, 1, 11, 15, 12, 13.5, 3, 0.6],
  ["z", 12, -3, 86, 3, 6, 8.5, 3, 0.8],
];

function yaw(deg) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return ([x, y, z]) => [PX + (x - PX) * c - y * s, (x - PX) * s + y * c, z];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.6);
  const box = [];
  for (let d = REST; d <= REST + AMP * VMAX; d += 8) for (const x of [-38, 86]) for (const y of [-13, 13]) for (const z of [0, 26]) box.push(yaw(d)([x, y, z]));
  fit(C, box, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const els = PARTS.map(() => solid(g));
  const teeth = mk("path", { class: "nf hi" }, g);
  const sp = spring(REST);
  let drawn = NaN;

  function slab(T, [axis, u0, v0, u1, v1, w0, w1, r, b]) {
    const o = AX[axis], R = rrect(u0, v0, u1, v1, r, 4), I = rrect(u0 + b, v0 + b, u1 - b, v1 - b, Math.max(0.3, r - b), 4);
    const at = (ring, w) => ring.map((q) => P(...T(o(q.u, q.v, w))));
    return { sil: poly(hull(at(R, w0).concat(at(R, w1)))), crease: poly(at(I, w1)) };
  }
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-3) return;
    drawn = sp.x;
    const T = yaw(sp.x);
    PARTS.forEach((p, i) => put(els[i], slab(T, p)));
    let d = "";
    for (const side of [-1, 1]) {
      const pts = [];
      for (let x = 16, k = 0; x <= 84; x += 3, k++) pts.push(P(...T([x, side * (k % 2 ? 6.5 : 3), 7.2])));
      d += open(pts);
    }
    teeth.setAttribute("d", d);
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(t) {
    sp.t = t == null ? REST : REST + t * AMP * amp;
    read.textContent = t == null ? "rest" : Math.round(sp.t) + "°";
    B.wake();
  }
  let last = null;
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      last = Math.abs(y) > 80 || x < -60 || x > 110 ? null : clamp((y + 40) / 100, 0, 1);
      aim(last);
    },
    leave: () => { last = null; aim(null); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  return {
    set: (v) => { amp = v; if (last != null) aim(last); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "hedgetrimmer",
  means: "A hedge trimmer: the pointer across it is where the cut sweeps, the whole trimmer turning about its rear handle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.3],
  tour: [[250, 170], [201, 222], [160, 250], null],
  mount,
});
