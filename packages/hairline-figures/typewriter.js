/**
 * Typewriter: a tapered body with a sloping bank of keys in front and, on
 * top, the carriage: a rail, the platen roller with its knobs, a sheet of
 * paper and the return lever. The pointer over the typewriter slides the
 * whole carriage along, as it travels while typing; leaving returns it. At
 * rest the platen is bright. The slider is how far the carriage travels.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, lerp, open, poly, prism, proj, rings, rrect, ringAt, run, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const REST = -6, PX = 14, PZ = 28, R = 7, HALF = 46;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [64, 80, 0], [0, 80, 0], [64, 0, 0], [2, 40 - 22 + REST, 62], [PX, 40 + 32 + HALF + 4, PZ - R], [30, 40 + REST - 56, 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the body, narrower at its top, then the bank of keys before it
  put(solid(g), { sil: poly(hull(ringAt(P, rrect(0, 0, 50, 80, 8, 4), 0).concat(ringAt(P, rrect(4, 5, 42, 75, 6, 4), 20)))), crease: open(ringAt(P, run(rrect(5.5, 6.5, 40.5, 73.5, 4.5, 4), front), 20)) });
  put(solid(g), prism(P, front, ...rings(42, 4, 64, 76, 5, 1.6), 0, 9));
  for (const x of [47, 53, 59]) for (let y = 11; y <= 69; y += 7.2) place(mk("circle", { r: 1.7, class: "dot off" }, g), P(x, y + (x === 53 ? 2 : 0), 9));

  // the carriage, redrawn as it slides
  const carr = mk("g", {}, g);
  const rail = solid(carr), paper = mk("path", { class: "" }, carr), platen = solid(carr), cap = mk("path", { class: "nf lo" }, carr);
  const knobA = mk("path", { class: "nf" }, carr), knobB = mk("path", { class: "nf" }, carr), lever = mk("path", { class: "nf" }, carr);
  platen.sil.classList.add("hi");
  const circle = (r, y) => { const pts = []; for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(P(PX + r * Math.cos(t), y, PZ + r * Math.sin(t))); } return pts; };
  const cyl = (r, y0, y1) => poly(hull(circle(r, y0).concat(circle(r, y1))));
  const off = tween(REST);
  let last = NaN;
  function draw(s) {
    if (Math.abs(s - last) < 0.01) return;
    last = s;
    const cy = 40 + s;
    put(rail, prism(P, front, ...rings(6, cy - HALF + 2, 22, cy + HALF - 2, 3, 1), 20, 22));
    paper.setAttribute("d", poly(fillet([P(11, cy - 22, PZ + 4), P(11, cy + 22, PZ + 4), P(2, cy + 22, 62), P(2, cy - 22, 62)], [1, 1, 1, 1])));
    knobA.setAttribute("d", cyl(4.5, cy - HALF - 5, cy - HALF));
    put(platen, { sil: cyl(R, cy - HALF, cy + HALF), crease: poly(circle(R - 1.2, cy + HALF)) });
    knobB.setAttribute("d", cyl(4.5, cy + HALF, cy + HALF + 5));
    cap.setAttribute("d", poly(circle(3.4, cy + HALF + 5)));
    lever.setAttribute("d", open([P(PX + 2, cy - HALF + 4, PZ + 7), P(24, cy - HALF - 2, PZ + 8), P(32, cy - HALF - 10, PZ + 6)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(off, now)); return !tdone(off, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(off, on ? max : REST, performance.now(), 0);
    read.textContent = on ? "col " + Math.round(max) : "rest";
    B.wake();
  }
  setOn(false);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setOn(clamp(x, -40, 70) === x && clamp(y, -30, 110) === y);
  }
  bag.add(pointer(stage, { move, leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "typewriter",
  means: "A typewriter: the pointer over it slides the carriage, platen, paper and lever, along the top; leaving returns it.",
  rules: [1, 3, 5, 8],
  range: [14, 24, 32],
  tour: [[148, 215], [203, 137], [251, 215], null],
  mount,
});
