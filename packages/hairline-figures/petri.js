/**
 * Petri dishes: six shallow dishes on a lab tray, each with colonies growing
 * in it and a clear lid on top. The pointer picks a dish by where it stands
 * on the tray: its lid lifts off to show the culture, and the dishes beside
 * it crack their lids a little, staggered from it. At rest one lid is raised,
 * bright. The slider is the stagger.
 *
 * The pattern: a grid on the ground, picked by world position.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const CX = 3, CY = 2, STEP = 38, R = 16, TZ = 3, DH = 4, LIFT = 18, FAV = 4;
const W = CX * STEP, H = CY * STEP;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const COL = [[[-6, -3], [4, 5], [5, -6]], [[0, 0], [-7, 4]], [[-5, -5], [6, 2], [-2, 7], [2, -2]], [[3, 4], [-6, 0]], [[-4, 4], [5, -4], [0, 0], [6, 5]], [[-3, -6], [4, 3]]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [W + 4, H + 4, 0], [W + 4, -4, 0], [-4, H + 4, 0], [STEP / 2, STEP / 2, TZ + DH + LIFT + 3]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, W + 4, H + 4, 7, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [], order = [];
  for (let j = 0; j < CY; j++) for (let i = 0; i < CX; i++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  for (const [i, j] of order) {
    const k = j * CX + i, x = STEP / 2 + i * STEP, y = STEP / 2 + j * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, y, R), disc(x, y, R - 1.5), TZ, TZ + DH));
    for (const [u, v] of COL[k]) place(flatDot(grp, C, 1.6, "dot off"), P(x + u, y + v, TZ + 1));
    const lid = solid(grp);
    items[k] = { k, i, j, x, y, lid, z: tween(k === FAV ? LIFT * 0.8 : 0), last: NaN };
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = TZ + DH - 1 + lift;
    put(it.lid, prism(P, front, disc(it.x, it.y, R + 1), disc(it.x, it.y, R - 0.5), z0, z0 + 2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, TZ + DH);
    let best = -1, bd = R + 4;
    items.forEach((it) => { const d = Math.hypot(wx - it.x, wy - it.y); if (d < bd) { bd = d; best = it.k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const fi = from % CX, fj = Math.floor(from / CX);
    items.forEach((it) => {
      const dd = a < 0 ? 0 : Math.max(Math.abs(it.i - (a % CX)), Math.abs(it.j - Math.floor(a / CX)));
      const z = a < 0 ? (it.k === FAV ? LIFT * 0.8 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(it.z, z, now, from < 0 ? 0 : (Math.abs(it.i - fi) + Math.abs(it.j - fj)) * stag);
      it.lid.sil.classList.toggle("hi", it.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "dish " + (a % CX + 1) + "·" + (Math.floor(a / CX) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "petri",
  means: "Six petri dishes on a tray: the lid under the pointer lifts off to show the colonies, and the lids beside it crack open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[172, 126], [117, 154], [228, 209], null],
  mount,
});
