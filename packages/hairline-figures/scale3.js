/**
 * Deli scale: a counter scale with a wide steel platter and a display head
 * on a post behind it. Over the scale the platter dips under its load and
 * the head turns round on its post to show the reading. At rest the head
 * stands turned partway away, bright. The slider is how far the platter dips.
 */
const {
  Cam, facing, fit, poly, prism, proj, rings, ringAt, rrect, rad, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 54, Y0 = -12, Y1 = 40, BZ = 10, PZ = 14, HX = 27, HY = -6, HZ0 = 34, HZ1 = 52, HW = 22, HD = 6;
const REST = 20, TURN = -45;

function turned(ring, deg) {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return ring.map((q) => ({ u: HX + c * q.u - s * q.v, v: HY + s * q.u + c * q.v, nu: c * q.nu - s * q.nv, nv: s * q.nu + c * q.nv }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dip = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [0, Y1, 0], [HX - HW, HY, HZ1], [HX + HW, HY, HZ1]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g);
  { const [r, i] = rings(0, Y0, X1, Y1, 6, 1.6); put(base, prism(P, front, r, i, 0, BZ)); }
  const post = solid(g);
  { const [r, i] = rings(HX - 2.5, HY - 2.5, HX + 2.5, HY + 2.5, 2.5, 0.8); put(post, prism(P, front, r, i, BZ, HZ0)); }
  const head = solid(g), screen = mk("path", { class: "nf lo" }, head.g);
  const plat = solid(g), lip = mk("path", { class: "nf lo" }, plat.g);
  const ang = tween(REST), pz = tween(0);
  let lastA = NaN, lastZ = NaN;

  function drawHead(deg) {
    if (deg === lastA) return;
    lastA = deg;
    const r = turned(rrect(-HW, -HD, HW, HD, 3, 4), deg), i = turned(rrect(-HW + 1.2, -HD + 1.2, HW - 1.2, HD - 1.2, 1.8, 4), deg);
    put(head, prism(P, front, r, i, HZ0, HZ1));
    // the reading window on the face that turns toward us
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), at = (u, z) => P(HX + c * u - s * HD, HY + s * u + c * HD, z);
    screen.setAttribute("d", front({ nu: -s, nv: c }) ? poly([at(-15, HZ0 + 5), at(15, HZ0 + 5), at(15, HZ1 - 4), at(-15, HZ1 - 4)]) + seg(at(-10, HZ0 + 9), at(4, HZ0 + 9)) : "");
  }
  function drawPlat(d) {
    if (d === lastZ) return;
    lastZ = d;
    const z = PZ - d, [r, i] = rings(4, 6, X1 - 4, Y1 - 3, 5, 2.2);
    put(plat, prism(P, front, r, i, z - 2, z));
    lip.setAttribute("d", poly(ringAt(P, rrect(10, 12, X1 - 10, Y1 - 9, 3, 4), z)));
  }

  const B = register(stage, (_dt, now) => {
    drawHead(tval(ang, now)); drawPlat(tval(pz, now));
    return !tdone(ang, now) || !tdone(pz, now);
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ);
    return x > -4 && x < X1 + 4 && y > Y0 - 4 && y < Y1 + 4;
  }
  let act = null;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    tset(ang, a ? TURN : REST, now, a ? 60 : 0);
    tset(pz, a ? Math.min(dip, 4) : 0, now, 0);
    head.sil.classList.add("hi");
    read.textContent = a ? "0.45kg" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { dip = v; }, destroy: bag.dispose };
}

hairline({
  name: "scale3",
  means: "A deli counter scale: over it, the platter dips under its load and the display head turns on its post to show the weight.",
  rules: [1, 3, 5, 6],
  range: [0, 2, 4],
  tour: [[182, 194], [198, 165], [202, 274], null],
  mount,
});
