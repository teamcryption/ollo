/**
 * Table football: a cabinet with its pitch, two side rails, and four rods
 * across it, each carrying a line of players, a grip on the near end. The
 * pointer picks the rod under it: that rod spins and its players kick, and
 * the rods beside it follow less, spreading out from the pointer. At rest the
 * rods sit at uneven angles and one player is bright.
 *
 * The pattern: pick by the pitch's plane, which never moves; a spin per rod
 * on the discrete clock, staggered by distance.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, seg, unproj, rad, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const XS = [-36, -12, 12, 36], RZ = 36, TOP = 18;
const YS = [[-14, 14], [-21, 0, 21], [-21, 0, 21], [-14, 14]];
const REST = [12, -18, 24, -10], FALL = [1, 0.45, 0.2, 0.1];
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let kick = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-58, -36, 0], [58, 36, 0], [58, -36, 0], [-58, 36, 0], [-58, -40, 42], [58, 60, RZ], [-58, 60, RZ]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r, b) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); return s; };
  box(solid(g), -58, -36, 58, 36, 0, TOP, 5, 2);
  const line = mk("path", { class: "lo nf" }, g);
  line.setAttribute("d", seg(P(0, -30, TOP), P(0, 30, TOP)));
  box(solid(g), -58, -36, 58, -31, TOP, 30, 2, 0.8);
  const rods = XS.map((x, i) => {
    const rod = mk("path", { class: "sil nf" }, g);
    rod.setAttribute("d", seg(P(x, -40, RZ), P(x, 36, RZ)));
    const men = YS[i].map(() => mk("path", { class: "sil" }, g));
    return { x, men, tw: tween(REST[i]) };
  });
  box(solid(g), -58, 31, 58, 36, TOP, 30, 2, 0.8);
  rods.forEach((r) => {
    const s = mk("path", { class: "sil nf" }, g);
    s.setAttribute("d", seg(P(r.x, 36, RZ), P(r.x, 48, RZ)));
    box(solid(g), r.x - 2.6, 46, r.x + 2.6, 60, RZ - 2.6, RZ + 2.6, 2.4, 0.8);
  });
  /** One player: a slab hung on the rod, turned by a degrees about it. */
  function man(x, y, a) {
    const d = [Math.sin(rad(a)), -Math.cos(rad(a))], e = [Math.cos(rad(a)), Math.sin(rad(a))], pts = [];
    for (const s of [-6, 16]) for (const t of [-2.2, 2.2]) for (const w of [-3.2, 3.2])
      pts.push(P(x + d[0] * s + e[0] * t, y + w, RZ + d[1] * s + e[1] * t));
    return poly(hull(pts));
  }
  let last = "", a = -1, hiK = -1;
  function draw(now) {
    const angs = rods.map((r) => tval(r.tw, now)), key = angs.map((v) => v.toFixed(2)).join();
    if (key === last) return;
    last = key;
    rods.forEach((r, i) => r.men.forEach((m, j) => m.setAttribute("d", man(r.x, YS[i][j], angs[i]))));
  }
  const B = register(stage, (dt, now) => { draw(now); return rods.some((r) => !tdone(r.tw, now)); });
  bag.add(B.unregister);
  function pick(k) {
    const now = performance.now();
    a = k;
    rods.forEach((r, i) => tset(r.tw, k < 0 ? REST[i] : kick * FALL[Math.abs(i - k)], now, k < 0 ? 0 : Math.abs(i - k) * 40));
    rods.forEach((r, i) => r.men.forEach((m, j) => m.classList.toggle("hi", k < 0 ? i === 1 && j === 1 : i === k)));
    read.textContent = k < 0 ? "rest" : `rod ${k + 1} · ${Math.round(kick)}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TOP);
      let k = -1;
      if (Math.abs(x) < 66 && y > -50 && y < 66) { let bd = Infinity; XS.forEach((rx, i) => { if (Math.abs(rx - x) < bd) { bd = Math.abs(rx - x); k = i; } }); }
      if (k !== a) pick(k);
    },
    leave: () => { if (a !== -1) pick(-1); },
  }));
  bag.add(() => svg.replaceChildren());
  pick(-1);
  draw(performance.now());
  return { set: (v) => { kick = v; const k = a; a = -2; pick(k); }, destroy: bag.dispose };
}

hairline({
  name: "foosball2",
  means: "A table football table: the pointer picks a rod and it spins its players into a kick, the rods beside it following less.",
  rules: [1, 2, 3, 5, 8],
  range: [40, 80, 110],
  tour: [[167, 142], [200, 158], [266, 191], null],
  mount,
});
