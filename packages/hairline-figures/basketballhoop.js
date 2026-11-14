/**
 * Basketball hoop: a pole on a weighted base holds a backboard with a
 * breakaway rim and its net. The pointer pulls the rim down as a dunk does:
 * the lower it stands under the rim, the further the rim tips on its hinge,
 * and the net swings with it. At rest the rim droops a touch, bright.
 * The slider is the rim's reach.
 *
 * The pattern: one part answering the pointer's position (spring).
 */
const {
  Cam, circ, clamp, fit, facing, open, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RR = 10, HZ = 74, HY = 4, NET = 14, REST = 5;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-30, -40, 0], [30, 24, 0], [-28, 2, 108], [28, 2, 108], [0, 26, HZ - 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-20, -40, 20, -10, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 8));
  put(solid(g), prism(P, front, disc(0, -25, 3.5, 20), disc(0, -25, 2.5, 20), 8, 96));
  const [ar, ai] = rings(-3, -25, 3, 0, 1.5, 0.8);
  put(solid(g), prism(P, front, ar, ai, 86, 91));
  const [bdr, bdi] = rings(-28, 0, 28, 3, 1.2, 0.6);
  put(solid(g), prism(P, front, bdr, bdi, 64, 106));
  // the shooter's square on the board's face, behind the rim
  const sq = [[-9, 70], [9, 70], [9, 84], [-9, 84]].map(([x, z]) => P(x, 3.1, z));
  mk("path", { d: poly(sq), class: "nf lo" }, g);
  const net = mk("path", { class: "nf lo" }, g);
  const rim = mk("path", { class: "nf sil hi" }, g);
  const plate = mk("path", { class: "nf" }, g);

  // a point on the rim's own frame: u across, v out from the board, w down the net
  const at = (u, v, w, th) => P(u, HY + v * Math.cos(th) + w * Math.sin(th), HZ - v * Math.sin(th) + -w * Math.cos(th));
  let last = NaN;
  function draw(deg) {
    const d2 = Math.round(deg * 10) / 10;
    if (d2 === last) return;
    last = d2;
    const th = rad(deg), top = [], bot = [];
    for (let i = 0; i < 28; i++) {
      const a = (i / 28) * 2 * Math.PI;
      top.push(at(RR * Math.cos(a), RR + RR * Math.sin(a), 0, th));
      bot.push(at(0.6 * RR * Math.cos(a), RR + 0.6 * RR * Math.sin(a) + deg * 0.12, NET, th * 0.4));
    }
    let nd = poly(bot);
    for (let i = 0; i < 28; i += 2) nd += seg(top[i], bot[(i + 2) % 28]) + seg(top[i], bot[(i + 26) % 28]);
    net.setAttribute("d", nd);
    rim.setAttribute("d", poly(top));
    plate.setAttribute("d", poly([at(-4, 0, -1, th), at(4, 0, -1, th), at(4, 2, 0, th), at(-4, 2, 0, th)]));
    read.textContent = deg - REST < 0.5 ? "rest" : Math.round(deg) + "°";
  }

  const tip = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(tip, dt); draw(tip.x); return m; });
  bag.add(B.unregister);

  const home = P(0, HY + RR, HZ);
  function aim([sx, sy]) {
    if (Math.abs(sx - home[0]) > 90) return REST;
    return REST + clamp((sy - home[1] + 20) / 80, 0, 1) * (14 + reach * 0.4);
  }
  draw(REST);
  bag.add(pointer(stage, { move: (p) => { tip.t = aim(p); B.wake(); }, leave: () => { tip.t = REST; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "basketballhoop",
  means: "A hoop on its pole: the lower the pointer stands under the rim, the further the breakaway rim tips down, swinging its net.",
  rules: [1, 3, 5, 6],
  range: [0, 45, 90],
  tour: [[179, 124], [169, 201], [162, 247], null],
  mount,
});
