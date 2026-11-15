/**
 * Wheel mixer: a bellied mortar drum hung between two posts on a skid with a
 * wheel at each end. The pointer's place in front of or behind the mixer is
 * how far the drum tips on its trunnions: toward the reader to pour, back to
 * take a load, on a spring. The read-out gives the tilt. At rest the drum
 * leans a little forward, its mouth bright. The slider is the farthest pour.
 *
 * The pattern: a continuous lean read on the ground plane, which never moves.
 */
const {
  Cam, clamp, fit, proj, rings, prism, facing, spring, stepS, unproj, poly, open, hull, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZP = 38, PX = 29, REST = 16, BACK = -24;
const BANDS = [[-15, 15], [-6, 22], [4, 23.5], [13, 19], [21, 13]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pour = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-44, -26, 0], [44, 26, 0], [-44, 30, 0], [0, 34, ZP + 10], [0, -34, ZP + 10], [0, 0, ZP + 28]], 200, 160);
  const P = proj(C), front = facing(C);
  const N = 28, ca = Math.cos(rad(45)) * Math.sqrt(0.75), cz = 0.5;

  const g = mk("g", {}, svg);
  const wheel = (x0) => {
    const pts = [];
    for (let k = 0; k < N; k++) { const t = (k / N) * 2 * Math.PI; for (const x of [x0, x0 + 3]) pts.push(P(x, 10 * Math.cos(t), 10 + 10 * Math.sin(t))); }
    const el = solid(g); el.sil.setAttribute("d", poly(hull(pts)));
    const hub = []; for (let k = 0; k <= N; k++) { const t = (k / N) * 2 * Math.PI; hub.push(P(x0 + 3, 3 * Math.cos(t), 10 + 3 * Math.sin(t))); }
    el.cr.setAttribute("d", open(hub));
  };
  const post = (x) => { const [r, i] = rings(x - 2.5, -3, x + 2.5, 3, 1.5, 0.8); put(solid(g), prism(P, front, r, i, 4, ZP + 4)); };
  wheel(-42);
  { const [r, i] = rings(-36, -9, 36, 9, 3, 1.2); put(solid(g), prism(P, front, r, i, 6, 10)); }
  post(-PX);
  const drum = solid(g), mouth = mk("path", { class: "sil hi" }, drum.g), lip = mk("path", { class: "nf lo" }, drum.g);
  post(PX);
  wheel(39);

  const tilt = spring(REST);
  let last = "";
  function at(th, h, r, t) { // a point of the drum: ring at local height h, radius r, angle t, tipped th toward +y
    const x = r * Math.cos(t), y = r * Math.sin(t), c = Math.cos(th), s = Math.sin(th);
    return P(x, y * c + h * s, ZP - y * s + h * c);
  }
  function draw(deg) {
    const key = deg.toFixed(2);
    if (key === last) return;
    last = key;
    const th = rad(deg), pts = [];
    for (const [h, r] of BANDS) for (let k = 0; k < N; k++) pts.push(at(th, h, r, (k / N) * 2 * Math.PI));
    drum.sil.setAttribute("d", poly(hull(pts)));
    const B = ca * Math.cos(th) - cz * Math.sin(th), t0 = Math.atan2(B, ca), band = [];
    for (let k = 0; k <= 16; k++) band.push(at(th, 4, 23.5, t0 - Math.PI / 2 + (k / 16) * Math.PI));
    drum.cr.setAttribute("d", open(band));
    const m = [], l = [];
    for (let k = 0; k < N; k++) { const t = (k / N) * 2 * Math.PI; m.push(at(th, 21, 13, t)); l.push(at(th, 21, 10.5, t)); }
    mouth.setAttribute("d", poly(m)); lip.setAttribute("d", poly(l));
  }
  draw(REST);

  const Bk = register(stage, (dt) => { const mv = stepS(tilt, dt); draw(tilt.x); return mv; });
  bag.add(Bk.unregister);

  function leave() { tilt.t = REST; read.textContent = "rest"; Bk.wake(); }
  function move(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    if (Math.abs(wx) > 60 || Math.abs(wy) > 70) return leave();
    tilt.t = clamp(wy * 1.6, BACK, pour);
    read.textContent = Math.round(tilt.t) + "°";
    Bk.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pour = v; }, destroy: bag.dispose };
}

hairline({
  name: "concretemix",
  means: "A wheel mixer's bellied drum hung on two posts: it tips toward the pointer to pour, or back to load, and settles leaning forward.",
  rules: [1, 3, 5, 8],
  range: [30, 45, 60],
  tour: [[271, 183], [200, 218], [165, 236], null],
  mount,
});
