/**
 * Business cards: a desk holder with a short stack of cards leaning on its
 * back rest. The pointer picks a card by where it stands along the stack: it
 * slides up out of the holder, and the cards beside it rise a little,
 * staggered from it. At rest one card stands proud, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fillet, fit, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, facing, mk, pointer, put, register, solid,
} = HL;

const N = 5, GAP = 7, L = 52, D = 44, CH = 24, LEAN = 0.2, LIFT = 17, FAV = 2, Y0 = 5, Y1 = 39;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[0, 0, 0], [L, D, 0], [L, 0, 0], [0, D, 0], [8, Y0, 4 + CH + LIFT + 2], [L, D, 12]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, x1, z1, r, b) => { const [o, i] = rings(x0, 0, x1, D, r, b); put(solid(g), prism(P, front, o, i, 0, z1)); };
  block(0, L, 3, 5, 1.6);
  block(0, 5, 20, 2, 1);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 11 + k * GAP, grp = mk("g", {}, g);
    const card = mk("path", { class: "sil" }, grp), line = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, card, line, z: tween(k === FAV ? 7 : k % 2 ? 1.5 : 0), last: NaN, c: P(x, (Y0 + Y1) / 2, 14) });
  }
  block(L - 5, L, 11, 2, 1);

  const at = (x, y, h, lift) => P(x - h * Math.sin(LEAN), y, 4 + lift + h * Math.cos(LEAN));
  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const pts = [at(it.x, Y0, 0, lift), at(it.x, Y1, 0, lift), at(it.x, Y1, CH, lift), at(it.x, Y0, CH, lift)];
    it.card.setAttribute("d", poly(fillet(pts, [1.5, 1.5, 1.5, 1.5], 3)));
    it.line.setAttribute("d", "M" + at(it.x + 0.2, Y0 + 5, CH - 6, lift).join(" ") + "L" + at(it.x + 0.2, Y0 + 19, CH - 6, lift).join(" "));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.c[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(items[best].c[1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), z = a < 0 ? (k === FAV ? 7 : k % 2 ? 1.5 : 0) : d === 0 ? LIFT : d === 1 ? 3.5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
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
  name: "businesscards",
  means: "A desk holder of business cards: the card under the pointer slides up out of the stack, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[162, 172], [197, 190], [233, 208], null],
  mount,
});
