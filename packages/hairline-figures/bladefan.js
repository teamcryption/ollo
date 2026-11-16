/**
 * Cooling fan: a square PC case fan lying on its back, the rounded frame
 * with its round throat, seven swept blades and the hub. The pointer, read
 * on the frame's top plane, turns the rotor on a spring so the bright blade
 * swings round to face it. At rest the rotor sits part-turned, one blade
 * bright. The slider is the blades' sweep.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, H = 12, CX = 32, CY = 32, R0 = 9.5, R1 = 27, N = 7, REST = -0.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sweep = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, H], [0, W, H], [0, 0, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(0, 0, W, W, 7, 1.6);
  const frame = solid(g);
  put(frame, prism(P, front, fr, fi, 0, H));
  const throat = circ(R1 + 2, 40).map((q) => P(CX + q.u, CY + q.v, H));
  mk("path", { class: "nf lo", d: poly(throat) }, frame.g);
  // four screw holes in the corners
  let sc = "";
  for (const [x, y] of [[5, 5], [W - 5, 5], [5, W - 5], [W - 5, W - 5]]) sc += poly(circ(1.6, 12).map((q) => P(x + q.u, y + q.v, H)));
  mk("path", { class: "nf lo", d: sc }, frame.g);
  const ZB = H - 1.5;
  const blades = [];
  for (let i = 0; i < N; i++) blades.push(mk("path", { class: "sil" }, g));
  const hub = solid(g), hcr = circ(R0, 24), hin = circ(R0 - 1.2, 24);
  put(hub, prism(P, front, hcr, hin, ZB - 1, H + 1.5));
  mk("path", { class: "nf lo", d: poly(circ(3, 16).map((q) => P(CX + q.u, CY + q.v, H + 1.5))) }, hub.g);

  const rot = spring(REST);
  let last = NaN, lastSw = NaN;
  function blade(t) {
    const sw = 0.35 + sweep * 0.5, pts = [];
    const pol = (r, a) => [CX + r * Math.cos(a), CY + r * Math.sin(a)];
    pts.push(pol(R0 - 1, t - 0.32), pol(R0 - 1, t + 0.18));
    pts.push(pol((R0 + R1) / 2, t + 0.18 + sw * 0.5), pol(R1 - 0.5, t + 0.3 + sw), pol(R1 - 0.5, t - 0.22 + sw));
    pts.push(pol((R0 + R1) / 2, t - 0.36 + sw * 0.45));
    return fillet(pts.map(([x, y]) => P(x, y, ZB)), [1, 1, 4, 3, 3, 4], 4);
  }
  function draw(a) {
    if (a === last && sweep === lastSw) return;
    last = a; lastSw = sweep;
    // paint far blades first: by the screen y of each blade's middle
    const order = blades.map((el, i) => ({ el, t: a + (i * 2 * Math.PI) / N })).sort((p, q) => (Math.sin(p.t) + Math.cos(p.t)) - (Math.sin(q.t) + Math.cos(q.t)));
    order.forEach(({ el, t }) => { el.setAttribute("d", poly(blade(t))); hub.g.before(el); });
  }
  const B = register(stage, (dt) => { const m = stepS(rot, dt); draw(rot.x); return m; });
  bag.add(B.unregister);

  let act = false;
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    const dx = x - CX, dy = y - CY, r = Math.hypot(dx, dy);
    if (r > W * 0.62 || x < -6 || y < -6 || x > W + 6 || y > W + 6) return leave();
    let ang = Math.atan2(dy, dx);
    while (ang - rot.t > Math.PI) ang -= 2 * Math.PI;
    while (ang - rot.t < -Math.PI) ang += 2 * Math.PI;
    rot.t = ang;
    act = true;
    let deg = Math.round(((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360);
    read.textContent = deg + "°";
    B.wake();
  }
  function leave() {
    if (act) { rot.t = REST + Math.round((rot.t - REST) / (2 * Math.PI)) * 2 * Math.PI; act = false; B.wake(); }
    read.textContent = "rest";
  }
  blades[0].classList.add("hi");
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sweep = clamp(v, 0, 1); last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "bladefan",
  means: "A PC cooling fan lying on its back: the rotor turns on a spring so the bright blade swings round to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[153, 176], [247, 176], [153, 129], null],
  mount,
});
