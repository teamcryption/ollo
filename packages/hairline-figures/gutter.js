/**
 * Rain gutter: a house wall under a roof edge, a gutter trough along the
 * eave and a downpipe at one end. The downpipe's hinged foot swings out as
 * the pointer moves to the right, from hanging straight down to lying out
 * over the ground. At rest the gutter is bright and the foot half out.
 *
 * The pattern: one part following a continuous input (spring).
 */
const {
  Cam, fit, facing, prism, proj, rings, clamp, spring, stepS, hull, poly, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = 93, HY = 35, HZ = 31, L = 28, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-12, -12, 0], [112, 70, 0], [112, -12, 0], [-12, 70, 0], [50, 12, 64]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, cls) => {
    const [o, i] = rings(x0, y0, x1, y1, r, b), s = solid(g);
    put(s, prism(P, front, o, i, z0, z1));
    if (cls) s.sil.classList.add(cls);
    return s;
  };
  box(-12, -12, 112, 70, 6, 2, -3, 0);
  box(0, 0, 100, 24, 2, 1.2, 0, 56);
  box(-4, -4, 104, 30, 2, 1, 56, 62);
  const gut = box(-2, 30, 102, 38, 2.5, 1.6, 50, 57);
  box(HX - 4, HY - 4, HX + 4, HY + 4, 3, 1.2, HZ, 50);
  const foot = mk("path", { class: "sil" }, g), lip = mk("path", { class: "nf lo" }, g);

  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.05) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const pts = [];
    const ends = [[HY, HZ], [HY + L * s, HZ - L * c]];
    for (const [y, z] of ends) for (const dx of [-4, 4]) for (const dn of [-4, 4]) pts.push(P(HX + dx, y + dn * c, z + dn * s));
    foot.setAttribute("d", poly(hull(pts)));
    const [ey, ez] = ends[1];
    lip.setAttribute("d", a < 40 ? "" : poly([[-4, -4], [4, -4], [4, 4], [-4, 4]].map(([dx, dn]) => P(HX + dx, ey + dn * c, ez + dn * s))));
  }

  const ang = spring(REST);
  draw(REST);
  let on = false;
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); show(); return m; });
  bag.add(B.unregister);
  function show() { read.textContent = on ? "out " + Math.round(ang.x) + "°" : "rest"; }
  function mark(a) { gut.sil.classList.toggle("hi", !a); foot.classList.toggle("hi", a); }
  mark(false); show();
  bag.add(pointer(stage, {
    move: ([sx]) => { on = true; mark(true); ang.t = clamp((sx - 90) / 140, 0, 1) * 90 * reach; B.wake(); },
    leave: () => { on = false; mark(false); ang.t = REST; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "gutter",
  means: "A rain gutter on a house eave: move the pointer right and the downpipe's hinged foot swings out over the ground.",
  rules: [3, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[212, 199], [120, 200], [226, 252], null],
  mount,
});
