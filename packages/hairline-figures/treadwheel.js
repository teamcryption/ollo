/**
 * Treadwheel: a medieval treadwheel crane, a great walking wheel on its axle
 * posts, its rope wound on the axle and led over a raking jib to a hanging
 * stone. The pointer across the figure walks the wheel: right turns it
 * forward and hoists the stone, left pays out and lowers it. At rest the
 * stone is the bright mark. The slider sets how far one sweep turns the wheel.
 *
 * The pattern: one part turning with the pointer (wind).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CZ = 40, R = 34, W = 8, TIP = [86, 0, 96], FOOT = [36, 0, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let K = value / 100;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-R, -12, 0], [-R, 12, CZ + R], [R, 12, 0], [R, -12, CZ + R], TIP, [86, 0, 0], [40, 14, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r = 2, b = 0.8) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  const W3 = (x, y, z) => P(x, y, z);
  box(-36, -13, 44, 13, 0, 3, 3, 1.2);
  box(-3, -13, 3, -9, 3, CZ + 2, 1.5, 0.6);
  const wheel = mk("g", {}, g);
  const rimB = mk("path", { class: "nf" }, wheel), spokesB = mk("path", { class: "nf" }, wheel);
  const slats = mk("path", { class: "nf lo" }, wheel), drum = mk("path", { class: "nf" }, wheel);
  // jib between the rims, then the near post and rim
  const jd = TIP.map((v, i) => v - FOOT[i]), jl = Math.hypot(...jd), dj = jd.map((v) => v / jl);
  const at = (t, b, c) => P(FOOT[0] + t * dj[0] - c * dj[2] * 5, b * 5, FOOT[2] + t * dj[2] + c * dj[0] * 5);
  const jp = [];
  for (const t of [0, jl]) for (const b of [-0.5, 0.5]) for (const c of [-0.5, 0.5]) jp.push(at(t, b, c));
  mk("path", { d: poly(hull(jp)), class: "sil" }, g);
  mk("path", { d: open([at(3, 0, 0.3), at(jl - 3, 0, 0.3)]), class: "nf lo" }, g);
  box(-3, 9, 3, 13, 3, CZ + 2, 1.5, 0.6);
  const rimF = mk("path", { class: "nf sil" }, g), spokesF = mk("path", { class: "nf" }, g);
  const rope = mk("path", { class: "nf lo" }, g), hang = mk("path", { class: "dash nf" }, g), stone = solid(g);
  const sr = spring(0);
  let last = "";
  const ring = (y, r, rot) => { const p = []; for (let i = 0; i < 48; i++) { const t = rot + (i / 48) * 2 * Math.PI; p.push(W3(r * Math.cos(t), y, CZ + r * Math.sin(t))); } return p; };
  const spokes = (y, rot) => { let d = ""; for (let k = 0; k < 6; k++) { const t = rot + (k * Math.PI) / 3; d += "M" + W3(4 * Math.cos(t), y, CZ + 4 * Math.sin(t)).join(",") + "L" + W3(R * Math.cos(t), y, CZ + R * Math.sin(t)).join(","); } return d; };

  function draw() {
    const rot = rad(sr.x), key = sr.x.toFixed(2);
    if (key === last) return;
    last = key;
    rimB.setAttribute("d", poly(ring(-W, R, 0)));
    spokesB.setAttribute("d", spokes(-W, rot));
    let d = "";
    for (let k = 0; k < 12; k++) { const t = rot + (k * Math.PI) / 6 + 0.26; d += "M" + W3(R * Math.cos(t), -W, CZ + R * Math.sin(t)).join(",") + "L" + W3(R * Math.cos(t), W, CZ + R * Math.sin(t)).join(","); }
    slats.setAttribute("d", d);
    drum.setAttribute("d", poly(ring(0, 5, rot)));
    rimF.setAttribute("d", poly(ring(W, R, 0)));
    spokesF.setAttribute("d", spokes(W, rot));
    const sz = clamp(26 + sr.x * 0.3, 6, 62);
    rope.setAttribute("d", open([W3(0, 0, CZ + 5), W3(TIP[0], 0, TIP[2])]));
    hang.setAttribute("d", open([W3(TIP[0], 0, TIP[2]), W3(TIP[0], 0, sz + 9)]));
    const [o, i] = rings(TIP[0] - 6, -6, TIP[0] + 6, 6, 2, 1);
    put(stone, prism(P, front, o, i, sz, sz + 9));
  }

  const B = register(stage, (dt) => { const m = stepS(sr, dt); draw(); return m; });
  bag.add(B.unregister);

  let on = null, tgt = null;
  function walk(p) {
    tgt = p;
    const act = !!p;
    sr.t = act ? clamp((p[0] - 200) / 110, -1, 1) * 140 * K : 0;
    if (act !== on) { on = act; rimF.classList.toggle("hi", act); stone.sil.classList.toggle("hi", !act); }
    read.textContent = act ? (sr.t >= 0 ? "+" : "−") + String(Math.abs(Math.round(sr.t))).padStart(3, "0") + "°" : "rest";
    B.wake();
  }
  walk(null);
  draw();
  bag.add(pointer(stage, { move: (p) => walk(p), leave: () => walk(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { K = v / 100; walk(tgt); }, destroy: bag.dispose };
}

hairline({
  name: "treadwheel",
  means: "A medieval treadwheel crane: the pointer walks the great wheel round, winding the rope over the jib to hoist or lower the stone.",
  rules: [1, 3, 5, 8],
  range: [30, 80, 100],
  tour: [[300, 160], [120, 160], [260, 200], null],
  mount,
});
