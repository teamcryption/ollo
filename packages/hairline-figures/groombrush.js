/**
 * Grooming brush: a slicker brush lying pins up, its handle out to one side. The pointer over it turns the brush on the floor as if mid-stroke; at rest it sits a little askew, bright. The slider is how far it turns.
 *
 * The pattern: one part turning on a hinge (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

// parts: footprint ring [x, y], from z0 to z1; m = moves with the hinge; hi = the bright one
const PARTS = [{"ring":[[138,21],[137.9,22],[137.6,22.9],[137.2,23.8],[136.5,24.5],[135.8,25.2],[134.9,25.6],[134,25.9],[133,26],[53,26],[52,25.9],[51.1,25.6],[50.2,25.2],[49.5,24.5],[48.8,23.8],[48.4,22.9],[48.1,22],[48,21],[48,19],[48.1,18],[48.4,17.1],[48.8,16.2],[49.5,15.5],[50.2,14.8],[51.1,14.4],[52,14.1],[53,14],[133,14],[134,14.1],[134.9,14.4],[135.8,14.8],[136.5,15.5],[137.2,16.2],[137.6,17.1],[137.9,18],[138,19]],"z0":4,"z1":9,"m":1},{"ring":[[52,34],[51.9,35.2],[51.5,36.3],[51,37.3],[50.2,38.2],[49.3,39],[48.3,39.5],[47.2,39.9],[46,40],[6,40],[4.8,39.9],[3.7,39.5],[2.7,39],[1.8,38.2],[1,37.3],[0.5,36.3],[0.1,35.2],[0,34],[0,6],[0.1,4.8],[0.5,3.7],[1,2.7],[1.8,1.8],[2.7,1],[3.7,0.5],[4.8,0.1],[6,0],[46,0],[47.2,0.1],[48.3,0.5],[49.3,1],[50.2,1.8],[51,2.7],[51.5,3.7],[51.9,4.8],[52,6]],"z0":3,"z1":10,"m":1,"hi":1}];
const LINES = [{"p":[[7,6,10],[7,6,15]],"m":1},{"p":[[7,13,10],[7,13,15]],"m":1},{"p":[[7,20,10],[7,20,15]],"m":1},{"p":[[7,27,10],[7,27,15]],"m":1},{"p":[[7,34,10],[7,34,15]],"m":1},{"p":[[14.2,6,10],[14.2,6,15]],"m":1},{"p":[[14.2,13,10],[14.2,13,15]],"m":1},{"p":[[14.2,20,10],[14.2,20,15]],"m":1},{"p":[[14.2,27,10],[14.2,27,15]],"m":1},{"p":[[14.2,34,10],[14.2,34,15]],"m":1},{"p":[[21.4,6,10],[21.4,6,15]],"m":1},{"p":[[21.4,13,10],[21.4,13,15]],"m":1},{"p":[[21.4,20,10],[21.4,20,15]],"m":1},{"p":[[21.4,27,10],[21.4,27,15]],"m":1},{"p":[[21.4,34,10],[21.4,34,15]],"m":1},{"p":[[28.599999999999998,6,10],[28.599999999999998,6,15]],"m":1},{"p":[[28.599999999999998,13,10],[28.599999999999998,13,15]],"m":1},{"p":[[28.599999999999998,20,10],[28.599999999999998,20,15]],"m":1},{"p":[[28.599999999999998,27,10],[28.599999999999998,27,15]],"m":1},{"p":[[28.599999999999998,34,10],[28.599999999999998,34,15]],"m":1},{"p":[[35.8,6,10],[35.8,6,15]],"m":1},{"p":[[35.8,13,10],[35.8,13,15]],"m":1},{"p":[[35.8,20,10],[35.8,20,15]],"m":1},{"p":[[35.8,27,10],[35.8,27,15]],"m":1},{"p":[[35.8,34,10],[35.8,34,15]],"m":1},{"p":[[43,6,10],[43,6,15]],"m":1},{"p":[[43,13,10],[43,13,15]],"m":1},{"p":[[43,20,10],[43,20,15]],"m":1},{"p":[[43,27,10],[43,27,15]],"m":1},{"p":[[43,34,10],[43,34,15]],"m":1}];
const AX = "z", PV = [135,20,0], A0 = -8, AMAX = -60, RAD = Math.PI / 180;

function turn(p, a) {
  const c = Math.cos(a), s = Math.sin(a);
  let x = p[0] - PV[0], y = p[1] - PV[1], z = p[2] - PV[2];
  if (AX === "x") [y, z] = [y * c - z * s, y * s + z * c];
  else if (AX === "y") [x, z] = [x * c + z * s, -x * s + z * c];
  else [x, y] = [x * c - y * s, x * s + y * c];
  return [x + PV[0], y + PV[1], z + PV[2]];
}
const pts = (pt, z) => pt.ring.map(([x, y]) => [x, y, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.35);
  const ext = [];
  for (const pt of PARTS) for (const z of [pt.z0, pt.z1]) for (const p of pts(pt, z)) {
    if (!pt.m) ext.push(p); else for (const a of [A0, AMAX]) ext.push(turn(p, a * RAD));
  }
  for (const l of LINES) for (const p of l.p) ext.push(p);
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg), g0 = mk("g", {}, g);
  const els = PARTS.map((pt) => ({ pt, sil: mk("path", { class: pt.hi ? "sil" : "sil" }, g), top: mk("path", { class: "nf lo" }, g) }));
  const lns = LINES.map((l) => ({ l, el: mk("path", { class: "nf" }, l.u ? g0 : g) }));
  const ang = tween(A0);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const f = (p, m) => P(...(m ? turn(p, a * RAD) : p));
    for (const e of els) {
      const lo = pts(e.pt, e.pt.z0).map((p) => f(p, e.pt.m)), hi = pts(e.pt, e.pt.z1).map((p) => f(p, e.pt.m));
      e.sil.setAttribute("d", poly(hull(lo.concat(hi))));
      e.top.setAttribute("d", poly(e.pt.face === 0 ? lo : hi));
    }
    for (const n of lns) n.el.setAttribute("d", poly(n.l.p.map((p) => f(p, n.l.m))).replace(/Z\s*$/i, ""));
  }
  draw(A0);
  // hit: the rest pose's box on screen, measured once (rule 01)
  const rest = [];
  for (const pt of PARTS) for (const z of [pt.z0, pt.z1]) for (const p of pts(pt, z)) rest.push(P(...(pt.m ? turn(p, A0 * RAD) : p)));
  const xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const bx = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
  const hit = ([sx, sy]) => sx > bx[0] && sx < bx[1] && sy > bx[2] && sy < bx[3];

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const hiEl = els.find((e) => e.pt.hi).sil;
  hiEl.classList.add("hi");
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? open : A0, performance.now(), 0);
    read.textContent = v ? "brush" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "groombrush",
  means: "A slicker brush lying pins up: the pointer turns it across the floor, like a grooming stroke.",
  rules: [1, 3, 4, 5],
  range: [-30,-50,-60],
  tour: [[170,94],[160,100],[181,89],null],
  mount,
});
