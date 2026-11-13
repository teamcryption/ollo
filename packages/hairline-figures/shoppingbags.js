/**
 * Shopping bags: five paper bags of different sizes standing on the floor,
 * each with an open top and two rope handles. The pointer picks a bag by
 * where it stands: it lifts by its handles, which pull taut, and the bags
 * beside it lift a little, staggered from it. At rest one bag is just picked
 * up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the bag
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, facing, fit, open, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = [16, 11, 20, 10, 14], H = [24, 18, 30, 15, 21], D = [8, 6, 10, 6, 8], Y = [2, 7, 0, 9, 3];
const GAP = 4, LIFT = 16, FAV = 2, REST = [0, 0, 3, 0, 0];
const xs = []; { let x = 0; for (const w of W) { xs.push(x); x += w + GAP; } }
const X1 = xs[4] + W[4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-6, -6, -3], [X1 + 6, 25, -3], [X1 + 6, -6, -3], [-6, 25, -3], [xs[2], 0, 30 + LIFT + 10], [xs[0], 0, 24 + LIFT + 10]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-6, -6, X1 + 6, 25, 4, 1.4); put(solid(g), prism(P, front, r, i, -3, 0)); }

  const bags = W.map((w, k) => ({ k, w, h: H[k], d: D[k], x0: xs[k], y0: Y[k], z: tween(REST[k]), last: NaN }));
  bags.slice().sort((a, b) => a.x0 + a.y0 - (b.x0 + b.y0)).forEach((b) => {
    b.el = solid(g);
    b.ropes = mk("path", { class: "nf sil" }, b.el.g);
  });

  function arc(b, y, z, hh) {
    const a = b.x0 + b.w * 0.3, c = b.x0 + b.w * 0.7, pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push(P(a + (c - a) * t, y, z + hh * Math.sin(Math.PI * t))); }
    return open(pts);
  }
  function draw(b, z) {
    if (z === b.last) return;
    b.last = z;
    const [r, i] = rings(b.x0, b.y0, b.x0 + b.w, b.y0 + b.d, 1.2, 0.7);
    put(b.el, prism(P, front, r, i, z, z + b.h));
    const hh = 5 + Math.min(z, LIFT) * 0.25, zt = z + b.h;
    b.ropes.setAttribute("d", arc(b, b.y0 + 1.6, zt, hh) + arc(b, b.y0 + b.d - 1.6, zt, hh));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bags) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = bags.map((b) => P(b.x0 + b.w / 2, b.y0 + b.d, b.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bags.forEach((b, k) => {
      const d = Math.abs(k - a);
      const z = a < 0 ? REST[k] : d === 0 ? LIFT : d === 1 ? 4 : d === 2 ? 1.5 : 0;
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      b.el.sil.classList.toggle("hi", on);
      b.ropes.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "bag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shoppingbags",
  means: "Five shopping bags on the floor: the one under the pointer lifts by its rope handles, its neighbours lift a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[137, 113], [213, 146], [285, 193], null],
  mount,
});
