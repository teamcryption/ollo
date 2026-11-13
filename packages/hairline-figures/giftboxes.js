/**
 * Gift boxes: six wrapped boxes of different sizes on a rounded tray, each a
 * box under a deeper lid, tied with a ribbon across the lid and down the
 * sides. The pointer picks a box: its lid lifts off, and the lids of the
 * boxes beside it lift a little, staggered from it. At rest one lid sits
 * raised, bright. The slider is the stagger.
 *
 * The pattern: one of many on a grid; parts stand at different heights, so the
 * pick reads each box's rest top (rule 01).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, ringAt, run, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

// x0, y0, width, depth, height (box under its lid)
const BOXES = [[0, 0, 34, 30, 22], [42, 0, 26, 26, 30], [76, 2, 30, 24, 18], [2, 40, 28, 28, 26], [40, 36, 36, 32, 16], [86, 38, 22, 22, 34]];
const LID = 7, OV = 1.6, LIFT = 16, FAV = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, -8, -4], [116, 78, -4], [116, -8, -4], [-8, 78, -4], [44, 0, 34 + LID + LIFT + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-8, -8, 116, 78, 10, 2);
  put(solid(g), prism(P, front, tr, ti, -4, 0));

  // far to near by each box's nearest corner
  const order = BOXES.map((b, k) => k).sort((a, b) => BOXES[a][0] + BOXES[a][2] + BOXES[a][1] + BOXES[a][3] - (BOXES[b][0] + BOXES[b][2] + BOXES[b][1] + BOXES[b][3]));
  const boxes = [];
  for (const k of order) {
    const [x0, y0, w, d, h] = BOXES[k];
    const base = solid(g), band = mk("path", { class: "nf lo" }, base.g);
    const [br, bi] = rings(x0, y0, x0 + w, y0 + d, 2, 1);
    put(base, prism(P, front, br, bi, 0, h - LID + 2));
    // the ribbon down the two faces that show
    band.setAttribute("d", seg(P(x0 + w / 2, y0 + d, 1), P(x0 + w / 2, y0 + d, h - LID + 2)) + seg(P(x0 + w, y0 + d / 2, 1), P(x0 + w, y0 + d / 2, h - LID + 2)));
    const lid = solid(g), tie = mk("path", { class: "nf" }, lid.g);
    const [lr, li] = rings(x0 - OV, y0 - OV, x0 + w + OV, y0 + d + OV, 2.4, 1.2);
    boxes[k] = { k, x0, y0, w, d, h, lid, tie, lr, li, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN };
  }

  function draw(b, z) {
    if (z === b.last) return;
    b.last = z;
    const z0 = b.h - LID + z, z1 = b.h + z, cx = b.x0 + b.w / 2, cy = b.y0 + b.d / 2;
    put(b.lid, prism(P, front, b.lr, b.li, z0, z1));
    // the ribbon: a cross on the lid and a knot of two loops at its middle
    b.tie.setAttribute("d",
      seg(P(b.x0 - OV, cy, z1), P(b.x0 + b.w + OV, cy, z1)) + seg(P(cx, b.y0 - OV, z1), P(cx, b.y0 + b.d + OV, z1)) +
      seg(P(cx + OV + 1, b.y0 + b.d + OV, z0), P(cx + OV + 1, b.y0 + b.d + OV, z1)).replace(/^/, "") +
      open([P(cx, cy, z1), P(cx - 5, cy - 2, z1 + 3), P(cx - 6, cy + 2, z1 + 2), P(cx, cy, z1), P(cx + 4, cy + 4, z1 + 3), P(cx + 1, cy + 6, z1 + 2), P(cx, cy, z1)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boxes) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The nearest box whose rest top holds the point (each read on its own top's plane); -1 for none. */
  function hit([sx, sy]) {
    for (let n = order.length - 1; n >= 0; n--) {
      const b = boxes[order[n]], [x, y] = unproj(C, sx, sy, b.h);
      if (x > b.x0 - 3 && x < b.x0 + b.w + 3 && y > b.y0 - 3 && y < b.y0 + b.d + 3) return b.k;
    }
    for (let n = order.length - 1; n >= 0; n--) {
      const b = boxes[order[n]], [x, y] = unproj(C, sx, sy, 0);
      if (x > b.x0 && x < b.x0 + b.w && y > b.y0 && y < b.y0 + b.d) return b.k;
    }
    return -1;
  }

  let act = -2;
  const dist = (a, b) => Math.hypot(BOXES[a][0] + BOXES[a][2] / 2 - BOXES[b][0] - BOXES[b][2] / 2, BOXES[a][1] + BOXES[a][3] / 2 - BOXES[b][1] - BOXES[b][3] / 2) / 40;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const b of boxes) {
      const z = a < 0 ? (b.k === FAV ? LIFT * 0.7 : 0) : b.k === a ? LIFT : Math.max(0, 6 - dist(a, b.k) * 4);
      tset(b.z, z, now, from < 0 ? 0 : dist(from, b.k) * stag);
      b.lid.sil.classList.toggle("hi", b.k === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "giftboxes",
  means: "Six wrapped gift boxes: the lid of the one under the pointer lifts off, and the lids nearby lift a little.",
  rules: [1, 2, 5, 9],
  range: [0, 45, 90],
  tour: [[178, 124], [184, 180], [236, 175], null],
  mount,
});
