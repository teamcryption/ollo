/**
 * Shape cube: an activity cube with shaped holes in its lid, a round, a
 * triangle, a square and a star. Near the pointer the cube turns on the floor
 * to bring its holes round to face it. At rest it sits a little askew, the
 * round hole bright. The slider is how far it turns.
 */
const { Cam, fit, proj, facing, rings, prism, poly, unproj, spring, stepS, disposer, mk, solid, put, pointer, register } = HL;

const H = 40, S2 = 26;
const turn = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
const shape = (k, cx, cy) => {
  const pts = [], n = [24, 3, 4, 10][k];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2 + (k === 2 ? Math.PI / 4 : -Math.PI / 2), r = k === 3 ? (i % 2 ? 3.4 : 7.5) : k === 2 ? 8 : 7;
    pts.push([cx + r * Math.cos(t), cy + r * Math.sin(t)]);
  }
  return pts;
};
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  const ext = [];
  for (let k = 0; k < 8; k++) { const t = (k / 8) * Math.PI * 2; ext.push([37 * Math.cos(t), 37 * Math.sin(t), 0], [37 * Math.cos(t), 37 * Math.sin(t), H]); }
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const R = rings(-S2, -S2, S2, S2, 4, 1.8);
  const body = solid(g);
  const holes = [0, 1, 2, 3].map(() => mk("path", { class: "sil" }, g));
  const POS = [[-12, -12], [12, -12], [-12, 12], [12, 12]];
  const sp = spring(0.22);
  let drawn = NaN, reach = 1, on = false;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    put(body, prism(P, front, turn(R[0], a), turn(R[1], a), 0, H));
    const c = Math.cos(a), s = Math.sin(a);
    holes.forEach((h, k) => h.setAttribute("d", poly(shape(k, POS[k][0], POS[k][1]).map(([u, v]) => P(u * c - v * s, u * s + v * c, H)))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function set(o) {
    on = o;
    sp.t = on ? 0.22 + 1.35 * reach : 0.22;
    holes[0].classList.toggle("hi", !on); holes[3].classList.toggle("hi", on);
    read.textContent = on ? "turn" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], H); set(Math.hypot(x, y) < 44); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); set(false);
  return { set: (v) => { reach = v; set(on); }, destroy: bag.dispose };
}

hairline({
  name: "puzzlecube",
  means: "A shape-sorter activity cube: near the pointer it turns on the floor, swinging its shaped holes round.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 135], [200, 163], [200, 60], null],
  mount,
});
