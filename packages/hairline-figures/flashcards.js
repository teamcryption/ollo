/**
 * Flash cards: a box of upright study cards. The pointer picks a card by
 * where it stands over the box: that card and every card in front of it
 * swing forward, the ones behind lean back, staggered out from it, opening
 * the file at the chosen card. At rest the file is open at one card, bright.
 * The slider is the stagger.
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, GAP = 6, X0 = 8, W = 58, H = 44, BZ = 10, FAV = 4, FWD = 38, BACK = -12;
const REST = [-14, -12, -10, -8, 22, 24, 27];
const XL = X0 + (N - 1) * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-4, -4, 0], [XL + 6, W + 4, 0], [X0 - 12, 0, BZ + H], [XL + 30, W, BZ + H * 0.8], [XL + 6, -4, 0], [-4, W + 4, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, XL + 6, W + 4, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  const cards = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * GAP, grp = mk("g", {}, g);
    const face = mk("path", { class: "sil" }, grp), edge = mk("path", { class: "nf lo" }, grp);
    const dots = [0, 1, 2].slice(0, (k % 3) + 1).map(() => mk("ellipse", { class: "dot off", rx: 1.6, ry: 1 }, grp));
    cards.push({ k, x, face, edge, dots, a: tween(REST[k]), last: NaN });
  }

  function draw(c, deg) {
    if (deg === c.last) return;
    c.last = deg;
    const s = Math.sin(deg * Math.PI / 180), co = Math.cos(deg * Math.PI / 180);
    const at = (y, h) => P(c.x + s * h, y, BZ - 2 + co * h);
    const pts = [at(0, 0), at(W, 0), at(W, H), at(0, H)];
    c.face.setAttribute("d", poly(fillet(pts, [1, 1, 4, 4], 4)));
    c.edge.setAttribute("d", seg(at(3, H - 3), at(W - 3, H - 3)));
    c.dots.forEach((d, i) => { const q = at(8 + i * 5, H - 9); d.setAttribute("cx", q[0]); d.setAttribute("cy", q[1]); });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cards) { draw(c, tval(c.a, now)); if (!tdone(c.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, BZ + H * 0.5);
    if (wy < -6 || wy > W + 6) return -1;
    const k = Math.round((wx - X0) / GAP);
    return k >= -2 && k <= N + 1 ? Math.max(0, Math.min(N - 1, k)) : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : FAV;
    act = a;
    cards.forEach((c, k) => {
      const to = a < 0 ? REST[k] : k >= a ? FWD + (k - a) * 1.5 : BACK + (k - a) * 1.5;
      tset(c.a, to, now, Math.abs(k - from) * stag);
      c.face.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "flashcards",
  means: "A box of upright flash cards: the card under the pointer and those in front swing forward, opening the file at it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[173, 140], [205, 156], [237, 172], null],
  mount,
});
