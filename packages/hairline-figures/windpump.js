/**
 * Windpump: a tapering farm tower on a pad, a water trough at its foot, and
 * on top a bladed wheel with a tail vane. The pointer is the wind: the head
 * turns on its mast to face the point on the ground under the pointer, a
 * spring following it. At rest it faces the front left, the vane bright.
 * The slider is how far the head may swing from rest.
 *
 * The pattern: one part turning to face the pointer (officechairs).
 */
const {
  Cam, circ, fit, facing, fillet, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, clamp, rad, unproj,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const H = 96, R = 22, REST = rad(80), FOOT = 15, TOPW = 3.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = rad(value);
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-30, -30, 0], [44, 30, 0], [30, 44, 0], [0, 0, H + R + 6], [-24, 0, H + R], [0, -24, H + R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [pr, pi] = rings(-26, -26, 26, 26, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 3));
  // the trough, low and round, beside the tower's front
  const tr = (r) => circ(r, 32).map((q) => ({ ...q, u: q.u + 30, v: q.v + 26 }));
  put(solid(g), prism(P, front, tr(11), tr(9.5), 0, 7));

  // the tower: a foot ring wider than its top ring, hull and crease
  const foot = rrect(-FOOT, -FOOT, FOOT, FOOT, 3, 4), top = rrect(-TOPW, -TOPW, TOPW, TOPW, 1.5, 4), inner = rrect(-TOPW + 0.8, -TOPW + 0.8, TOPW - 0.8, TOPW - 0.8, 0.7, 4);
  const tw = solid(g);
  put(tw, { sil: poly(hull(ringAt(P, foot, 3).concat(ringAt(P, top, H)))), crease: open(ringAt(P, run(inner, front), H)) });
  // braces on the two near faces
  let br = "";
  const at = (z) => FOOT + (TOPW - FOOT) * ((z - 3) / (H - 3));
  for (let i = 0; i < 4; i++) {
    const z0 = 3 + i * 22, z1 = z0 + 22, w0 = at(z0) - 1, w1 = at(z1) - 1;
    br += seg(P(w0, -w0, z0), P(w1, w1, z1)) + seg(P(-w0, w0, z0), P(w1, w1, z1)) + seg(P(w0, w0, z0), P(w1, -w1, z1)) + seg(P(w0, w0, z0), P(-w1, w1, z1));
  }
  mk("path", { d: br, class: "lo nf" }, g);
  // the pump rod running down into the pad
  mk("path", { d: seg(P(FOOT + 3, 0, 3), P(FOOT + 3, 0, 20)), class: "lo nf" }, g);

  const head = mk("g", {}, g);
  const tail = mk("path", { class: "sil" }, head), boom = mk("path", { class: "nf" }, head);
  const wheel = mk("g", {}, head);
  const rim = mk("path", { class: "sil" }, wheel), blades = mk("path", { class: "lo nf" }, wheel), hub = mk("path", {}, wheel);

  const yaw = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const dx = Math.cos(a), dy = Math.sin(a), px = -dy, py = dx, hz = H + R * 0.2 + 4;
    const c = [dx * 6, dy * 6], wpt = (t, r, k = 0) => P(c[0] + k * dx + r * Math.cos(t) * px, c[1] + k * dy + r * Math.cos(t) * py, hz + r * Math.sin(t));
    const ring = [], ring2 = [];
    for (let i = 0; i < 40; i++) { const t = (i / 40) * 2 * Math.PI; ring.push(wpt(t, R), wpt(t, R, 1.6)); }
    rim.setAttribute("d", poly(hull(ring)));
    let b = "";
    for (let i = 0; i < 16; i++) { const t = (i / 16) * 2 * Math.PI; b += seg(wpt(t, 5), wpt(t, R - 2)); }
    for (let i = 0; i < 40; i++) ring2.push(wpt((i / 40) * 2 * Math.PI, R - 2));
    blades.setAttribute("d", b + poly(ring2));
    const hb = [];
    for (let i = 0; i < 12; i++) { const t = (i / 12) * 2 * Math.PI; hb.push(wpt(t, 3.5), wpt(t, 3.5, 4)); }
    hub.setAttribute("d", poly(hull(hb)));
    // the tail: a boom back from the mast, a vane standing at its end
    const T = (k, z) => P(-dx * k, -dy * k, hz + z);
    boom.setAttribute("d", seg(T(-6, 0), T(30, 2)));
    tail.setAttribute("d", poly(fillet([T(18, -1), T(40, -6), T(42, 14), T(22, 6)], [1, 2, 2, 1])));
    // whichever is nearer the viewer is painted last
    if (-dx - dy > dx + dy) head.append(tail); else head.prepend(tail);
  }

  const B = register(stage, (dt) => { const m = stepS(yaw, dt); draw(yaw.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    let want = REST, act = !!p;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      let d = Math.atan2(wy, wx) - REST;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      want = REST + clamp(d, -reach, reach);
    }
    yaw.t = want;
    if (act !== on) { on = act; tail.classList.toggle("hi", !act); rim.classList.toggle("hi", act); }
    const deg = Math.round((((want * 180) / Math.PI) % 360 + 360) % 360);
    read.textContent = act ? "wind " + deg + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = rad(v); if (on === false) aim(null); }, destroy: bag.dispose };
}

hairline({
  name: "windpump",
  means: "A farm windpump on its tower: the bladed wheel and tail vane turn on the mast to face the pointer, as if it were the wind.",
  rules: [1, 3, 5, 8],
  range: [30, 100, 170],
  tour: [[283, 262], [200, 207], [181, 299], null],
  mount,
});
