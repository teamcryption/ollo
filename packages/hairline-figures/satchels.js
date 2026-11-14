/**
 * Satchels: a row of school satchels hanging by their straps from the hooks
 * of a cloakroom board. The pointer picks a satchel by where it is along the
 * row: that bag is lifted up to its hook, the others hitch up a little,
 * staggered from it. At rest the bags hang at uneven drops, one bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is the nearest resting
 * centre by screen x, inside the row's fixed band.
 */
const {
  Cam, clamp, facing, fit, open, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 18, X0 = 8, W = 6.5, Y0 = 4, Y1 = 9, H = 17, HOOK = 53;
const REST = [41, 44, 38, 43, 40], FAV = 2, LIFT = 49, BUMP = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const XE = X0 + (N - 1) * STEP;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-6, -3, 63], [XE + 12, -3, 63], [-6, Y1, 18], [XE + 10, Y1, 18], [XE + 10, Y1, 63]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the cloakroom board, and a hook per peg
  const board = solid(g);
  put(board, prism(P, front, ...rings(-6, -3, XE + 12, 0, 1.4, 0.5), 50, 63));
  for (let k = 0; k < N; k++) {
    const hk = solid(g), x = X0 + k * STEP;
    put(hk, prism(P, front, ...rings(x - 1.5, 0, x + 1.5, 4, 1.2, 0.5), HOOK - 2, HOOK + 1));
  }

  const bags = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    bags.push({
      x: X0 + k * STEP,
      strap: mk("path", { class: "nf lo" }, grp),
      s: solid(grp),
      flap: mk("path", { class: "nf lo" }, grp),
      z: tween(REST[k]),
      last: NaN,
    });
  }

  function draw(b, top) {
    if (top === b.last) return;
    b.last = top;
    const x = b.x, [r, i] = rings(x - W, Y0, x + W, Y1, 3, 1);
    put(b.s, prism(P, front, r, i, top - H, top));
    b.strap.setAttribute("d", seg(P(x - 4, 6.5, top), P(x, 2.5, HOOK)) + seg(P(x + 4, 6.5, top), P(x, 2.5, HOOK)));
    const f = [[-5.5, -0.8], [-5.5, -7], [-3, -9.5], [3, -9.5], [5.5, -7], [5.5, -0.8]].map(([u, v]) => P(x + u, Y1, top + v));
    b.flap.setAttribute("d", open(f) + seg(P(x, Y1, top - 9.5), P(x, Y1, top - 12.5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    bags.forEach((b) => { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest resting centre by screen x, inside the band the row rests in
  const cx = bags.map((b, k) => P(b.x, 7, REST[k] - H / 2)[0]);
  const yTop = P(0, 0, 63)[1] - 4, yBot = P(XE, Y1, 18)[1] + 6;
  function hit([sx, sy]) {
    if (sx < cx[0] - 22 || sx > cx[N - 1] + 22) return -1;
    const a = P(0, 0, 0)[1], b = P(XE, 0, 0)[1], slope = (b - a) / (cx[N - 1] - cx[0]);
    const off = (sx - cx[0]) * slope;
    if (sy < yTop + off - 30 || sy > yBot - (b - a) + off + 30) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bags.forEach((b, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(REST[k] + BUMP - Math.abs(k - a), REST[k], LIFT - 2);
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "peg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "satchels",
  means: "School satchels on a cloakroom board: the bag under the pointer is lifted to its hook, its neighbours hitch up after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[125, 157], [230, 204], [265, 229], null],
  mount,
});
