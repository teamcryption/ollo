/**
 * Card shuffler: a box with two half-decks waiting in its top trays, a crank
 * on a post between them and a drawer at the front. The pointer on the
 * shuffler turns the crank: the half-decks sink as their cards drop, and the
 * drawer slides out holding the shuffled stack. At rest the crank sits a
 * quarter turn round, bright. The slider is how far the crank is turned.
 *
 * The pattern: one object, one gesture (cloches).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, clamp, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 60, BY = 36, BZ = 20, PX = 30, PY = 18, PZ = 40, ARM = 15;
const DECKS = [[4, 7, 26, 29, 12], [34, 7, 56, 29, 10]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [BX, 0, 0], [0, BY + 26, 0], [BX, BY + 26, 0], [PX, PY, PZ + 8], [PX + ARM, PY - ARM, PZ + 8], [PX - ARM, PY + ARM, PZ + 8]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, z0, z1, r = 2.5, b = 1.4) => { const s = solid(parent); const [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };

  // the drawer sits under the body's front face, so it is painted after it
  box(g, 0, 0, BX, BY, 0, BZ, 4, 1.8);
  for (const [x0, y0, x1, y1] of DECKS) box(g, x0 - 1.5, y0 - 1.5, x1 + 1.5, y1 + 1.5, BZ, BZ + 1.6, 2, 0.8);

  const deckG = DECKS.map(() => mk("g", {}, g));
  const post = mk("g", {}, g);
  box(post, PX - 2.6, PY - 2.6, PX + 2.6, PY + 2.6, BZ, PZ, 2.6, 1);
  g.insertBefore(post, deckG[1]);
  const arm = mk("path", { class: "sil" }, g), knob = mk("path", { class: "sil" }, g);
  const drawer = mk("g", {}, g);

  const st = { turn: tween(0), out: tween(0) };
  let last = "";
  function cyl(cx, cy, r, z0, z1) {
    const pts = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; pts.push(P(cx + r * Math.cos(t), cy + r * Math.sin(t), z0), P(cx + r * Math.cos(t), cy + r * Math.sin(t), z1)); }
    return poly(hull(pts));
  }
  function draw(t, o) {
    const key = t.toFixed(3) + "," + o.toFixed(3);
    if (key === last) return;
    last = key;
    // the half-decks sink as the crank turns
    DECKS.forEach(([x0, y0, x1, y1, h], k) => {
      const gk = deckG[k], top = BZ + 1.6 + Math.max(1.2, h * (1 - 0.85 * t));
      gk.replaceChildren();
      const [rg, ri] = rings(x0, y0, x1, y1, 1.6, 1);
      put(solid(gk), prism(P, front, rg, ri, BZ + 1.6, top));
      for (let z = BZ + 4; z < top - 1.5; z += 3) mk("path", { class: "nf lo", d: open(ringAt(P, run(rg, front), z)) }, gk);
    });
    // the crank: an arm from the post to a knob
    const a = rad(-75 + 300 * t), ex = PX + ARM * Math.cos(a), ey = PY + ARM * Math.sin(a);
    const pts = [];
    for (const [x, y] of [[PX, PY], [ex, ey]]) for (let i = 0; i < 12; i++) { const q = (i / 12) * Math.PI * 2; pts.push(P(x + 2.4 * Math.cos(q), y + 2.4 * Math.sin(q), PZ), P(x + 2.4 * Math.cos(q), y + 2.4 * Math.sin(q), PZ + 2.6)); }
    arm.setAttribute("d", poly(hull(pts)));
    knob.setAttribute("d", cyl(ex, ey, 2.2, PZ + 2.6, PZ + 9));
    // the drawer: floor, the shuffled stack, then its front plate
    drawer.replaceChildren();
    const d = 3 + 22 * o, y1 = BY + d;
    box(drawer, 8, BY - 1, 52, y1, 2, 3.4, 2, 0.8);
    const sh = 1 + 9 * t;
    const [cr, ci] = rings(14, BY, 46, Math.max(BY + 1.5, y1 - 2), 1.6, 0.7);
    if (d > 6) { put(solid(drawer), prism(P, front, cr, ci, 3.4, 3.4 + sh)); for (let z = 6; z < 3.4 + sh - 1.5; z += 3) mk("path", { class: "nf lo", d: open(ringAt(P, run(cr, front), z)) }, drawer); }
    box(drawer, 6, y1, 54, y1 + 2.4, 1.5, 13, 1.2, 0.6);
    const pull = mk("path", { class: "nf lo", d: open([P(24, y1 + 2.4, 8), P(36, y1 + 2.4, 8)]) }, drawer);
    pull.setAttribute("class", "nf");
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(st.turn, now), tval(st.out, now));
    return !(tdone(st.turn, now) && tdone(st.out, now));
  });
  bag.add(B.unregister);

  // hit test on the rest pose: the shuffler's screen box
  const sc = [[0, 0, 0], [BX, 0, 0], [0, BY + 6, 0], [BX, BY + 6, 0], [PX, PY, PZ + 9], [0, 0, BZ + 14], [BX, BY, BZ]].map((p) => P(...p));
  const xs = sc.map((p) => p[0]), ys = sc.map((p) => p[1]);
  const X0 = Math.min(...xs), X1 = Math.max(...xs), Y0 = Math.min(...ys) - 6, Y1 = Math.max(...ys);
  const hit = ([sx, sy]) => sx > X0 && sx < X1 && sy > Y0 && sy < Y1;

  let act = null;
  function apply() {
    const now = performance.now();
    tset(st.turn, act ? amp : 0.08, now, 0);
    tset(st.out, act ? amp : 0, now, act ? 140 : 0);
    B.wake();
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    arm.classList.toggle("hi", true);
    knob.classList.toggle("hi", true);
    read.textContent = a ? "crank" : "rest";
    apply();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 0.2, 1); if (act) apply(); }, destroy: bag.dispose };
}

hairline({
  name: "cardshuffler",
  means: "A card shuffler: the pointer turns its crank, the two half-decks sink into the box and the drawer slides out with the shuffled stack.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.9, 1],
  tour: [[228, 89], [253, 188], [170, 150], null],
  mount,
});
