/**
 * Picnic table: a slatted top on two A-frame legs, a basket with its handle
 * on the top, and a bench along each side on short posts. The pointer picks
 * a bench by which side of the table it stands on: that bench slides out
 * from the table, and the other tucks back in. At rest the near bench sits
 * pulled a little out, bright. The slider is how far a bench slides.
 *
 * The pattern: one of two, picked on a fixed plane (terrain).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 84, W = 36, TZ = 27, SZ = 16, FAV = 1;
const box = (x0, y0, x1, y1, r = 1) => rrect(x0, y0, x1, y1, r, 4);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[0, -30, 0], [L, -30, 0], [0, W + 30, 0], [L, W + 30, 0], [0, -10, TZ + 3], [L, W, TZ + 3], [L / 2, W / 2, TZ + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const slab = (parent, x0, y0, x1, y1, z0, z1, b = 1) => { const [r, i] = rings(x0, y0, x1, y1, 1.6, b); const s = solid(parent); put(s, prism(P, front, r, i, z0, z1)); return s; };
  const bar = (parent, x, ya, za, yb, zb) => {
    const s = solid(parent), a = box(x - 2, ya - 2, x + 2, ya + 2), b = box(x - 2, yb - 2, x + 2, yb + 2);
    s.sil.setAttribute("d", poly(hull(ringAt(P, a, za).concat(ringAt(P, b, zb)))));
  };

  // benches: far (side 0) and near (side 1), each a group that slides along y
  const benches = [];
  function bench(side) {
    const grp = mk("g", {}, g), y0 = side ? W + 8 : -16;
    for (const x of [10, L - 10]) slab(grp, x - 2, y0 + 2, x + 2, y0 + 6, 0, SZ - 2, 0.6);
    const seat = slab(grp, 2, y0, L - 2, y0 + 8, SZ - 2, SZ, 1.2);
    benches[side] = { grp, seat: seat.sil, y0, s: side ? 1 : -1, t: tween(side === FAV ? 0.4 : 0), last: NaN };
  }
  bench(0);
  for (const x of [8, L - 8]) { bar(g, x, -2, 0, 12, TZ); bar(g, x, W + 2, 0, W - 12, TZ); }
  slab(g, 0, 0, L, W, TZ - 3, TZ, 1.4);
  const seams = mk("path", { class: "nf lo" }, g);
  seams.setAttribute("d", [9, 18, 27].map((y) => open([P(1.5, y, TZ), P(L - 1.5, y, TZ)])).join(" "));
  // the basket and its handle
  const bk = mk("g", {}, g), [br, bi] = rings(30, 11, 52, 25, 3, 1.2);
  put(solid(bk), prism(P, front, br, bi, TZ, TZ + 9));
  const lid = mk("path", { class: "nf lo" }, bk);
  lid.setAttribute("d", open(ringAt(P, run(br, front), TZ + 6)));
  const arc = [];
  for (let i = 0; i <= 16; i++) { const t = Math.PI * (i / 16); arc.push(P(41 - 9 * Math.cos(t), 18, TZ + 9 + 9 * Math.sin(t))); }
  mk("path", { class: "nf", d: open(arc) }, bk);
  bench(1);

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of benches) {
      const v = tval(b.t, now);
      if (v !== b.last) { b.last = v; const [ox, oy] = P(0, b.s * v * reach, 0), [cx, cy] = P(0, 0, 0); b.grp.setAttribute("transform", `translate(${(ox - cx).toFixed(2)} ${(oy - cy).toFixed(2)})`); }
      if (!tdone(b.t, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [u, v] = unproj(C, sx, sy, SZ);
    if (u < -12 || u > L + 12 || v < -34 || v > W + 34) return -1;
    return v < W / 2 ? 0 : 1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    benches.forEach((b, k) => {
      tset(b.t, a < 0 ? (k === FAV ? 0.4 : 0) : k === a ? 1 : 0, now, 0);
      b.seat.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a ? "near" : "far";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0, 16); for (const b of benches) b.last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "picnictable",
  means: "A picnic table with a basket on top: the bench on the pointer's side slides out from the table, the other tucks back in.",
  rules: [1, 3, 5, 6],
  range: [4, 10, 16],
  tour: [[250, 131], [144, 184], [110, 200], null],
  mount,
});
