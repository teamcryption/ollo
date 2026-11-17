/**
 * Wash bag: a hanging toiletry bag on its hook, pockets inside. The pointer over it swings the front panel down to show the pockets; at rest the panel leans out a little, bright. The slider is how far it drops.
 *
 * The pattern: one part turning on a hinge (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

// parts: footprint ring [x, y], from z0 to z1; m = moves with the hinge; hi = the bright one
const PARTS = [{"ring":[[90,16],[89.8,17.6],[89.4,19.1],[88.7,20.4],[87.7,21.7],[86.4,22.7],[85.1,23.4],[83.6,23.8],[82,24],[8,24],[6.4,23.8],[4.9,23.4],[3.6,22.7],[2.3,21.7],[1.3,20.4],[0.6,19.1],[0.2,17.6],[0,16],[0,8],[0.2,6.4],[0.6,4.9],[1.3,3.6],[2.3,2.3],[3.6,1.3],[4.9,0.6],[6.4,0.2],[8,0],[82,0],[83.6,0.2],[85.1,0.6],[86.4,1.3],[87.7,2.3],[88.7,3.6],[89.4,4.9],[89.8,6.4],[90,8]],"z0":0,"z1":100},{"ring":[[8,24],[82,24],[82,27],[8,27]],"z0":8,"z1":44},{"ring":[[8,24],[44,24],[44,27],[8,27]],"z0":54,"z1":92},{"ring":[[46,24],[82,24],[82,27],[46,27]],"z0":54,"z1":92},{"ring":[[2,26],[88,26],[88,30],[2,30]],"z0":0,"z1":98,"m":1,"hi":1}];
const LINES = [{"p":[[45,12,100],[45,12,112]]},{"p":[[45,12,112],[46.95090322016128,12,112.19214719596769],[48.8268343236509,12,112.76120467488713],[50.55570233019602,12,113.68530387697454],[52.071067811865476,12,114.92893218813452],[53.314696123025456,12,116.44429766980397],[54.23879532511287,12,118.1731656763491],[54.80785280403231,12,120.04909677983872],[55,12,122],[54.80785280403231,12,123.95090322016128],[54.23879532511287,12,125.8268343236509],[53.31469612302545,12,127.55570233019603],[52.071067811865476,12,129.07106781186548],[50.55570233019603,12,130.31469612302544],[48.8268343236509,12,131.23879532511287],[46.95090322016128,12,131.8078528040323],[45,12,132],[43.04909677983872,12,131.8078528040323],[41.1731656763491,12,131.23879532511287],[39.44429766980398,12,130.31469612302544],[37.92893218813453,12,129.07106781186548],[36.685303876974544,12,127.55570233019603],[35.76120467488713,12,125.8268343236509],[35.19214719596769,12,123.95090322016128],[35,12,122]]}];
const AX = "x", PV = [0,26,0], A0 = -10, AMAX = -90, RAD = Math.PI / 180;

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
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "toiletrybag",
  means: "A hanging wash bag on its hook: the pointer swings the front panel down to open the pockets inside.",
  rules: [1, 3, 4, 5],
  range: [-45,-80,-90],
  tour: [[240,131],[228,140],[252,122],null],
  mount,
});
