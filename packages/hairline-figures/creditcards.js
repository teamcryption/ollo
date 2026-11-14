/**
 * Card reader: a terminal on the counter with a screen, a keypad and a slot
 * in its near face, a card half out of the slot. The pointer over the
 * terminal pushes the card home; the status light comes on and the card
 * gives up the bright. At rest the card stands out, bright. The slider is
 * how far the card goes in.
 *
 * The pattern: one discrete state, a slide (tween).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tset, tval, tdone, tween, unproj,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const W = 40, D = 70, H = 14, CL = 54, REST = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let deep = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + CL - REST + 2, 0], [W, D + CL - REST + 2, 0], [0, 0, H + 2], [W, 0, H + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const [sr, si] = rings(6, 6, W - 6, 30, 3, 1);
  put(solid(g), prism(P, front, sr, si, H, H + 1.2));
  const keys = [];
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const k = mk("circle", { r: 1.7, class: "dot off" }, g);
    place(k, P(11 + c * 9, 38 + r * 7.5, H));
    keys.push(k);
  }
  const lamp = mk("circle", { r: 2, class: "dot off" }, g);
  place(lamp, P(W - 6, 2.6 + 0.4, H));
  mk("path", { d: seg(P(5, D, 8), P(W - 5, D, 8)), class: "lo nf" }, g);
  const card = solid(g);

  let last = NaN;
  function draw(ins) {
    if (ins === last) return;
    last = ins;
    const [cr, ci] = rings(6, D - 1, W - 6, D + CL - ins, 2, 1.2);
    put(card, prism(P, front, cr, ci, 7, 8.4));
  }
  const slide = tween(REST);
  const B = register(stage, (_dt, now) => { draw(tval(slide, now)); return !tdone(slide, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const ins = on ? REST + (CL - REST - 10) * deep : REST;
    tset(slide, ins, performance.now(), 0);
    card.sil.classList.toggle("hi", !on);
    lamp.setAttribute("class", on ? "dot" : "dot off");
    read.textContent = on ? "chip " + Math.round(ins) : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 7);
    return x > -10 && x < W + 10 && y > -10 && y < D + CL - REST + 4;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { deep = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "creditcards",
  means: "A card reader with a card half out of its slot: the pointer over it pushes the card home and the status light comes on.",
  rules: [1, 4, 5, 8],
  range: [0.3, 1, 1],
  tour: [[235, 135], [125, 206], [272, 89], null],
  mount,
});
