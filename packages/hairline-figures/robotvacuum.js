/**
 * Robot vacuum: a round robot on a floor plate, its dock standing at the far
 * edge. The pointer, read on the ground plane, is where the robot heads: it
 * glides toward it inside a clamped reach and turns its bumper to face it,
 * the lidar puck riding at its back. At rest it sits off the dock, angled
 * home, and the dock's contact dot is the bright mark. The slider is the reach.
 *
 * The pattern: one part follows the pointer on the ground (terrain pick).
 */
const {
  Cam, circ, clamp, fit, facing, open, prism, proj, rings, ringAt, run, spring, stepS, unproj,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const W = 120, R = 22, H = 8, REST = [72, 70], RH = -2.4, DOCK = [4, 38, 14, 82];
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, -3], [W, W, -3], [W, 0, -3], [0, W, -3], [DOCK[0], DOCK[1], 26], [DOCK[2], DOCK[3], 26]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(0, 0, W, W, 8, 2);
  put(solid(g), prism(P, front, fr, fi, -3, 0));
  // the dock: a ramp plate, then the upright block with its contact
  const [pr, pi] = rings(DOCK[2], 46, DOCK[2] + 10, 74, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 0, 1.4));
  const [dr, di] = rings(DOCK[0], DOCK[1], DOCK[2], DOCK[3], 4, 1.4);
  const dock = solid(g);
  put(dock, prism(P, front, dr, di, 0, 24));
  mk("path", { d: open([P(DOCK[2], 52, 14), P(DOCK[2], 68, 14)]), class: "nf lo" }, g);
  const contact = mk("circle", { r: 2.6, class: "dot" }, g);
  place(contact, P(DOCK[2] + 1, 60, 5));

  const bot = mk("g", {}, g);
  const body = solid(bot), bump = mk("path", { class: "nf" }, bot), puck = solid(bot);
  const eye = mk("circle", { r: 2.2, class: "dot m" }, bot);
  const sx = spring(REST[0]), sy = spring(REST[1]), sh = spring(RH);
  let last = "";

  function draw() {
    const x = sx.x, y = sy.x, h = sh.x, key = x.toFixed(2) + y.toFixed(2) + h.toFixed(3);
    if (key === last) return;
    last = key;
    put(body, prism(P, front, disc(x, y, R, 40), disc(x, y, R - 2, 40), 0, H));
    const keep = (q) => front(q) && Math.cos(Math.atan2(q.v - y, q.u - x) - h) > 0.3;
    const arc = run(disc(x, y, R, 60), keep);
    bump.setAttribute("d", arc.length > 1 ? open(ringAt(P, arc, H * 0.45)) : "");
    const px = x - 7 * Math.cos(h), py = y - 7 * Math.sin(h);
    put(puck, prism(P, front, disc(px, py, 7, 24), disc(px, py, 5.6, 24), H, H + 3.4));
    place(eye, P(x + 15 * Math.cos(h), y + 15 * Math.sin(h), H));
  }

  const B = register(stage, (dt) => {
    const m = [stepS(sx, dt), stepS(sy, dt), stepS(sh, dt)].some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(tx, ty) {
    let a = Math.atan2(ty - sy.x, tx - sx.x);
    if (Math.hypot(ty - sy.x, tx - sx.x) < 3) a = sh.t;
    while (a - sh.t > Math.PI) a -= 2 * Math.PI;
    while (a - sh.t < -Math.PI) a += 2 * Math.PI;
    sh.t = a;
    sx.t = tx; sy.t = ty;
  }

  function move([px, py]) {
    const [wx, wy] = unproj(C, px, py, 0);
    if (wx < -10 || wy < -10 || wx > W + 10 || wy > W + 10) return leave();
    const dx = wx - REST[0], dy = wy - REST[1], d = Math.hypot(dx, dy), s = d > reach ? reach / d : 1;
    const tx = clamp(REST[0] + dx * s, DOCK[2] + R + 12, W - R - 3), ty = clamp(REST[1] + dy * s, R + 3, W - R - 3);
    aim(tx, ty);
    body.sil.classList.add("hi");
    contact.setAttribute("class", "dot off");
    const deg = Math.round((((sh.t * 180) / Math.PI) % 360 + 360) % 360);
    read.textContent = String(deg).padStart(3, "0") + "°";
    B.wake();
  }
  function leave() {
    let a = RH;
    while (a - sh.t > Math.PI) a -= 2 * Math.PI;
    while (a - sh.t < -Math.PI) a += 2 * Math.PI;
    sh.t = a; sx.t = REST[0]; sy.t = REST[1];
    body.sil.classList.remove("hi");
    contact.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  draw();
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "robotvacuum",
  means: "A robot vacuum off its dock: it glides toward the pointer on the floor and turns its bumper to face it.",
  rules: [1, 3, 4, 5],
  range: [10, 28, 40],
  tour: [[260, 205], [150, 195], [215, 150], null],
  mount,
});
