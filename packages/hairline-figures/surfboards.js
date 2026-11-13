/**
 * Surfboards: five boards standing on their tails in a floor rack, leaning
 * back against a rail held by two posts. The pointer picks a board by where
 * it stands: it tips forward off the rail toward the reader, and the boards
 * beside it come off the rail a little, staggered from it. At rest one board
 * already leans out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); a board is the hull of
 * its cross-sections, tilted by its lean.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HT = [74, 66, 82, 70, 62], WD = [15, 14, 17, 15, 13], REST = [-0.27, -0.3, -0.06, -0.29, -0.33];
const STEP = 15, FAV = 2, OUT = 0.2, YC = 2, RZ = 46;
const X1 = (HT.length - 1) * STEP;
const PROF = [[0, 0.5], [0.08, 0.78], [0.25, 0.95], [0.5, 1], [0.72, 0.88], [0.88, 0.6], [0.97, 0.28], [1, 0.08]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-12, -24, -4], [X1 + 12, 20, -4], [X1 + 12, -24, -4], [-12, 24, -4], [0, -20, 84], [X1, 18, 70]], 200, 168);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [br, bi] = rings(-12, -24, X1 + 12, 16, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, -4, 0));
  const post = (x) => { const [r, i] = rings(x - 2, -20, x + 2, -16, 1.4, 0.6); put(solid(g), prism(P, front, r, i, 0, RZ + 4)); };
  post(-8);
  { const [r, i] = rings(-8, -20, X1 + 8, -16, 1.6, 0.6); put(solid(g), prism(P, front, r, i, RZ, RZ + 4)); }
  post(X1 + 8);
  // the slots in the foot rail: one dim notch per board
  const notch = mk("path", { class: "nf lo" }, g);
  notch.setAttribute("d", HT.map((_h, k) => poly(ringAt(P, rrect(k * STEP - 2.4, YC - 7, k * STEP + 2.4, YC + 7, 1, 2), 0))).join(""));

  const boards = HT.map((h, k) => {
    const el = solid(g);
    return { k, h, w: WD[k], x: k * STEP, el, a: tween(REST[k]), last: NaN };
  });

  function draw(b, a) {
    if (a === b.last) return;
    b.last = a;
    const pts = [], str = [], s = Math.sin(a), c = Math.cos(a);
    for (const [t, f] of PROF) {
      const z = t * b.h * c, y = YC + t * b.h * s, w = (b.w * f) / 2;
      pts.push(...ringAt(P, rrect(b.x - 1.5, y - w, b.x + 1.5, y + w, 1.2, 2), z));
      str.push(P(b.x + 1.5, y, z));
    }
    b.el.sil.setAttribute("d", poly(hull(pts)));
    b.el.cr.setAttribute("d", open(str.slice(1, -1)));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boards) { draw(b, tval(b.a, now)); if (!tdone(b.a, now)) moving = true; }
    const order = boards.slice().sort((p, q) => p.x + Math.sin(tval(p.a, now)) * 40 - (q.x + Math.sin(tval(q.a, now)) * 40));
    const key = order.map((b) => b.k).join();
    if (key !== painted) { painted = key; for (const b of order) g.appendChild(b.el.g); }
    return moving;
  });
  bag.add(B.unregister);

  /** The board whose resting middle is nearest the pointer's x on screen; -1 off the rack. */
  const mids = boards.map((b) => P(b.x, YC, b.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boards.forEach((b, k) => {
      const d = Math.abs(k - a);
      const t = a < 0 ? REST[k] : d === 0 ? OUT : d === 1 ? clamp(REST[k] + 0.12, -0.33, 0) : REST[k] === -0.06 ? -0.24 : REST[k];
      tset(b.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "board " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "surfboards",
  means: "Five surfboards leaning on a rack rail: the board under the pointer tips forward toward the reader, its neighbours ease off the rail.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[151, 142], [197, 165], [243, 206], null],
  mount,
});
