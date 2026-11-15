/**
 * Gym rings: a tall frame with a crossbar, and two rings hanging on long
 * straps. The pointer is where the rings swing to: both straps swing on a
 * spring about the bar, and the near ring is bright. At rest they hang with a
 * slight swing.
 */
const { Cam, facing, fit, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const REST = 0.2, L = 52, TOP = 94, R = 10, YS = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-16, -46, 0], [16, 46, 0], [-16, 46, 0], [16, -46, 0], [0, -46, 98], [0, 46, 98], [40, 0, 40], [-40, 0, 40]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, x0, y0, x1, y1, z0, z1, r = 1.5) => {
    const [a, b] = rings(x0, y0, x1, y1, r, Math.min(1, Math.min(x1 - x0, y1 - y0) / 4));
    put(s, prism(P, front, a, b, z0, z1));
  };
  box(solid(g), -16, -48, 16, -40, 0, 3, 2);
  box(solid(g), -2, -46, 2, -42, 3, 94, 1);
  box(solid(g), -2.5, -47, 2.5, 47, 94, 98, 1.5);
  const hang = [-YS, YS].map((y) => ({ y, strap: mk("path", { class: "nf sil", d: "" }, g), outer: mk("path", { class: "nf sil", d: "" }, g), inner: mk("path", { class: "nf lo", d: "" }, g) }));
  box(solid(g), -2, 42, 2, 46, 3, 94, 1);
  box(solid(g), -16, 40, 16, 48, 0, 3, 2);
  hang[1].outer.classList.add("hi");
  const sp = spring(REST, { k: 60 * value, c: 9 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const dx = Math.sin(a), dz = -Math.cos(a);
    for (const h of hang) {
      const ex = L * dx, ez = TOP + L * dz, cx = ex + R * dx, cz = ez + R * dz;
      h.strap.setAttribute("d", "M" + P(0, h.y - 2, TOP) + "L" + P(ex, h.y, ez) + "L" + P(0, h.y + 2, TOP));
      const ring = (r) => {
        const pts = [];
        for (let k = 0; k < 40; k++) { const b = (k / 40) * Math.PI * 2, u = Math.cos(b) * r, v = Math.sin(b) * r; pts.push(P(cx - v * dx, h.y + u, cz - v * dz)); }
        return "M" + pts.join("L") + "Z";
      };
      h.outer.setAttribute("d", ring(R));
      h.inner.setAttribute("d", ring(R - 2.2));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const say = () => { read.textContent = Math.round(sp.t * 57.3) + "deg"; };
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 40);
      sp.t = Math.abs(y) > 70 ? REST : Math.max(-0.7, Math.min(0.7, x / 45));
      say(); B.wake();
    },
    leave: () => { sp.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest"; draw();
  return { set: (v) => { sp.k = 60 * v; sp.c = 9 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "gymrings",
  means: "Gym rings on a tall frame: both rings swing on their straps toward the pointer, the near ring bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[221, 199], [141, 159], [190, 185], null],
  mount,
});
