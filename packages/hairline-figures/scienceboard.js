/**
 * Periodic blocks: element blocks set out on a tray in the table's stepped
 * shape, a tall column at each end and a gap in the top row. Each block has
 * a dot code on its top. The pointer picks a block by where it stands: it
 * lifts out of the tray, and the blocks around it rise a little, staggered
 * from it. At rest one block is raised, bright. The slider is the stagger.
 *
 * The pattern: one of many on a grid (terrain).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, unproj, tdone, tset, tval, tween, ringAt, rrect,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const ST = 17, BS = 14, BH = 9, CZ = 4, LIFT = 18, FAV = [2, 3];
const LAYOUT = [[0, 6], [0, 1, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6]];
const COLS = 7, ROWS = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  const X1 = COLS * ST + 4, Y1 = ROWS * ST + 4;
  fit(C, [[-4, -4, 0], [X1, Y1, 0], [X1, -4, 0], [-4, Y1, 0], [0, 0, CZ + BH + LIFT], [X1, 0, CZ + BH + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, X1, Y1, 5, 2);
  put(solid(g), prism(P, front, tr, ti, 0, CZ));
  const items = [];
  const cells = [];
  LAYOUT.forEach((cols, r) => cols.forEach((c) => cells.push([c, r])));
  cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  for (const [c, r] of cells) {
    const x0 = 2 + c * ST, y0 = 2 + r * ST, grp = mk("g", {}, g);
    const s = solid(grp);
    const [ring, inner] = rings(x0, y0, x0 + BS, y0 + BS, 2.2, 1.2);
    // dot code: one to three dots on the top, by the block's column
    const dots = [];
    for (let d = 0; d < 1 + ((c + r) % 3); d++) dots.push(flatDot(grp, C, 1.3, "dot off"));
    const id = r + "-" + c;
    const rest = r === FAV[0] && c === FAV[1] ? LIFT * 0.6 : 0;
    items.push({ c, r, x0, y0, grp, s, ring, inner, dots, rest, z: tween(rest), last: NaN });
  }
  function draw(it, z) {
    if (z === it.last) return;
    it.last = z;
    put(it.s, prism(P, front, it.ring, it.inner, CZ + z, CZ + z + BH));
    const n = it.dots.length;
    it.dots.forEach((d, k) => place(d, P(it.x0 + BS / 2 + (k - (n - 1) / 2) * 3.4, it.y0 + BS / 2, CZ + z + BH)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, CZ + BH);
    let best = -1, bd = Infinity;
    items.forEach((it, k) => {
      const dx = wx - (it.x0 + BS / 2), dy = wy - (it.y0 + BS / 2), d = Math.hypot(dx, dy);
      if (Math.abs(dx) < ST / 2 + 1 && Math.abs(dy) < ST / 2 + 1 && d < bd) { bd = d; best = k; }
    });
    return best;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? items[a] : act >= 0 ? items[act] : null;
    act = a;
    const sel = a >= 0 ? items[a] : null;
    items.forEach((it) => {
      const dd = sel ? Math.max(Math.abs(it.c - sel.c), Math.abs(it.r - sel.r)) : 0;
      const z = !sel ? it.rest : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from ? (Math.abs(it.c - from.c) + Math.abs(it.r - from.r)) * stag : 0);
      const on = sel ? it === sel : it.rest > 0;
      it.s.sil.classList.toggle("hi", on);
      it.dots.forEach((d) => d.setAttribute("class", on ? "dot" : "dot off"));
    });
    // the chosen block paints last, above its neighbours
    const top = sel || items.find((it) => it.rest > 0);
    g.append(top.grp);
    read.textContent = sel ? "el " + (sel.r + 1) + "·" + (sel.c + 1) : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "scienceboard",
  means: "Element blocks set out in the periodic table's stepped shape: the block under the pointer lifts out, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[147, 120], [279, 212], [253, 225], null],
  mount,
});
