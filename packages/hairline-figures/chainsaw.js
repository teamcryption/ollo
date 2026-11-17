/**
 * Chainsaw: the engine body with its rear handle, the top handle and the
 * hand guard, and the long bar with its chain. The pointer along the saw is
 * how far the nose kicks up: the whole saw tips back on its rear handle, on a
 * spring. At rest it lies almost flat, the chain bright. The slider is how
 * far it can tip.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rrect, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = -36, REST = 6, AMP = 30, VMAX = 1.4;
const AX = { z: (u, v, w) => [u, v, w], y: (u, v, w) => [u, w, v], x: (u, v, w) => [w, u, v] };
const PARTS = [
  ["z", -36, -3, -20, 3, 4, 12, 3, 1],
  ["z", -22, -10, 12, 10, 0, 20, 6, 1.5],
  ["z", -17, -3, -13, 3, 18, 30, 1.5, 0.6],
  ["z", 2, -3, 6, 3, 18, 30, 1.5, 0.6],
  ["y", -18, 26, 7, 31, -3, 3, 2.4, 0.8],
  ["x", -9, 16, 9, 34, 12, 14, 3, 0.6],
  ["y", 10, 4, 76, 16, -1.5, 1.5, 6, 1],
];

function tilt(deg) {
  const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
  return ([x, y, z]) => [PX + (x - PX) * c - z * s, y, (x - PX) * s + z * c];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.9);
  const box = [];
  for (const d of [0, REST + AMP * VMAX]) for (const x of [-36, 78]) for (const y of [-10, 10]) for (const z of [0, 34]) box.push(tilt(d)([x, y, z]));
  fit(C, box, 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const els = PARTS.map(() => solid(g));
  const chain = mk("path", { class: "nf hi" }, g);
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
    const T = tilt(sp.x);
    PARTS.forEach((p, i) => put(els[i], slab(T, p)));
    chain.setAttribute("d", poly(rrect(8, 2, 78, 18, 8, 6).map((q) => P(...T([q.u, 1.6, q.v])))));
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
      last = Math.abs(y) > 45 || x < -60 || x > 100 ? null : clamp((x + 40) / 116, 0, 1);
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
  name: "chainsaw",
  means: "A chainsaw: the pointer along the bar is how far the nose kicks up, the whole saw tipping back on its rear handle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[150, 230], [240, 255], [314, 281], null],
  mount,
});
