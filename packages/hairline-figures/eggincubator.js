/**
 * Egg incubator: a deep cabinet with a turning rack of eggs on top and a
 * windowed lid hinged at the back. The pointer opens the lid: the further
 * along the cabinet it stands, the wider the lid swings back. At rest the
 * lid sits ajar, bright. The slider is how far the lid can open.
 *
 * The pattern: one part answering where the pointer stands (terrain).
 */
const { Cam, circ, ringAt, clamp, fit, facing, hull, lerp, poly, open, prism, proj, rad, rings, seg, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const X1 = 84, Y1 = 72, TZ = 24, LH = 13, CX = 3, CY = 3;
const corners = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const rot = (p, a) => { const dy = p[1] - 0, dz = p[2] - TZ, c = Math.cos(a), s = Math.sin(a); return [p[0], dy * c - dz * s, TZ + dy * s + dz * c]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.95);
  const lidPts = corners(-1, 0, TZ, X1 + 1, Y1 + 1, TZ + LH);
  fit(C, [[0, 0, 0], [X1, Y1, 0], ...lidPts.map((p) => rot(p, rad(80))), ...lidPts.map((p) => rot(p, rad(5)))], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const body = mk("g", {}, g);
  const [r0, r1] = rings(0, 0, X1, Y1, 8, 2);
  put(solid(body), prism(P, front, r0, r1, 0, TZ));
  let d = "";
  for (let i = 1; i < CX; i++) d += seg(P(i * X1 / CX, 2, TZ), P(i * X1 / CX, Y1 - 2, TZ));
  for (let j = 1; j < CY; j++) d += seg(P(2, j * Y1 / CY, TZ), P(X1 - 2, j * Y1 / CY, TZ));
  mk("path", { d, class: "nf lo" }, body);
  for (let j = 0; j < CY; j++) for (let i = 0; i < CX; i++) {
    const x = (i + 0.5) * X1 / CX, y = (j + 0.5) * Y1 / CY, pts = [];
    for (const [r, z] of [[5, 0], [8, 4], [8.5, 7], [7, 11], [3.5, 15]]) pts.push(...ringAt(P, circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), TZ + z));
    mk("path", { d: poly(hull(pts)), class: "nf" }, body);
  }
  const lid = mk("g", {}, g), lsil = mk("path", { class: "sil" }, lid), ltop = mk("path", { class: "nf lo" }, lid);
  const REST = 24, sp = spring(REST);
  let last = NaN, behind = null;
  function draw(a) {
    if (a === last) return;
    last = a;
    const q = lidPts.map((p) => P(...rot(p, rad(a))));
    lsil.setAttribute("d", poly(hull(q)));
    const w = [[10, 10], [X1 - 10, 10], [X1 - 10, Y1 - 10], [10, Y1 - 10]].map(([x, y]) => P(...rot([x, y, TZ + LH], rad(a))));
    ltop.setAttribute("d", poly([q[4], q[5], q[6], q[7]]) + seg(q[2], q[6]) + seg(q[3], q[7]) + poly(w));
    const b = a > 58;
    if (b !== behind) { behind = b; if (b) g.insertBefore(lid, body); else g.appendChild(lid); }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [u, v] = unproj(C, sx, sy, 0);
    if (u < -30 || u > X1 + 30 || v < -50 || v > Y1 + 40) return leave();
    const t = clamp(u / X1, 0, 1), a = lerp(0.5, 1, t) * maxA;
    sp.t = a; lsil.classList.add("hi");
    read.textContent = Math.round(a) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; lsil.classList.add("hi"); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "eggincubator",
  means: "An egg incubator with a rack of eggs under a windowed lid: the pointer swings the lid back on its hinge, wider the further it goes.",
  rules: [1, 3, 5, 6],
  range: [50, 70, 80],
  tour: [[232, 233], [200, 302], [98, 251], null],
  mount,
});
