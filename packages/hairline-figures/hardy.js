/**
 * Hardy tool: a chisel-edged cutter standing in the square hardy hole of an
 * anvil's heel. Over it, the hardy lifts out of its hole on its square shank,
 * ready to be swapped; away, it drops back in. At rest the cutting edge is
 * bright. The slider is how high it lifts.
 */
const {
  Cam, fit, facing, hull, poly, open, prism, proj, ringAt, rings, rrect, run, unproj, tset, tval, tdone, tween, lerp, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const T = 30, HX = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-46, -24, 0], [46, 24, 0], [46, -24, 0], [-46, 24, 0], [HX, 0, T + 34 + 30]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-46, -24, 46, 24, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, T));
  mk("path", { d: poly(ringAt(P, rrect(HX - 6, -6, HX + 6, 6, 1, 2), T)), class: "lo" }, g);
  mk("path", { d: poly(ringAt(P, rrect(-34, -6, -26, 2, 4, 4), T)), class: "nf lo" }, g);
  const tool = mk("g", {}, g);
  const shank = solid(tool), collar = solid(tool), blade = mk("path", { class: "sil" }, tool), crease = mk("path", { class: "nf lo" }, tool), edge = mk("path", { class: "nf hi" }, tool);
  const [sr, si] = rings(HX - 5, -5, HX + 5, 5, 1.2, 1);
  const [cr, ci] = rings(HX - 11, -9, HX + 11, 9, 2.5, 1.2);
  const foot = rrect(HX - 10, -8, HX + 10, 8, 2, 4), top = rrect(HX - 10, -0.8, HX + 10, 0.8, 0.8, 2);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const L = v * lerp(12, 30, reach), z0 = T + L;
    if (L <= 0.5) put(shank, { sil: "", crease: "" });
    if (L > 0.5) put(shank, prism(P, front, sr, si, T, z0));
    put(collar, prism(P, front, cr, ci, z0, z0 + 4));
    const zb = z0 + 4, zt = zb + 26;
    blade.setAttribute("d", poly(hull(ringAt(P, foot, zb).concat(ringAt(P, top, zt)))));
    crease.setAttribute("d", open(ringAt(P, run(foot, front), zb + 1)));
    edge.setAttribute("d", seg(P(HX - 10, 0, zt), P(HX + 10, 0, zt)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? "lift" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, T + 15); return Math.abs(x - HX) < 26 && Math.abs(y) < 26; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "hardy",
  means: "A hardy cutter in an anvil heel's square hole: over it, the hardy lifts out on its square shank, then drops back in.",
  rules: [1, 4, 5, 6],
  range: [0.4, 0.8, 1],
  tour: [[213, 140], [200, 160], [230, 175], null],
  mount,
});
