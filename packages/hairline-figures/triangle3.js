/**
 * Triangle: a steel triangle hanging by its cord from a small stand, its
 * beater lying on the base. The pointer turns the triangle on its cord, from
 * face-on toward edge-on, further the further right it is. At rest it hangs
 * slightly turned and its outline is bright. The slider is how far it turns.
 */
const { Cam, circ, fit, fillet, hull, poly, prism, proj, facing, ringAt, spring, stepS, clamp, mk, pointer, put, register, solid, disposer } = HL;

const SQ = Math.SQRT1_2, HZ = 118, TZ = 104, REST = 0.35;
const OUT = fillet([[0, TZ], [33, TZ - 57], [-33, TZ - 57]], [4, 4, 4], 4);
const INN = fillet([[0, TZ - 8], [26, TZ - 53], [-26, TZ - 53]], [1.5, 1.5, 1.5], 3).reverse();
const at = (u, v, z) => [(u + v) * SQ, (v - u) * SQ, z];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [at(-70, -20, 0), at(45, 20, 0), at(-70, 0, HZ + 6), at(40, 0, HZ), at(-34, 0, 40), at(34, 0, 40)], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const shift = (ring, u, v) => ring.map((q) => ({ ...q, u: q.u + at(u, v, 0)[0], v: q.v + at(u, v, 0)[1] }));
  // base: a round plate under the stand
  put(solid(g), prism(P, front, shift(circ(46, 40), -14, 0), shift(circ(43.5, 40), -14, 0), 0, 5));
  // beater: a thin rod with a round knob, lying on the base
  mk("path", { d: poly(hull(ringAt(P, shift(circ(1.6, 12), -30, 22), 5).concat(ringAt(P, shift(circ(1.6, 12), 10, 30), 5), ringAt(P, shift(circ(1.6, 12), 10, 30), 8), ringAt(P, shift(circ(1.6, 12), -30, 22), 8)))) }, g);
  put(solid(g), prism(P, front, shift(circ(4, 20), -52, 0), shift(circ(2.8, 20), -52, 0), 5, HZ + 3));
  const arm = [];
  for (const u of [-52, 4]) for (const dz of [0, 4]) arm.push(...ringAt(P, shift(circ(2, 12), u, 0), HZ - 1 + dz));
  mk("path", { d: poly(hull(arm)), class: "sil" }, g);
  const cord = mk("path", { class: "nf" }, g), tri = mk("path", { class: "sil hi" }, g);
  const A = spring(REST);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const c = Math.cos(th), s = Math.sin(th);
    const pt = ([a, z]) => P(...at(a * c, a * s, z));
    cord.setAttribute("d", "M" + P(...at(0, 0, HZ)).join(",") + "L" + pt([0, TZ]).join(","));
    tri.setAttribute("d", poly(OUT.map(pt)) + poly(INN.map(pt)));
  }
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx]) => {
      A.t = clamp((sx - 120) / 100, -1, 1) * 1.3 * reach;
      read.textContent = "turn " + Math.round(Math.abs(A.t * 180) / Math.PI) + "°";
      B.wake();
    },
    leave: () => { A.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "triangle3",
  means: "A steel triangle hanging by its cord from a stand: the pointer turns it on the cord, from face-on toward edge-on.",
  rules: [3, 5, 8],
  range: [0, 100, 100],
  tour: [[255, 133], [142, 224], [310, 224], null],
  mount,
});
