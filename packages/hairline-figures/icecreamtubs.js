/**
 * Ice cream tubs: a freezer counter holding eight tubs in two rows of four,
 * each a tapered tub under a domed lid, with a scoop lying on the counter
 * beside them. The pointer picks a tub: its lid lifts and tips back to show
 * the scooped mound inside, and the lids round it lift a little, staggered
 * from it. At rest one lid sits tipped open, bright. The slider is the stagger.
 *
 * The pattern: one of many on a grid; the pick reads each tub's rest lid top
 * (rule 01), nearest first.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, rrect, run, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 4, ROWS = 2, PITCH = 27, X0 = 15, Y0 = 15, R = 11.5, RF = 10, TH = 10, LR = 12.4;
const LIFT = 16, TIP = 0.3, FAV = [1, 2];
const CX0 = -4, CY0 = -4, CX1 = 128, CY1 = 61, CZ = -22;

/** A circle at (cx, cy), as a ring with enough sides to stay round on screen. */
const disc = (cx, cy, r, n = 10) => rrect(cx - r, cy - r, cx + r, cy + r, r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[CX0, CY0, CZ], [CX1, CY1, CZ], [CX1, CY0, 0], [CX0, CY1, CZ], [X0, Y0, TH + 5 + LIFT + 6]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the freezer cabinet, with the seam of its sliding door on the near face
  const [cr, ci] = rings(CX0, CY0, CX1, CY1, 6, 1.6);
  const cab = solid(g);
  put(cab, prism(P, front, cr, ci, CZ, 0));
  mk("path", { class: "nf lo", d: open([P(CX0 + 8, CY1, -6), P(CX1 - 6, CY1, -6)]) + open([P(CX1, CY1 - 6, -6), P(CX1, CY0 + 8, -6)]) }, cab.g);

  // the scoop: a round bowl and a handle, lying to the right of the tubs
  const [hr, hi] = rings(119, 22, 122.4, 43, 1.7, 0.6);
  put(solid(g), prism(P, front, hr, hi, 0, 2.2));
  const bowl = mk("path", { class: "sil" }, g);
  bowl.setAttribute("d", poly(hull([...disc(120.7, 47.5, 5.2).map((s) => P(s.u, s.v, 0)), ...disc(120.7, 47.5, 3.6).map((s) => P(s.u, s.v, 4))])));
  mk("path", { class: "nf lo", d: open(run(disc(120.7, 47.5, 3.6), front).map((s) => P(s.u, s.v, 4))) }, g);

  const tubs = [];
  for (let s = 0; s <= COLS + ROWS - 2; s++)
    for (let r = 0; r < ROWS; r++) {
      const c = s - r;
      if (c < 0 || c >= COLS) continue;
      const cx = X0 + c * PITCH, cy = Y0 + r * PITCH, fav = r === FAV[0] - 1 && c === FAV[1] - 1;
      const body = solid(g), mound = mk("path", { class: "sil" }, g), curl = mk("path", { class: "nf lo" }, g);
      put(body, { sil: poly(hull([...disc(cx, cy, RF).map((p) => P(p.u, p.v, 0)), ...disc(cx, cy, R).map((p) => P(p.u, p.v, TH))])), crease: poly(disc(cx, cy, R - 1).map((p) => P(p.u, p.v, TH))) });
      // the scooped mound, a dome a little lower than the lid, with the curl a scoop leaves
      const dome = [[R - 1.4, TH - 0.5], [R - 2.4, TH + 1.6], [R - 4.4, TH + 3], [R - 7.5, TH + 3.6]];
      mound.setAttribute("d", poly(hull(dome.flatMap(([rr, z]) => disc(cx, cy, rr).map((p) => P(p.u, p.v, z))))));
      curl.setAttribute("d", open(Array.from({ length: 9 }, (_, i) => { const a = -1.9 + i * 0.32, rr = 2 + i * 0.6; return P(cx + rr * Math.cos(a), cy + rr * Math.sin(a), TH + 3.4 - i * 0.16); })));
      const lid = solid(g);
      tubs.push({ r, c, cx, cy, lid, z: tween(fav ? LIFT * 0.75 : 0), last: NaN, fav });
    }

  const ring = disc(0, 0, LR, 8), cap = disc(0, 0, LR - 2.6, 8), inner = disc(0, 0, LR - 1, 8);
  /** The lid lifted z and tipped back on its far edge as it rises, so its near rim comes up first. */
  function draw(t, z) {
    if (z === t.last) return;
    t.last = z;
    const a = (z / LIFT) * TIP, ca = Math.cos(a), sa = Math.sin(a), zb = TH - 2 + z;
    const at = (p, h) => P(t.cx + p.u, t.cy + p.v * ca - h * sa, zb + h * ca + p.v * sa);
    const sil = poly(hull([...ring.map((p) => at(p, 0)), ...ring.map((p) => at(p, 4.5)), ...cap.map((p) => at(p, 6.5))]));
    put(t.lid, { sil, crease: open(run(inner, front).map((p) => at(p, 4.5))) });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tubs) { draw(t, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The nearest tub whose closed lid top holds the point, read on that top's plane; then the counter. */
  function hit([sx, sy]) {
    for (let n = tubs.length - 1; n >= 0; n--) {
      const t = tubs[n], [x, y] = unproj(C, sx, sy, TH + 4.5);
      if (Math.hypot(x - t.cx, y - t.cy) < R + 2) return n;
    }
    for (let n = tubs.length - 1; n >= 0; n--) {
      const t = tubs[n], [x, y] = unproj(C, sx, sy, TH / 2);
      if (Math.hypot(x - t.cx, y - t.cy) < R) return n;
    }
    return -1;
  }

  let act = -2;
  const gd = (a, b) => Math.hypot(a.r - b.r, a.c - b.c);
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, A = tubs[a];
    act = a;
    for (const t of tubs) {
      const z = a < 0 ? (t.fav ? LIFT * 0.75 : 0) : t === A ? LIFT : clamp(5 - gd(A, t) * 2.5, 0, 5);
      tset(t.z, z, now, from < 0 ? 0 : gd(tubs[from], t) * stag);
      t.lid.sil.classList.toggle("hi", a < 0 ? t.fav : t === A);
    }
    read.textContent = a < 0 ? "rest" : "tub " + (A.r + 1) + "·" + (A.c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "icecreamtubs",
  means: "Eight ice cream tubs: the lid of the one under the pointer lifts off its scooped mound, and lids nearby lift a little.",
  rules: [1, 2, 5, 9],
  range: [0, 45, 90],
  tour: [[155, 98], [191, 152], [263, 152], null],
  mount,
});
