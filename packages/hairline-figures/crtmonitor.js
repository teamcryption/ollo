/**
 * CRT monitor: a deep tube monitor, its bezel square and its back tapering to
 * the neck of the tube, sat on a round swivel foot. The pointer is where the
 * user sits: the whole set swivels on its foot and tips on its tilt hinge to
 * face it, on springs. At rest it is turned a little aside, screen bright.
 * The slider is how far it may turn.
 *
 * The pattern: a continuous aim on two angles; the hit is the floor's plane.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rrect, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 10, ZC = 30, REST = [0.32, -0.08];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gain = value;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-28, -28, 0], [28, 28, 0], [28, -28, 0], [-28, 28, 0], [0, 0, ZC + 24]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(18, 48), circ(16.4, 48), 0, 3));
  put(solid(g), prism(P, front, circ(5, 24), circ(4, 24), 3, PZ));
  // local rings: the bezel in the x-z plane at y = 16, the back at y = -24
  const plane = (ring, y) => ring.map((q) => [q.u, y, ZC + q.v]);
  const bezel = plane(rrect(-23, -20, 23, 20, 4, 4), 16), lip = plane(rrect(-23, -20, 23, 20, 4, 4), 12);
  const back = plane(rrect(-15, -14, 15, 12, 6, 4), -24);
  const glass = plane(rrect(-18, -15.5, 18, 15.5, 6, 6), 16.3), cap = plane(rrect(-5, -5, 5, 5, 2.5, 4), -30);
  const body = mk("path", { class: "sil" }, g), neck = mk("path", { class: "nf lo" }, g);
  const rim = mk("path", { class: "nf lo" }, g), screen = mk("path", { class: "nf" }, g);
  const sb = spring(REST[0]), st = spring(REST[1]);
  let last = "", over = false;

  function pose([x, y, z]) {
    const a = st.x, b = sb.x, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), s = Math.sin(b);
    const zz = z - PZ, y1 = y * ca - zz * sa, z1 = y * sa + zz * ca + PZ;
    return P(x * cb - y1 * s, x * s + y1 * cb, z1);
  }
  function draw() {
    const key = sb.x.toFixed(3) + st.x.toFixed(3);
    if (key === last) return;
    last = key;
    const B = bezel.map(pose), L = lip.map(pose), K = back.map(pose), Q = cap.map(pose);
    body.setAttribute("d", poly(hull(B.concat(L, K))));
    neck.setAttribute("d", poly(hull(K.concat(Q))));
    rim.setAttribute("d", poly(B));
    screen.setAttribute("d", poly(glass.map(pose)));
    // the tube's neck hides behind the body when it faces away
    if (sb.x > -0.2) g.insertBefore(neck, body); else body.after(neck);
  }
  const R = register(stage, (dt) => { const a = stepS(sb, dt), b = stepS(st, dt); draw(); return a || b; });
  bag.add(R.unregister);

  function aim(p) {
    if (!p) { over = false; sb.t = REST[0]; st.t = REST[1]; }
    else {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = true;
      sb.t = clamp(Math.atan2(-x, Math.max(y, 4)), -1, 1) * gain;
      st.t = clamp((r - 60) / 70, -1, 1) * -0.32 * gain;
    }
    screen.classList.toggle("hi", !over);
    body.classList.toggle("hi", over);
    read.textContent = over ? `${Math.round(sb.t * 57.3)}° ${Math.round(st.t * 57.3)}°` : "rest";
    R.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gain = v; }, destroy: bag.dispose };
}

hairline({
  name: "crtmonitor",
  means: "A deep tube monitor on a swivel foot: it turns and tips on its hinge to face wherever the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.2],
  tour: [[64, 182], [324, 263], [200, 300], null],
  mount,
});
