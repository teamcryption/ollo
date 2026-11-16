/**
 * Citrus press: a lever juicer on a base plate, a post at the back carrying a
 * long lever on a pivot, the pressing cone hung from the lever over a juice
 * cup with its reamer. The pointer is how hard it presses: the further along
 * the base it stands, the further the lever swings down on a spring, bringing
 * the cone onto the cup. At rest the lever is raised, bright. The slider is
 * how quickly it follows.
 *
 * The pattern: a continuous swing (terrain's spring, on one angle); the hit is
 * on the base's plane, which never moves.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 92, BY = 46, PZ = 50, PX = 10, CY = 23, CUPX = 40, ARM = 96, HEAD = 30, UP = -0.5, DOWN = 0.42;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], [PX, CY, PZ + 6], [PX + ARM * Math.cos(UP), CY, PZ - ARM * Math.sin(UP)]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, 5));
  put(solid(g), prism(P, front, rings(PX - 5, CY - 5, PX + 5, CY + 5, 2, 1)[0], null, 5, PZ + 3));
  put(solid(g), prism(P, front, disc(CUPX, CY, 17), disc(CUPX, CY, 15.5), 5, 15));
  const ream = [];
  for (const [r, z] of [[8, 0], [5, 5], [2, 8], [0.5, 9]]) ream.push(...ringAt(P, disc(CUPX, CY, r, 20), 15 + z));
  mk("path", { d: poly(hull(ream)), class: "nf" }, g);
  const head = mk("path", { class: "sil" }, g);
  const lever = mk("path", { class: "sil hi" }, g);
  const sp = spring(UP, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = false;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a);
    const Lv = (u, v, w) => P(PX + u * c + w * s, CY + v, PZ - u * s + w * c);
    const pts = [];
    for (const u of [-6, ARM]) for (const v of [-3.5, 3.5]) for (const w of [0, 5]) pts.push(Lv(u, v, w));
    lever.setAttribute("d", poly(hull(pts)));
    const hx = PX + HEAD * c, hz = PZ - HEAD * s;
    const hp = [];
    for (const [r, z] of [[4, 0], [16, -8], [16, -13]]) hp.push(...ringAt(P, disc(hx, CY, r), hz + z));
    head.setAttribute("d", poly(hull(hp)));
    read.textContent = over ? Math.round((100 * (a - UP)) / (DOWN - UP)) + "%" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 5);
      over = y > -25 && y < BY + 25 && x > -25 && x < BX + 40;
      sp.t = over ? UP + (DOWN - UP) * clamp(x / BX, 0, 1) : UP;
      drawn = NaN; B.wake();
    },
    leave: () => { over = false; drawn = NaN; sp.t = UP; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "citruspress",
  means: "A lever citrus press: the lever swings down as the pointer moves along the base, bringing the cone onto the cup.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[262, 226], [200, 190], [166, 153], null],
  mount,
});
