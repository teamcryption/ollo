/**
 * Pogo stick: a pole with foot pegs, a handlebar and a bare spring above the
 * foot. At rest it leans, spring squeezed, the spring bright. The pointer
 * over it springs it upright and up off the ground, the spring stretched.
 * The slider is how high it hops.
 *
 * The pattern: one part answering the pointer on a spring.
 */
const { Cam, fit, hull, lerp, open, poly, proj, spring, stepS, disposer, mk, pointer, register } = HL;

const RING = [];
for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; RING.push([Math.cos(t), Math.sin(t)]); }

function mount({ stage, svg, read }, value) {
  let hop = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  const at = (t) => { const a = lerp(0.42, -0.08, t), h = t * hop, c = lerp(14, 0, t); return { a, h, c, X: (x, s) => [x, -Math.sin(a) * s, h + Math.cos(a) * s] }; };
  const ext = [];
  for (const t of [0, 1]) { const f = at(t); for (const x of [-34, 34]) for (const s of [0, 140]) ext.push(f.X(x, s)); }
  ext.push([0, 30, 0], [0, -60, 0]);
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = ["low", "coil", "house", "peg", "bar", "grip"].map((k) => [k, mk("path", { class: k === "coil" ? "nf hi" : "sil" }, g)]);
  const el = Object.fromEntries(parts);
  const rod = (A, Bp, r) => {
    const pts = [];
    for (const E of [A, Bp]) for (const [c, s] of RING) pts.push(P(E[0] + r * c, E[1] + r * s, E[2]), P(E[0] + r * c, E[1], E[2] + r * s), P(E[0], E[1] + r * c, E[2] + r * s));
    return poly(hull(pts));
  };
  const sp = spring(0);
  let last = NaN;
  function draw() {
    if (sp.x === last) return;
    last = sp.x;
    const { a, c, X } = at(sp.x), top = 128 - c;
    el.low.setAttribute("d", rod(X(0, 2), X(0, 54 - c), 2.2));
    const coil = [];
    for (let i = 0; i <= 96; i++) { const t = (i / 96) * 8 * Math.PI * 2, s = 10 + (i / 96) * (34 - c); const p = X(0, s); coil.push(P(p[0] + 4.6 * Math.cos(t), p[1] + 4.6 * Math.sin(t) * Math.cos(a), p[2] + 4.6 * Math.sin(t) * Math.sin(a))); }
    el.coil.setAttribute("d", open(coil));
    el.house.setAttribute("d", rod(X(0, 44 - c), X(0, top), 5.5));
    el.peg.setAttribute("d", rod(X(-18, 50 - c), X(18, 50 - c), 2.6));
    el.bar.setAttribute("d", rod(X(0, top - 2), X(0, top + 4), 3));
    el.grip.setAttribute("d", rod(X(-32, top + 6), X(32, top + 6), 3));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();
  const box = ext.map((p) => P(...p));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  function onMove(p) { if (!inside(p)) return onLeave(); sp.t = 1; read.textContent = "hop"; B.wake(); }
  function onLeave() { sp.t = 0; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: onMove, leave: onLeave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { hop = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pinwheel2",
  means: "A pogo stick leaning on a squeezed spring: the pointer springs it upright and up off the ground.",
  rules: [1, 3, 5, 8],
  range: [8, 18, 24],
  tour: [[196, 174], [182, 268], [224, 56], null],
  mount,
});
