/**
 * Ice tray: a tray of eight cubes in two rows. The pointer picks a cube by
 * the cell under it on the tray: the cube jumps out and tumbles, and the
 * cubes beside it loosen and tip a little, staggered by distance. At rest
 * one cube sits loose, tipped, bright. The slider is the stagger.
 *
 * The pattern: a grid on a plane, answering with a tumble.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, run, unproj, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 4, NY = 2, CELL = 17, H = 12, TZ = 5, FAV = 5, M = 4;
const W = NX * CELL + 2 * M, D = NY * CELL + 2 * M;
const sq = rrect(-6, -6, 6, 6, 2.2, 3), sqIn = rrect(-4.8, -4.8, 4.8, 4.8, 1.2, 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.25);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [M + 8, M + 8, TZ + H + 30], [W - 8, M + 8, TZ + H + 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, W, D, 5, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  for (let i = 1; i < NX; i++) mk("path", { d: open([P(M + i * CELL, M, TZ), P(M + i * CELL, D - M, TZ)]), class: "nf lo" }, g);
  mk("path", { d: open([P(M, M + CELL, TZ), P(W - M, M + CELL, TZ)]), class: "nf lo" }, g);

  const cells = [];
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) cells.push({ i, j, x: M + (i + 0.5) * CELL, y: M + (j + 0.5) * CELL });
  const order = cells.map((c, k) => k).sort((a, b) => cells[a].x + cells[a].y - cells[b].x - cells[b].y);
  const rest = (k) => (k === FAV ? [26, 6] : [((k * 7) % 5) - 2, 0]);
  const items = cells.map((c) => ({ ...c, a: tween(0), z: tween(0), last: "" }));
  for (const k of order) {
    const it = items[k], grp = mk("g", {}, g);
    it.sil = mk("path", { class: "sil" }, grp); it.cre = mk("path", { class: "nf lo" }, grp);
    const [a, z] = rest(k); it.a = tween(a); it.z = tween(z);
  }
  const frontIn = run(sqIn, front);

  function draw(it, a, lift) {
    const key = a.toFixed(2) + "," + lift.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const s = Math.sin(a * Math.PI / 180), c = Math.cos(a * Math.PI / 180), zc = TZ + lift + H / 2;
    // tumble about the cube's centre, around the tray's short axis
    const t = (u, v, z) => { const dz = z - H / 2; return P(it.x + u * c + dz * s, it.y + v, zc - u * s + dz * c); };
    const pts = [];
    for (const q of sq) pts.push(t(q.u, q.v, 0), t(q.u, q.v, H));
    it.sil.setAttribute("d", poly(hull(pts)));
    it.cre.setAttribute("d", open(frontIn.map((q) => t(q.u, q.v, H))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now), tval(it.z, now)); if (!tdone(it.a, now) || !tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TZ + H);
    const i = Math.floor((x - M) / CELL), j = Math.floor((y - M) / CELL);
    return i >= 0 && i < NX && j >= 0 && j < NY ? j * NX + i : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ai = a % NX, aj = Math.floor(a / NX);
    items.forEach((it, k) => {
      const dd = Math.max(Math.abs(it.i - ai), Math.abs(it.j - aj)), d = from < 0 ? 0 : Math.abs(k - from) * stag * 0.6;
      const [ra, rz] = rest(k);
      tset(it.a, a < 0 ? ra : dd === 0 ? 72 : dd === 1 ? 12 : ra, now, d);
      tset(it.z, a < 0 ? rz : dd === 0 ? 22 : dd === 1 ? 3 : 0, now, d);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cube " + (ai + 1) + "·" + (aj + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "icecubes",
  means: "An ice tray of eight cubes: the cube under the pointer jumps out and tumbles, and the cubes beside it loosen and tip.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[161, 135], [200, 155], [239, 214], null],
  mount,
});
