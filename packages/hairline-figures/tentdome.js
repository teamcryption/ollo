/**
 * Dome tent: a dome on a groundsheet, two poles crossing over its crown,
 * an arched door on the side facing us. The nearer the pointer comes to
 * the door, the further the door unzips: the flap rolls down from the top
 * of the arch to a roll at the sill. At rest it is barely unzipped, bright.
 * The slider is how far the flap may roll down.
 *
 * The pattern: one part opening with distance (continuous).
 */
const {
  Cam, clamp, fit, hull, open, poly, prism, proj, rad, rings, spring, stepS, unproj, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 52, H = 46, SPAN = 40, TOP = 66, REST = 0.12;
const V = [Math.cos(rad(30)) * Math.SQRT1_2, Math.cos(rad(30)) * Math.SQRT1_2, Math.sin(rad(30))];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxO = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-R - 8, -R - 8, 0], [R + 8, R + 8, 0], [R + 8, -R - 8, 0], [-R - 8, R + 8, 0], [0, 0, H + 2]], 200, 172);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const w = (ph, ps, dr = 0) => [(R + dr) * Math.cos(rad(ps)) * Math.cos(rad(ph)), (R + dr) * Math.cos(rad(ps)) * Math.sin(rad(ph)), (H + dr) * Math.sin(rad(ps))];
  const pt = (ph, ps, dr = 0) => P(...w(ph, ps, dr));
  const [gr, gi] = rings(-R - 8, -R - 8, R + 8, R + 8, 14, 2);
  put(solid(g), prism(P, front, gr, gi, 0, 1.5));
  const dome = [];
  for (let ps = 0; ps <= 90; ps += 10) for (let ph = 0; ph < 360; ph += 10) dome.push(pt(ph, ps));
  mk("path", { d: poly(hull(dome)), class: "sil" }, g);
  // poles: two arcs over the crown, only where the dome faces us
  let poles = "";
  for (const ph0 of [0, 90]) {
    let run = [];
    for (let s = -90; s <= 90; s += 3) {
      const ps = 90 - Math.abs(s), ph = s < 0 ? ph0 + 180 : ph0, q = w(ph, ps);
      const vis = (q[0] * V[0] + q[1] * V[1]) / (R * R) + (q[2] * V[2]) / (H * H) > 0;
      if (vis) run.push(P(...w(ph, ps, 0.6))); else if (run.length) { poles += open(run); run = []; }
    }
    if (run.length) poles += open(run);
  }
  mk("path", { d: poles, class: "nf lo" }, g);
  const arch = (ph) => TOP * Math.sqrt(Math.max(0, 1 - ((ph - 45) / SPAN) ** 2));
  const phs = []; for (let ph = 45 - SPAN; ph <= 45 + SPAN + 0.01; ph += 4) phs.push(ph);
  const door = phs.map((ph) => pt(ph, arch(ph), 0.4));
  mk("path", { d: poly(door), class: "nf lo" }, g);
  const flap = mk("path", { class: "sil" }, g), roll = mk("path", { class: "nf lo" }, g), zip = mk("path", { class: "nf lo" }, g);
  let last = NaN, on = false;
  function draw(o) {
    o = Math.round(o * 200) / 200;
    if (o === last) return;
    last = o;
    const cap = TOP * (1 - o), dr = 1 + o * 3;
    const topE = phs.map((ph) => pt(ph, Math.min(arch(ph), cap), dr));
    const base = phs.map((ph) => pt(ph, 0, dr)).reverse();
    flap.setAttribute("d", cap < 1 ? "" : poly(topE.concat(base)));
    roll.setAttribute("d", o > 0.04 && cap > 1 ? open(phs.map((ph) => pt(ph, Math.max(0, Math.min(arch(ph), cap) - 3), dr + 1.5))) : "");
    zip.setAttribute("d", cap > 4 ? open([pt(45, 0, dr), pt(45, Math.min(TOP, cap), dr)]) : "");
    read.textContent = on ? "zip " + Math.round(o * 100) + "%" : "rest";
  }
  const op = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(op, dt); draw(op.x); return m; });
  bag.add(B.unregister);
  const dx = R * Math.SQRT1_2, dy = R * Math.SQRT1_2;
  function aim(p) {
    on = !!p; last = NaN;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0), d = Math.hypot(wx - dx, wy - dy);
      if (d > 150) return aim(null);
      op.t = clamp(maxO * (1 - (d - 30) / 120), 0.04, maxO);
    } else op.t = REST;
    B.wake();
  }
  flap.classList.add("hi");
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxO = v; }, destroy: bag.dispose };
}

hairline({
  name: "tentdome",
  means: "A dome tent on a groundsheet: the nearer the pointer comes to its arched door, the further the flap unzips and rolls down to the sill.",
  rules: [1, 3, 5, 8],
  range: [0.7, 0.95, 1],
  tour: [[341, 186], [200, 229], [200, 101], null],
  mount,
});
