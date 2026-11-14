/**
 * Window box: a planter on a sill under a window, five flowers in a row.
 * The pointer picks a flower by where it stands: it grows up toward the
 * light, its neighbours a little, staggered from it. At rest one flower
 * stands tall, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, fillet, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 22, BX = 6 + (N - 1) * STEP + 12, BH = 18, ST = 14, GROW = 26, FAV = 3;
const RESTH = [4, 0, 6, 10, 2];
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  const top = BH + ST + GROW + 14 + 8;
  fit(C, [[-4, -6, 0], [BX + 4, 18, 0], [-4, -6, top + 8], [BX + 4, -6, top + 8], [BX + 4, 18, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the window behind: a frame on the wall plane, with its mullion
  const fr = fillet([P(-2, -6, 6), P(BX + 2, -6, 6), P(BX + 2, -6, top + 8), P(-2, -6, top + 8)], [3, 3, 3, 3]);
  mk("path", { d: poly(fr) }, g);
  const pane = fillet([P(4, -6, BH + 2), P(BX - 4, -6, BH + 2), P(BX - 4, -6, top + 2), P(4, -6, top + 2)], [2, 2, 2, 2]);
  mk("path", { d: poly(pane) + seg(P(BX / 2, -6, BH + 2), P(BX / 2, -6, top + 2)), class: "nf lo" }, g);
  const [sr, si] = rings(-4, -6, BX + 4, 18, 3, 1.2);
  put(solid(g), prism(P, front, sr, si, 0, 4));

  const flowers = [];
  for (let k = 0; k < N; k++) {
    const x = 12 + k * STEP, y = 4, grp = mk("g", {}, g);
    const stem = mk("path", { class: "nf lo" }, grp), head = mk("path", { class: "sil" }, grp), eye = mk("path", { class: "nf lo" }, grp);
    flowers.push({ k, x, y, grp, stem, head, eye, h: tween(RESTH[k]), last: NaN });
  }
  const [br, bi] = rings(0, -2, BX, 12, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 4, BH));

  function draw(f, h) {
    if (h === f.last) return;
    f.last = h;
    const zt = BH + ST + h;
    f.stem.setAttribute("d", seg(P(f.x, f.y, BH - 1), P(f.x, f.y, zt)) + seg(P(f.x, f.y, zt - 8), P(f.x + 4, f.y, zt - 4)));
    f.head.setAttribute("d", poly(hull(ringAt(P, disc(f.x, f.y, 7), zt).concat(ringAt(P, disc(f.x, f.y, 7), zt + 2.5)))));
    f.eye.setAttribute("d", poly(ringAt(P, disc(f.x, f.y, 2.5, 12), zt + 2.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const f of flowers) { draw(f, tval(f.h, now)); if (!tdone(f.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = flowers.map((f) => P(f.x, f.y, BH + ST / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    flowers.forEach((f, k) => {
      const dd = Math.abs(k - a), h = a < 0 ? RESTH[k] : dd === 0 ? GROW : dd === 1 ? 8 : 0;
      tset(f.h, h, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      f.head.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bloom " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "windowbox",
  means: "A window box of five flowers on a sill: the flower under the pointer grows toward the light, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[121, 142], [155, 159], [258, 211], null],
  mount,
});
