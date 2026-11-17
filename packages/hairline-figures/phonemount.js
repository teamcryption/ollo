/**
 * Phone mount: a dashboard phone cradle on a round suction foot, a phone
 * seated on its two hooks and held by two side jaws. At rest the jaws grip,
 * bright. The pointer over the mount springs the jaws apart and the phone
 * lifts free of the hooks; the slider is how wide the jaws open.
 *
 * The pattern: a pair of parts that part (clamp).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PW = 27, PZ0 = 26, PZ1 = 104, REST = 1.5;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxS = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-20, -20, 0], [20, 14, 0], [-PW - 26, 0, 60], [PW + 26, 14, 40], [-PW, 4, PZ1 + 32], [PW, 10, PZ1 + 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // a plate standing in x-z, thin in y: silhouette and one crease on its face
  const slab = (s, x0, z0, x1, z1, y0, y1, r) => {
    const o = rrect(x0, z0, x1, z1, r, 6), i = rrect(x0 + 1.6, z0 + 1.6, x1 - 1.6, z1 - 1.6, Math.max(r - 1.6, 0.5), 6);
    const at = (q, y) => P(q.u, y, q.v);
    put(s, { sil: poly(hull(o.map((q) => at(q, y0)).concat(o.map((q) => at(q, y1))))), crease: poly(i.map((q) => at(q, y1))) });
  };
  put(solid(g), prism(P, front, disc(0, -4, 17), disc(0, -4, 14), 0, 5));
  put(solid(g), prism(P, front, disc(0, -4, 4, 20), disc(0, -4, 2.5, 20), 5, 46));
  const armL = solid(g), armR = solid(g);
  slab(solid(g), -PW - 2, 20, PW + 2, 92, -1, 3, 6);
  for (const x of [-16, 10]) slab(solid(g), x, 18, x + 6, 28, 2, 14, 1.5);
  const phone = solid(g), lens = mk("path", { class: "nf lo" }, g), jawL = solid(g), jawR = solid(g);
  const st = tween(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const l = s * 1.3;
    slab(phone, -PW, PZ0 + l, PW, PZ1 + l, 4, 10, 7);
    lens.setAttribute("d", poly(rrect(-5, PZ1 + l - 7, 5, PZ1 + l - 4.5, 1.2, 4).map((q) => P(q.u, 10, q.v))));
    slab(armL, -PW - 2 - s, 57, 0, 65, -5, -1, 2);
    slab(armR, 0, 57, PW + 2 + s, 65, -5, -1, 2);
    slab(jawL, -PW - 6 - s, 50, -PW + 4 - s, 72, 0, 14, 2.5);
    slab(jawR, PW - 4 + s, 50, PW + 6 + s, 72, 0, 14, 2.5);
  }
  const B = register(stage, (_dt, now) => { draw(tval(st, now)); return !tdone(st, now); });
  bag.add(B.unregister);
  jawL.sil.classList.add("hi");
  jawR.sil.classList.add("hi");
  const mid = P(0, 6, 60);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(st, a > 0 ? maxS : REST, performance.now(), 0);
    read.textContent = a > 0 ? "open" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 120 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxS = v; if (act > 0) { tset(st, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "phonemount",
  means: "A dashboard phone mount on a suction foot: the pointer over it springs the side jaws apart and the phone lifts off its hooks.",
  rules: [1, 4, 5, 8],
  range: [10, 18, 24],
  tour: [[200, 170], [170, 160], [230, 190], null],
  mount,
});
