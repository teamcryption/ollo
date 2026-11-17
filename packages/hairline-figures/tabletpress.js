/**
 * Pill press: a bench press with a column, a head and a long lever. The
 * pointer over the figure pulls the lever down, which drives the punch into
 * the die. At rest the lever stands raised, bright. The slider is how far
 * the lever travels.
 */
const { Cam, circ, fit, hull, poly, proj, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const PV = [12, 36, 66], LEN = 74;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, 0, 0], [60, 44, 0], [60, 0, 0], [0, 44, 0], [12 + LEN * 0.8, 36, 66 + LEN * 0.6], [12 + LEN, 36, 50]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, z0, x1, y1, z1, cls = "") => {
    mk("path", { d: poly([P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)]), class: cls }, g);
    mk("path", { d: poly([P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)]), class: cls }, g);
    mk("path", { d: poly([P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)]), class: cls }, g);
  };
  const cyl = (x, y, r, z0, z1, el) => {
    const c = circ(r, 28), pts = [];
    for (const q of c) pts.push(P(x + q.u, y + q.v, z0), P(x + q.u, y + q.v, z1));
    const d = poly(hull(pts)) + poly(c.map((q) => P(x + q.u, y + q.v, z1)));
    if (el) el.setAttribute("d", d); else mk("path", { d }, g);
  };
  box(0, 0, 0, 60, 44, 6);
  box(4, 14, 6, 16, 28, 66);
  cyl(38, 21, 7, 6, 13);
  const rod = mk("path", {}, g);
  box(4, 12, 54, 46, 30, 66);
  const lever = mk("path", { class: "sil" }, g), knob = mk("path", { class: "sil" }, g);
  mk("path", { d: poly(circ(4, 20).map((q) => P(PV[0] + q.u, PV[1] + 0.5, PV[2] + q.v))), class: "" }, g);
  const s = spring(0, { k: 110, c: 19 });
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    cyl(38, 21, 3, 30 - o * 16, 55, rod);
    const a = (40 - o * 52) * Math.PI / 180, ca = Math.cos(a), sa = Math.sin(a);
    const at = (t, w, y) => P(PV[0] + t * ca - w * sa, y, PV[2] + t * sa + w * ca);
    const pts = [];
    for (const y of [PV[1] - 2, PV[1] + 2]) for (const [t, w] of [[-4, -2.5], [-4, 2.5], [LEN, -2], [LEN, 2]]) pts.push(at(t, w, y));
    lever.setAttribute("d", poly(hull(pts)));
    const e = [PV[0] + LEN * ca, PV[2] + LEN * sa], kp = [];
    for (const q of circ(5.5, 20)) kp.push(P(e[0] + q.u, PV[1] + q.v, e[1]), P(e[0] + q.u, PV[1], e[1] + q.v));
    knob.setAttribute("d", poly(hull(kp)));
  }
  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    s.t = v ? clamp(amt, 0.3, 1) : 0;
    read.textContent = v ? "press" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: () => setOn(true), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { s.t = clamp(amt, 0.3, 1); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "tabletpress",
  means: "A bench pill press: the pointer pulls its long lever down, driving the punch into the die.",
  rules: [1, 3, 5, 6],
  range: [30, 100, 100],
  tour: [[194, 76], [205, 140], [240, 185], null],
  mount,
});
