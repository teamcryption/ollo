/**
 * Weight bench: an adjustable bench on two feet, a flat seat and a backrest
 * hinged behind it on a strut. The pointer sets the incline: the further
 * along the bench it goes towards the head end, the more upright the backrest
 * stands, clamped at 80 degrees. At rest the backrest sits at a light incline,
 * bright. The slider is how quickly the backrest follows.
 */
const { Cam, fit, proj, facing, rings, prism, hull, poly, seg, unproj, spring, stepS, clamp, rad, disposer, mk, pointer, put, register, solid } = HL;

const L = 34, T = 4, HZ = 12, REST = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.75);
  fit(C, [[-36, -10, 0], [26, 10, 0], [-8, -7, 47], [-34, 7, 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1) => {
    const s = solid(g), r = rings(x0, y0, x1, y1, 0.8, Math.min(1, 0.25 * Math.min(x1 - x0, y1 - y0)));
    put(s, prism(P, front, r[0], r[1], z0, z1));
    return s;
  };
  box(-32, -10, -27, 10, 0, 3);
  box(-31, -2, -28, 2, 3, 8);
  box(-32, -2.5, 24, 2.5, 7, 10);
  box(19, -10, 24, 10, 0, 3);
  box(20, -2, 23, 2, 3, 7);
  const strut = mk("path", { class: "nf sil" }, g);
  const back = solid(g);
  box(10, -2, 14, 2, 10, 12);
  const seat = box(2, -7, 24, 7, 12, 16);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  function draw() {
    const a = rad(sp.x);
    if (Math.abs(a - drawn) < 1e-5) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), pts = [];
    for (const u of [0, 1]) for (const v of [-7, 7]) for (const w of [0, T]) pts.push(P(-u * L * c + w * s, v, HZ + u * L * s + w * c));
    put(back, { sil: poly(hull(pts)), crease: poly([pts[1], pts[3], pts[7], pts[5]]) });
    strut.setAttribute("d", seg(P(-24, 0, 10), P(-0.55 * L * c, 0, HZ + 0.55 * L * s)));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  back.sil.classList.add("hi");

  function aim(x) {
    sp.t = x == null ? REST : clamp((10 - x) * 2, 0, 80);
    read.textContent = x == null ? "rest" : Math.round(sp.t) + "\u00b0";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => {
      const [x, y] = unproj(C, q[0], q[1], 10);
      aim(Math.abs(y) > 30 || x < -50 || x > 40 ? null : x);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "weightbench",
  means: "An adjustable weight bench: the backrest tilts up as the pointer moves towards its head end, from flat to upright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[154, 156], [207, 183], [260, 209], null],
  mount,
});
