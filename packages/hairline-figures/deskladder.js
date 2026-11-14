/**
 * Ladder shelf: a ladder shelf leaning on the wall, two rails tilting back,
 * four shelves that grow shallower as they climb, books on each. The pointer
 * picks a shelf by its rest top: its tall book slides out, the tall books on the
 * shelves beside it rise a little, staggered from it. At rest one book on
 * the second shelf stands half out, bright. The slider is the stagger.
 *
 * The pattern: stepped parts, picked on each part's own rest top.
 */
const {
  Cam, fit, hull, poly, open, prism, proj, rings, ringAt, rrect, run, unproj, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 114, XF = 48, XT = 7, W = 66, RT = 3.4, SLIDE = 14, FAV = 1;
const ZS = [8, 36, 64, 92];
const depth = (z) => XF + (XT - XF) * (z / H);
// books per shelf: [y offset, width, height, depth trim]
const ROWS = [
  [[6, 6, 13, 0], [13, 5, 15, 0], [19, 7, 17, 0], [27, 5, 12, 0], [45, 6, 14, 0]],
  [[8, 5, 12, 0], [14, 6, 14, 0], [21, 7, 18, 0], [40, 5, 13, 0], [46, 6, 11, 0]],
  [[10, 6, 14, 0], [24, 5, 12, 0], [30, 7, 17, 0], [38, 5, 13, 0]],
  [[16, 5, 11, 0], [22, 6, 15, 0], [29, 5, 12, 0], [44, 6, 13, 0]],
];
const TALL = [2, 2, 2, 1];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, H + 2], [XF + 2, 0, 0], [XF + 2, W, 0], [0, W, H + 2], [0, 0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a leaning rail: foot ring on the floor, top ring set back toward the wall
  function rail(y0) {
    const foot = rrect(XF - RT, y0, XF, y0 + RT, 1.2, 4), top = rrect(XT - RT, y0, XT, y0 + RT, 1.2, 4);
    const inner = rrect(XT - RT + 0.7, y0 + 0.7, XT - 0.7, y0 + RT - 0.7, 0.6, 4);
    put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, H)))), crease: open(ringAt(P, run(inner, front), H)) });
  }
  rail(0);

  const shelves = [];
  ZS.forEach((z, s) => {
    const d = depth(z + 2), grp = mk("g", {}, g);
    const [r, ri] = rings(0, RT, d - RT * 0.5, W - RT, 1.6, 1.2);
    put(solid(grp), prism(P, front, r, ri, z, z + 2.2));
    const bd = Math.min(15, d - 3);
    const books = ROWS[s].map(([y, w, h], i) => {
      const bg = mk("g", {}, grp), sd = solid(bg);
      const [br, bi] = rings(1.5, y, 1.5 + bd - (i % 2) * 1.5, y + w, 1.2, 0.9);
      return { br, bi, sd, h, z0: z + 2.2, tall: i === TALL[s], tw: tween(0), last: NaN };
    });
    shelves.push({ s, z, d, books });
  });
  rail(W - RT);

  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    const mv = (r) => r.map((q) => ({ ...q, u: q.u + lift }));
    put(b.sd, prism(P, front, mv(b.br), mv(b.bi), b.z0 + lift * 0.12, b.z0 + lift * 0.12 + b.h));
  }
  const all = shelves.flatMap((sh) => sh.books);
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of all) { draw(b, tval(b.tw, now)); if (!tdone(b.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // pick on each shelf's own rest top, the part whose middle is nearest
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    for (const sh of shelves) {
      const [x, y] = unproj(C, sx, sy, sh.z + 8);
      if (x < -4 || x > sh.d + 4 || y < 0 || y > W) continue;
      const dd = Math.abs(x - sh.d / 2) / sh.d + Math.abs(y - W / 2) / W;
      if (dd < bd) { bd = dd; best = sh.s; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const sh of shelves) {
      const dd = Math.abs(sh.s - a);
      for (const b of sh.books) {
        const m = Math.min(SLIDE, sh.d * 0.55), z = a < 0 ? (sh.s === FAV && b.tall ? m * 0.7 : 0) : !b.tall ? 0 : dd === 0 ? m : dd === 1 ? m * 0.3 : 0;
        tset(b.tw, z, now, from < 0 ? 0 : Math.abs(sh.s - from) * stag);
        b.sd.sil.classList.toggle("hi", b.tall && sh.s === (a < 0 ? FAV : a));
      }
    }
    read.textContent = a < 0 ? "rest" : "shelf " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskladder",
  means: "A ladder shelf leaning on the wall: the shelf under the pointer slides its tall book out, and the shelves beside it stir.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[183, 137], [190, 205], [200, 92], null],
  mount,
});
