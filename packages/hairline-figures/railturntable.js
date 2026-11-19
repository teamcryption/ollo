/**
 * Railway turntable: a round pit with its bridge across it, a locomotive on
 * the bridge's rails, and roads of track running out from the rim. The
 * pointer picks the road: the bridge and its engine swing round on a spring
 * to face it. At rest the engine stands a little askew of the roads, its cab
 * bright. The slider is how far round the bridge will swing.
 *
 * The pattern: a continuous aim (officechairs' spring on an angle); the hit
 * is on the yard's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, run, open, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 48, ROAD = 30, REST = rad(22), ROADS = [0, 60, 105, 180, 250, 300].map(rad);
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.0);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([(R + ROAD + 2) * Math.cos(a), (R + ROAD + 2) * Math.sin(a), 0], [(R - 20) * Math.cos(a), (R - 20) * Math.sin(a), 22]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // roads of track out from the rim, then the pit: its rim and the far half of its floor
  let rails = "", ties = "";
  for (const a of ROADS) {
    const c = Math.cos(a), s = Math.sin(a), at = (r, w) => P(r * c - w * s, r * s + w * c, 0);
    for (const w of [-3, 3]) rails += seg(at(R + 1, w), at(R + ROAD, w));
    for (let r = R + 4; r < R + ROAD; r += 5) ties += seg(at(r, -5), at(r, 5));
  }
  mk("path", { class: "nf lo", d: ties }, g);
  mk("path", { class: "nf sil", d: rails }, g);
  const rim = circ(R, 72);
  mk("path", { class: "", d: "M" + rim.map((q) => P(q.u, q.v, 0).join(",")).join("L") + "Z" }, g);
  mk("path", { class: "nf lo", d: open(run(rim, (q) => !front(q)).map((q) => P(q.u * 0.97, q.v * 0.97, -7))) }, g);
  mk("path", { class: "nf lo", d: open(circ(R - 6, 60).map((q) => P(q.u, q.v, -7)).concat([P(R - 6, 0, -7)])) }, g);

  const br = mk("g", {}, g);
  const deck = solid(br), track = mk("path", { class: "nf lo" }, br);
  const [DR, DI] = rings(-R + 1, -6, R - 1, 6, 1.5, 0.8);
  const parts = [
    { ring: rings(-20, -5, 20, 5, 1.5, 0.8), z0: 1.5, z1: 5.5, d: 0 },
    { ring: rings(-5, -4.2, 19, 4.2, 4, 1), z0: 5.5, z1: 13.5, d: 8 },
    { ring: rings(-20, -5.5, -5, 5.5, 1.5, 0.8), z0: 5.5, z1: 21, d: -12 },
    { ring: [circ(1.8, 16).map((q) => ({ ...q, u: q.u + 15 })), null], z0: 13.5, z1: 19, d: 15, top: true },
  ];
  for (const p of parts) p.el = solid(br);
  parts[2].el.sil.classList.add("hi");

  const sp = spring(REST);
  let drawn = NaN, order = "";
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), at = (u, w, z) => P(u * c - w * s, u * s + w * c, z);
    put(deck, prism(P, front, turn(DR, a), turn(DI, a), -2, 0.8));
    let t = "";
    for (const w of [-3, 3]) t += seg(at(-R + 2, w, 1), at(R - 2, w, 1));
    for (let u = -R + 5; u < R - 2; u += 5) t += seg(at(u, -4.5, 0.9), at(u, 4.5, 0.9));
    track.setAttribute("d", t);
    for (const p of parts) put(p.el, prism(P, front, turn(p.ring[0], a), p.ring[1] && turn(p.ring[1], a), p.z0, p.z1));
    // paint the engine's parts far to near; the chimney always after its boiler
    const k = (p) => (p.top ? 1e3 : 0) + (p === parts[0] ? -1e3 : p.d * (c + s));
    const sorted = parts.slice().sort((p, q) => k(p) - k(q)), key = sorted.map((p) => p.d).join();
    if (key !== order) { order = key; for (const p of sorted) br.appendChild(p.el.g); }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let aim = null;
  function retarget() {
    const goal = aim == null ? REST : REST + reach * wrap(aim - REST);
    sp.t = sp.t + wrap(goal - sp.t);
    read.textContent = aim == null ? "rest" : "road " + (Math.round((goal * 180) / Math.PI + 360) % 360);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      aim = r > R + ROAD + 10 || r < 8 ? null : Math.atan2(y, x);
      retarget();
    },
    leave: () => { aim = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  read.textContent = "rest";
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "railturntable",
  means: "A railway turntable: the bridge in its pit swings the locomotive round to face the road under the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.2, 1, 1],
  tour: [[109, 126], [299, 117], [180, 215], null],
  mount,
});
