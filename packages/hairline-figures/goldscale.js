/**
 * Coin scale: a balance on a plinth, a beam on a post, two pans hanging from
 * its ends, a stack of coins in the left pan and one coin in the right. The
 * pointer leans on the beam: the pan on its side sinks and the other rises,
 * on a spring. At rest the heavier pan hangs low, bright. The slider is the
 * reach of the tilt.
 *
 * The pattern: one continuous value, a lean (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, seg,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const PX = 30, PY = 15, PZ = 64, HALF = 40, HANG = 30, MAX = 14, REST = 6, BR = 13;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  const lowZ = PZ - HALF * Math.sin(rad(MAX)) - HANG;
  fit(C, [[PX - HALF - BR, PY, lowZ], [PX + HALF + BR, PY, lowZ], [12, 0, 0], [48, 30, 0], [PX - HALF, PY, PZ + HALF * Math.sin(rad(MAX)) + 3], [PX + HALF, PY, PZ + HALF * Math.sin(rad(MAX)) + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const mkPan = (coins) => {
    const grp = mk("g", {}, g);
    return { coins, grp, str: mk("path", { class: "lo nf" }, grp), bowl: mk("path", { class: "sil" }, grp), rim: mk("path", { class: "lo nf" }, grp),
      stack: coins ? solid(grp) : null };
  };
  const left = mkPan(4);
  const [br, bi] = rings(12, 0, 48, 30, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 6));
  const [pr, pi] = rings(PX - 3, PY - 3, PX + 3, PY + 3, 3, 1);
  put(solid(g), prism(P, front, pr, pi, 6, PZ - 1));
  const right = mkPan(1);
  const beam = mk("path", { class: "sil" }, g);
  const knob = solid(g);
  put(knob, prism(P, front, disc(PX, PY, 3.2, 16), disc(PX, PY, 2.2, 16), PZ - 2, PZ + 3));

  function drawPan(pan, cx, ez) {
    const pz = ez - HANG, hook = P(cx, PY, ez - 1.5);
    let d = "";
    for (const a of [90, 210, 330]) d += seg(hook, P(cx + BR * Math.cos(rad(a)), PY + BR * Math.sin(rad(a)), pz + 3));
    pan.str.setAttribute("d", d);
    pan.bowl.setAttribute("d", poly(hull(ringAt(P, disc(cx, PY, BR), pz + 3).concat(ringAt(P, disc(cx, PY, 8), pz)))));
    pan.rim.setAttribute("d", poly(ringAt(P, disc(cx, PY, BR - 1.2), pz + 3)));
    if (pan.stack) put(pan.stack, prism(P, front, disc(cx + 1, PY, 5.5, 24), disc(cx + 1, PY, 4.5, 24), pz + 2, pz + 2 + 1.8 * pan.coins));
  }

  let last = NaN;
  function draw(e) {
    if (e === last) return;
    last = e;
    const s = Math.sin(rad(e)), c = Math.cos(rad(e));
    const lx = PX - HALF * c, lz = PZ - HALF * s, rx = PX + HALF * c, rz = PZ + HALF * s;
    const pts = [];
    for (const [x, z] of [[lx, lz], [rx, rz]]) for (const dy of [-1.5, 1.5]) for (const dz of [-1.5, 1.5]) pts.push(P(x, PY + dy, z + dz));
    beam.setAttribute("d", poly(hull(pts)));
    drawPan(left, lx, lz);
    drawPan(right, rx, rz);
    left.bowl.classList.toggle("hi", e > 1);
    right.bowl.classList.toggle("hi", e < -1);
  }

  const tilt = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(tilt.x); return m; });
  bag.add(B.unregister);

  const pv = P(PX, PY, PZ);
  function aim(sx) {
    const e = sx == null ? REST : -clamp((sx - pv[0]) / 90, -1, 1) * MAX * reach;
    tilt.t = e;
    read.textContent = sx == null ? "rest" : Math.abs(e) < 1 ? "level" : (e > 0 ? "L " : "R ") + Math.round(Math.abs(e)) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p[0]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "goldscale",
  means: "A balance with coins in its pans: the pan on the pointer's side sinks and the other rises, and at rest the heavier one hangs low.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[129, 152], [271, 223], [200, 114], null],
  mount,
});
