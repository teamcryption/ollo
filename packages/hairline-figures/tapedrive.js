/**
 * Tape drive: a desktop drive, a rounded box with a slot and an activity light
 * on its front, and a tape cartridge in the slot. The pointer over the drive
 * slides the cartridge out toward the hand; at rest it sticks out a little,
 * bright. The slider is how far it ejects.
 */
const {
  Cam, fillet, fit, flatDot, place, poly, prism, proj, rings, rrect, seg, unproj, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 50, H = 26, CX0 = 9, CX1 = 55, CZ0 = 7, CZ1 = 19, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxO = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[0, 0, 0], [W, D + 60, 0], [W, 0, 0], [0, D + 60, 0], [0, 0, H], [W, 0, H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(0, 0, W, D, 6, 1.6);
  const body = solid(g);
  put(body, prism(P, front, r0, i0, 0, H));
  const slot = fillet([[CX0 - 2, CZ0 - 1.5], [CX1 + 2, CZ0 - 1.5], [CX1 + 2, CZ1 + 1.5], [CX0 - 2, CZ1 + 1.5]], [2, 2, 2, 2], 4).map(([x, z]) => P(x, D, z));
  mk("path", { class: "nf lo", d: poly(slot) + seg(P(10, 0, H), P(10, D, H)) }, body.g);
  place(flatDot(body.g, C, 1.6, "dot m"), P(W - 5, D, H - 4));

  const cart = solid(g);
  cart.sil.classList.add("hi");
  const out = tween(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const [r, i] = rings(CX0, D - 1, CX1, D + o, 2.5, 1.4);
    put(cart, prism(P, front, r, i, CZ0, CZ1));
  }
  const notch = mk("path", { class: "nf lo" }, cart.g);
  function drawNotch(o) {
    notch.setAttribute("d", o > 10 ? poly(rrect(CX0 + 8, D + o - 9, CX1 - 8, D + o - 4, 1.5, 3).map((q) => P(q.u, q.v, CZ1))) : "");
  }

  const B = register(stage, (_dt, now) => { const o = tval(out, now); draw(o); drawNotch(o); return !tdone(out, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    return x > -6 && x < W + 6 && y > -6 && y < D + 6 ? 1 : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(out, a < 0 ? REST : maxO, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "eject";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxO = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "tapedrive",
  means: "A desktop tape drive: the pointer over it slides the tape cartridge out of the front slot toward the hand.",
  rules: [1, 5, 6, 8],
  range: [30, 46, 60],
  tour: [[258, 108], [236, 84], [272, 150], null],
  mount,
});
