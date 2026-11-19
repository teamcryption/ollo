/**
 * Cycle rickshaw: a bench for two on a pair of rear wheels, a folding hood
 * over it on two hinges, and the rider's saddle, bar and single front wheel
 * ahead. Near the pointer the hood folds back on its hinges, open to the sky.
 * At rest it stands up over the bench, bright. The slider is how far it folds.
 *
 * The pattern: one part swinging on a hinge (open).
 */
const { Cam, fit, proj, rings, prism, facing, tween, tset, tval, tdone, poly, seg, hull, fillet, rad, disposer, mk, pointer, put, register, solid, flatDot, place } = HL;

const R = 13, Y = 18, FX = 74, FR = 12, HX = -9, HZ = 30;
const PROF = [[0, 0], [-1, 10], [1, 19], [6, 24], [14, 25], [22, 23]];
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-40, -Y - 4, 0], [FX + FR + 4, Y + 4, 0], [-40, 0, 58], [FX + FR, 0, 58]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (cx, y, rr, n) => {
    const o = [], i = [], s = [];
    for (let k = 0; k < 40; k++) { const t = (k / 40) * Math.PI * 2; o.push(P(cx + rr * Math.cos(t), y, rr + rr * Math.sin(t))); i.push(P(cx + (rr - 2.4) * Math.cos(t), y, rr + (rr - 2.4) * Math.sin(t))); }
    for (let k = 0; k < n; k++) { const t = 0.2 + (k / n) * Math.PI * 2; s.push(seg(P(cx, y, rr), P(cx + (rr - 2.4) * Math.cos(t), y, rr + (rr - 2.4) * Math.sin(t)))); }
    mk("path", { class: "sil", d: poly(o) + poly(i) }, g);
    mk("path", { class: "nf lo", d: s.join("") }, g);
  };
  wheel(0, -Y, R, 8);
  mk("path", { class: "nf sil", d: seg(P(0, -Y, R), P(0, Y, R)) + seg(P(0, 0, R), P(FX - 30, 0, 20)) + seg(P(FX - 30, 0, 20), P(FX, 0, FR)) + seg(P(FX - 30, 0, 20), P(FX - 34, 0, 40)) + seg(P(FX - 30, 0, 20), P(FX - 4, 0, 44)) + seg(P(FX - 4, 0, 44), P(FX, 0, FR)) }, g);
  const hoodG = mk("g", {}, g);
  const hood = mk("path", { class: "sil" }, hoodG), bows = mk("path", { class: "nf lo" }, hoodG);
  const seatG = mk("g", {}, g);
  const [sr, si] = rings(-10, -Y + 2, 14, Y - 2, 3, 1.2);
  put(solid(seatG), prism(P, front, sr, si, 18, 24));
  const [kr, ki] = rings(-12, -Y + 2, -7, Y - 2, 2, 0.8);
  put(solid(seatG), prism(P, front, kr, ki, 24, HZ + 2));
  wheel(0, Y, R, 8);
  mk("path", { class: "sil", d: poly([P(FX - 40, -4, 41), P(FX - 28, -3, 41), P(FX - 28, 3, 41), P(FX - 40, 4, 41)]) }, g);
  wheel(FX, 0, FR, 6);
  mk("path", { class: "nf sil", d: seg(P(FX - 4, -12, 46), P(FX - 4, 12, 46)) + seg(P(FX - 4, 0, 44), P(FX - 4, 0, 46)) }, g);
  const dot = flatDot(g, C, 2, "dot off");
  place(dot, P(0, Y + 8, 0));
  const tw = tween(6);
  let drawn = NaN, reach = value, on = false, back = null;
  function draw(a) {
    if (Math.abs(a - drawn) < 1e-3) return;
    drawn = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const at = ([dx, dz], y) => P(HX + dx * c - dz * s, y, HZ + dx * s + dz * c);
    const L = PROF.map((p) => at(p, -Y)), Rt = PROF.map((p) => at(p, Y));
    const hp = hull(L.concat(Rt)); hood.setAttribute("d", poly(fillet(hp, hp.map(() => 2))));
    bows.setAttribute("d", PROF.slice(2, 5).map((p) => seg(at(p, -Y), at(p, Y))).join(""));
    const b = a > 55;
    if (b !== back) { back = b; if (b) seatG.before(hoodG); else seatG.after(hoodG); }
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const lo = P(-30, 0, 0), hi = P(FX + FR, 0, 0), top = P(0, 0, 58);
  function set(o) {
    on = o;
    tset(tw, on ? 30 + 80 * reach : 6, performance.now(), 0);
    hood.classList.add("hi");
    read.textContent = on ? "fold" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => set(p[0] > lo[0] - 10 && p[0] < hi[0] + 20 && p[1] > top[1] - 30 && p[1] < hi[1] + 40),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false); draw(6);
  return { set: (v) => { reach = v; if (on) { on = false; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "pedicab",
  means: "A cycle rickshaw: near the pointer the hood over its passenger bench folds back on its hinges.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[157, 83], [200, 150], [130, 175], null],
  mount,
});
