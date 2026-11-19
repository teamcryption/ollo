/**
 * Payphone: a wall box with a coin slot, a keypad and its handset hanging
 * in the cradle on a coiled cord. Bringing the pointer near lifts the
 * handset off the hook and swings it out, the cord stretching after it. At
 * rest the handset sits a touch off the hook, bright. The slider is how far
 * it lifts.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, rings, seg, tset, tval, tween, tdone, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 44, Y1 = 26, Z1 = 78, HX = 10, HZ = 44, REST = 0.08;
const SHAPE = [[-21, 3.5], [21, 3.5], [21, -7.5], [13, -7.5], [10, -1], [-10, -1], [-13, -7.5], [-21, -7.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, Z1], [0, Y1, Z1], [0, Y1 + 30, 30], [0, Y1 + 30, 74], [X1, Y1, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const F = (x, z, d = 0) => P(x, Y1 + d, z);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, Z1));
  // coin slot, display and keypad on the face
  mk("path", { d: poly([F(28, 66), F(38, 66), F(38, 72), F(28, 72)]) }, g);
  mk("path", { d: seg(F(30, 69, 0.2), F(36, 69, 0.2)), class: "nf" }, g);
  mk("path", { d: poly([F(20, 54), F(39, 54), F(39, 61), F(20, 61)]), class: "lo" }, g);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const x = 21 + c * 6.5, z = 46 - r * 6.5;
    mk("path", { d: poly([F(x, z), F(x + 4.5, z), F(x + 4.5, z + 4.5), F(x, z + 4.5)]), class: "lo" }, g);
  }
  mk("path", { d: poly([F(26, 8), F(36, 8), F(36, 14), F(26, 14)]) }, g);
  // the cradle hook
  mk("path", { d: poly(hull([F(4, 64), F(16, 64), F(4, 64, 6), F(16, 64, 6), F(4, 67), F(16, 67), F(4, 67, 6), F(16, 67, 6)])) }, g);
  const cord = mk("path", { class: "nf" }, g);
  const hg = mk("g", {}, g);
  const body = mk("path", { class: "sil hi" }, hg), face = mk("path", {}, hg), holes = mk("path", { class: "nf lo" }, hg);
  const tw = tween(REST);
  let last = NaN;

  function pose(L) {
    const th = rad(-38 * L), cx = HX + 8 * L, cz = HZ + 6 * L, d0 = 6 + 26 * L;
    const pt = (u, w, d) => F(cx + w * Math.cos(th) + u * Math.sin(th), cz + u * Math.cos(th) - w * Math.sin(th), d0 + d);
    return pt;
  }
  function draw(L) {
    if (L === last) return;
    last = L;
    const pt = pose(L);
    const a = SHAPE.map(([u, w]) => pt(u, w, 0)), b = SHAPE.map(([u, w]) => pt(u, w, 5));
    body.setAttribute("d", poly(hull(a.concat(b))));
    face.setAttribute("d", poly(b));
    let h = "";
    for (const u of [-17.5, 17.5]) for (const w of [-5, -2, 1.5]) h += seg(pt(u - 1, w, 5.2), pt(u + 1, w, 5.2));
    holes.setAttribute("d", h);
    // the coiled cord: from the box's lower left to the mouthpiece
    const s = F(14, 14, 0), e = pt(-21, 0, 2.5), pts = [];
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, sag = Math.sin(Math.PI * t) * 22 * (1 - L * 0.6), coil = (i % 2 ? 2.2 : -2.2) * (1 - 0.4 * L);
      pts.push([s[0] + (e[0] - s[0]) * t + coil, s[1] + (e[1] - s[1]) * t + sag]);
    }
    cord.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const hc = F(HX, HZ, 6);
  let on = false;
  function choose(v) {
    on = v;
    tset(tw, v ? amp : REST, performance.now(), 0);
    read.textContent = v ? "lift" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const v = Math.hypot(sx - hc[0], sy - hc[1]) < 110; if (v !== on || v) choose(v); },
    leave: () => choose(false),
  }));
  draw(REST);
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) choose(true); }, destroy: bag.dispose };
}

hairline({
  name: "payphone",
  means: "A payphone on the wall: bringing the pointer near lifts the handset off its hook and swings it out on its coiled cord.",
  rules: [1, 4, 5, 6],
  range: [0.4, 0.7, 1],
  tour: [[181, 137], [162, 230], [295, 65], null],
  mount,
});
