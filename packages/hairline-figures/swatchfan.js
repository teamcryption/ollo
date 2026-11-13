/**
 * Swatch fan: nine colour cards fanned out from a pin, each card ruled into
 * three swatches, a hole at its foot. The pointer picks the card pointing its
 * way: it slides out along its length and lifts, and the cards beside it lean
 * away, staggered from it. At rest the fan is open with one card drawn out,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many round a pivot (riffle). The pick is the card whose
 * resting angle is nearest the pointer's angle about the pin.
 */
const {
  Cam, circ, clamp, fit, facing, fillet, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 9, L = 78, W = 15, TK = 0.9, A0 = -18, SPREAD = 8, OUT = 12, LEAN = 4, FAV = 5;
const restA = (k) => A0 + k * SPREAD;
const SHAPE = fillet([[0, -W / 2], [L, -W / 2], [L, W / 2], [0, W / 2]], [W / 2, 2.5, 2.5, W / 2]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.2);
  const ext = [];
  // every card's far corners at its widest lean and furthest slide, the stack's top and foot, and the pin
  for (let a = A0 - LEAN; a <= restA(N - 1) + LEAN; a += 4) for (const v of [-W / 2, W / 2]) for (const z of [0, N * 1.2 + 6]) {
    const u = L + OUT; ext.push([u * Math.cos(rad(a)) - v * Math.sin(rad(a)), u * Math.sin(rad(a)) + v * Math.cos(rad(a)), z]);
  }
  fit(C, [...ext, [-W / 2, -W / 2, 0], [W / 2, W / 2, N * 1.2 + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const cards = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const edge = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp), lines = mk("path", { class: "nf lo" }, grp);
    cards.push({ k, grp, edge, face, lines, a: tween(restA(k)), s: tween(k === FAV ? OUT * 0.7 : 0), last: "" });
  }
  // the pin through every card's foot, over the stack
  const pin = solid(g);
  { const ring = circ(3.2, 24), inner = circ(2, 24); put(pin, prism(P, front, ring, inner, 0, N * 1.2 + 3)); }

  function draw(c, a, s) {
    const key = a.toFixed(2) + "," + s.toFixed(2);
    if (key === c.last) return;
    c.last = key;
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a)), z = 1 + c.k * 1.2 + (s > 0.1 ? s * 0.3 : 0);
    const w = (u, v, zz = z) => P((u + s) * ca - v * sa, (u + s) * sa + v * ca, zz);
    c.face.setAttribute("d", poly(SHAPE.map(([u, v]) => w(u, v))));
    c.edge.setAttribute("d", poly(SHAPE.map(([u, v]) => w(u, v, z - TK))));
    let d = "";
    for (const u of [L * 0.4, L * 0.6, L * 0.8]) d += seg(w(u, -W / 2 + 1.2), w(u, W / 2 - 1.2));
    c.lines.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cards) { draw(c, tval(c.a, now), tval(c.s, now)); if (!tdone(c.a, now) || !tdone(c.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The card whose resting angle is nearest the pointer's angle about the pin, on the ground plane. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, N * 0.6), r = Math.hypot(x, y);
    if (r < 10 || r > L + OUT + 8) return -1;
    const ang = (Math.atan2(y, x) * 180) / Math.PI;
    if (ang < A0 - SPREAD || ang > restA(N - 1) + SPREAD) return -1;
    return clamp(Math.round((ang - A0) / SPREAD), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cards.forEach((c, k) => {
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(c.a, a < 0 ? restA(k) : restA(k) + (k < a ? -LEAN : k > a ? LEAN : 0), now, delay);
      tset(c.s, a < 0 ? (k === FAV ? OUT * 0.7 : 0) : k === a ? OUT : 0, now, delay);
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
  name: "swatchfan",
  means: "A fan of nine colour cards: the card pointing toward the pointer slides out, and the cards beside it lean away.",
  rules: [1, 2, 5, 10],
  range: [0, 40, 80],
  tour: [[243, 143], [187, 169], [110, 183], null],
  mount,
});
