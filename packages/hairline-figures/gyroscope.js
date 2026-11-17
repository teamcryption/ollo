/**
 * Gyroscope: a rotor in a gimbal ring on a post and a round foot. The
 * pointer turns the gimbal to face it and tips the rotor's axle by how far
 * away it stands. At rest the ring is turned a little and the rotor leans,
 * bright. The slider is the most the rotor may tip.
 */
const {
  Cam, circ, fit, facing, open, poly, prism, proj, rings, unproj, clamp, rad, hull,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const H = 62, RG = 36, RR = 26;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-RG, -RG, 0], [RG, RG, 0], [0, 0, H + RG + 2], [RG, -RG, H], [-RG, RG, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [b0, b1] = rings(-26, -26, 26, 26, 26, 2);
  put(solid(g), prism(P, front, b0, b1, 0, 6));
  put(solid(g), prism(P, front, disc(3.5, 20), disc(2, 20), 6, H - RG + 1));
  const back = mk("path", { class: "nf" }, g), backI = mk("path", { class: "nf lo" }, g);
  const axle = mk("path", { class: "nf" }, g);
  const rotor = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), hub = mk("path", { class: "nf" }, g);
  const frontR = mk("path", { class: "nf" }, g), frontI = mk("path", { class: "nf lo" }, g);
  const yaw = spring(rad(25)), tilt = spring(rad(22));
  const add = (c, a, k) => [c[0] + a[0] * k, c[1] + a[1] * k, c[2] + a[2] * k];
  const ring3 = (c, a, b, r, n = 48) => { const o = []; for (let i = 0; i <= n; i++) { const t = (i / n) * 2 * Math.PI; o.push(add(add(c, a, r * Math.cos(t)), b, r * Math.sin(t))); } return o; };

  function draw() {
    const y = yaw.x, t = tilt.x, c = [0, 0, H];
    const u = [Math.cos(y), Math.sin(y), 0], z = [0, 0, 1];
    const half = (pts, near) => { const o = []; let cur = []; for (const p of pts) { if ((p[0] + p[1] > 0) === near) cur.push(P(...p)); else if (cur.length) { o.push(open(cur)); cur = []; } } if (cur.length) o.push(open(cur)); return o.join(" "); };
    const gO = ring3(c, u, z, RG), gI = ring3(c, u, z, RG - 3.5);
    back.setAttribute("d", half(gO, false)); backI.setAttribute("d", half(gI, false));
    frontR.setAttribute("d", half(gO, true)); frontI.setAttribute("d", half(gI, true));
    const ax = [u[0] * Math.sin(t), u[1] * Math.sin(t), Math.cos(t)];
    const pv = [-Math.sin(y), Math.cos(y), 0];
    const q = [ax[1] * pv[2] - ax[2] * pv[1], ax[2] * pv[0] - ax[0] * pv[2], ax[0] * pv[1] - ax[1] * pv[0]];
    axle.setAttribute("d", open([P(...add(c, ax, -(RG - 3.5))), P(...add(c, ax, RG - 3.5))]));
    const top = ring3(add(c, ax, 3), pv, q, RR), bot = ring3(add(c, ax, -3), pv, q, RR);
    rotor.setAttribute("d", poly(hull(top.concat(bot).map((p) => P(...p)))));
    const up = ax[0] + ax[1] + ax[2] * 1.4 > 0 ? top : bot;
    face.setAttribute("d", poly(ring3(add(c, ax, up === top ? 3 : -3), pv, q, RR - 6).map((p) => P(...p))));
    hub.setAttribute("d", poly(ring3(add(c, ax, up === top ? 3 : -3), pv, q, 4, 20).map((p) => P(...p))));
  }
  draw();
  rotor.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(yaw, dt) | stepS(tilt, dt); draw(); return !!m; });
  bag.add(B.unregister);
  function aim(wx, wy) {
    const a = Math.atan2(wy, wx);
    let d = a - yaw.t; d = Math.atan2(Math.sin(d), Math.cos(d));
    yaw.t += d;
    const k = clamp(Math.hypot(wx, wy) / 70, 0.15, 1);
    tilt.t = rad(reach) * k;
    read.textContent = Math.round((((yaw.t * 180) / Math.PI) % 360 + 360) % 360) + "°";
    B.wake();
  }
  function rest() { yaw.t = rad(25) + Math.round((yaw.t - rad(25)) / (2 * Math.PI)) * 2 * Math.PI; tilt.t = rad(22); read.textContent = "rest"; B.wake(); }
  rest();
  bag.add(pointer(stage, { move: ([sx, sy]) => { const [wx, wy] = unproj(C, sx, sy, 0); aim(wx, wy); }, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "gyroscope",
  means: "A gyroscope on a post: the gimbal ring turns to face the pointer and the spinning rotor tips its axle toward it.",
  rules: [1, 3, 5, 6],
  range: [10, 35, 60],
  tour: [[350, 240], [60, 240], [200, 300], null],
  mount,
});
