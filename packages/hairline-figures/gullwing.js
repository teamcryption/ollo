/**
 * Gullwing coupe: a low sports car whose two doors are hinged at the middle
 * of the roof. At rest the near door stands a little open, bright. The
 * pointer over the car swings both doors up like wings, on a spring; the
 * slider sets how far they lift.
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, ringAt, rrect, unproj, rad, clamp,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, W = 40, HZ = 32, HY = W / 2, D0 = 34, D1 = 62, REST = 22;
const PROF = [[HY, HZ], [HY + 11, HZ], [W - 3, 18], [W, 9]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [48, W + 6, 52], [48, -6, 52]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  function wheel(cx, y, par) {
    const pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(cx + 9 * Math.cos(t), y, 9 + 9 * Math.sin(t))); }
    mk("path", { d: poly(pts), class: "sil" }, par);
    const hub = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; hub.push(P(cx + 4 * Math.cos(t), y, 9 + 4 * Math.sin(t))); }
    mk("path", { d: poly(hub), class: "nf lo" }, par);
  }
  wheel(20, 2, g); wheel(76, 2, g);
  const farDoor = mk("g", {}, g);
  const fs = mk("path", { class: "sil" }, farDoor), fc = mk("path", { class: "nf lo" }, farDoor);
  // body: low wedge, then the cabin tapering to the roof
  const [br, bi] = rings(0, 0, L, W, 12, 2);
  put(solid(g), prism(P, front, br, bi, 5, 17));
  const foot = rrect(22, 2, 76, W - 2, 8, 6), top = rrect(D0 + 1, HY - 11, D1 - 3, HY + 11, 5, 6), inner = rrect(D0 + 3, HY - 9, D1 - 5, HY + 9, 3, 6);
  const cab = solid(g);
  put(cab, { sil: poly(hull(ringAt(P, foot, 17).concat(ringAt(P, top, HZ)))), crease: open(ringAt(P, inner, HZ)) });
  wheel(20, W - 2, g); wheel(76, W - 2, g);
  const nearDoor = mk("g", {}, g);
  const ns = mk("path", { class: "sil hi" }, nearDoor), nc = mk("path", { class: "nf lo" }, nearDoor);

  function doorPts(a, side) {
    const out = [];
    for (const [y, z] of PROF) {
      const dy = (y - HY) * side, dz = z - HZ;
      const ry = dy * Math.cos(a) - dz * Math.sin(a), rz = dy * Math.sin(a) + dz * Math.cos(a);
      out.push([HY + ry * side, HZ + rz]);
    }
    return out;
  }
  function drawDoor(a, side, s, c) {
    const pr = doorPts(a, side), A = pr.map(([y, z]) => P(D0, y, z)), B = pr.map(([y, z]) => P(D1, y, z));
    s.setAttribute("d", poly(hull(A.concat(B))));
    let d = "";
    for (let i = 1; i < pr.length - 1; i++) d += open([A[i], B[i]]) + " ";
    c.setAttribute("d", d + open(A) + " " + open(B));
  }

  const op = spring(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(v);
    drawDoor(a, -1, fs, fc);
    drawDoor(a, 1, ns, nc);
  }
  const B = register(stage, (dt) => { const m = stepS(op, dt); draw(op.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const on = x > -10 && x < L + 10 && y > -30 && y < W + 30;
    op.t = on ? REST + (amax - REST) * clamp((x + 10) / (L * 0.6), 0.35, 1) : REST;
    read.textContent = on ? "door " + Math.round(op.t) + "°" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave: () => { op.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "gullwing",
  means: "A gullwing coupe: the pointer over the car swings both roof-hinged doors up like wings; the slider sets how far.",
  rules: [1, 3, 5, 8],
  range: [50, 105, 125],
  tour: [[160, 190], [244, 234], [290, 240], null],
  mount,
});
