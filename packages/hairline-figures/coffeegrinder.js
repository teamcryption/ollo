/**
 * Coffee grinder: a hand grinder, a square box with a drawer, a flared
 * hopper on top and a crank over it. The crank turns to face the pointer on
 * the ground, on a spring, and swings back to its rest angle when it
 * leaves. The crank's knob is the bright mark. The slider is the rest angle.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const B0 = 15, ZB = 30, ZH = 46, ZS = 52, ARM = 20;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-ARM - 3, -ARM - 3, 0], [ARM + 3, ARM + 3, 0], [ARM + 3, -ARM - 3, ZS + 9], [-ARM - 3, ARM + 3, ZS + 9], [0, 0, ZS + 9], [B0, B0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-B0, -B0, B0, B0, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, ZB));
  // the drawer on the front face, and its pull
  const dr = [[-9, B0, 6], [9, B0, 6], [9, B0, 17], [-9, B0, 17]].map((p) => P(...p));
  mk("path", { d: poly(dr), class: "nf lo" }, g);
  mk("path", { d: poly(hull(ringAt(P, disc(0, B0 + 1.2, 1.6, 12), 11).concat(ringAt(P, disc(0, B0 + 1.2, 1.6, 12), 12.4)))), class: "nf" }, g);
  // the hopper: narrow at the box, flared at its mouth
  mk("path", { d: poly(hull(ringAt(P, disc(0, 0, 9), ZB).concat(ringAt(P, disc(0, 0, 13, 44), ZH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(0, 0, 11.6, 44), ZH)), class: "nf lo" }, g);
  mk("path", { d: open(ringAt(P, run(disc(0, 0, 10, 36), front), ZB + 5)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(0, 0, 2.4, 16), disc(0, 0, 1.6, 16), ZH - 4, ZS));
  const crank = mk("g", {}, g);
  const arm = mk("path", { class: "sil" }, crank), hub = solid(crank), knob = solid(crank);
  knob.sil.classList.add("hi");

  const A = spring(restA);
  let last = NaN, aimed = false;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), ex = c * ARM, ey = s * ARM;
    arm.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 2.6, 16), ZS).concat(ringAt(P, disc(0, 0, 2.6, 16), ZS + 1.6),
      ringAt(P, disc(ex, ey, 1.8, 12), ZS), ringAt(P, disc(ex, ey, 1.8, 12), ZS + 1.6)))));
    put(hub, prism(P, front, disc(0, 0, 3, 16), disc(0, 0, 2, 16), ZS + 1.6, ZS + 3.2));
    put(knob, prism(P, front, disc(ex, ey, 2.8, 16), disc(ex, ey, 1.8, 16), ZS + 1.6, ZS + 9));
    // the knob stands at the arm's end: in front of the hub when nearer the viewer
    if (ex + ey > 0) crank.appendChild(knob.g); else crank.insertBefore(knob.g, hub.g);
    read.textContent = aimed ? ((Math.round(a) % 360) + 360) % 360 + "°" : "rest";
  }
  const rad = (d) => (d * Math.PI) / 180;

  const L = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(L.unregister);

  function aim(t) {
    // the nearest turn to the new angle, so the crank never spins the long way
    let d = ((t - A.t) % 360 + 540) % 360 - 180;
    A.t += d;
    L.wake();
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (Math.hypot(wx, wy) < 4) return;
    aimed = true;
    aim((Math.atan2(wy, wx) * 180) / Math.PI);
  }
  draw(A.x);
  bag.add(pointer(stage, { move, leave: () => { aimed = false; aim(restA); last = NaN; } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (!aimed) aim(v); }, destroy: bag.dispose };
}

hairline({
  name: "coffeegrinder",
  means: "A hand coffee grinder: its crank turns on a spring to face the pointer, and swings back to rest when it leaves.",
  rules: [1, 3, 5, 9],
  range: [0, 40, 90],
  tour: [[300, 170], [200, 250], [100, 170], null],
  mount,
});
