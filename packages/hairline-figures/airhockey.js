/**
 * Air hockey: a table with a rail, a centre line and circle, two mallets at
 * the ends and a puck. The puck slides on a spring to the point of the table
 * under the pointer, the mallet on that half follows behind it, and the paint
 * order follows them. At rest
 * the puck sits off centre, bright. The slider is how far it travels.
 *
 * The pattern: one part following the pointer on a plane (terrain pick).
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 130, D = 70, TZ = 10, RIM = 4, PR = 5, RX = 80, RY = 24;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, TZ + 12], [W, D, TZ + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the table body, then its playing surface inside a rail
  const [tr, ti] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  const [sr, si] = rings(RIM, RIM, W - RIM, D - RIM, 6, 1.2);
  put(solid(g), prism(P, front, sr, si, TZ, TZ + 0.01));
  mk("path", { d: seg(P(W / 2, RIM, TZ), P(W / 2, D - RIM, TZ)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(W / 2, D / 2, 12, 36), TZ)), class: "nf lo" }, g);
  // the goals: slots in the short rails
  for (const x of [RIM / 2, W - RIM / 2]) mk("path", { d: seg(P(x, D / 2 - 10, TZ), P(x, D / 2 + 10, TZ)), class: "nf" }, g);

  const parts = [];
  const mallets = [];
  function mallet(x, y, side) {
    const grp = mk("g", {}, g), m = { grp, side, hx: x, hy: y, sx: spring(x), sy: spring(y), base: solid(grp), grip: solid(grp), lx: NaN, ly: NaN };
    m.draw = () => {
      if (m.sx.x === m.lx && m.sy.x === m.ly) return;
      const x = (m.lx = m.sx.x), y = (m.ly = m.sy.x);
      put(m.base, prism(P, front, disc(x, y, 7.5), disc(x, y, 6), TZ, TZ + 2.5));
      put(m.grip, prism(P, front, disc(x, y, 3.2, 20), disc(x, y, 2.2, 20), TZ + 2.5, TZ + 10));
    };
    mallets.push(m);
    parts.push({ grp, key: () => m.sx.x + m.sy.x });
  }
  mallet(16, D / 2 + 6, -1);
  mallet(W - 16, D / 2 - 8, 1);
  const pg = mk("g", {}, g), puck = solid(pg);
  puck.sil.classList.add("hi");
  const px = spring(RX), py = spring(RY);
  parts.push({ grp: pg, key: () => px.x + py.x });

  let lx = NaN, ly = NaN, order = "";
  function draw() {
    mallets.forEach((m) => m.draw());
    if (px.x !== lx || py.x !== ly) {
      lx = px.x; ly = py.x;
      put(puck, prism(P, front, disc(lx, ly, PR), disc(lx, ly, PR - 1.2), TZ, TZ + 1.8));
    }
    const sorted = parts.slice().sort((a, b) => a.key() - b.key());
    const o = sorted.map((p) => parts.indexOf(p)).join();
    if (o !== order) { order = o; sorted.forEach((p) => g.appendChild(p.grp)); }
  }
  const B = register(stage, (dt) => {
    let m = stepS(px, dt) | stepS(py, dt);
    for (const k of mallets) m |= stepS(k.sx, dt) | stepS(k.sy, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);

  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], TZ);
    if (wx < -10 || wx > W + 10 || wy < -10 || wy > D + 10) return leave();
    const tx = clamp(wx, RIM + PR, W - RIM - PR), ty = clamp(wy, RIM + PR, D - RIM - PR);
    px.t = RX + (tx - RX) * reach; py.t = RY + (ty - RY) * reach;
    // the mallet on the pointer's half comes up behind the puck, staying on its own side
    for (const k of mallets) {
      const mine = (tx < W / 2 ? -1 : 1) === k.side;
      k.sx.t = mine ? clamp(px.t + k.side * 16, k.side < 0 ? RIM + 8 : W / 2 + 8, k.side < 0 ? W / 2 - 8 : W - RIM - 8) : k.hx;
      k.sy.t = mine ? clamp(py.t, RIM + 8, D - RIM - 8) : k.hy;
    }
    read.textContent = "puck " + (1 + Math.floor(tx / (W / 5))) + "·" + (1 + Math.floor(ty / (D / 3)));
    B.wake();
  }
  function leave() { px.t = RX; py.t = RY; for (const k of mallets) { k.sx.t = k.hx; k.sy.t = k.hy; } read.textContent = "rest"; B.wake(); }
  leave();
  draw();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "airhockey",
  means: "An air hockey table: the puck slides to the point under the pointer and the mallet on that half comes up behind it.",
  rules: [1, 3, 5, 6],
  range: [0.4, 0.8, 1],
  tour: [[124, 157], [250, 170], [200, 150], null],
  mount,
});
