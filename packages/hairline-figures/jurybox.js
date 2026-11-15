/**
 * Ballot drop box: a tall box on four short legs under a lipped lid, with a
 * broad hinged flap over the drop slot on its front. The pointer over the
 * box swings the flap up and out on its top hinge, showing the slot; the
 * slider is how far it swings. At rest the closed flap is the bright mark.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;
const YF = 24, HZ = 46, FL = 22, X0 = 4, X1 = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[-1, -1, 0], [31, 25, 0], [31, -1, 0], [-1, 25, 0], [-1, -1, 54], [31, 25, 54], [X0, YF + FL, HZ + 2], [X1, YF + FL, HZ + 2]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const H3 = (pts) => poly(hull(pts.map((p) => P(...p))));
  const L3 = (pts) => pts.map((p, k) => (k ? "L" : "M") + P(...p).map((n) => n.toFixed(1)).join(" ")).join("");
  [[1, 1], [26, 1], [1, 20], [26, 20]].forEach(([x, y]) => box(x, y, x + 3, y + 3, 1, 0.5, 0, 8));
  const body = box(0, 0, 30, 24, 3, 1, 8, 50);
  box(-1.5, -1.5, 31.5, 25.5, 3.5, 1, 50, 54);
  mk("path", { class: "nf lo", d: L3([[X0 + 3, YF, 38], [X1 - 3, YF, 38], [X1 - 3, YF, 41], [X0 + 3, YF, 41], [X0 + 3, YF, 38]]) }, body.g);
  const fg = mk("g", {}, g), flap = mk("path", { class: "sil" }, fg), grip = mk("path", { class: "nf lo" }, fg);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = v * 1.75, c = Math.cos(a), s = Math.sin(a);
    const at = (x, d, n) => [x, YF + n * c + d * s, HZ - d * c + n * s];
    const pts = [];
    [X0, X1].forEach((x) => [[0, 0], [FL, 0], [0, 1.6], [FL, 1.6]].forEach(([d, n]) => pts.push(at(x, d, n))));
    flap.setAttribute("d", H3(pts));
    grip.setAttribute("d", L3([at(X0 + 7, FL - 3, 1.6), at(X1 - 7, FL - 3, 1.6)]) + L3([at(X0, 0, 1.6), at(X1, 0, 1.6)]));
  }
  const zone = hull([[-2, -2, 0], [32, 26, 0], [32, -2, 0], [-2, 26, 0], [-2, -2, 54], [32, 26, 54], [32, -2, 54], [-2, 26, 54], [X0, YF + FL, HZ], [X1, YF + FL, HZ]].map((p) => P(...p)));
  const side = (q, k) => { const a = zone[k], b = zone[(k + 1) % zone.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]); };
  function hit(q) { const s = zone.map((_, k) => side(q, k)); return s.every((v) => v >= 0) || s.every((v) => v <= 0); }
  function mark(a) { flap.classList.add("hi"); read.textContent = a ? "open" : "rest"; }
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
  name: "jurybox",
  means: "A ballot drop box: the pointer over it swings the broad flap up and out on its hinge, showing the drop slot.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1],
  tour: [[170, 124], [142, 256], [306, 64], null],
  mount,
});
