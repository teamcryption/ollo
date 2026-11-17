/**
 * Ice maker: a countertop box with a control strip on its side, a basket
 * heaped with cubes under a windowed lid hinged along its back edge. The
 * pointer over it swings the lid up and over to show the ice; away, the lid
 * rests just cracked, bright. The slider is how far the lid opens.
 *
 * The pattern: one hinged part tilting open (lid); the lid moves behind the
 * cubes once it stands past upright-ish, so paint order follows depth.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, rad,
} = HL;

const W = 40, D = 56, H = 48, LZ1 = 53, HZ = 50, ANG = 108, REST = 0.07;
const CUBES = [[9, 10, 47], [17, 14, 48], [26, 9, 46.5], [12, 22, 48.5], [22, 24, 47.5], [10, 34, 47], [20, 37, 48], [28, 30, 46.5], [14, 45, 46.5], [25, 43, 47.5]];
const LID = rrect(0, 0, W, D, 7, 12), WIN = rrect(8, 9, W - 8, D - 9, 4, 6);
const XF = (x, y, z, t) => {
  const a = rad(ANG * t), dz = z - HZ;
  return [x * Math.cos(a) - dz * Math.sin(a), y, HZ + x * Math.sin(a) + dz * Math.cos(a)];
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.65);
  const ext = [[0, 0, 0], [W, 0, 0], [0, D, 0], [W, D, 0]];
  for (const q of LID) for (const z of [H, LZ1]) ext.push(XF(q.u, q.v, z, 1), XF(q.u, q.v, z, 0));
  fit(C, ext, 200, 163);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, the basket's opening in its top, and the control strip on its long side
  const [br, bi] = rings(0, 0, W, D, 7, 2);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 0, H));
  const side = (y0, y1, z0, z1, r) => poly(rrect(y0, z0, y1, z1, r, 4).map((q) => P(W, q.u, q.v)));
  mk("path", { class: "nf lo", d: poly(ringAt(P, rrect(5, 5, W - 5, D - 5, 4, 6), H)) + side(12, 44, 30, 40, 3) + side(36, 40, 33, 37, 1.6) }, body.g);

  // the ice: small rounded cubes heaped in the basket
  const cg = mk("g", {}, g);
  CUBES.forEach(([x, y, z]) => { const [r, i] = rings(x - 3.5, y - 3.5, x + 3.5, y + 3.5, 1.6, 0.8); put(solid(cg), prism(P, front, r, i, z - 4, z + 1.5)); });

  // the lid: a plate with its window, swung about its back edge
  const lg = mk("g", {}, g);
  const lsil = mk("path", { class: "sil" }, lg), ltop = mk("path", { class: "nf lo" }, lg), lwin = mk("path", { class: "nf lo" }, lg);
  const tw = tween(REST);
  let last = NaN, behind = false;
  function draw(t) {
    if (t === last) return;
    last = t;
    const pt = (q, z) => P(...XF(q.u, q.v, z, t));
    lsil.setAttribute("d", poly(hull(LID.map((q) => pt(q, H)).concat(LID.map((q) => pt(q, LZ1))))));
    ltop.setAttribute("d", poly(LID.map((q) => pt(q, LZ1))));
    lwin.setAttribute("d", poly(WIN.map((q) => pt(q, LZ1))));
    const b = ANG * t > 70;
    if (b !== behind) { behind = b; if (b) cg.before(lg); else cg.after(lg); }
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  // hit: the rest pose's screen box, which never moves
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  for (const z of [0, LZ1]) for (const q of br) {
    const [sx, sy] = P(q.u, q.v, z);
    x0 = Math.min(x0, sx); x1 = Math.max(x1, sx); y0 = Math.min(y0, sy); y1 = Math.max(y1, sy);
  }
  const hit = ([sx, sy]) => sx > x0 - 4 && sx < x1 + 4 && sy > y0 - 4 && sy < y1 + 4 ? 0 : -1;

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : amp, performance.now(), 0);
    lsil.classList.add("hi");
    read.textContent = a < 0 ? "rest" : "lid " + Math.round(ANG * amp) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "icemaker",
  means: "A countertop ice maker whose windowed lid swings up on its back hinge when the pointer comes over it, showing the heaped cubes.",
  rules: [1, 3, 4, 6],
  range: [30, 100, 100],
  tour: [[213, 146], [250, 200], [175, 240], null],
  mount,
});
