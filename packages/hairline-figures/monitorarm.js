/**
 * Monitor arm: a desk with a clamp post, an arm reaching out from it and a
 * flat screen on the arm's end. The screen swivels round the post to face
 * the pointer, on a spring, as far as the arm allows. At rest it is turned
 * a little aside, its edge bright. The slider is how far it may swing.
 *
 * The pattern: a part turning to face the pointer.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, unproj, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 30, SW = 40, ST = 2.6, Z0 = 30, Z1 = 76, AZ = 52, REST = 45 - 40;
const turn = (ring, cx, cy, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-34, -34, 0], [46, 46, 0], [46, -34, 0], [-34, 46, 0], [22, -20, Z1], [-20, 22, Z1], [36, 36, Z1]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-34, -34, 46, 46, 8, 2);
  put(solid(g), prism(P, front, dr, di, -5, 0));
  const disc = (r, n = 24) => circ(r, n);
  put(solid(g), prism(P, front, disc(6), disc(4.6), 0, 3));
  put(solid(g), prism(P, front, disc(2.6), disc(1.7), 3, AZ + 4));
  const arm = solid(g), elbow = solid(g), mon = solid(g);
  const bezel = mk("path", { class: "nf lo" }, g);

  const th = spring(rad(REST));
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const cx = L * Math.cos(t), cy = L * Math.sin(t);
    const [ar, ai] = rings(0, -2.2, L, 2.2, 2, 0.8);
    put(arm, prism(P, front, turn(ar, 0, 0, t), turn(ai, 0, 0, t), AZ - 3, AZ + 1));
    put(elbow, prism(P, front, turn(disc(3.4), cx - 2 * Math.cos(t), cy - 2 * Math.sin(t), 0), turn(disc(2.4), cx - 2 * Math.cos(t), cy - 2 * Math.sin(t), 0), AZ - 8, AZ + 2));
    const [mr, mi] = rings(-ST / 2, -SW, ST / 2, SW, 1, 0.5);
    put(mon, prism(P, front, turn(mr, cx, cy, t), turn(mi, cx, cy, t), Z0, Z1));
    // the screen's glass: an inset outline on the face that looks out
    const c = Math.cos(t), s = Math.sin(t), fx = cx + c * (ST / 2 + 0.05), fy = cy + s * (ST / 2 + 0.05);
    const at = (w, z) => P(fx - s * w, fy + c * w, z);
    const q = [at(-SW + 3, Z0 + 3), at(SW - 3, Z0 + 3), at(SW - 3, Z1 - 3), at(-SW + 3, Z1 - 3)];
    bezel.setAttribute("d", poly(q));
  }

  const B = register(stage, (dt) => {
    const moving = stepS(th, dt);
    draw(th.x);
    return moving;
  });
  bag.add(B.unregister);
  mon.sil.classList.add("hi");

  function aim(p) {
    if (!p) { th.t = rad(REST); read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    let d = Math.atan2(y, x) * 180 / Math.PI - 45;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    d = clamp(d, -reach, reach);
    th.t = rad(45 + d);
    read.textContent = (d >= 0 ? "+" : "") + Math.round(d) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "monitorarm",
  means: "A screen on a desk arm: it swivels round its post to face the pointer, as far as the arm allows, and turns back aside at rest.",
  rules: [1, 3, 5, 8],
  range: [20, 45, 70],
  tour: [[120, 200], [280, 200], [200, 240], null],
  mount,
});
