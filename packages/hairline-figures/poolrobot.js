/**
 * Pool robot: a boxy pool cleaner on two rubber tracks, a brush roller
 * across its nose, and a filter lid hinged along its far side. The pointer
 * over the robot swings the lid up and over on that hinge to show the
 * filter basket, wider the nearer the pointer is to the open side. At rest
 * the lid is shut and the brush roller is bright. The slider is how far the
 * lid swings.
 *
 * The pattern: one part on a hinge (lid), hit on a fixed plane.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rad, rings, rrect, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 56, W = 40, HZ = 16, HY = 0, LH = 9, TR = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.9);
  const rot = (x, y, z, a) => {
    const dy = y - HY, dz = z - HZ, c = Math.cos(a), s = Math.sin(a);
    return [x, HY + dy * c - dz * s, HZ + dy * s + dz * c];
  };
  const far = [[0, W, HZ], [L, W, HZ], [L, W, HZ + LH]].map((p) => rot(p[0], p[1], p[2], rad(110)));
  fit(C, [[-2, -7, 0], [L + 9, W + 7, 0], [L + 9, -7, 0], [-2, W + 7, 0], [0, 0, HZ + LH], ...far], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a track: a stadium loop standing in the x–z plane, with its cleats
  function track(y0, y1) {
    const a = [], b = [];
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * Math.PI * 2, cx = Math.cos(t) >= 0 ? L - 2 - TR : 2 + TR;
      a.push(P(cx + TR * Math.cos(t), y0, TR + TR * Math.sin(t))); b.push(P(cx + TR * Math.cos(t), y1, TR + TR * Math.sin(t)));
    }
    mk("path", { class: "sil", d: poly(hull(a.concat(b))) }, g);
    let cl = "";
    for (const x of [2 + TR, L - 2 - TR]) {
      const hub = [];
      for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; hub.push(P(x + 4 * Math.cos(t), y1, TR + 4 * Math.sin(t))); }
      cl += poly(hub);
    }
    mk("path", { class: "nf lo", d: poly(b) + cl }, g);
  }
  track(-7, -1);

  // the body and the filter basket under the lid
  const [br, bi] = rings(0, 0, L, W, 9, 1.6);
  put(solid(g), prism(P, front, br, bi, 3, HZ));
  mk("path", { class: "nf lo", d: poly(rrect(8, 6, L - 8, W - 6, 6, 6).map((q) => P(q.u, q.v, HZ))) + poly(rrect(12, 10, L - 12, W - 10, 4, 6).map((q) => P(q.u, q.v, HZ))) }, g);

  // the brush roller across the nose
  const roll = [];
  for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; roll.push(P(L + 3 + 5 * Math.cos(t), 1, 5 + 5 * Math.sin(t)), P(L + 3 + 5 * Math.cos(t), W - 1, 5 + 5 * Math.sin(t))); }
  const brush = mk("path", { class: "sil", d: poly(hull(roll)) }, g);
  let ribs = "";
  for (let k = 1; k < 6; k++) { const y = (W * k) / 6; ribs += poly([P(L + 8, y - 1.5, 5), P(L + 3, y + 1.5, 10)]); }
  mk("path", { class: "nf lo", d: ribs }, g);

  // the lid, hinged along the far side
  const shell = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g);
  const foot = rrect(0, 0, L, W, 9, 8), crown = rrect(5, 5, L - 5, W - 5, 6, 8), inner = rrect(7, 7, L - 7, W - 7, 4, 8);
  track(W + 1, W + 7);

  const ang = tween(0);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), R = (ring, z) => ring.map((q) => P(...rot(q.u, q.v, z, a)));
    shell.setAttribute("d", poly(hull(R(foot, HZ).concat(R(crown, HZ + LH)))));
    top.setAttribute("d", poly(R(inner, HZ + LH)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit: the pointer on the lid's resting plane, which band across the robot
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HZ);
    if (x < -4 || x > L + 10 || y < -8 || y > W + 8) return -1;
    return clamp(Math.round((y / W) * 3), 0, 3);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const deg = a < 0 ? 0 : Math.round(maxA * (0.55 + 0.15 * a));
    tset(ang, deg, performance.now(), 0);
    shell.classList.toggle("hi", a >= 0);
    brush.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "lid " + deg + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "poolrobot",
  means: "A pool cleaning robot on tracks: its filter lid swings up on the far hinge, wider the nearer the pointer is to the open side.",
  rules: [1, 3, 4, 5],
  range: [40, 80, 110],
  tour: [[219, 180], [190, 196], [150, 214], null],
  mount,
});
