/**
 * Shopping basket: a tapered basket with a mesh of slats and two handles
 * hinged on its long rims. Over the basket both handles swing up and lean
 * in together, ready to carry, the near one a beat after the far one. At
 * rest the near handle hangs down its side and the far one stands half up,
 * bright. The slider is the beat between the two handles.
 */
const {
  Cam, fit, hull, open, poly, proj, ringAt, rrect, rad, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 60, Y1 = 38, H = 26, IN = 6, L = 30, XA = 15, XB = 45;
const REST = [35, -78], UP = [118, 118];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let beat = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [XA, Y1 / 2, H + L], [XB, Y1 / 2, H + L], [X1, Y1 + L * 0.3, H - L]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // the basket: a tapered tub, its rim open on top, slats down the two faces we see
  const top = rrect(0, 0, X1, Y1, 4, 4), bot = rrect(IN, IN, X1 - IN, Y1 - IN, 3, 4), rim = rrect(1.5, 1.5, X1 - 1.5, Y1 - 1.5, 3, 4);
  const farH = mk("g", {}, g);
  const body = solid(g);
  put(body, { sil: poly(hull(ringAt(P, top, H).concat(ringAt(P, bot, 0)))), crease: poly(ringAt(P, rim, H)) });
  let mesh = "";
  for (let k = 1; k < 8; k++) { const t = k / 8; mesh += seg(P(t * X1, Y1, H - 3), P(IN + t * (X1 - 2 * IN), Y1 - IN, 3)); }
  for (let k = 1; k < 5; k++) { const t = k / 5; mesh += seg(P(X1, t * Y1, H - 3), P(X1 - IN, IN + t * (Y1 - 2 * IN), 3)); }
  { const i = IN * 9 / H; mesh += open([P(i, Y1 - i, H - 9), P(X1 - i, Y1 - i, H - 9), P(X1 - i, i, H - 9)]); }
  mk("path", { class: "nf lo", d: mesh }, body.g);
  const nearH = mk("g", {}, g);

  const hs = [{ y: 0, s: -1, grp: farH }, { y: Y1, s: 1, grp: nearH }].map((h, k) => ({
    ...h, k, sil: mk("path", { class: "sil nf" }, h.grp), a: tween(REST[k]), last: NaN,
  }));
  function draw(h, deg) {
    if (deg === h.last) return;
    h.last = deg;
    const dy = h.s * Math.cos(rad(deg)), dz = Math.sin(rad(deg));
    const at = (x, l) => P(x, h.y + dy * l, H + dz * l);
    const pts = [at(XA, 0), at(XA, L - 4), at(XA + 2, L - 1), at(XA + 6, L), at(XB - 6, L), at(XB - 2, L - 1), at(XB, L - 4), at(XB, 0)];
    h.sil.setAttribute("d", open(pts) + open([at(XA + 9, L - 2.2), at(XB - 9, L - 2.2)]));
    // the far handle hangs behind the tub, and stands in front of it once raised
    if (h.k === 0) { if (deg < 0) g.insertBefore(farH, body.g); else body.g.after(farH); }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const h of hs) { draw(h, tval(h.a, now)); if (!tdone(h.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H / 2);
    return x > -4 && x < X1 + 4 && y > -4 && y < Y1 + 4;
  }
  let act = null;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    hs.forEach((h, k) => {
      tset(h.a, a ? UP[k] : REST[k], now, k * beat);
      h.sil.classList.toggle("hi", a ? true : k === 0);
    });
    read.textContent = a ? "carry" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { beat = v; }, destroy: bag.dispose };
}

hairline({
  name: "cartstack",
  means: "A shopping basket: over it, both handles swing up off the rims and lean in together, ready to carry.",
  rules: [1, 3, 5, 6],
  range: [0, 80, 200],
  tour: [[200, 137], [177, 153], [223, 257], null],
  mount,
});
