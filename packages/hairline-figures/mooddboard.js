/**
 * Pin board: a studio mood board standing on its feet, swatch cards pinned
 * across it, each card a colour chip over a label strip. The pointer picks
 * the card nearest it: the card swings on its pin and lifts off the board,
 * and the cards around it sway a little, staggered by distance. At rest the
 * cards hang at uneven leans and one is lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many on a face plane (deposit boxes).
 */
const {
  Cam, fit, hull, poly, proj, rad, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const BY = 170, BZ0 = 16, BZ1 = 132, T = 5, CW = 30, CH = 38, FAV = 2;
const CARDS = [[28, 100, -5], [70, 108, 4], [113, 98, -3], [148, 106, 6], [44, 52, 3], [90, 46, -6], [134, 54, 2]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.55);
  fit(C, [[-14, 0, 0], [14, BY, 0], [0, 0, BZ1], [T + 14, BY, BZ1], [T + 14, 0, BZ0]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const corner = (x0, x1, y0, y1, z0, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(P(x, y, z)); return o; };
  for (const fy of [16, BY - 16]) mk("path", { d: poly(hull(corner(-14, 14, fy - 3, fy + 3, 0, 3))) + seg(P(T / 2, fy, 3), P(T / 2, fy, BZ0)), class: "nf" }, g);
  mk("path", { d: poly(hull(corner(0, T, 0, BY, BZ0, BZ1))), class: "sil" }, g);
  mk("path", { d: poly([P(T, 4, BZ0 + 4), P(T, BY - 4, BZ0 + 4), P(T, BY - 4, BZ1 - 4), P(T, 4, BZ1 - 4)]), class: "nf lo" }, g);
  const items = CARDS.map(([y, z, lean], k) => {
    const grp = mk("g", {}, g);
    return { k, y, z, lean, card: mk("path", { class: "sil" }, grp), chip: mk("path", { class: "nf lo" }, grp), pin: mk("path", { class: "nf" }, grp),
      s: tween(k === FAV ? 1 : 0), last: NaN };
  }).sort((a, b) => a.y - b.y);
  items.forEach((it) => g.appendChild(it.card.parentNode));
  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const ang = rad(it.lean + s * (it.lean < 0 ? -24 : 24)), c = Math.cos(ang), sn = Math.sin(ang), x = T + 0.6 + s * 12;
    const W = (dy, dz) => P(x, it.y + dy * c - dz * sn, it.z + dy * sn + dz * c);
    it.card.setAttribute("d", poly([W(-CW / 2, 4), W(CW / 2, 4), W(CW / 2, 4 - CH), W(-CW / 2, 4 - CH)]));
    it.chip.setAttribute("d", poly([W(-CW / 2 + 4, -2), W(CW / 2 - 4, -2), W(CW / 2 - 4, -24), W(-CW / 2 + 4, -24)]) + seg(W(-CW / 2 + 4, -29), W(CW / 2 - 10, -29)));
    const ring = [];
    for (let i = 0; i < 12; i++) { const q = (i / 12) * 2 * Math.PI; ring.push(P(x + 0.4, it.y + 2.2 * Math.cos(q), it.z + 2.2 * Math.sin(q))); }
    it.pin.setAttribute("d", poly(ring));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = CARDS.map(([y, z]) => P(T, y, z - CH / 2 + 4));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it) => {
      const d = a < 0 ? 0 : Math.hypot(it.y - CARDS[a][0], it.z - CARDS[a][1]);
      const s = a < 0 ? (it.k === FAV ? 1 : 0) : it.k === a ? 1 : d < 60 ? 0.3 : 0;
      const dd = from < 0 ? 0 : Math.hypot(it.y - CARDS[from][0], it.z - CARDS[from][1]) / 40;
      tset(it.s, s, now, dd * stag);
      it.card.classList.toggle("hi", it.k === (a < 0 ? FAV : a));
    });
    const top = items.find((it) => it.k === (a < 0 ? FAV : a));
    g.appendChild(top.card.parentNode);
    read.textContent = a < 0 ? "rest" : "card " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mooddboard",
  means: "A studio pin board of swatch cards: the card nearest the pointer swings on its pin and lifts, its neighbours sway.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[250, 102], [182, 214], [118, 165], null],
  mount,
});
