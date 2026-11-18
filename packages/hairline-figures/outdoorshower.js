/**
 * Outdoor shower: a timber post on a slatted deck square, a tap half way up
 * and a long arm at the top carrying a wide rain head. The pointer is where
 * the water should fall: the arm swings round the post on a spring to hold
 * the head over it. At rest the arm points off to the left, its head bright.
 * The slider is how far the arm may swing.
 *
 * The pattern: a continuous aim on the ground plane, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 118, AL = 40, HR = 11, REST = rad(-80);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-48, -48, 0], [48, 48, 0], [48, -48, 0], [-48, 48, 0], [0, 0, PZ + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-34, -34, 34, 34, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, 5));
  const slats = mk("path", { class: "nf lo" }, g);
  slats.setAttribute("d", [-17, 0, 17].map((v) => seg(P(-32, v, 5), P(32, v, 5))).join(""));
  const farG = mk("g", {}, g);
  const [pr, pi] = rings(-4, -4, 4, 4, 2, 1);
  put(solid(g), prism(P, front, pr, pi, 5, PZ + 4));
  const [tr, ti] = rings(4, -2, 9, 2, 1, 0.6);
  put(solid(g), prism(P, front, tr, ti, 54, 59));
  mk("path", { d: seg(P(9, 0, 60), P(9, 0, 66)), class: "nf" }, g);
  const nearG = mk("g", {}, g);
  const arm = solid(farG), drop = solid(farG), head = solid(farG);
  head.sil.classList.add("hi");
  const sa = spring(REST);
  let last = NaN, over = null;

  const turn = (ring, a) => ring.map((q) => ({
    u: q.u * Math.cos(a) - q.v * Math.sin(a), v: q.u * Math.sin(a) + q.v * Math.cos(a),
    nu: q.nu * Math.cos(a) - q.nv * Math.sin(a), nv: q.nu * Math.sin(a) + q.nv * Math.cos(a),
  }));
  const disc = (x, y, r) => circ(r, 32).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

  function draw() {
    const a = sa.x;
    if (Math.abs(a - last) < 0.0005) return;
    last = a;
    const [ar, ai] = rings(-2, -2, AL, 2, 2, 0.6);
    put(arm, prism(P, front, turn(ar, a), turn(ai, a), PZ - 2, PZ + 2));
    const hx = AL * Math.cos(a), hy = AL * Math.sin(a);
    put(drop, prism(P, front, disc(hx, hy, 2), disc(hx, hy, 1.2), PZ - 8, PZ - 2));
    put(head, prism(P, front, disc(hx, hy, HR), disc(hx, hy, HR - 2), PZ - 11, PZ - 8));
    const grp = hx + hy > 0 ? nearG : farG;
    for (const s of [arm, drop, head]) grp.appendChild(s.g);
  }

  const B = register(stage, (dt) => { const m = stepS(sa, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    const lim = rad(30 + 150 * reach), mid = rad(45);
    sa.t = over === null ? REST : mid + clamp(over - mid, -lim, lim);
    read.textContent = over === null ? "rest" : "arm " + Math.round((((sa.t * 180) / Math.PI) + 360) % 360);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      if (r > 140 || r < 4) over = null;
      else { let t = Math.atan2(y, x); while (t < rad(45) - Math.PI) t += 2 * Math.PI; while (t > rad(45) + Math.PI) t -= 2 * Math.PI; over = t; }
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "outdoorshower",
  means: "An outdoor shower post on a deck: the arm swings round the post to hold its rain head over the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[200, 260], [330, 190], [80, 190], null],
  mount,
});
