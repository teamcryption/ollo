/**
 * Dice cup: a round felt tray with a tall leather cup turned mouth-down over
 * three dice, two more dice loose beside it. The pointer over the tray lifts
 * the cup off the dice, higher the nearer it comes, and the cup leans away
 * from the hand; the die nearest the pointer takes the bright edge. At rest
 * the cup sits just off the felt and one loose die is bright.
 * The slider is how high the cup can lift.
 */
const {
  Cam, circ, clamp, fit, facing, flatDot, hull, open, place, poly, prism, proj, rings, ringAt, rrect, run,
  spring, stepS, unproj, disposer, mk, pointer, put, register, solid,
} = HL;

const TR = 44, TZ = 4, CB = 17, CT = 12, CH = 30, D = 8, FAV = 3;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rot = (ring, x, y, a) => ring.map((q) => {
  const c = Math.cos(a), s = Math.sin(a);
  return { u: x + q.u * c - q.v * s, v: y + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c };
});
// dice: x, y, turn, pips on top
const DICE = [[-5, -6, 0.3, 4], [6, -1, -0.5, 2], [-2, 7, 0.9, 5], [27, -16, 0.4, 3], [-18, 27, -0.3, 6]];
const PIPS = {
  2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]],
  5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]],
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxLift = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-TR, -TR, 0], [TR, TR, 0], [TR, -TR, 0], [-TR, TR, 0], [-8, -8, 46 + CH], [8, 8, 46 + CH]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, TR, 56), disc(0, 0, TR - 3, 56), 0, TZ));

  function die(parent, [x, y, a, n]) {
    const s = solid(parent), h = D / 2;
    const ring = rot(rrect(-h, -h, h, h, 1.6, 4), x, y, a), inner = rot(rrect(-h + 1, -h + 1, h - 1, h - 1, 1, 4), x, y, a);
    put(s, prism(P, front, ring, inner, TZ - 1, TZ - 1 + D));
    const c = Math.cos(a), sn = Math.sin(a);
    for (const [i, j] of PIPS[n] || [[0, 0]]) {
      const u = i * 2.2, v = j * 2.2, d = flatDot(parent, C, 0.8, "dot off");
      place(d, P(x + u * c - v * sn, y + u * sn + v * c, TZ - 1 + D));
    }
    return s;
  }
  const back = mk("g", {}, g), cupG = mk("g", {}, g), fwd = mk("g", {}, g);
  const dice = DICE.map((d) => die(d[0] + d[1] > 20 ? fwd : back, d));
  const sil = mk("path", { class: "sil" }, cupG), crease = mk("path", { class: "nf lo" }, cupG), band = mk("path", { class: "nf lo" }, cupG);

  const lift = spring(4), ox = spring(0), oy = spring(0);
  let last = "";
  function drawCup() {
    const z0 = TZ - 1 + lift.x, z1 = z0 + CH, x = ox.x, y = oy.x;
    const key = [z0, x, y].map((n) => n.toFixed(2)).join();
    if (key === last) return;
    last = key;
    const foot = disc(x, y, CB, 44), top = disc(x, y, CT, 40), inner = disc(x, y, CT - 2, 40);
    sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    crease.setAttribute("d", open(ringAt(P, run(inner, front), z1)));
    band.setAttribute("d", open(ringAt(P, run(disc(x, y, CB - 1, 44), front), z0 + 5)));
  }
  drawCup();

  const B = register(stage, (dt) => {
    const m = [stepS(lift, dt), stepS(ox, dt), stepS(oy, dt)].some(Boolean);
    drawCup();
    return m;
  });
  bag.add(B.unregister);

  let act = -2;
  function choose(a) {
    if (a === act) return;
    act = a;
    dice.forEach((s, k) => s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a)));
    read.textContent = a < 0 ? "rest" : "die " + DICE[a][3];
  }
  function move(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0), d = Math.hypot(wx, wy);
    if (d > TR + 4) return leave();
    const near = clamp(1 - d / TR, 0, 1);
    lift.t = maxLift * (0.5 + 0.5 * near);
    ox.t = clamp(-wx * 0.3, -9, 9); oy.t = clamp(-wy * 0.3, -9, 9);
    let best = 0, bd = Infinity;
    DICE.forEach(([x, y], k) => { const dd = Math.hypot(x - wx, y - wy); if (dd < bd) { bd = dd; best = k; } });
    choose(best);
    B.wake();
  }
  function leave() { lift.t = 4; ox.t = 0; oy.t = 0; choose(-1); B.wake(); }
  choose(-1);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxLift = v; }, destroy: bag.dispose };
}

hairline({
  name: "dicecup",
  means: "A leather cup turned over dice on a felt tray: the pointer lifts the cup off them, and the nearest die lights up.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 46],
  tour: [[110, 212], [200, 229], [290, 230], null],
  mount,
});
