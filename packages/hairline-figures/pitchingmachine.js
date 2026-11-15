/**
 * Batting cage: a netted tunnel on hoops, a pitching machine at the far end.
 * The pointer is where the ball is driven: the back net takes it, bellying
 * out round the ball, the mesh bending on a spring, and the ring of net round
 * the ball is bright. At rest one ball sits low in the net. The slider is how
 * hard the ball is hit.
 *
 * The pattern: a continuous press (springs on the ball's place and depth);
 * the hit is on the floor's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, open, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const X0 = -72, X1 = 72, YW = 24, H = 44, HOOPS = [-72, -36, 0, 36, 72];
const REST = [34, 12, 5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.75);
  let force = value;
  fit(C, [[X0, -YW - 40, 0], [X1, -YW - 40, H], [X0, YW, 0], [X1, YW, H], [X0, -YW, H], [X1, YW, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [fr, fi] = rings(X0 - 4, -YW - 4, X1 + 4, YW + 4, 4, 2);
  put(solid(g), prism(P, front, fr, fi, 0, 2));
  const net = mk("path", { class: "nf lo", d: "" }, g);
  const lip = mk("path", { class: "nf sil hi", d: "" }, g);
  const ball = flatDot(g, C, 1.6, "dot");
  // hoops: posts on both sides and a bar across the roof; the roof's netting between them
  const hoop = (x, y0, y1) => open([P(x, y0, 2), P(x, y0, H - 4), P(x, y0 + Math.sign(y1 - y0) * 4, H), P(x, y1 - Math.sign(y1 - y0) * 4, H), P(x, y1, H - 4), P(x, y1, 2)]);
  mk("path", { class: "nf sil", d: HOOPS.map((x) => hoop(x, -YW, YW)).join("") }, g);
  let roof = "";
  for (let y = -YW + 8; y <= YW - 8; y += 16) roof += seg(P(X0, y, H), P(X1, y, H));
  mk("path", { class: "nf lo", d: roof }, g);
  // the pitching machine: a base, a column and a throwing wheel facing down the tunnel
  put(solid(g), prism(P, front, ...rings(X0 + 6, -8, X0 + 22, 8, 2.5, 1), 2, 8));
  put(solid(g), prism(P, front, circ(2.2, 16).map((q) => ({ ...q, u: q.u + X0 + 14, v: q.v })), null, 8, 18));
  const wheel = [];
  for (let k = 0; k <= 32; k++) { const t = (k / 32) * Math.PI * 2; wheel.push(P(X0 + 14, 7 * Math.cos(t), 24 + 7 * Math.sin(t))); }
  mk("path", { class: "sil", d: open(wheel) }, g);
  mk("path", { class: "nf sil", d: seg(P(X0, YW, 2), P(X0, YW, H - 4)) + seg(P(X1, YW, 2), P(X1, YW, H - 4)) }, g);

  const bx = spring(REST[0]), bz = spring(REST[1]), bd = spring(REST[2]);
  let drawn = "";
  const yAt = (x, z) => {
    const edge = clamp(Math.sin(((x - X0) / (X1 - X0)) * Math.PI), 0, 1) * clamp(Math.sin((z / H) * Math.PI), 0, 1);
    return -YW - bd.x * Math.exp(-((x - bx.x) ** 2 + (z - bz.x) ** 2) / (2 * 24 * 24)) * edge;
  };
  function draw() {
    const key = bx.x.toFixed(2) + bz.x.toFixed(2) + bd.x.toFixed(2);
    if (key === drawn) return;
    drawn = key;
    let d = "";
    for (let z = 6; z < H; z += 6) { const pts = []; for (let x = X0; x <= X1; x += 3) pts.push(P(x, yAt(x, z), z)); d += open(pts); }
    for (let x = X0 + 8; x < X1; x += 8) { const pts = []; for (let z = 2; z <= H; z += 2) pts.push(P(x, yAt(x, z), z)); d += open(pts); }
    net.setAttribute("d", d);
    const lp = [], lr = 6 + bd.x * 0.2;
    for (let k = 0; k <= 36; k++) { const t = (k / 36) * Math.PI * 2, x = bx.x + lr * Math.cos(t), z = bz.x + lr * Math.sin(t); lp.push(P(x, yAt(x, z), z)); }
    lip.setAttribute("d", open(lp));
    place(ball, P(bx.x, yAt(bx.x, bz.x) + 1.5, bz.x));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of [bx, bz, bd]) if (stepS(s, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { bx.t = REST[0]; bz.t = REST[1]; bd.t = REST[2]; read.textContent = "rest"; B.wake(); return; }
    const x = clamp(p[0], X0 + 20, X1 - 14), z = clamp(14 + (p[1] + YW) * 0.5, 10, H - 12);
    bx.t = x; bz.t = z; bd.t = 34 * force;
    read.textContent = "bay " + clamp(Math.ceil((x - X0) / 36), 1, 4);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => { const p = unproj(C, q[0], q[1], 0); aim(p[0] < X0 - 10 || p[0] > X1 + 10 || Math.abs(p[1]) > YW + 30 ? null : p); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return {
    set: (v) => { force = v; if (bd.t !== REST[2]) { bd.t = 34 * v; B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pitchingmachine",
  means: "A batting cage: the back net bellies out round the ball where the pointer drives it, the ring of net round it bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.25],
  tour: [[113, 181], [175, 199], [249, 224], null],
  mount,
});
