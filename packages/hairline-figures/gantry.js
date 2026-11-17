/**
 * Gantry hoist: two A-frame legs on wheeled feet carry a beam; a trolley runs
 * along the beam and a crate hangs from its hook. The pointer's screen x is the
 * trolley's place on the beam, its height the hook's lift. At rest the trolley
 * sits off to one side, the hook bright. The slider is the rest place.
 *
 * The pattern: one part sliding along a track by the pointer (slide).
 */
const {
  Cam, circ, fit, hull, open, poly, prism, proj, rings, seg, clamp,
  disposer, mk, pointer, put, register, solid, spring, stepS, facing, flatDot, place,
} = HL;

const BX = 40, BZ = 72, LIM = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restX = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-BX - 4, -18, 0], [BX + 4, 18, 0], [-BX - 4, 0, BZ + 6], [BX + 4, 0, BZ + 6], [LIM + 14, 14, 8], [-LIM - 14, -14, 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const bar = (a, b, r) => hull(circ(r, 12).flatMap((q) => [P(a[0] + q.u, a[1] + q.v, a[2]), P(b[0] + q.u, b[1] + q.v, b[2])]));
  const frame = (x) => {
    const f = solid(g); const [fr, fi] = rings(x - 3, -18, x + 3, 18, 3, 1); put(f, prism(P, front, fr, fi, 2, 6));
    for (const y of [-15, 15]) { const [w, wi] = rings(x - 2.4, y - 2.4, x + 2.4, y + 2.4, 2.4, 0.7); put(solid(g), prism(P, front, w, wi, 0, 2)); }
    mk("path", { class: "sil", d: poly(bar([x, -14, 6], [x, 0, BZ], 2)) }, g);
    mk("path", { class: "sil", d: poly(bar([x, 14, 6], [x, 0, BZ], 2)) }, g);
  };
  frame(-BX);
  const [br, bi] = rings(-BX - 4, -3, BX + 4, 3, 2, 1);
  put(solid(g), prism(P, front, br, bi, BZ - 3, BZ + 3));
  const trol = solid(g), cable = mk("path", { class: "nf lo" }, g), crate = solid(g), lid = mk("path", { class: "nf lo" }, g);
  const hook = flatDot(g, C, 2.6, "dot");
  frame(BX);
  const X = spring(restX), Z = spring(26);
  let lx = NaN, lz = NaN, act = false;

  function draw() {
    const x = X.x, z = Z.x;
    if (x === lx && z === lz) return;
    lx = x; lz = z;
    const [tr, ti] = rings(x - 7, -6, x + 7, 6, 3, 1.2);
    put(trol, prism(P, front, tr, ti, BZ - 5, BZ + 5));
    const top = z + 18, hz = top + 7;
    cable.setAttribute("d", open([P(x, 0, BZ - 5), P(x, 0, hz)]) + " " + seg(P(x, 0, hz), P(x - 9, -9, top)) + seg(P(x, 0, hz), P(x + 9, 9, top)) + seg(P(x, 0, hz), P(x - 9, 9, top)) + seg(P(x, 0, hz), P(x + 9, -9, top)));
    const [cr, ci] = rings(x - 12, -12, x + 12, 12, 2.5, 1.2);
    put(crate, prism(P, front, cr, ci, z - 4, top));
    lid.setAttribute("d", seg(P(x - 12, -4, top), P(x + 12, -4, top)) + seg(P(x - 12, 4, top), P(x + 12, 4, top)));
    place(hook, P(x, 0, hz));
    read.textContent = act ? "x " + Math.round(x) + " · " + Math.round(z) : "rest";
  }

  const B = register(stage, (dt) => { const a = stepS(X, dt), b = stepS(Z, dt); draw(); return a || b; });
  bag.add(B.unregister);
  const x0 = P(0, 0, BZ)[0], dx = P(1, 0, BZ)[0] - x0;
  function setActive(on, x, z) {
    act = on; X.t = x; Z.t = z;
    crate.sil.classList.toggle("hi", on);
    hook.setAttribute("class", on ? "dot off" : "dot");
    lx = NaN; B.wake();
  }
  setActive(false, restX, 26);
  draw();
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(true, clamp((sx - x0) / dx, -LIM, LIM), clamp(44 - ((sy - 60) / 200) * 40, 8, 44)),
    leave: () => setActive(false, restX, 26),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restX = v; if (!act) setActive(false, v, 26); }, destroy: bag.dispose };
}

hairline({
  name: "gantry",
  means: "A gantry hoist: the trolley runs along the beam with the pointer and the hook lifts the hanging crate as it rises.",
  rules: [1, 3, 4, 5],
  range: [-22, -12, 0],
  tour: [[185, 198], [215, 165], [215, 250], null],
  mount,
});
