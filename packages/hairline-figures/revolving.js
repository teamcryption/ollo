/**
 * Revolving door: four glass wings round a central post, on a round floor
 * plate under a round canopy, with a curved glass wall behind. The pointer
 * across the doorway turns the wings on a spring, further the further it
 * goes from the middle. At rest one wing is bright. The slider is how far
 * the wings can turn.
 *
 * The pattern: a continuous turn, hit on a fixed plane (unproj).
 */
const {
  Cam, circ, clamp, fit, hull, poly, proj, prism, rings, ringAt, rrect, seg, unproj, spring, stepS, rad,
  disposer, facing, mk, pointer, put, register, solid,
} = HL;

const R = 40, H = 74, REST = 22;
const disc = (r, n = 48) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-R - 4, -R - 4, 0], [R + 4, R + 4, 0], [R + 4, -R - 4, 0], [-R - 4, R + 4, 0], [0, 0, H + 8]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const add = (a, b, s) => a.map((x, i) => x + b[i] * s);
  put(solid(g), prism(P, front, disc(R + 5), disc(R + 3), 0, 3));
  // the curved glass wall at the back, between the two openings
  const arc = [];
  for (let i = 0; i <= 20; i++) { const t = rad(180 + 15 + (i / 20) * 60); arc.push([R * Math.cos(t), R * Math.sin(t)]); }
  const back = arc.map(([x, y]) => P(x, y, 3)).concat(arc.slice().reverse().map(([x, y]) => P(x, y, H)));
  mk("path", { d: poly(back), class: "nf lo" }, g);
  const rot = mk("g", {}, g);
  const post = solid(rot);
  put(post, prism(P, front, disc(3, 20), disc(2, 20), 3, H));
  const wings = [0, 1, 2, 3].map((k) => {
    const wg = mk("g", {}, rot);
    return { k, g: wg, sil: mk("path", { class: k === 0 ? "sil hi" : "sil" }, wg), cr: mk("path", { class: "nf lo" }, wg), bar: mk("path", { class: "lo" }, wg) };
  });
  const [cr, ci] = [disc(R + 5), disc(R + 2)];
  put(solid(g), prism(P, front, cr, ci, H, H + 7));

  function slab(c, U, V, W, a, b, t, r) {
    const pts = [], at = (u, v, z) => P(...add(add(add(c, U, u), V, v), W, z));
    for (const q of rrect(-a, -b, a, b, r, 4)) pts.push(at(q.u, q.v, -t / 2), at(q.u, q.v, t / 2));
    const s = W[0] + W[1] >= 0 ? 1 : -1;
    const inner = rrect(-a + 2.4, -b + 2.4, a - 2.4, b - 2.4, Math.max(1, r - 2), 4).map((q) => at(q.u, q.v, s * t / 2));
    return { sil: poly(hull(pts)), cr: poly(inner), bar: seg(at(a - 12, -2, s * (t / 2 + 1)), at(a - 4, -2, s * (t / 2 + 1))) };
  }
  const th = spring(REST);
  let last = NaN;
  function draw() {
    if (th.x === last) return;
    last = th.x;
    const order = [];
    for (const w of wings) {
      const a = rad(th.x + w.k * 90), U = [Math.cos(a), Math.sin(a), 0], W = [-Math.sin(a), Math.cos(a), 0];
      const s = slab([U[0] * (R / 2 + 1), U[1] * (R / 2 + 1), H / 2 + 1.5], U, [0, 0, 1], W, R / 2 - 2.5, H / 2 - 3.5, 2.2, 3);
      w.sil.setAttribute("d", s.sil); w.cr.setAttribute("d", s.cr); w.bar.setAttribute("d", s.bar);
      order.push([U[0] + U[1], w.g]);
    }
    order.push([0, post.g]);
    order.sort((p, q) => p[0] - q[0]).forEach(([, el]) => rot.appendChild(el));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  const mid = P(0, 0, H / 2);
  function aim(p) {
    let on = false;
    if (p) { const [x, y] = unproj(C, p[0], p[1], H / 2); on = Math.hypot(x, y) < R * 1.6; }
    const dx = p ? clamp((p[0] - mid[0]) / 90, -1, 1) : 0;
    th.t = on ? REST + (dx >= 0 ? 0.35 + dx : dx - 0.35) * 55 * reach : REST;
    read.textContent = on ? "turn " + Math.round(th.t - REST) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "revolving",
  means: "A revolving door: four glass wings round a post turn as the pointer crosses the doorway, further from the middle.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.85, 1],
  tour: [[267, 140], [140, 150], [291, 140], null],
  mount,
});
