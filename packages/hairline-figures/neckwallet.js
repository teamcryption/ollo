/**
 * Passport holder: a flat neck pouch on its cord, a passport inside. The pointer over it swings the flap open; at rest the flap stands ajar, bright. The slider is how far it opens.
 *
 * The pattern: one part turning on a hinge (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

// parts: footprint ring [x, y], from z0 to z1; m = moves with the hinge; hi = the bright one
const PARTS = [{"ring":[[8,98],[12,98],[12,150],[8,150]],"z0":0,"z1":1.5},{"ring":[[58,98],[62,98],[62,150],[58,150]],"z0":0,"z1":1.5},{"ring":[[8,146],[62,146],[62,150],[8,150]],"z0":0,"z1":1.5},{"ring":[[70,94],[69.9,95.2],[69.5,96.3],[69,97.3],[68.2,98.2],[67.3,99],[66.3,99.5],[65.2,99.9],[64,100],[6,100],[4.8,99.9],[3.7,99.5],[2.7,99],[1.8,98.2],[1,97.3],[0.5,96.3],[0.1,95.2],[0,94],[0,6],[0.1,4.8],[0.5,3.7],[1,2.7],[1.8,1.8],[2.7,1],[3.7,0.5],[4.8,0.1],[6,0],[64,0],[65.2,0.1],[66.3,0.5],[67.3,1],[68.2,1.8],[69,2.7],[69.5,3.7],[69.9,4.8],[70,6]],"z0":0,"z1":4},{"ring":[[8,12],[62,12],[62,72],[8,72]],"z0":4,"z1":5.5},{"ring":[[70,94],[69.9,95.2],[69.5,96.3],[69,97.3],[68.2,98.2],[67.3,99],[66.3,99.5],[65.2,99.9],[64,100],[6,100],[4.8,99.9],[3.7,99.5],[2.7,99],[1.8,98.2],[1,97.3],[0.5,96.3],[0.1,95.2],[0,94],[0,40],[0.1,38.8],[0.5,37.7],[1,36.7],[1.8,35.8],[2.7,35],[3.7,34.5],[4.8,34.1],[6,34],[64,34],[65.2,34.1],[66.3,34.5],[67.3,35],[68.2,35.8],[69,36.7],[69.5,37.7],[69.9,38.8],[70,40]],"z0":4,"z1":6,"m":1,"hi":1}];
const LINES = [];
const AX = "x", PV = [0,100,5], A0 = -25, AMAX = -170, RAD = Math.PI / 180;

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
  const C = Cam(45, 0.5, 1.7);
  const ext = [];
  for (const pt of PARTS) for (const z of [pt.z0, pt.z1]) for (const p of pts(pt, z)) {
    if (!pt.m) ext.push(p); else for (const a of [A0, AMAX]) ext.push(turn(p, a * RAD));
  }
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
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "neckwallet",
  means: "A neck pouch for a passport: the pointer swings its flap open to show the passport inside.",
  rules: [1, 3, 4, 5],
  range: [-90,-150,-170],
  tour: [[227,156],[212,166],[244,147],null],
  mount,
});
