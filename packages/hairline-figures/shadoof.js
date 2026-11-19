/**
 * Shadoof: a well sweep. A forked post holds a long pole on a pin; a stone
 * counterweight is lashed to the short end and a bucket hangs on a rope from
 * the long end, over a round well. The pointer is the hand on the rope: the
 * further toward the well it goes, the further the pole tips and lowers the
 * bucket, while the stone rises. At rest the bucket is up, bright.
 * The slider is how far the pole may swing.
 *
 * The pattern: a continuous aim (a spring on one angle), picked on the ground.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, poly, prism, proj, rad, rings, rrect, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 0, PZ = 62, ARM = 76, SHORT = 44, ROPE = 12, WX = 72, WR = 17, WZ = 16, REST = -26;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-62, -24, 0], [100, 26, 0], [-60, 0, 100], [PX + ARM, 0, PZ + 36], [WX, 0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // ground slab, then the well
  const [sr, si] = rings(-62, -24, 100, 26, 10, 2);
  put(solid(g), prism(P, front, sr, si, 0, 3));
  put(solid(g), prism(P, front, disc(WX, 0, WR), disc(WX, 0, WR - 3), 3, WZ));
  mk("path", { d: poly(disc(WX, 0, WR - 4, 32).map((q) => P(q.u, q.v, WZ))), class: "nf lo" }, g);

  const stone = mk("path", { class: "sil" }, g);
  const [br, bi] = rings(PX - 4, -11, PX + 4, -5, 2, 1);
  put(solid(g), prism(P, front, br, bi, 3, PZ + 6));
  const pole = mk("path", { class: "sil" }, g);
  const pin = mk("path", { class: "nf lo" }, g);
  const [fr, fi] = rings(PX - 4, 5, PX + 4, 11, 2, 1);
  put(solid(g), prism(P, front, fr, fi, 3, PZ + 6));
  const rope = mk("path", { class: "nf" }, g);
  const bucket = solid(g);
  bucket.sil.classList.add("hi");

  // a point s along the pole, y across it, c off its axis, at angle th
  const at = (th, s, y, c) => {
    const ct = Math.cos(th), st = Math.sin(th);
    return P(PX + s * ct + c * st, y, PZ - s * st + c * ct);
  };
  const pts = (th, s0, s1, r) => {
    const o = [];
    for (const s of [s0, s1]) for (let i = 0; i < 20; i++) { const f = (i / 20) * Math.PI * 2; o.push(at(th, s, r * Math.cos(f), r * Math.sin(f))); }
    return o;
  };
  const block = rrect(-9, -8, 9, 8, 3.5, 4);

  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg);
    pole.setAttribute("d", poly(hull(pts(th, -SHORT - 4, ARM + 3, 2.4))));
    pin.setAttribute("d", seg(P(PX, -9, PZ), P(PX, 9, PZ)));
    const sp = [];
    for (const c of [-14, 2.5]) for (const q of block) sp.push(at(th, -SHORT + q.u, q.v, c));
    stone.setAttribute("d", poly(hull(sp)));
    const ex = PX + ARM * Math.cos(th), ez = PZ - ARM * Math.sin(th), bz = ez - ROPE - 9;
    rope.setAttribute("d", seg(P(ex, 0, ez), P(ex, 0, bz + 9)));
    put(bucket, prism(P, front, disc(ex, 0, 6.5, 24), disc(ex, 0, 5, 24), bz, bz + 9));
  }

  const a = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(a.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { a.t = REST; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    if (x < -70 || x > 110 || Math.abs(y) > 60) return aim(null);
    const u = clamp((x + 50) / 130, 0, 1);
    a.t = lerp(REST, REST + amp, u);
    read.textContent = "dip " + Math.round(u * 9);
    B.wake();
  }
  draw(REST);
  read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "shadoof",
  means: "A well sweep: the pointer toward the well tips the long pole, lowering the bucket as the stone counterweight rises.",
  rules: [1, 3, 5, 8],
  range: [16, 30, 42],
  tour: [[170, 225], [279, 259], [225, 245], null],
  mount,
});
