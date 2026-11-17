/**
 * Gnocchi board: a flat wooden paddle ridged across its face, with a round
 * handle at one end. The pointer over it lifts the handle and tips the board
 * up on its far edge, as a cook holds it to roll a gnocchi down the ridges;
 * at rest it lies nearly flat, its handle bright. The hit is a fixed screen
 * box, so it never moves with the drawing.
 */
const {
  Cam, fit, hull, poly, proj, rad, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const Y1 = 34, Y0 = -34, HL0 = -62, W = 22, T = 3.5, REST = 7, TILT = 48;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.7);
  const rot = (th) => { const c = Math.cos(th), s = Math.sin(th); return (x, y, z) => [x, Y1 + (y - Y1) * c + z * s, -(y - Y1) * s + z * c]; };
  const ext = [];
  for (const th of [0, rad(TILT)]) { const f = rot(th); for (const x of [-W, W]) for (const y of [HL0 - 2, Y1]) for (const z of [0, T]) ext.push(f(x, y, z)); }
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const grip = mk("path", { class: "sil hi" }, g), gripEnd = mk("path", { class: "nf" }, g);
  const board = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), ridges = mk("path", { class: "nf lo" }, g);
  const ring = rrect(-W, Y0, W, Y1, 6, 4), inner = rrect(-W + 1.6, Y0 + 1.6, W - 1.6, Y1 - 1.6, 4.4, 4);
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const f = rot(rad(REST + v * (TILT - REST) * amt)), Q = (x, y, z) => P(...f(x, y, z));
    const at = (r, z) => r.map((q) => Q(q.u, q.v, z));
    board.setAttribute("d", poly(hull(at(ring, 0).concat(at(ring, T)))));
    face.setAttribute("d", poly(at(inner, T)));
    let d = "";
    for (let y = Y0 + 5; y < Y1 - 3; y += 3.6) d += seg(Q(-W + 4, y, T), Q(W - 4, y, T));
    ridges.setAttribute("d", d);
    const a = [], b = [];
    for (let i = 0; i < 24; i++) { const q = (i / 24) * Math.PI * 2, x = 4 * Math.cos(q), z = T / 2 + 4 * Math.sin(q); a.push(Q(x, Y0 + 2, z)); b.push(Q(x, HL0, z)); }
    grip.setAttribute("d", poly(hull(a.concat(b))));
    gripEnd.setAttribute("d", poly(b));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "tip" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 140 && Math.abs(sy - 166) < 145), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "gnocchi",
  means: "A ridged gnocchi board with a round handle: the pointer lifts the handle and tips the board up on its far edge.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1],
  tour: [[174, 243], [250, 171], [151, 305], null],
  mount,
});
