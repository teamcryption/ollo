/**
 * Spice drawer: a small cabinet of three stacked drawers, each holding a
 * row of spice jars. The pointer picks a drawer by height: it slides out to
 * show its jar lids, and the drawers beside it ease out a little, staggered
 * from it. At rest the middle drawer stands half out, bright.
 *
 * The pattern: one of many in a single stack (riffle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 40, N = 3, DH = 17, GAP = 3, OUT = 30, FAV = 1;
const Z = (k) => 4 + (N - 1 - k) * (DH + GAP);

function mount({ stage, svg, read }, value) {
  let stag = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const H = 4 + N * (DH + GAP) + 2;
  fit(C, [[0, 0, 0], [W, D + OUT + 4, 0], [0, 0, H], [W, D + OUT + 4, H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, D, 4, 2.5);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  const items = [];
  for (let k = N - 1; k >= 0; k--) {
    const z0 = Z(k);
    mk("path", { d: poly([P(4, D, z0), P(W - 4, D, z0), P(W - 4, D, z0 + DH), P(4, D, z0 + DH)]), class: "nf lo" }, g);
    const grp = mk("g", {}, g);
    items[k] = { k, z0, grp, o: tween(k === FAV ? OUT * 0.5 : 2), last: NaN };
  }
  const jar = (x, y, z) => prism(P, front, circ(4.5, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), circ(3.2, 20).map((q) => ({ ...q, u: q.u + x, v: q.v + y })), z, z + 2.5);
  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    it.grp.replaceChildren();
    const [r, i] = rings(4, D - 2, W - 4, D + o + 3, 2, 2);
    const s = solid(it.grp);
    put(s, prism(P, front, r, i, it.z0, it.z0 + DH));
    s.sil.classList.toggle("hi", it.hi);
    for (const yy of [8, 20]) if (D + o + 3 - yy > D + 3) for (const x of [14, 26, 38, 50]) put(solid(it.grp), jar(x, D + o + 3 - yy, it.z0 + DH - 3));
    const kn = circ(2.4, 16).map((q) => P(W / 2 + q.u, D + o + 3.5, it.z0 + DH / 2 + q.v));
    mk("path", { d: poly(kn) }, it.grp);
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(W / 2, D, it.z0 + DH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][0] - sx) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), t = a < 0 ? (k === FAV ? OUT * 0.5 : 2) : d === 0 ? OUT : 6;
      tset(it.o, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.hi = k === (a < 0 ? FAV : a);
      it.last = NaN;
    });
    read.textContent = a < 0 ? "rest" : "row " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "breadbin2",
  means: "A cabinet of three spice drawers: the drawer under the pointer slides out to show its jars, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[195, 125], [195, 164], [195, 204], null],
  mount,
});
