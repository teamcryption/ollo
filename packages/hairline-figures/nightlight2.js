/**
 * Projector lamp: a star projector night light, a squat base and a drum
 * pierced with stars. Near the pointer the drum rises out of the base and
 * turns, the stars wheeling round it. At rest the drum sits down, one star
 * bright. The slider is how high it rises.
 */
const { Cam, fit, proj, facing, circ, prism, poly, unproj, spring, stepS, disposer, mk, solid, put, pointer, register } = HL;

const RB = 24, HB = 12, RD = 20, HD = 30, NS = 9;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-RB, -RB, 0], [RB, RB, 0], [-RB, -RB, HB + HD + 22], [RB, RB, HB + HD + 22]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const head = solid(g), cap = solid(g);
  const stars = [];
  for (let i = 0; i < NS; i++) stars.push(mk("path", { class: "sil" }, g));
  const base = solid(g);
  put(base, prism(P, front, circ(RB, 64), circ(RB - 2, 64), 0, HB));
  const lift = spring(10), spin = spring(0.4);
  let drawn = "", reach = 1, on = false;
  function draw() {
    const z0 = HB - 4 + lift.x, a = spin.x, key = z0.toFixed(3) + a.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    put(head, prism(P, front, circ(RD, 64), circ(RD - 1.6, 64), z0, z0 + HD));
    put(cap, prism(P, front, circ(7, 32), null, z0 + HD, z0 + HD + 3));
    stars.forEach((st, i) => {
      const t = a + (i / NS) * Math.PI * 2, nx = Math.cos(t), ny = Math.sin(t), zc = z0 + HD * (i % 2 ? 0.4 : 0.68);
      if (nx + ny < 0.35) { st.setAttribute("d", ""); return; }
      const pts = [];
      for (let k = 0; k < 10; k++) {
        const b = (k / 10) * Math.PI * 2 - Math.PI / 2, r = k % 2 ? 1.6 : 4;
        pts.push(P(RD * nx - ny * r * Math.cos(b), RD * ny + nx * r * Math.cos(b), zc - r * Math.sin(b)));
      }
      st.setAttribute("d", poly(pts));
    });
  }
  const B = register(stage, (dt) => { const m1 = stepS(lift, dt), m2 = stepS(spin, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);
  function set(o) {
    on = o;
    lift.t = on ? 12 + 12 * reach : 10;
    spin.t = on ? 0.4 + 2.4 * reach : 0.4;
    head.sil.classList.toggle("hi", on);
    stars[0].classList.toggle("hi", !on);
    read.textContent = on ? "glow" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], HB); set(Math.hypot(x, y) < 40); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); set(false);
  return { set: (v) => { reach = v; set(on); }, destroy: bag.dispose };
}

hairline({
  name: "nightlight2",
  means: "A star projector lamp: near the pointer its starry drum rises from the base and turns, the stars wheeling round.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 171], [200, 186], [200, 84], null],
  mount,
});
