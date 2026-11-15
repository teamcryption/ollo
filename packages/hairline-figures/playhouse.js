/**
 * Playhouse: a small gabled play house on a mat, its door ajar. The pointer
 * turns the whole house to face it, and the door swings wide open while the
 * pointer is near. At rest the house stands turned a little, door ajar and
 * bright. The slider is how far the house may turn.
 *
 * The pattern: one object answering the pointer's position (aim).
 */
const {
  Cam, fit, facing, hull, poly, open, seg, prism, proj, rings, ringAt, rrect, rad, clamp, lerp,
  spring, stepS, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const W = 50, D = 36, H = 30, RH = 20, OV = 4, DW = 7, DH = 21, REST = -14;

function rot(ring, t) {
  const c = Math.cos(t), s = Math.sin(t);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-44, -44, 0], [44, 44, 0], [44, -44, 0], [-44, 44, 0], [0, 0, H + RH + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-44, -44, 44, 44, 10, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 2));
  const body = solid(g), roof = solid(g);
  const gable = mk("path", { class: "nf lo" }, g);
  const frame = mk("path", { class: "nf lo" }, g);
  const win = mk("path", { class: "nf lo" }, g);
  const leaf = mk("path", { class: "sil hi" }, g);

  const [br, bi] = rings(-W / 2, -D / 2, W / 2, D / 2, 3, 1.6);
  const eave = rrect(-W / 2 - OV, -D / 2 - OV, W / 2 + OV, D / 2 + OV, 2, 4);
  const turn = spring(REST), door = tween(25);
  let last = "";

  function draw(th, ph) {
    const key = th.toFixed(2) + ph.toFixed(1);
    if (key === last) return;
    last = key;
    const t = rad(th), c = Math.cos(t), s = Math.sin(t);
    const L = (x, y, z) => P(x * c - y * s, x * s + y * c, z);
    put(body, prism(P, front, rot(br, t), rot(bi, t), 2, 2 + H));
    const zE = 2 + H, zR = zE + RH, xe = W / 2 + OV, ye = D / 2 + OV;
    const pts = ringAt(P, rot(eave, t), zE).concat([L(-xe, 0, zR), L(xe, 0, zR)]);
    roof.sil.setAttribute("d", poly(hull(pts)));
    roof.cr.setAttribute("d", seg(L(-xe + 1, 0, zR - 0.6), L(xe - 1, 0, zR - 0.6)));
    const ex = c + s > 0 ? xe : -xe;
    gable.setAttribute("d", open([L(ex, -ye, zE), L(ex, 0, zR), L(ex, ye, zE)]) + seg(L(-xe, ye, zE), L(xe, ye, zE)));
    const fy = D / 2;
    frame.setAttribute("d", poly([L(-DW, fy, 2), L(DW, fy, 2), L(DW, fy, 2 + DH), L(-DW, fy, 2 + DH)]));
    const wx = W / 2 - 9, wz = 2 + H / 2 + 2;
    win.setAttribute("d", poly([L(wx - 5, fy, wz - 5), L(wx + 5, fy, wz - 5), L(wx + 5, fy, wz + 5), L(wx - 5, fy, wz + 5)]) + seg(L(wx, fy, wz - 5), L(wx, fy, wz + 5)));
    const p = rad(ph), fx = -DW + 2 * DW * Math.cos(p), fyy = fy + 2 * DW * Math.sin(p);
    leaf.setAttribute("d", poly([L(-DW, fy, 2), L(fx, fyy, 2), L(fx, fyy, 2 + DH), L(-DW, fy, 2 + DH)]));
  }

  let act = false;
  const B = register(stage, (dt, now) => {
    const m = stepS(turn, dt);
    draw(turn.x, tval(door, now));
    read.textContent = act ? "turn " + Math.round(turn.x) : "rest";
    return m || !tdone(door, now);
  });
  bag.add(B.unregister);

  function move([sx]) {
    act = true;
    turn.t = clamp(lerp(-reach, reach * 0.8, (sx - 60) / 280), -reach, reach * 0.8);
    tset(door, 80, performance.now(), 0);
    B.wake();
  }
  function leave() {
    act = false;
    turn.t = REST;
    tset(door, 25, performance.now(), 0);
    B.wake();
  }
  draw(REST, 25);
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "playhouse",
  means: "A gabled play house on a mat: it turns to face the pointer and its door swings wide open.",
  rules: [3, 5, 6, 8],
  range: [10, 35, 40],
  tour: [[136, 115], [171, 177], [264, 179], null],
  mount,
});
