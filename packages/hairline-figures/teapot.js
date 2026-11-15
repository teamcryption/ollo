/**
 * Teapot: a round pot on a tray, handle behind, spout toward a cup. The
 * pointer's place along the tray tips the pot about its front foot; past
 * two thirds of the way a stream falls from the spout into the cup. At rest
 * the pot leans a little and its lid is bright. The slider is the most tilt.
 *
 * The pattern: one part answering a continuous input (tilt).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Z0 = 3, PX = 14, REST = 5;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BODY = [[0, 13], [3, 17], [10, 20.5], [18, 19], [24, 12.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-38, -24, 0], [70, 26, 0], [70, -24, 0], [-38, 26, 0], [-10, 0, 46], [44, 0, 44]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-38, -24, 70, 26, 9, 2);
  put(solid(g), prism(P, front, tr, ti, 0, Z0));

  const handle = mk("path", { class: "sil" }, g);
  const body = mk("path", { class: "sil" }, g);
  const rim = mk("path", { class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g);
  const knob = mk("path", {}, g);
  const spout = mk("path", { class: "sil" }, g);
  const mouth = mk("path", { class: "nf lo" }, g);
  const stream = mk("path", { class: "nf lo" }, g);
  const CX = 54, CY = 6;
  put(solid(g), prism(P, front, disc(CX, CY, 12), disc(CX, CY, 10), Z0, Z0 + 1.5));
  put(solid(g), prism(P, front, disc(CX, CY, 7.5), disc(CX, CY, 6.2), Z0 + 1.5, Z0 + 12));
  mk("path", { d: poly(disc(CX, CY, 6.2).map((q) => P(q.u, q.v, Z0 + 12))), class: "nf lo" }, g);

  let ca = 1, sa = 0;
  const W = (x, y, z) => { const dx = x - PX; return P(PX + dx * ca + z * sa, y, Z0 - dx * sa + z * ca); };
  const ring = (x, r, z, n = 32) => circ(r, n).map((q) => W(x + q.u, q.v, z));
  const tilt = spring(REST);
  let last = NaN, act = false;

  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a; ca = Math.cos(rad(a)); sa = Math.sin(rad(a));
    let pts = [];
    for (const [z, r] of BODY) pts.push(...ring(0, r, z));
    body.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ring(0, 12.5, 24)));
    lid.setAttribute("d", poly(hull(ring(0, 11.5, 24.4).concat(ring(0, 8, 27.5)))));
    knob.setAttribute("d", poly(hull(ring(0, 2.4, 27.5, 16).concat(ring(0, 2.4, 31, 16)))));
    pts = [];
    for (let i = 0; i <= 6; i++) { const t = i / 6; pts.push(...ring(17 + 21 * t, 4.8 - 2.6 * t, 6 + 19 * t * t, 16)); }
    spout.setAttribute("d", poly(hull(pts)));
    mouth.setAttribute("d", poly(ring(38, 2.2, 25.2, 16)));
    const out = [], inn = [];
    for (let i = 0; i <= 12; i++) { const t = rad(80 + (200 * i) / 12); out.push(W(-19 + 11 * Math.cos(t), 0, 13 + 9 * Math.sin(t))); inn.push(W(-19 + 7.5 * Math.cos(t), 0, 13 + 5.5 * Math.sin(t))); }
    handle.setAttribute("d", poly(out.concat(inn.reverse())));
    if (a > most * 0.62) {
      const tip = W(38, 0, 25.2), end = P(CX - 1, CY, Z0 + 12), s = [];
      for (let i = 0; i <= 8; i++) { const t = i / 8; s.push([tip[0] + (end[0] - tip[0]) * t, tip[1] + (end[1] - tip[1]) * t * t]); }
      stream.setAttribute("d", open(s));
    } else stream.setAttribute("d", "");
  }

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const on = !!p;
    let t = REST;
    if (on) { const [wx] = unproj(C, p[0], p[1], Z0); t = REST + (most - REST) * clamp((wx + 20) / 70, 0, 1); }
    tilt.t = t;
    if (on !== act) { act = on; spout.classList.toggle("hi", on); lid.classList.toggle("hi", !on); }
    read.textContent = on ? Math.round(t) + "°" : "rest";
    B.wake();
  }
  aim(null);
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v; }, destroy: bag.dispose };
}

hairline({
  name: "teapot",
  means: "A teapot on a tray: moving toward the cup tips the pot forward, and past two thirds a stream pours into the cup.",
  rules: [3, 5, 8, 9],
  range: [20, 38, 50],
  tour: [[149, 125], [215, 185], [259, 234], null],
  mount,
});
