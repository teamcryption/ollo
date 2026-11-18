/**
 * Fortune teller: a fairground fortune machine, a cabinet with a glass case
 * on top holding a turbaned teller over a crystal ball. Over the machine the
 * teller leans down to the ball and a fortune card slides out of the slot in
 * the cabinet. At rest the card peeks out, bright. The slider is how far the
 * card comes out (and how far the teller leans).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const W = 44, D = 34, Z1 = 44, Z2 = 90, BX = 22, BY = 13;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + 44, 0], [0, 0, Z2 + 8], [W, D, Z2 + 8]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 2, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, Z1));
  // front panel and the card slot
  mk("path", { d: poly([P(6, D, 8), P(W - 6, D, 8), P(W - 6, D, 20), P(6, D, 20)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(13, D, 25), P(31, D, 25), P(31, D, 28), P(13, D, 28)]), class: "nf" }, g);
  // the glass case: back edges, then the teller, then the front edges
  const E = (a, b) => seg(P(...a), P(...b));
  const x0 = 2, x1 = W - 2, y0 = 2, y1 = D - 2;
  mk("path", { d: E([x0, y0, Z1], [x0, y0, Z2]) + E([x1, y0, Z1], [x1, y0, Z2]) + E([x0, y1, Z1], [x0, y1, Z2]) + E([x0, y0, Z1], [x1, y0, Z1]) + E([x0, y0, Z1], [x0, y1, Z1]), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(BX, BY, 10), disc(BX, BY, 8.5), Z1, Z1 + 3));
  const body = mk("path", {}, g), head = mk("path", {}, g), turban = mk("path", {}, g), gem = mk("path", { class: "nf" }, g);
  // crystal ball on its stand
  put(solid(g), prism(P, front, disc(BX, 25, 3.5), disc(BX, 25, 2.5), Z1, Z1 + 4));
  const bc = P(BX, 25, Z1 + 9);
  mk("ellipse", { cx: bc[0], cy: bc[1], rx: 5.5 * C.S, ry: 5.5 * C.S }, g);
  mk("path", { d: E([x1, y1, Z1], [x1, y1, Z2]) + E([x0, y1, Z1], [x1, y1, Z1]) + E([x1, y0, Z1], [x1, y1, Z1]), class: "nf lo" }, g);
  // cap on the case
  const [cr, ci] = rings(-2, -2, W + 2, D + 2, 3, 1.4);
  put(solid(g), prism(P, front, cr, ci, Z2, Z2 + 6));
  // the card
  const card = mk("path", { class: "sil hi" }, g), lines = mk("path", { class: "nf lo" }, g);
  const tw = tween(0);
  let last = NaN;
  const rot = (dz, a) => [BY + dz * Math.sin(a), Z1 + 3 + dz * Math.cos(a)];
  function draw(t) {
    if (t === last) return;
    last = t;
    const out = 5 + t * amax, a = rad(t * (14 + amax * 0.7));
    const cz = (y) => 26.5 - (y - D) * 0.12;
    const cp = (x, y) => P(x, y, cz(y));
    card.setAttribute("d", poly([cp(14, D), cp(30, D), cp(30, D + out), cp(14, D + out)]));
    lines.setAttribute("d", [0.25, 0.4, 0.55, 0.7, 0.85].filter((s) => out > 12).map((s) => seg(cp(17, D + out * s), cp(27, D + out * s))).join(""));
    const [sy, sz] = rot(20, a), [hy, hz] = rot(29, a), [ty, tz] = rot(33.5, a);
    body.setAttribute("d", poly(hull(ringAt(P, disc(BX, BY, 8), Z1 + 3).concat(ringAt(P, disc(BX, sy, 6), sz)))));
    const hc = P(BX, hy, hz);
    head.setAttribute("d", `M${hc[0] - 5 * C.S},${hc[1]}a${5 * C.S},${5 * C.S} 0 1,0 ${10 * C.S},0a${5 * C.S},${5 * C.S} 0 1,0 ${-10 * C.S},0Z`);
    turban.setAttribute("d", poly(hull(ringAt(P, disc(BX, ty, 6), tz - 1.5).concat(ringAt(P, disc(BX, ty, 3), tz + 4)))));
    const gp = P(BX, ty + 5.5, tz);
    gem.setAttribute("d", poly([[gp[0], gp[1] - 3], [gp[0] + 2, gp[1]], [gp[0], gp[1] + 3], [gp[0] - 2, gp[1]]]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const box = hull([[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0], [0, 0, Z2 + 6], [W, 0, Z2 + 6], [0, D, Z2 + 6], [W, D, Z2 + 6]].map((q) => P(...q)));
  const inside = ([x, y]) => {
    let c = false;
    for (let i = 0, j = box.length - 1; i < box.length; j = i++) {
      const [xi, yi] = box[i], [xj, yj] = box[j];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  let on = null;
  function setOn(v, force) {
    if (v === on && !force) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "card" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "fortuneteller",
  means: "A fortune teller machine: over it, the teller leans to the crystal ball and a fortune card slides out of the slot.",
  rules: [1, 3, 5, 6],
  range: [10, 34, 38],
  tour: [[209, 194], [226, 150], [200, 122], null],
  mount,
});
