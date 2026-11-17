/**
 * Valet stand: a round foot, a pole, a shoulder board on top and a trouser
 * bar under it. The pointer turns the top: board and bar swivel on the pole
 * to face it, on a spring. At rest the top stands turned a little, the
 * shoulder board bright. The slider is how quickly it follows.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 112, HW = 46, BAR = 68, BL = 34, REST = -38;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-HW, -HW, 0], [HW, HW, 0], [HW, -HW, 0], [-HW, HW, 0], [0, 0, H + 18]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(30, 48), circ(27.5, 48), 0, 4));
  put(solid(g), prism(P, front, circ(2.4, 16), circ(1.4, 16), 4, H));
  const bar = mk("path", { class: "sil" }, g), board = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
  const sw = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  // the board's outline: a flat bottom and an arched shoulder line, convex
  const outline = [];
  for (let i = 0; i <= 16; i++) { const t = i / 16, x = -HW + 2 * HW * t; outline.push([x, H + 4 + 12 * Math.sin(Math.PI * t) ** 0.6]); }
  outline.push([HW - 2, H], [-HW + 2, H]);
  let last = NaN;

  function draw() {
    const th = rad(sw.x);
    if (th === last) return;
    last = th;
    const c = Math.cos(th), s = Math.sin(th);
    const W = (lx, ly, lz) => P(lx * c - ly * s, lx * s + ly * c, lz);
    const fr = outline.map(([x, z]) => W(x, 3, z)), bk = outline.map(([x, z]) => W(x, -3, z));
    board.setAttribute("d", poly(hull(fr.concat(bk))));
    face.setAttribute("d", poly(outline.map(([x, z]) => W(x * 0.9, 3, H + (z - H) * 0.8 + 1.4))));
    const rod = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2, ly = 5 + 2.2 * Math.cos(t), lz = BAR + 2.2 * Math.sin(t); rod.push(W(-BL, ly, lz), W(BL, ly, lz)); }
    bar.setAttribute("d", poly(hull(rod)));
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(); return m; });
  bag.add(B.unregister);

  function setOver(p) {
    let on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      on = r > 4 && r < 140;
      if (on) {
        let t = (Math.atan2(y, x) * 180) / Math.PI - 90;
        while (t - sw.t > 90) t -= 180;
        while (t - sw.t < -90) t += 180;
        sw.t = t;
      }
    }
    if (!on) sw.t = REST;
    board.classList.toggle("hi", true);
    read.textContent = on ? (((Math.round(sw.t) % 180) + 180) % 180) + "°" : "rest";
    B.wake();
  }
  setOver(null);
  bag.add(pointer(stage, { move: setOver, leave: () => setOver(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sw.k = 100 * v; sw.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "valet",
  means: "A clothes valet stand: its shoulder board and trouser bar swivel on the pole to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[255, 266], [145, 210], [300, 200], null],
  mount,
});
