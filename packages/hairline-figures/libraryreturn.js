/**
 * Book return: a library drop box with a capped top, a service door on its
 * side and a slot in its front, a book half pushed into the slot. The
 * pointer coming toward the slot pushes the book in; drawing back lets it
 * slide out again. At rest the book sticks out and the slot is bright.
 * The slider is how far out the book rests.
 *
 * The pattern: one part following the pointer along one axis.
 */
const {
  Cam, clamp, fillet, fit, facing, flatDot, place, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 70, BY = 50, BZ = 92, L = 64, BK0 = 14, BK1 = 56, Z0 = 60, Z1 = 71;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restOut = value / 100;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-4, -4, BZ + 7], [BX + 4, BY + 4, 0], [BX + 4, -4, 0], [-4, BY + L, 0], [BK0, BY + L, Z1], [BK1, BY + L, Z0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [r0, i0] = rings(0, 0, BX, BY, 6, 2);
  put(solid(g), prism(P, front, r0, i0, 0, BZ));
  const [r1, i1] = rings(-4, -4, BX + 4, BY + 4, 7, 2);
  put(solid(g), prism(P, front, r1, i1, BZ, BZ + 7));
  // service door on the side face, and its lock
  mk("path", { d: poly(fillet([P(BX, 10, 12), P(BX, 40, 12), P(BX, 40, 52), P(BX, 10, 52)], [3, 3, 3, 3])), class: "nf lo" }, g);
  const lock = flatDot(g, C, 1.6, "dot off");
  place(lock, P(BX, 36, 34));
  // the slot, a frame on the front face
  const slot = mk("path", { d: poly(fillet([P(BK0 - 5, BY, Z0 - 3), P(BK1 + 5, BY, Z0 - 3), P(BK1 + 5, BY, Z1 + 3), P(BK0 - 5, BY, Z1 + 3)], [2, 2, 2, 2])), class: "sil" }, g);
  mk("path", { d: poly(fillet([P(BK0 - 2, BY, Z0 - 0.5), P(BK1 + 2, BY, Z0 - 0.5), P(BK1 + 2, BY, Z1 + 0.5), P(BK0 - 2, BY, Z1 + 0.5)], [1, 1, 1, 1])), class: "nf lo" }, g);
  const book = solid(g);
  const pages = mk("path", { class: "nf lo" }, g);

  const rest = () => 0.15 + 0.75 * clamp(restOut, 0, 1);
  const out = spring(rest());
  let last = NaN;
  function draw(o) {
    const r = Math.round(o * 200) / 200;
    if (r === last) return;
    last = r;
    const y1 = BY + Math.max(2.5, L * r);
    const [br, bi] = rings(BK0, BY, BK1, y1, 2, 1);
    put(book, prism(P, front, br, bi, Z0, Z1));
    pages.setAttribute("d", seg(P(BK1, BY, (Z0 + Z1) / 2), P(BK1, y1 - 2, (Z0 + Z1) / 2)) + seg(P(BK0 + 3, y1, Z0 + 1.5), P(BK1 - 2, y1, Z0 + 1.5)));
  }
  draw(out.x);

  const B = register(stage, (dt) => { const m = stepS(out, dt); draw(out.x); return m; });
  bag.add(B.unregister);

  // hit on the ground plane, which never moves: the strip in front of the slot
  let on = null;
  function setOn(v) {
    on = v;
    out.t = v == null ? rest() : v;
    read.textContent = v == null ? "rest" : "in " + Math.round((1 - v) * 100);
    book.sil.classList.toggle("hi", v != null);
    slot.setAttribute("class", v == null ? "sil hi" : "sil");
    B.wake();
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wx < -10 || wx > BX + 10 || wy < BY - 30 || wy > BY + L + 40) return setOn(null);
    setOn(clamp((wy - BY - 4) / (L + 16), 0.02, 1));
  }
  setOn(null);
  bag.add(pointer(stage, { move, leave: () => setOn(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restOut = v / 100; if (on == null) { out.t = rest(); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "libraryreturn",
  means: "A library book return: coming toward the slot pushes the book in, and drawing back lets it slide out again.",
  rules: [1, 3, 5, 8],
  range: [0, 55, 100],
  tour: [[126, 288], [170, 268], [203, 250], null],
  mount,
});
