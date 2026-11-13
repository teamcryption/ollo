/**
 * Golf green: a putting green on its apron, a cup with the flagstick standing
 * in it and three golf balls lying out on the grass. The pointer is where the
 * putts are aimed: every ball rolls toward it on its own springs, the nearest
 * one bright, and the flag swings round to stream toward it. At rest the balls
 * lie scattered round the cup, one bright, the flag streaming off to the side.
 * The slider is how far a ball rolls.
 *
 * The pattern: a continuous pull per ball (terrain's spring, in x and y); the
 * hit is on the green's plane, which never moves, against the balls' rests.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, open, poly, prism, proj, run, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid, r2,
} = HL;

const GR = (a) => 62 + 7 * Math.sin(2 * a + 1) + 4 * Math.cos(3 * a);
const H = [18, -16], PH = 64, BR = 5.6, ZT = 3;
const RESTS = [[-36, 14], [-4, 30], [34, 18]], FAV = 1, FL0 = -40 * (Math.PI / 180);
const blob = (dr, n = 72) => Array.from({ length: n }, (_, k) => {
  const a = (k / n) * Math.PI * 2, r = GR(a) + dr;
  return { u: r * Math.cos(a), v: r * Math.sin(a), nu: Math.cos(a), nv: Math.sin(a) };
});
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ROLL = 30 * value, over = null;
  const C = Cam(45, 0.5, 2.05);
  const ext = blob(9, 24).map((q) => [q.u, q.v, -4]).concat([[H[0], H[1], PH + 2]]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // apron, green, the cup with its far inner wall
  put(solid(g), prism(P, front, blob(9), blob(7.6), -4, 0));
  put(solid(g), prism(P, front, blob(0), blob(-1.6), 0, ZT));
  const cup = circ(3.6, 32).map((q) => ({ ...q, u: q.u + H[0], v: q.v + H[1] }));
  mk("path", { class: "nf", d: poly(cup.map((q) => P(q.u, q.v, ZT))) }, g);
  mk("path", { class: "nf lo", d: open(run(cup, (q) => !front(q)).map((q) => P(q.u, q.v, ZT - 2.5))) }, g);

  const items = [];
  const flag = { key: H[0] + H[1], g: mk("g", {}, g), sp: spring(FL0), drawn: NaN };
  mk("path", { class: "nf sil", d: seg(P(H[0], H[1], ZT - 1), P(H[0], H[1], PH)) }, flag.g);
  flag.cloth = mk("path", { class: "", d: "" }, flag.g);
  items.push(flag);
  const balls = RESTS.map(([x, y], i) => {
    const b = { i, rx: x, ry: y, sx: spring(x), sy: spring(y), g: mk("g", {}, g), drawn: "" };
    b.body = mk("ellipse", { class: "sil", rx: r2(BR * C.S), ry: r2(BR * C.S) }, b.g);
    b.dim = [[-0.4, -0.1], [0.05, 0.35], [0.38, -0.25], [-0.05, -0.45]].map((o) => ({ o, el: flatDot(b.g, C, 0.45, "dot off") }));
    items.push(b);
    return b;
  });
  let orderKey = "";

  function draw() {
    const a = flag.sp.x;
    if (!(Math.abs(a - flag.drawn) < 1e-4)) {
      flag.drawn = a;
      const c = Math.cos(a), s = Math.sin(a), at = (l, z) => P(H[0] + l * c, H[1] + l * s, z);
      const pts = [P(H[0], H[1], PH), at(13, PH - 1.6), at(26, PH - 8), at(13, PH - 15), P(H[0], H[1], PH - 16)];
      flag.cloth.setAttribute("d", poly(fillet(pts, [0.6, 3, 1.2, 3, 0.6], 4)));
    }
    for (const b of balls) {
      const x = b.sx.x, y = b.sy.x, key = x.toFixed(2) + "," + y.toFixed(2);
      if (key === b.drawn) continue;
      b.drawn = key;
      b.key = x + y;
      const [cx, cy] = P(x, y, ZT + BR);
      b.body.setAttribute("cx", r2(cx)); b.body.setAttribute("cy", r2(cy));
      for (const d of b.dim) place(d.el, [cx + d.o[0] * BR * C.S, cy + d.o[1] * BR * C.S]);
    }
    const sorted = items.slice().sort((p, q) => p.key - q.key), k = sorted.map((it) => items.indexOf(it)).join();
    if (k !== orderKey) { orderKey = k; for (const it of sorted) g.appendChild(it.g); }
  }

  const B = register(stage, (dt) => {
    let m = stepS(flag.sp, dt);
    for (const b of balls) { if (stepS(b.sx, dt)) m = true; if (stepS(b.sy, dt)) m = true; }
    draw();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let near = null, bd = Infinity;
    for (const b of balls) {
      if (!over) { b.sx.t = b.rx; b.sy.t = b.ry; continue; }
      const vx = over[0] - b.rx, vy = over[1] - b.ry, d = Math.hypot(vx, vy);
      if (d < bd) { bd = d; near = b; }
      const m = d < 0.01 ? 0 : Math.min(Math.max(d - BR * 2.2, 0) * 0.7, ROLL) / d;
      let tx = b.rx + vx * m, ty = b.ry + vy * m;
      const r = Math.hypot(tx, ty), lim = GR(Math.atan2(ty, tx)) - BR - 3;
      if (r > lim) { tx *= lim / r; ty *= lim / r; }
      b.sx.t = tx; b.sy.t = ty;
    }
    for (const b of balls) b.body.classList.toggle("hi", over ? b === near : b.i === FAV);
    const aim = over && Math.hypot(over[0] - H[0], over[1] - H[1]) > 5 ? Math.atan2(over[1] - H[1], over[0] - H[0]) : over ? flag.sp.t : FL0;
    flag.sp.t = flag.sp.t + wrap(aim - flag.sp.t);
    read.textContent = near ? "ball " + (near.i + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZT);
      over = Math.hypot(x, y) < GR(Math.atan2(y, x)) + 12 ? [x, y] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  draw();
  return { set: (v) => { ROLL = 30 * v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "golfgreen",
  means: "A putting green with a flag and three balls: the balls roll toward the pointer, the nearest bright, and the flag swings to it.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.5],
  tour: [[129, 150], [153, 185], [225, 204], null],
  mount,
});
