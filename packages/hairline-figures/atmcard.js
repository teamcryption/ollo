/**
 * Card reader: a flat payment terminal with a screen and a keypad, and a chip
 * card in front of its slot. When the pointer is over the reader the card
 * slides into the slot chip first and the screen takes the bright. At rest
 * the card waits just out of the slot, bright. The slider is how deep it goes.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 42, Y1 = 66, Z1 = 10, SZ = 4.5, CX0 = 7, CX1 = 35, CL = 46, REST = Y1 + 9;
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let depth = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, 0, 0], [X1, 0, 0], [0, REST + CL, 0], [X1, REST + CL, 0], [0, 0, Z1], [X1, 0, Z1]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [br, bi] = rings(0, 0, X1, Y1, 7, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, Z1));
  const screen = mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(6, 6, X1 - 6, 26, 2.5, 4), Z1)) }, g);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) {
    const x = 11 + c * 10, y = 33 + r * 7.5;
    mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(x - 3.2, y - 2.2, x + 3.2, y + 2.2, 1.2, 3), Z1)) }, g);
  }
  // the slot on the near end
  mk("path", { class: "nf", d: seg(P(CX0 - 1, Y1, SZ), P(CX1 + 1, Y1, SZ)) }, g);

  // the card: only the part outside the slot is drawn
  const card = solid(g), chip = mk("path", { class: "nf lo" }, g);
  const cy = tween(REST);
  let last = NaN;
  function draw(y0) {
    if (y0 === last) return;
    last = y0;
    const a = Math.max(y0, Y1), b = y0 + CL;
    const ring = rrect(CX0, a, CX1, b, a > y0 ? 0.3 : 2.5, 4), inner = rrect(CX0 + 2, a + (a > y0 ? 0 : 2), CX1 - 2, b - 2, 1.5, 4);
    put(card, { sil: poly(hull(ringAt(P, ring, SZ - 0.5).concat(ringAt(P, ring, SZ + 0.5)))), crease: poly(ringAt(P, inner, SZ + 0.5)) });
    const c0 = y0 + 6, c1 = y0 + 14;
    chip.setAttribute("d", c0 >= Y1 ? poly(ringAt(P, rrect(CX1 - 13, c0, CX1 - 5, c1, 1.4, 3), SZ + 0.5)) + seg(P(CX1 - 9, c0, SZ + 0.5), P(CX1 - 9, c1, SZ + 0.5)) : "");
  }

  const B = register(stage, (_dt, now) => { draw(tval(cy, now)); return !tdone(cy, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z1);
    return x > -10 && x < X1 + 10 && y > -10 && y < REST + CL;
  }

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(cy, on ? Y1 - CL * depth : REST, performance.now(), 0);
    card.sil.classList.toggle("hi", !on);
    screen.classList.toggle("hi", on);
    screen.classList.toggle("lo", !on);
    read.textContent = on ? "chip in" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { depth = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "atmcard",
  means: "A card reader with a chip card at its slot: over the reader the card slides in chip first and the screen lights.",
  rules: [1, 4, 5, 6],
  range: [0.3, 0.6, 0.75],
  tour: [[250, 133], [200, 160], [150, 190], null],
  mount,
});
