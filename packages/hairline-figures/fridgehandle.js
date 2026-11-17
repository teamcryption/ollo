/**
 * Fridge drawer: the bottom of a fridge, a glass shelf over a crisper drawer of greens. The pointer over it slides the drawer out towards the viewer; at rest it sits a little proud, bright.
 *
 * The pattern: one part sliding out from a body (drawer).
 */
const { Cam, circ, fit, facing, prism, proj, rings, seg, poly, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const OUT = 44, REST = 0.1;
const CASE = rings(0, 0, 84, 50, 6, 1.8);
const SHELF = rings(-2, -2, 86, 52, 3, 1.2);
const BIN = rings(5, 4, 79, 52, 4, 1.8);
const LIP = rings(28, 50, 56, 52, 1, 0.4);
const LEAF = [[22, 18, 9], [42, 30, 11], [62, 20, 8], [30, 38, 7]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.05);
  const ext = [];
  for (const q of SHELF[0]) ext.push([q.u, q.v, 84]);
  for (const q of CASE[0]) ext.push([q.u, q.v, 0]);
  for (const q of BIN[0]) ext.push([q.u, q.v + OUT, 3]);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, CASE[0], CASE[1], 0, 42));
  put(solid(g), prism(P, front, SHELF[0], SHELF[1], 42, 46));
  for (const w of [rings(-2, -2, 2, 52, 1.5, 0.6), rings(-2, -2, 86, 2, 1.5, 0.6)]) put(solid(g), prism(P, front, w[0], w[1], 46, 84));
  const bs = solid(g);
  const det = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const dy = OUT * t, sh = (r) => r.map((q) => ({ ...q, v: Math.max(48, q.v + dy) }));
    put(bs, prism(P, front, sh(BIN[0]), sh(BIN[1]), 3, 36));
    let d = poly(sh(LIP[0]).map((q) => P(q.u, q.v, 32)));
    const vis = dy - 2;
    for (const [x, y, r] of LEAF) if (y + dy - r * 0.8 > 50 && vis > 0) d += poly(circ(r, 20).map((q) => P(x + q.u, y + dy + q.v * 0.8, 36))) + seg(P(x - r * 0.6, y + dy, 36), P(x + r * 0.6, y + dy, 36));
    det.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  // hit: the rest pose's screen box
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const q of SHELF[0]) for (const z of [0, 46]) { const [sx, sy] = P(q.u, q.v, z); x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy); }
  y1 += 10;
  const hit = ([sx, sy]) => (sx < x0 || sx > x1 || sy < y0 || sy > y1 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : Math.max(REST, amp), performance.now(), 0);
    bs.sil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "out " + Math.round(OUT * amp);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "fridgehandle",
  means: "The bottom of a fridge: the crisper drawer under the glass shelf slides out towards you, greens showing, when the pointer comes over it.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[190, 178], [250, 170], [150, 212], null],
  mount,
});
