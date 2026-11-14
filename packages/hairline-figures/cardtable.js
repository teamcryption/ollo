/**
 * Card table: a felt table with five cards dealt face down in a row and a
 * short stack of chips at the far corner. The pointer picks a card by where it
 * stands: it lifts off the felt and tips up toward the player, its neighbours
 * rising a little, staggered from it. At rest one card is half lifted, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 30, CW = 22, CL = 32, LIFT = 16, FAV = 2, TZ = 4, Y0 = 34;
const X1 = (N - 1) * STEP + CW + 24;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-4, -4, 0], [X1, Y0 + CL + 16, 0], [X1, -4, 0], [-4, Y0 + CL + 16, 0], [X1 / 2, Y0, TZ + LIFT + 12]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-4, -4, X1, Y0 + CL + 16, 10, 2.2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  // chips: three short discs stacked at the far corner
  for (let i = 0; i < 3; i++) put(solid(g), prism(P, front, disc(12, 14, 7), disc(12, 14, 5.6), TZ + i * 2.4, TZ + i * 2.4 + 2.2));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = 12 + k * STEP, grp = mk("g", {}, g);
    const card = mk("path", { class: "sil" }, grp), back = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, grp, card, back, z: tween(k === FAV ? 0.55 : 0), last: NaN });
  }
  // a card's corners: rest flat; lifted it rises and tips its near edge down toward the player
  function corners(it, f) {
    const z = TZ + 0.6 + f * LIFT, tip = f * 14;
    const at = (u, v) => P(u, v, z + ((Y0 + CL / 2 - v) / CL) * tip);
    return { at, z };
  }
  function draw(it, f) {
    if (f === it.last) return;
    it.last = f;
    const { at } = corners(it, f);
    const ring = rrect(it.x0, Y0, it.x0 + CW, Y0 + CL, 3, 4);
    const top = ring.map((q) => at(q.u, q.v)), bot = ring.map((q) => { const p = at(q.u, q.v); return [p[0], p[1] + 1.4]; });
    const all = top.concat(bot);
    it.card.setAttribute("d", poly(HL.hull(all)));
    it.back.setAttribute("d", poly(rrect(it.x0 + 3, Y0 + 3, it.x0 + CW - 3, Y0 + CL - 3, 2, 3).map((q) => at(q.u, q.v))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + CW / 2, Y0 + CL / 2, TZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), f = a < 0 ? (k === FAV ? 0.55 : 0) : dd === 0 ? 1 : dd === 1 ? 0.22 : 0;
      tset(it.z, f, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.card.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "card " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cardtable",
  means: "Five cards dealt face down on a felt table: the card under the pointer lifts and tips up, its neighbours rising a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[150, 150], [200, 175], [250, 200], null],
  mount,
});
