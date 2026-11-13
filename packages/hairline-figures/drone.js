/**
 * Drone: a quadcopter hovering over its landing pad, a rounded body, four
 * arms out to four rotor rings, and two landing skids. The pointer is where
 * it wants to go: the drone drifts toward it on springs, up to a limit, and
 * tilts into the drift, its rotor rings bright. At rest it hangs a little off
 * the pad's centre, barely leaning, one rotor lit. The slider is how quickly
 * it follows.
 *
 * The pattern: a continuous aim (terrain's spring, on a position and a lean);
 * the hit is on the ground's plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rrect, seg, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const H = 34, BR = 6, ARM = 13, RR = 7, PAD = 30, MAXD = 30, TMAX = 0.3, FAV = 3;
const REST = [-6, 5], ROT = [[-1, -1], [1, -1], [-1, 1], [1, 1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.85);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([PAD * Math.cos(a), PAD * Math.sin(a), 0], [48 * Math.cos(a), 48 * Math.sin(a), H + 9]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the pad: a low disc, an inner ring, four lights round its rim
  const pad = solid(g);
  put(pad, prism(P, front, circ(PAD, 64), circ(PAD - 1.6, 64), 0, 1.6));
  mk("path", { class: "nf lo", d: poly(circ(18, 48).map((q) => P(q.u, q.v, 1.6))) }, pad.g);
  for (let k = 0; k < 4; k++) { const a = Math.PI / 4 + (k * Math.PI) / 2; place(flatDot(g, C, 1.2, "dot off"), P(24 * Math.cos(a), 24 * Math.sin(a), 1.6)); }
  const mark = flatDot(g, C, 1.4, "dot m");

  // the drone, back to front: skids, arms, the far rotor, body, the side rotors, the near one
  const legs = mk("path", { class: "nf sil" }, g), arms = mk("path", { class: "nf sil" }, g);
  const rot = ROT.map(() => ({ sil: null, cr: null }));
  const mkRot = (i) => { const gr = mk("g", {}, g); rot[i].sil = mk("path", { class: "sil" }, gr); rot[i].cr = mk("path", { class: "nf lo" }, gr); };
  mkRot(0);
  const body = solid(g);
  mkRot(1); mkRot(2); mkRot(3);

  const sp = [spring(REST[0]), spring(REST[1]), spring(0), spring(0)];
  const BOT = rrect(-BR, -BR, BR, BR, 3, 6), TOPR = rrect(-BR + 1, -BR + 1, BR - 1, BR - 1, 2, 6);
  const ring = (r, n = 32) => circ(r, n);
  let last = "";

  function draw() {
    const [dx, dy, tx, ty] = sp.map((s) => s.x), key = sp.map((s) => s.x.toFixed(3)).join();
    if (key === last) return;
    last = key;
    // a lean of |t| toward (tx, ty): Rodrigues about the axis (-ty, tx, 0)
    const th = Math.hypot(tx, ty), kx = th ? -ty / th : 0, ky = th ? tx / th : 0, c = Math.cos(th), s = Math.sin(th);
    const T = ([x, y, z]) => {
      const kp = kx * x + ky * y, cx = ky * z, cy = -kx * z, cz = kx * y - ky * x;
      return P(dx + x * c + cx * s + kx * kp * (1 - c), dy + y * c + cy * s + ky * kp * (1 - c), H + z * c + cz * s);
    };
    const at = (r, z, ox = 0, oy = 0) => r.map((q) => T([q.u + ox, q.v + oy, z]));
    body.sil.setAttribute("d", poly(hull(at(BOT, 0).concat(at(BOT, 5)))));
    body.cr.setAttribute("d", poly(at(TOPR, 5)));
    let A = "", L = "";
    ROT.forEach(([sx, sy], i) => {
      const ox = sx * ARM, oy = sy * ARM;
      A += seg(T([sx * 4, sy * 4, 2.5]), T([ox, oy, 3]));
      rot[i].sil.setAttribute("d", poly(hull(at(ring(RR), 4.4, ox, oy).concat(at(ring(RR), 5.6, ox, oy)))));
      rot[i].cr.setAttribute("d", poly(at(ring(1.4, 12), 5.6, ox, oy)));
    });
    for (const sy of [-1, 1]) {
      L += seg(T([-3, sy * 4, 0]), T([-3, sy * 7, -8])) + seg(T([3, sy * 4, 0]), T([3, sy * 7, -8]));
      L += seg(T([-8, sy * 7, -8]), T([8, sy * 7, -8]));
    }
    arms.setAttribute("d", A);
    legs.setAttribute("d", L);
    place(mark, P(dx, dy, 0));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of sp) if (stepS(s, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    let d = 0, ux = 0, uy = 0;
    if (p) { const r = Math.hypot(p[0], p[1]); d = clamp(r, 0, MAXD); if (r > 0) { ux = p[0] / r; uy = p[1] / r; } }
    const [gx, gy] = p ? [ux * d, uy * d] : REST, f = p ? (d / MAXD) * TMAX : 0.06;
    const n = Math.hypot(gx, gy) || 1;
    sp[0].t = gx; sp[1].t = gy; sp[2].t = (gx / n) * f; sp[3].t = (gy / n) * f;
    rot.forEach((r, i) => r.sil.classList.toggle("hi", p ? true : i === FAV));
    read.textContent = p ? "drift " + Math.round(d) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); aim(Math.hypot(x, y) < 95 ? [x, y] : null); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return {
    set: (v) => { for (const s of sp) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drone",
  means: "A quadcopter over its landing pad: it drifts and leans toward the pointer, up to a limit, its rotor rings bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[120, 200], [210, 120], [281, 272], null],
  mount,
});
