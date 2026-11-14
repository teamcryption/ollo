/**
 * Laminator: a long low machine on a desk with a flat output tray in front.
 * The pointer's place along the tray is how far the sheet has fed out of the
 * front slot: it slides out on a spring and draws back as the pointer moves
 * toward the machine. At rest the sheet is part way out, bright.
 *
 * The pattern: one part following the pointer (continuous slide).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, clamp, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const BX = 92, BY = 34, BZ = 20, SZ = 7, TY = 98, LMAX = 60, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let soft = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-2, -2, 0], [BX + 2, -2, 0], [-2, TY + 2, 0], [BX + 2, TY + 2, 0], [0, 0, BZ + 2], [BX, 0, BZ + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, z0, z1, r, b, cls) => {
    const s = solid(parent);
    const [a, i] = rings(x0, y0, x1, y1, r, b);
    put(s, prism(P, front, a, i, z0, z1));
    if (cls) s.sil.setAttribute("class", cls);
    return s;
  };
  // the body, with its top feed slot and a vent seam on the front
  box(g, 0, 0, BX, BY, 0, BZ, 8, 2);
  mk("path", { class: "nf", d: poly([P(14, 9, BZ), P(BX - 14, 9, BZ), P(BX - 14, 12, BZ), P(14, 12, BZ)]) }, g);
  mk("path", { class: "nf lo", d: seg(P(10, BY, BZ - 5), P(BX - 10, BY, BZ - 5)) }, g);
  // the output slot, a dark line where the sheet comes through
  mk("path", { class: "nf", d: poly([P(10, BY, SZ - 1), P(BX - 10, BY, SZ - 1), P(BX - 10, BY, SZ + 2), P(10, BY, SZ + 2)]) }, g);
  const lamp = flatDot(g, C, 2.4, "dot m");
  place(lamp, P(BX - 8, 20, BZ));
  // the tray, low and thin, reaching out in front
  const tray = box(g, 10, BY - 2, BX - 10, TY, 0, 2.5, 4, 1.2);
  tray.cr.setAttribute("class", "lo nf");
  const sheetG = mk("g", {}, g);
  const sheet = solid(sheetG);
  const L = spring(REST);
  let last = NaN;

  function draw(len) {
    if (Math.abs(len - last) < 0.01) return;
    last = len;
    const y1 = BY + Math.max(len, 2);
    const [a, i] = rings(10, BY, BX - 10, y1, 3, 1);
    put(sheet, prism(P, front, a, i, SZ, SZ + 0.9));
  }

  const B = register(stage, (dt) => {
    const m = stepS(L, dt);
    draw(L.x);
    return m;
  });
  bag.add(B.unregister);

  let act = null;
  function set(len) {
    act = len;
    L.t = len == null ? REST : len;
    sheet.sil.classList.add("hi");
    read.textContent = len == null ? "rest" : Math.round((len / LMAX) * 100) + "%";
    B.wake();
  }
  set(null);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, SZ);
    if (x < -20 || x > BX + 20 || y < -10 || y > TY + 20) return set(null);
    set(clamp(Math.round(y - BY), 4, LMAX));
  }
  bag.add(pointer(stage, { move, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { soft = v; }, destroy: bag.dispose };
}

hairline({
  name: "laminator",
  means: "A laminator with a tray in front: the sheet feeds out of the slot as far as the pointer reaches along the tray.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[212, 165], [157, 193], [137, 203], null],
  mount,
});
