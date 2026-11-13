/**
 * Garden tools: a shed wall of boards with a batten, six tools hanging on its
 * pegs (rake, spade, fork, hoe, shears, trowel), each a flat profile with its
 * thickness. The pointer picks a tool by where it hangs: it swings out toward
 * the reader and lifts off its peg, and its neighbours swing a little,
 * staggered from it. At rest one tool is swung out part way, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), hanging; the pick is the
 * tool whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fillet, fit, facing, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RZ = 84, WALL = RZ + 14, SWING = 34, LIFT = 7, FAV = 1, PY = 3;
const teeth = (cs, hw, d0, d1) => cs.flatMap((c) => [[c + hw, d0], [c + hw, d1], [c - hw, d1], [c - hw, d0]]);
const spread = (a, b, n) => Array.from({ length: n }, (_, i) => b - ((b - a) * i) / (n - 1));
const tgrip = (hw, d1, rest) => [[-5, -5], [5, -5], [5, -1.5], [hw, -1.5], [hw, d1], ...rest, [-hw, d1], [-hw, -1.5], [-5, -1.5]];
// each profile in its own plane: u across (centred on the peg), d down from the peg
const TOOLS = [
  { w: 22, p: [[-1.5, -5], [1.5, -5], [1.5, 60], [11, 60], ...teeth(spread(-10.2, 10.2, 6), 0.8, 64, 71), [-11, 60], [-1.5, 60]] },
  { w: 14, p: tgrip(1.5, 38, [[6, 40], [6.5, 58], [0, 63], [-6.5, 58], [-6, 40]]) },
  { w: 14, p: tgrip(1.5, 38, [[6, 39], [6, 43], ...teeth(spread(-4.8, 4.8, 4), 0.8, 43, 62), [-6, 43], [-6, 39]]) },
  { w: 16, p: [[-1.2, -5], [1.2, -5], [1.2, 60], [2.6, 64], [8, 64], [8, 70], [-8, 70], [-8, 64], [-2.6, 64], [-1.2, 60]] },
  { w: 12, p: [[-6, -4], [-3, -4], [0, 13], [3, -4], [6, -4], [2, 16], [2.6, 40], [0.6, 42], [0, 26], [-0.6, 42], [-2.6, 40], [-2, 16]] },
  { w: 10, p: [[-1.8, -4], [1.8, -4], [1.8, 12], [0.6, 12], [0.6, 15], [4.5, 16], [4, 26], [0, 33], [-4, 26], [-4.5, 16], [-0.6, 15], [-0.6, 12], [-1.8, 12]] },
];
const GAP = 7;
let cx = 8;
for (const t of TOOLS) { t.x = cx + t.w / 2; cx += t.w + GAP; t.len = Math.max(...t.p.map((q) => q[1])); t.p = fillet(t.p, t.p.map(() => 0.6)); }
const X1 = cx + 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  const tip = PY + 71 * Math.sin(rad(SWING));
  fit(C, [[-4, -4, -3], [X1 + 4, 34, -3], [X1 + 4, -4, -3], [-4, 34, -3], [-4, -4, WALL], [X1 + 4, -4, WALL], [12, tip, RZ + LIFT - 71 * Math.cos(rad(SWING))]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the floor, the wall of boards with its seams, the batten
  { const [r, i] = rings(-4, -4, X1 + 4, 34, 3, 1.2); put(solid(g), prism(P, front, r, i, -3, 0)); }
  const wall = solid(g);
  { const [r, i] = rings(-4, -4, X1 + 4, 0, 1.5, 0.8); put(wall, prism(P, front, r, i, 0, WALL)); }
  let seams = "";
  for (let x = 14; x < X1; x += 16) seams += seg(P(x, 0, 1), P(x, 0, WALL - 1));
  mk("path", { class: "nf lo", d: seams }, wall.g);
  { const [r, i] = rings(-3, 0, X1 + 3, 2.4, 1, 0.5); put(solid(g), prism(P, front, r, i, RZ - 3, RZ + 3)); }

  const tg = mk("g", {}, g);
  const tools = TOOLS.map((t, k) => {
    const grp = mk("g", {}, tg);
    const peg = mk("path", { class: "nf" }, grp);
    peg.setAttribute("d", seg(P(t.x, 2.4, RZ), P(t.x, 6, RZ)) + seg(P(t.x, 6, RZ), P(t.x, 6, RZ + 2.5)));
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    const pegTip = mk("path", { class: "nf", d: seg(P(t.x, PY + 0.5, RZ), P(t.x, 6, RZ)) + seg(P(t.x, 6, RZ), P(t.x, 6, RZ + 2.5)) }, grp);
    return { k, ...t, grp, back, face, pegTip, a: tween(k === FAV ? SWING * 0.45 : 0), z: tween(0), last: "" };
  });

  function draw(t, a, z) {
    const key = a.toFixed(2) + "," + z.toFixed(2);
    if (key === t.last) return;
    t.last = key;
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
    // swung about the peg's line (the x axis): down is (0, sa, -ca), the face's normal (0, ca, sa)
    const w = (u, d, off) => P(t.x + u, PY + d * sa + off * ca, RZ + z - d * ca + off * sa);
    t.face.setAttribute("d", poly(t.p.map(([u, d]) => w(u, d, 0))));
    t.back.setAttribute("d", poly(t.p.map(([u, d]) => w(u, d, -1.3))));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tools) { draw(t, tval(t.a, now), tval(t.z, now)); if (!tdone(t.a, now) || !tdone(t.z, now)) moving = true; }
    // the more a tool swings out, the nearer it is: paint it later
    const order = tools.slice().sort((p, q) => tval(p.a, now) - tval(q.a, now) || p.k - q.k);
    const key = order.map((t) => t.k).join();
    if (key !== painted) { painted = key; for (const t of order) tg.appendChild(t.grp); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = tools.map((t) => P(t.x, PY, RZ - t.len / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tools.forEach((t, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(t.a, a < 0 ? (k === FAV ? SWING * 0.45 : 0) : d === 0 ? SWING : d === 1 ? 9 : d === 2 ? 3 : 0, now, delay);
      tset(t.z, a === k ? LIFT : 0, now, delay);
      t.face.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tool " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gardentools",
  means: "Six garden tools on a shed wall: the one under the pointer swings out and lifts off its peg, its neighbours swing a little.",
  rules: [1, 2, 5, 10],
  range: [0, 40, 80],
  tour: [[148, 103], [210, 128], [292, 159], null],
  mount,
});
