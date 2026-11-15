/**
 * Tool chest: a tall rolling chest on four casters, six drawers that grow
 * deeper toward the floor, a push handle on its side. The pointer picks a
 * drawer by its height on the front; it rolls out on its runners and the
 * drawers beside it follow a little, staggered from it. At rest the second
 * drawer stands open, bright. The slider is the stagger.
 *
 * The pattern: one of a stack of unequal parts; the pick is the drawer whose
 * resting front middle is nearest the pointer's y on screen.
 */
const {
  Cam, facing, fit, prism, proj, rings, seg, open, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 42, HS = [6, 6, 8, 9, 11, 13], Z0 = 11, OUT = 32, FAV = 1;
const ZS = []; { let z = Z0; for (let k = HS.length - 1; k >= 0; k--) { ZS[k] = z; z += HS[k]; } }
const ZT = ZS[0] + HS[0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [W + 6, 0, 0], [0, D + OUT, 0], [W + 6, D + OUT, 0], [0, 0, ZT + 3], [W + 6, 0, ZT + 3]], 200, 166);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const caster = (x, y) => { const [r, i] = rings(x - 3, y - 3, x + 3, y + 3, 3, 1); put(solid(g), prism(P, front, r, i, 0, Z0 - 1)); };
  caster(6, 6); caster(W - 6, 6); caster(6, D - 6);
  { const [r, i] = rings(0, 0, W, D, 2, 1.2); put(solid(g), prism(P, front, r, i, Z0 - 2, ZT)); }
  caster(W - 6, D - 6);
  mk("path", { class: "nf", d: open([P(W, 8, ZT - 6), P(W + 5, 8, ZT - 6), P(W + 5, D - 8, ZT - 6), P(W, D - 8, ZT - 6)]) }, g);
  const dg = mk("g", {}, g);
  const drawers = [];
  for (let k = HS.length - 1; k >= 0; k--) {
    const el = solid(dg), marks = mk("path", { class: "nf lo" }, el.g);
    drawers[k] = { k, z0: ZS[k], h: HS[k], el, marks, y: tween(k === FAV ? 20 : 0), last: "" };
  }
  { const [r, i] = rings(-1.5, -1.5, W + 1.5, D + 1.5, 2.4, 1.2); put(solid(g), prism(P, front, r, i, ZT, ZT + 3)); }

  function draw(d, y) {
    const key = y.toFixed(2);
    if (key === d.last) return;
    d.last = key;
    const z0 = d.z0 + 0.5, z1 = d.z0 + d.h - 0.5;
    const [r, i] = rings(2.5, 2 + y, W - 2.5, D + 0.6 + y, 1.2, 0.7);
    put(d.el, prism(P, front, r, i, z0, z1));
    const f = D + 0.6 + y, hz = z1 - 2;
    let m = seg(P(10, f, hz), P(W - 10, f, hz));
    if (y > 5) m += seg(P(W / 2, Math.max(D, 6 + y), z1), P(W / 2, f - 3, z1)); // a divider in the open tray
    d.marks.setAttribute("d", m);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const d of drawers) { draw(d, tval(d.y, now)); if (!tdone(d.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = drawers.map((d) => P(W / 2, D, d.z0 + d.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 18 && Math.abs(mids[best][0] - sx) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    drawers.forEach((d, k) => {
      const n = Math.abs(k - a);
      const y = a < 0 ? (k === FAV ? 20 : 0) : n === 0 ? OUT : n === 1 ? 6 : 0;
      tset(d.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drw " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "nailgun",
  means: "A rolling tool chest of six drawers on casters: the one under the pointer rolls out, its neighbours follow a little in turn.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[187, 110], [187, 142], [187, 199], null],
  mount,
});
