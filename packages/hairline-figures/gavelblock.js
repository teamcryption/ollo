/**
 * Ballot scanner: a ballot bin with a scanner head on top and a feed slot
 * across it, a marked ballot standing half out of the slot. The pointer over
 * the scanner feeds the ballot down into the slot; the slider is how far it
 * goes in. At rest the waiting ballot is the bright mark.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TOP = 40, X0 = 5, X1 = 31, YB = 11, HR = 32, HIN = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-2, -2, 0], [38, 26, 0], [38, -2, 0], [-2, 26, 0], [X0, YB, TOP + HR], [X1, YB, TOP + HR]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const H3 = (pts) => poly(hull(pts.map((p) => P(...p))));
  const L3 = (pts) => pts.map((p, k) => (k ? "L" : "M") + P(...p).map((n) => n.toFixed(1)).join(" ")).join("");

  box(0, 0, 36, 24, 3, 1, 0, 30);
  const head = box(-2, -2, 38, 26, 4, 1.2, 30, TOP);
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(X0 - 1, YB - 1, X1 + 1, YB + 2, 1, 3), TOP))
    + L3([[26, 26, 32], [35, 26, 32], [35, 26, 38], [26, 26, 38], [26, 26, 32]])
    + L3([[4, 24, 4], [24, 24, 4], [24, 24, 26], [4, 24, 26], [4, 24, 4]]) + seg(P(20, 24, 15), P(22, 24, 15)) }, head.g);
  const bg = mk("g", {}, g), sil = mk("path", { class: "sil" }, bg), lines = mk("path", { class: "nf lo" }, bg);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const h = HR - (HR - HIN) * v, zt = TOP + h;
    sil.setAttribute("d", H3([[X0, YB, TOP], [X1, YB, TOP], [X0, YB + 1, TOP], [X1, YB + 1, TOP], [X0, YB, zt], [X1, YB, zt], [X0, YB + 1, zt], [X1, YB + 1, zt]]));
    let d = "";
    for (let k = 0; k < 4; k++) {
      const z = zt - 6 - k * 6;
      if (z > TOP + 1) d += L3([[X0 + 3, YB + 1, z], [X0 + 6, YB + 1, z - 2], [X0 + 10, YB + 1, z + 2]]) + seg(P(X0 + 13, YB + 1, z), P(X1 - 3, YB + 1, z));
    }
    lines.setAttribute("d", d);
  }
  const zone = hull([[-2, -2, 0], [38, 26, 0], [38, -2, 0], [-2, 26, 0], [-2, -2, TOP + HR], [38, 26, TOP], [38, -2, TOP + HR], [-2, 26, TOP]].map((p) => P(...p)));
  const side = (q, k) => { const a = zone[k], b = zone[(k + 1) % zone.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]); };
  function hit(q) { const s = zone.map((_, k) => side(q, k)); return s.every((v) => v >= 0) || s.every((v) => v <= 0); }
  function mark(a) { sil.classList.add("hi"); read.textContent = a ? "cast" : "rest"; }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? amt : 0, performance.now(), 0);
    mark(a);
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gavelblock",
  means: "A ballot scanner: the pointer over it feeds the marked ballot down into the scanner's slot.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1],
  tour: [[202, 84], [134, 239], [275, 145], null],
  mount,
});
