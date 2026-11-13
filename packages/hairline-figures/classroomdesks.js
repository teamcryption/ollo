/**
 * Classroomdesks: a classroom of six lift-top desks in two rows of three,
 * each a box on four legs with a lid hinged at its back edge and a chair
 * pulled up to it. The pointer picks a desk by where it stands on the floor:
 * its lid lifts open, and the lids of the desks around it lift a little,
 * staggered by distance. At rest the chairs stand at uneven distances and
 * one lid is up, bright. The slider is the stagger.
 *
 * The pattern: a grid on the ground (terrain); the hit is the pointer on the
 * plane of the closed lids.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rad, rings, rrect, hull, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 3, ROWS = 2, SX = 40, SY = 46, DW = 26, DD = 18, Z0 = 20, Z1 = 28, T = 1.6, FAV = 4;
const REST = [5, 0, 0, 0, 44, 9], PUSH = [0, 5, -2, 3, 0, 7];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const XM = (COLS - 1) * SX + DW, YM = (ROWS - 1) * SY + DD + 24;
  fit(C, [[0, 0, 0], [XM, YM, 0], [XM, 0, 0], [0, YM, 0], [0, 0, Z1 + DD], [XM, SY, Z1 + DD]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const line = (a, b) => "M" + P(...a).join(",") + "L" + P(...b).join(",");

  const items = [], desks = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const k = r * COLS + c, x0 = c * SX, y0 = r * SY, cy = y0 + DD + 5 + PUSH[k];
    items.push({ key: x0 + y0 + 22, fn: () => {
      const grp = mk("g", {}, g);
      let legs = "";
      for (const [x, y] of [[x0 + 2, y0 + 2], [x0 + DW - 2, y0 + 2], [x0 + 2, y0 + DD - 2], [x0 + DW - 2, y0 + DD - 2]]) legs += line([x, y, 0], [x, y, Z0]);
      mk("path", { class: "nf sil", d: legs }, grp);
      const [br, bi] = rings(x0, y0, x0 + DW, y0 + DD, 2, 1.2);
      put(solid(grp), prism(P, front, br, bi, Z0, Z1));
      desks[k] = { k, r, c, x0, y0, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), th: tween(REST[k]), last: NaN };
    } });
    items.push({ key: x0 + cy + 30, fn: () => {
      const grp = mk("g", {}, g), a = x0 + 6, b = x0 + DW - 6, y1 = cy + 12;
      mk("path", { class: "nf sil", d: line([a + 1, cy + 1, 0], [a + 1, cy + 1, 13]) + line([b - 1, cy + 1, 0], [b - 1, cy + 1, 13]) + line([a + 1, y1 - 1, 0], [a + 1, y1 - 1, 13]) + line([b - 1, y1 - 1, 0], [b - 1, y1 - 1, 13]) }, grp);
      const [sr, si] = rings(a, cy, b, y1, 1.6, 0.7);
      put(solid(grp), prism(P, front, sr, si, 13, 14.8));
      mk("path", { class: "nf sil", d: line([a + 1.5, y1 - 0.8, 14.8], [a + 1.5, y1 - 0.8, 19]) + line([b - 1.5, y1 - 0.8, 14.8], [b - 1.5, y1 - 0.8, 19]) }, grp);
      const [rr, ri] = rings(a, y1 - 1.6, b, y1, 0.7, 0.3);
      put(solid(grp), prism(P, front, rr, ri, 19, 27));
    } });
  }
  items.sort((p, q) => p.key - q.key).forEach((it) => it.fn());

  // the lid: u along x, v from the hinge at the back edge, w through its thickness
  function draw(d, deg) {
    if (deg === d.last) return;
    d.last = deg;
    const th = rad(deg), at = (s, w) => P(s.u, d.y0 + s.v * Math.cos(th) - w * Math.sin(th), Z1 + s.v * Math.sin(th) + w * Math.cos(th));
    const ring = rrect(d.x0 - 0.6, 0, d.x0 + DW + 0.6, DD + 0.8, 2.2, 4);
    d.sil.setAttribute("d", poly(hull(ring.map((s) => at(s, 0)).concat(ring.map((s) => at(s, T))))));
    const up = -0.61 * Math.sin(th) + 0.5 * Math.cos(th) > 0;
    d.cr.setAttribute("d", deg < 1 ? open(ring.filter((s) => s.v > DD - 1).map((s) => at(s, T))) : poly(rrect(d.x0 + 1.4, 1.4, d.x0 + DW - 1.4, DD - 0.6, 1.2, 4).map((s) => at(s, up ? T : 0))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of desks) { draw(d, tval(d.th, now)); if (!tdone(d.th, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z1);
    const c = clamp(Math.round((x - DW / 2) / SX), 0, COLS - 1), r = clamp(Math.round((y - DD / 2 - 8) / SY), 0, ROWS - 1);
    const dx = x - c * SX, dy = y - r * SY;
    return dx > -6 && dx < DW + 6 && dy > -6 && dy < DD + 24 ? r * COLS + c : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    desks.forEach((d, k) => {
      const ar = Math.floor(a / COLS), ac = a % COLS, dist = Math.abs(d.r - ar) + Math.abs(d.c - ac);
      const fr = Math.floor(from / COLS), fc = from % COLS;
      tset(d.th, a < 0 ? REST[k] : dist === 0 ? 72 : dist === 1 ? 14 : 5, now, from < 0 ? 0 : (Math.abs(d.r - fr) + Math.abs(d.c - fc)) * stag);
      d.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "desk " + (Math.floor(a / COLS) + 1) + "·" + ((a % COLS) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "classroomdesks",
  means: "A classroom of six lift-top desks: the lid of the desk under the pointer lifts open, the lids around it lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[150, 120], [200, 140], [250, 160], null],
  mount,
});
