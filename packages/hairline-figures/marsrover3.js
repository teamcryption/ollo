/**
 * Space probe: a boxy bus with two long solar wings and a big dish on a
 * mast. The dish swings round to aim at the pointer, tipped up toward deep
 * space. At rest it looks off to the far left, bright. The slider is how
 * high the dish tips.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, unproj, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = -150, ZD = 48, RD = 24, DEP = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-12, -66, 20], [12, 66, 20], [-26, 0, ZD + 26], [26, 0, ZD - 20], [0, 26, ZD + 26], [0, 0, 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  function wing(y0, y1) {
    const w = mk("g", {}, g), z = 22;
    mk("path", { d: poly([P(-11, y0, z), P(11, y0, z), P(11, y1, z), P(-11, y1, z)]), class: "sil" }, w);
    let d = seg(P(0, y0, z), P(0, y1, z));
    for (let i = 1; i < 4; i++) { const y = y0 + ((y1 - y0) * i) / 4; d += seg(P(-11, y, z), P(11, y, z)); }
    mk("path", { d, class: "lo nf" }, w);
    mk("path", { d: seg(P(0, Math.sign(y0) * 14, z), P(0, y0, z)), class: "nf" }, w);
  }
  wing(-20, -64);
  const [br, bi] = rings(-14, -14, 14, 14, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 6, 34));
  wing(20, 64);
  mk("path", { d: seg(P(0, 0, 34), P(0, 0, ZD - 4)), class: "sil nf" }, g);
  const feedB = mk("path", { class: "sil nf" }, g), dish = mk("path", { class: "sil hi" }, g);
  const rim = mk("path", { class: "lo nf" }, g), feedF = mk("path", { class: "sil nf" }, g);

  const sp = spring(REST);
  let last = NaN;
  function draw() {
    if (sp.x === last) return;
    last = sp.x;
    const ph = rad(sp.x), el = rad(20 + tip * 0.5);
    const ax = [Math.cos(ph) * Math.cos(el), Math.sin(ph) * Math.cos(el), Math.sin(el)];
    const u = [-Math.sin(ph), Math.cos(ph), 0];
    const w = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
    const at = (a, b, c) => P(a * u[0] + b * w[0] + c * ax[0], a * u[1] + b * w[1] + c * ax[1], ZD + a * u[2] + b * w[2] + c * ax[2]);
    const ring = [], pts = [];
    for (let i = 0; i < 40; i++) { const t = (i / 40) * 2 * Math.PI; ring.push(at(RD * Math.cos(t), RD * Math.sin(t), DEP)); }
    for (const [r, c] of [[RD * 0.7, DEP * 0.5], [RD * 0.35, DEP * 0.12]]) for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI; pts.push(at(r * Math.cos(t), r * Math.sin(t), c)); }
    dish.setAttribute("d", poly(hull(ring.concat(pts, [at(0, 0, 0)]))));
    rim.setAttribute("d", poly(ring));
    const toward = ax[0] + ax[1] + ax[2] * 0.7 > 0;
    let f = "";
    for (let i = 0; i < 3; i++) { const t = (i / 3) * 2 * Math.PI; f += seg(at(RD * Math.cos(t), RD * Math.sin(t), DEP), at(0, 0, DEP + 18)); }
    f += seg(at(0, 0, DEP + 16), at(0, 0, DEP + 22));
    feedF.setAttribute("d", toward ? f : "");
    feedB.setAttribute("d", toward ? "" : f);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 20);
    let a = (Math.atan2(y, x) * 180) / Math.PI;
    while (a - sp.t > 180) a -= 360;
    while (a - sp.t < -180) a += 360;
    sp.t = a;
    read.textContent = "az " + (((Math.round(a) % 360) + 360) % 360);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; last = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "marsrover3",
  means: "A deep-space probe with solar wings: its big dish swings round to aim at the pointer, tipped up toward the stars.",
  rules: [1, 3, 5, 8],
  range: [0, 40, 80],
  tour: [[340, 213], [60, 182], [200, 280], null],
  mount,
});
