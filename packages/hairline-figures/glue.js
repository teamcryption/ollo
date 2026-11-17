/**
 * Glue pot: a round pot of hide glue with a rolled rim and a wire wiper
 * across its mouth, and a flat brush standing in it. The pointer over the
 * pot draws the brush up and tips it out over the rim, nearer the pointer
 * the further it rises. At rest the brush leans in the pot, bright.
 */
const {
  Cam, circ, fit, hull, poly, open, proj, ringAt, rrect, clamp, spring, stepS,
  disposer, mk, pointer, register, unproj,
} = HL;

const R = 34, H = 30, BL = 72;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-R, -R, 0], [R, R, 0], [0, 0, H + BL + 14], [-50, -50, H + 50]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const body = mk("path", { class: "sil" }, g);
  body.setAttribute("d", poly(hull(ringAt(P, disc(R), 0).concat(ringAt(P, disc(R), H)))));
  mk("path", { d: poly(ringAt(P, disc(R - 2), H)), class: "nf lo" }, g);
  mk("path", { d: open([P(-R + 3, 0, H + 6), P(0, 0, H + 9), P(R - 3, 0, H + 6)]), class: "nf lo" }, g);
  const bg = mk("g", {}, g);
  const handle = mk("path", { class: "sil hi" }, bg), hcr = mk("path", { class: "nf lo" }, bg);
  const ferr = mk("path", { class: "sil hi" }, bg), brist = mk("path", { class: "sil hi" }, bg);
  const wall = mk("path", { class: "sil" }, g);
  const fr = disc(R).filter((q) => q.u + q.v >= -0.01);
  wall.setAttribute("d", poly(hull(ringAt(P, fr, H).concat(ringAt(P, fr, 0)))));
  mk("path", { d: open(ringAt(P, disc(R - 2).filter((q) => q.u + q.v >= 0), H - 4)), class: "nf lo" }, g);

  // a box along the brush axis: base point b, tilt a (radians toward -x,-y)
  function box(w, d, z0, z1, lift, a) {
    const ca = Math.cos(a), sa = Math.sin(a), pts = [], top = [];
    const ring = rrect(-w, -d, w, d, Math.min(w, d) * 0.6, 3);
    const T = (u, v, z) => { const zz = z + lift; return P(zz * sa * 0.75 + u * ca, -zz * sa * 0.75 + v, H - 22 + zz * ca); };
    for (const q of ring) { pts.push(T(q.u, q.v, z0)); top.push(T(q.u, q.v, z1)); }
    return { d: poly(hull(pts.concat(top))), top };
  }
  const sp = spring(0.15);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const lift = 4 + t * 20 * (0.5 + reach * 0.5), a = 0.12 + t * 0.5 * (0.4 + reach * 0.6);
    handle.setAttribute("d", box(2.6, 2.6, 28, BL, lift, a).d);
    const hb = box(1.2, 1.2, 30, BL - 2, lift, a);
    hcr.setAttribute("d", open([hb.top[0], hb.top[Math.floor(hb.top.length / 2)]]));
    ferr.setAttribute("d", box(8, 3.4, 18, 30, lift, a).d);
    brist.setAttribute("d", box(9, 3.8, 0, 18, lift, a).d);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const d = Math.hypot(x, y);
    const inside = d < 90 && Math.abs(sx - 200) < 150;
    sp.t = inside ? clamp(1.3 - d / 150, 0.6, 1) : 0.15;
    read.textContent = inside ? "lift " + Math.round(sp.t * 100) : "rest";
    B.wake();
  }
  read.textContent = "rest";
  draw(sp.x);
  bag.add(pointer(stage, { move, leave: () => { sp.t = 0.15; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "glue",
  means: "A glue pot with a brush standing in it: the pointer over the pot draws the brush up and tips it out over the rim.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[200, 201], [180, 215], [222, 232], null],
  mount,
});
