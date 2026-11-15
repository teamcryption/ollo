/**
 * Salad spinner: a round bowl on a foot ring, a lid with a pump plunger on a
 * tall rod. The pointer pumps it: the lower the pointer, the further the
 * knob is pressed down, and the vented lid turns with each stroke. At rest
 * the plunger stands up, its knob bright.
 */
const {
  Cam, circ, facing, fit, prism, proj, seg, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 34, HB = 30, ROD = 34, LO = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(R + 2) * Math.cos(a), (R + 2) * Math.sin(a), 0]); }
  ext.push([0, 0, HB + 3 + ROD + 8]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R - 8, 48), circ(R - 9.4, 48), 0, 3));
  put(solid(g), prism(P, front, circ(R, 64), circ(R - 1.6, 64), 3, HB));
  put(solid(g), prism(P, front, circ(R + 2, 64), circ(R - 4, 64), HB, HB + 3));
  const vents = mk("path", { class: "nf lo", d: "" }, g);
  place(flatDot(g, C, 1.6, "dot m"), P(R * 0.62, R * 0.62, HB + 3));
  const rod = solid(g), knob = solid(g);
  knob.sil.classList.add("hi");
  const dp = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let spin = 0.3, drawn = NaN, prev = 0;
  function draw() {
    const d = dp.x;
    spin += Math.abs(d - prev) * 2.4; prev = d;
    if (Math.abs(d - drawn) < 1e-4) return;
    drawn = d;
    const zt = HB + 3 + LO + (ROD - LO) * (1 - d);
    let v = "";
    for (let i = 0; i < 8; i++) {
      const a = spin + (i / 8) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
      v += seg(P(c * 11, s * 11, HB + 3), P(c * (R - 7), s * (R - 7), HB + 3));
    }
    vents.setAttribute("d", v);
    put(rod, prism(P, front, circ(3, 24), null, HB + 3, zt));
    put(knob, prism(P, front, circ(10, 40), circ(8.8, 40), zt, zt + 6));
  }
  const B = register(stage, (dt) => { const m = stepS(dp, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const t = clamp((p[1] - 70) / 160, 0, 1);
      dp.t = t;
      read.textContent = "pump " + Math.round(t * 100) + "%";
      B.wake();
    },
    leave: () => { dp.t = 0; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw();
  return {
    set: (v) => { dp.k = 100 * v; dp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "saladspinner",
  means: "A salad spinner: the pointer presses the pump knob down its rod, and the vented lid turns with every stroke.",
  rules: [3, 5, 8, 9],
  range: [0.5, 1, 1.6],
  tour: [[200, 275], [200, 75], [96, 224], null],
  mount,
});
