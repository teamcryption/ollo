/**
 * Sextant: the frame laid flat, a sector with its graduated arc, and the
 * index arm on its pivot under the index mirror. The pointer swings the arm:
 * it follows the pointer's bearing from the pivot along the arc on a spring.
 * At rest the arm sits off centre, bright. The slider is how far it may swing.
 */
const {
  Cam, fit, prism, proj, rings, rrect, facing, poly, hull, seg, unproj, clamp, rad,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const AX = -36, AY = -36, L = 82, B0 = rad(45), HALF = rad(30), REST = B0 - rad(18);
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: AX + q.u * c - q.v * s, v: AY + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  const at = (r, b, z) => [AX + r * Math.cos(b), AY + r * Math.sin(b), z];
  fit(C, [at(0, 0, 0), at(L + 8, B0 - HALF - 0.2, 0), at(L + 8, B0 + HALF + 0.2, 0), at(L + 8, B0, 0), at(0, 0, 18)], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the frame: a sector plate
  const fan = [P(...at(-6, B0, 2)), P(...at(-6, B0, 5))];
  for (let k = 0; k <= 24; k++) { const b = B0 - HALF - 0.08 + (k / 24) * (2 * HALF + 0.16); fan.push(P(...at(L + 6, b, 2)), P(...at(L + 6, b, 5))); }
  mk("path", { class: "sil", d: poly(hull(fan)) }, g);
  let gr = "";
  for (let k = 0; k <= 30; k++) { const b = B0 - HALF + (k / 30) * 2 * HALF; gr += seg(P(...at(L + 4.5, b, 5)), P(...at(L + (k % 5 ? 1.5 : -1), b, 5))); }
  for (let k = 0; k < 2; k++) { const b = B0 + (k ? 1 : -1) * HALF * 0.55; gr += seg(P(...at(8, b, 5)), P(...at(L - 6, b, 5))); }
  mk("path", { class: "nf lo", d: gr }, g);
  [[L - 4, B0 - HALF + 0.05], [L - 4, B0 + HALF - 0.05], [4, B0]].forEach(([r, b]) => place(flatDot(g, C, 1.3, "dot off"), P(...at(r, b, 5))));
  const hz = solid(g);
  const hb = at(42, B0 - HALF * 0.75, 0);
  put(hz, prism(P, front, ...rings(hb[0] - 4, hb[1] - 4, hb[0] + 4, hb[1] + 4, 1.4, 0.8), 5, 15));
  const arm = { g: mk("g", {}, g) };
  arm.bar = solid(arm.g); arm.box = solid(arm.g); arm.tab = solid(arm.g);
  arm.bar.sil.classList.add("hi");
  const BAR = rings(-6, -3.2, L + 4, 3.2, 2.4, 1), BOX = rings(-6, -6, 6, 6, 2, 1), TAB = rings(L - 6, -6, L + 4, 6, 2, 1);

  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    put(arm.tab, prism(P, front, turn(TAB[0], a), turn(TAB[1], a), 5, 7));
    put(arm.bar, prism(P, front, turn(BAR[0], a), turn(BAR[1], a), 5, 8));
    put(arm.box, prism(P, front, turn(BOX[0], a), turn(BOX[1], a), 8, 18));
    const mid = at(L * 0.5, a, 0);
    if (mid[0] + mid[1] > hb[0] + hb[1]) hz.g.after(arm.g); else arm.g.after(hz.g);
  }
  // the box must sit above the bar, and the tab below it
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  let over = null;
  function aim() {
    if (over == null) { sp.t = REST; read.textContent = "rest"; }
    else { sp.t = B0 + clamp(over - B0, -HALF, HALF) * value; read.textContent = Math.round((sp.t - B0 + HALF) * 180 / Math.PI * 2) + "°"; }
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0), d = Math.hypot(x - AX, y - AY); over = d > 10 && d < L + 30 ? Math.atan2(y - AY, x - AX) : null; aim(); },
    leave: () => { over = null; aim(); },
  }));
  bag.add(() => svg.replaceChildren());
  aim();
  return { set: (v) => { value = v; aim(); }, destroy: bag.dispose };
}

hairline({
  name: "sextant",
  means: "A sextant laid flat: the index arm swings along the graduated arc to the pointer's bearing from its pivot.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.15],
  tour: [[122, 192], [250, 212], [180, 222], null],
  mount,
});
