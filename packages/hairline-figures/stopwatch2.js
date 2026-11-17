/**
 * Pocket watch: a round hunter case lying flat, its crown and bow at the
 * side. The pointer over the watch swings the hinged lid up off the dial;
 * at rest the lid stands a little open, bright. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, seg, unproj, clamp, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 40, H = 9, LT = 3, REST = 42;
const disc = (x, y, r, n = 44) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-R - 18, -R, 0], [R + 26, R, 0], [0, -R - 21, H + 2 * R], [0, -R - 21, 0], [R, R, 0]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2.5), 0, H));
  // crown and bow at +x
  put(solid(g), prism(P, front, disc(R + 5, 0, 4, 16), disc(R + 5, 0, 2.5, 16), H / 2 - 3, H / 2 + 3));
  const bow = [];
  for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI * 2; bow.push(P(R + 9 + 8 + 8 * Math.cos(t), 6 * Math.sin(t), H / 2)); }
  mk("path", { d: poly(bow), class: "nf" }, g);
  // dial: ring of hour dots and two hands
  const dial = mk("g", {}, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, R - 6), H)), class: "nf lo" }, dial);
  for (let k = 0; k < 12; k++) { const t = (k / 12) * Math.PI * 2, q = P((R - 10) * Math.cos(t), (R - 10) * Math.sin(t), H); mk("circle", { cx: q[0], cy: q[1], r: k % 3 ? 0.9 : 1.6, class: "dot off" }, dial); }
  mk("path", { d: seg(P(0, 0, H), P(16, -10, H)) + seg(P(0, 0, H), P(-6, 24, H)), class: "nf" }, dial);
  const lid = mk("path", { class: "sil" }, g), lidIn = mk("path", { class: "nf lo" }, g);

  // lid hinged at the back edge (y = -R), rotating about the x axis
  const Y0 = -R;
  const lp = (u, v, z, a) => { const dv = v - Y0; return P(u, Y0 + dv * Math.cos(a) - z * Math.sin(a), H + dv * Math.sin(a) + z * Math.cos(a)); };
  const ang = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return; last = d;
    const a = rad(d), pts = [];
    for (const q of disc(0, -0.0001, R, 48)) { pts.push(lp(q.u, q.v, 0, a), lp(q.u, q.v, LT, a)); }
    lid.setAttribute("d", poly(hull(pts)));
    lidIn.setAttribute("d", poly(disc(0, 0, R - 5, 40).map((q) => lp(q.u, q.v, LT, a))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  function set(a) {
    if (a === act) return; act = a;
    tset(ang, a ? open : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  lid.classList.add("hi");
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); set(Math.hypot(x, y) < R + 14); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "stopwatch2",
  means: "A pocket watch lying flat: the pointer over it swings the hinged lid up off the dial.",
  rules: [1, 3, 5, 8],
  range: [60, 100, 105],
  tour: [[163, 228], [232, 250], [120, 205], null],
  mount,
});
