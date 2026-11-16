/**
 * Racket stand: a paddle-tennis racket held upright in a cradle on a rod
 * and a rounded base. The pointer is where a customer stands: the racket
 * turns on its rod to face it, the perforated face swinging round, and
 * returns to a three-quarter view when the pointer leaves. At rest the
 * racket's face is bright. The slider is how far it turns.
 */
const { Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, rrect, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.5, HOLES = [[-10, 92], [0, 92], [10, 92], [-14, 80], [-5, 80], [5, 80], [14, 80], [-10, 68], [0, 68], [10, 68], [0, 100]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-30, -22, 0], [30, 22, 0], [30, -22, 0], [-30, 22, 0], [-24, 0, 118], [24, 0, 118], [0, -24, 118], [0, 24, 118]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-30, -22, 30, 22, 12, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  put(solid(g), prism(P, front, circ(2, 16), circ(1, 16), 5, 30));
  const [cr, ci] = rings(-6, -4, 6, 4, 3, 1);
  put(solid(g), prism(P, front, cr, ci, 30, 36));
  const handle = solid(g), head = solid(g);
  const holes = HOLES.map(() => mk("path", { class: "nf lo" }, g));
  const yaw = spring(REST);
  const slab = (s, ring, inner, a, b, m) => {
    const pr = (q, t) => P(...m(q.u, q.v, t));
    s.sil.setAttribute("d", poly(hull(ring.map((q) => pr(q, a)).concat(ring.map((q) => pr(q, b))))));
    s.cr.setAttribute("d", poly(inner.map((q) => pr(q, b))));
  };
  let last = NaN;
  function draw() {
    const y = yaw.x;
    if (Math.abs(y - last) < 1e-4) return;
    last = y;
    const c = Math.cos(y), s = Math.sin(y);
    const m = (u, w, t) => [u * c - t * s, u * s + t * c, w];
    slab(handle, rrect(-3.2, 32, 3.2, 62, 2.5, 4), rrect(-2.2, 33, 2.2, 61, 1.5, 4), -2, 2, m);
    slab(head, rrect(-22, 58, 22, 116, 20, 14), rrect(-20, 60, 20, 114, 18, 14), -1.4, 1.4, m);
    const side = Math.sin(y + Math.PI / 4) >= 0 ? 1.4 : -1.4;
    HOLES.forEach(([u, w], k) => holes[k].setAttribute("d", poly(circ(2.2, 12).map((q) => P(...m(u + q.u, w + q.v, side))))));
  }
  const B = register(stage, (dt) => { const mv = stepS(yaw, dt); draw(); return mv; });
  bag.add(B.unregister);
  function aim(p) {
    let on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.hypot(x, y) < 150 && Math.hypot(x, y) > 4) { on = true; yaw.t = REST + clamp(Math.atan2(y, x) - Math.PI / 4, -1.4, 1.4) * reach; }
    }
    if (!on) yaw.t = REST;
    read.textContent = on ? Math.round(((yaw.t * 57.3) % 360 + 360) % 360) + "°" : "rest";
    head.sil.classList.toggle("hi", !on);
    handle.sil.classList.toggle("hi", on);
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "paddletennis",
  means: "A paddle-tennis racket on a display stand: it turns on its rod to face the pointer, then back to a three-quarter view.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[261, 265], [94, 258], [322, 265], null],
  mount,
});
