/**
 * Dishwasher: a tall cabinet whose front door hinges at its foot. The
 * pointer's height over the figure tips the door down, and once it lies
 * low the lower rack, with its standing plates, rolls out over it. At rest
 * the door stands ajar and the panel light is on. The slider is how far
 * the door can fall.
 *
 * The pattern: one part tilting on a hinge (a continuous spring).
 */
const {
  Cam, clamp, fit, hull, lerp, open, poly, prism, proj, rad, rings, spring, stepS, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 80, D = 72, H = 96, DH = 80, DT = 3, REST = 16, RZ = 26;
const PLATES = [[-26, 12], [-19, 11], [-12, 12], [-5, 10]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[0, 0, 0], [W, 0, H], [W, D, 0], [0, D, H], [0, D + DH + 4, 0], [W, D + DH + 4, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 6, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const face = (x0, x1, z0, z1) => [P(x0, D, z0), P(x1, D, z0), P(x1, D, z1), P(x0, D, z1)];
  mk("path", { d: poly(face(6, W - 6, 8, DH)), class: "lo" }, g);
  mk("path", { d: poly(face(6, W - 6, DH + 4, H - 4)), class: "nf lo" }, g);
  const lamp = P(W - 14, D, DH + 8);
  const dot = mk("circle", { cx: lamp[0], cy: lamp[1], r: 2.6, class: "dot" }, g);
  // the rack and its plates: only the part already out of the cavity is drawn
  const rack = mk("g", {}, g);
  const rb = mk("path", { class: "nf lo" }, rack), plates = PLATES.map(() => mk("path", {}, rack)), rt = mk("path", { class: "nf" }, rack);
  const door = mk("path", { class: "sil" }, g), handle = mk("path", { class: "nf lo" }, g);

  const sp = spring(REST);
  let last = NaN, layLast = null;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = (x, v, w) => P(x, D + v * s + w * c, 4 + v * c - w * s);
    const pts = [];
    for (const x of [3, W - 3]) for (const v of [0, DH]) for (const w of [0, DT]) pts.push(at(x, v, w));
    door.setAttribute("d", poly(hull(pts)));
    handle.setAttribute("d", a > 51 ? "" : poly([at(20, DH - 8, DT), at(W - 20, DH - 8, DT), at(W - 20, DH - 4, DT), at(20, DH - 4, DT)]));
    const o = clamp((a - 48) / 40, 0, 1) * 46, y0 = Math.max(D, D - 34 + o), y1 = D - 2 + o;
    const show = y1 - y0 >= 2;
    const rect = (z) => [P(9, y0, z), P(W - 9, y0, z), P(W - 9, y1, z), P(9, y1, z)];
    rb.setAttribute("d", poly(rect(RZ)) + " " + PLATES.map(([dy]) => open([P(9, y1 + dy, RZ), P(W - 9, y1 + dy, RZ)])).join(" "));
    rt.setAttribute("d", poly(rect(RZ + 10)) + " " + [9, W - 9].map((x) => open([P(x, y0, RZ), P(x, y0, RZ + 10)]) + " " + open([P(x, y1, RZ), P(x, y1, RZ + 10)])).join(" "));
    PLATES.forEach(([dy, r], i) => {
      const ring = [];
      for (let k = 0; k < 28; k++) { const t = (k / 28) * Math.PI * 2; ring.push(P(W / 2 + r * Math.cos(t), y1 + dy, RZ + 1 + r + r * Math.sin(t))); }
      plates[i].setAttribute("d", show && y1 + dy >= y0 ? poly(ring) : "");
    });
    if (!show) { rb.setAttribute("d", ""); rt.setAttribute("d", ""); }
    // the rack sits in front of the door's plane once the door is past ~52°
    const lay = a > 52;
    if (lay !== layLast) { layLast = lay; if (lay) rack.before(door); else rack.after(door); door.after(handle); }
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const yT = P(W, 0, H)[1], yB = P(0, D + DH, 0)[1];
  function move([sx, sy]) {
    if (sx < 30 || sx > 370) return leave();
    sp.t = lerp(4, maxA, clamp((sy - yT) / (yB - yT), 0, 1));
    door.classList.add("hi"); dot.setAttribute("class", "dot m");
    read.textContent = Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() {
    sp.t = REST;
    door.classList.remove("hi"); dot.setAttribute("class", "dot");
    read.textContent = "rest";
    B.wake();
  }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "dishwasher",
  means: "A dishwasher whose door tips down as the pointer moves lower, the plate rack rolling out over it once it lies open.",
  rules: [1, 3, 5, 6],
  range: [60, 90, 90],
  tour: [[325, 64], [206, 154], [124, 247], null],
  mount,
});
