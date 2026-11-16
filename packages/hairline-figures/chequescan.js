/**
 * Cheque scanner: a desk scanner with a slot in its top and a cheque
 * standing in the slot. At rest the cheque is fed half in, bright. The
 * pointer over the scanner slides the cheque up out of the slot so its
 * lines show. The slider is how far it comes out.
 *
 * The pattern: one part that answers (a single slide).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 70, BY = 44, BZ = 22, CX0 = 13, CX1 = 57, CY0 = 21, CY1 = 22.5, REST = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hmax = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [BX, BY, 0], [BX, 0, 0], [0, BY, 0], [CX0, CY0, BZ + 54], [CX1, CY1, BZ + 54]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  mk("path", { d: poly(ringAt(P, rings(CX0 - 2, CY0 - 1, CX1 + 2, CY1 + 1, 1.2, 0.4)[0], BZ)), class: "nf" }, g);
  mk("path", { d: seg(P(8, BY, 8), P(24, BY, 8)) + seg(P(BX, 8, 8), P(BX, 14, 8)), class: "nf lo" }, g);

  const cheque = mk("path", { class: "sil hi" }, g), lines = mk("path", { class: "nf lo" }, g);
  const h = tween(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const zt = BZ + v, pts = [];
    for (const x of [CX0, CX1]) for (const y of [CY0, CY1]) for (const z of [BZ, zt]) pts.push(P(x, y, z));
    cheque.setAttribute("d", poly(hull(pts)));
    const L = (x0, x1, z) => (z > BZ + 2 ? seg(P(x0, CY1, z), P(x1, CY1, z)) : "");
    lines.setAttribute("d", L(16, 38, zt - 5) + L(44, 54, zt - 4) + L(44, 54, zt - 9) + L(16, 54, zt - 13) + L(16, 30, zt - 21) + L(40, 54, zt - 21) + L(16, 54, zt - 28));
  }

  const B = register(stage, (_dt, now) => { draw(tval(h, now)); return !tdone(h, now); });
  bag.add(B.unregister);

  const box = [P(0, 0, 0), P(BX, 0, 0), P(0, BY, 0), P(BX, BY, 0), P(0, 0, BZ + REST), P(BX, BY, BZ)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs) - 6, Math.max(...xs) + 6, Math.min(...ys) - 6, Math.max(...ys) + 6];
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(h, v ? hmax : REST, performance.now(), 0);
    read.textContent = v ? "out" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > x0 && sx < x1 && sy > y0 && sy < y1), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { hmax = v; if (on) { tset(h, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "chequescan",
  means: "A cheque scanner with a cheque in its slot: the pointer over it slides the cheque up out of the slot.",
  rules: [1, 3, 5, 6],
  range: [34, 44, 54],
  tour: [[200, 144], [175, 127], [225, 235], null],
  mount,
});
