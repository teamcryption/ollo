/**
 * Trail marker: a post on a low stone plinth with two pointed marker boards,
 * one high, one lower and turned the other way. At rest the high board points
 * down the trail, bright. The pointer on the ground turns the boards on the
 * post to point at it. The slider is the angle between the two boards.
 */
const { Cam, fit, hull, poly, prism, proj, rings, facing, spring, stepS, unproj, disposer, mk, pointer, put, register, solid } = HL;

const PH = 74, REST = -0.6, BL = [[2, -1.4], [36, -1.4], [44, 0], [36, 1.4], [2, 1.4]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gap = (value * Math.PI) / 180;
  const C = Cam(45, 0.5, 3.45);
  fit(C, [[-38, -38, 0], [38, 38, 0], [38, -38, PH], [-38, 38, PH]], 200, 218);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const plinth = solid(g);
  put(plinth, prism(P, front, ...rings(-12, -12, 12, 12, 8, 1.8), 0, 7));
  const back = mk("g", {}, g), postG = mk("g", {}, g), fore = mk("g", {}, g);
  const post = solid(postG);
  put(post, prism(P, front, ...rings(-2.6, -2.6, 2.6, 2.6, 1.4, 0.7), 7, PH));
  const cap = solid(postG);
  put(cap, prism(P, front, ...rings(-3.8, -3.8, 3.8, 3.8, 2, 0.9), PH, PH + 2.5));
  const boards = [[54, 64], [38, 47]].map(([z0, z1]) => ({ z0, z1, s: solid(fore), last: NaN }));
  const ang = spring(REST);

  function drawBoard(b, a) {
    if (a === b.last) return;
    b.last = a;
    const c = Math.cos(a), s = Math.sin(a), T = ([u, v], z) => P(u * c - v * s, u * s + v * c, z);
    const pts = [];
    BL.forEach((q) => pts.push(T(q, b.z0), T(q, b.z1)));
    b.s.sil.setAttribute("d", poly(hull(pts)));
    const m = (b.z0 + b.z1) / 2, h = (b.z1 - b.z0) / 2 - 1.6;
    b.s.cr.setAttribute("d", poly([T([5, 0], m - h), T([34, 0], m - h), T([40, 0], m), T([34, 0], m + h), T([5, 0], m + h)]));
    const par = c + s > 0 ? fore : back;
    if (b.s.g.parentNode !== par) par.appendChild(b.s.g);
  }
  const B = register(stage, (dt) => {
    const moving = stepS(ang, dt);
    drawBoard(boards[0], ang.x);
    drawBoard(boards[1], ang.x + Math.PI - gap);
    return moving;
  });
  bag.add(B.unregister);
  boards[0].s.sil.classList.add("hi");

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), d = Math.hypot(x, y);
    if (d < 8 || d > 70) return leave();
    let a = Math.atan2(y, x);
    while (a - ang.t > Math.PI) a -= 2 * Math.PI;
    while (a - ang.t < -Math.PI) a += 2 * Math.PI;
    ang.t = a;
    const deg = Math.round(((a * 180) / Math.PI % 360 + 360) % 360);
    read.textContent = deg + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gap = (v * Math.PI) / 180; boards[1].last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "trekpole",
  means: "A trail marker: the pointer on the ground turns the post's two marker boards to point at it.",
  rules: [1, 3, 4, 8],
  range: [90, 150, 180],
  tour: [[102, 307], [285, 313], [176, 221], null],
  mount,
});
