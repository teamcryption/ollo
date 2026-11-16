/**
 * Paper holder: three paper roll holders on a tiled wall, each a roll on a
 * bracket under a hinged chrome flap, a sheet hanging from its front. The
 * pointer picks a holder by where it stands: its flap tilts up and the sheet
 * slides down, and the holders beside it give a little, staggered from it.
 * At rest one flap is half up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, each flap tilting on a hinge.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, L = 26, STEP = 40, RR = 11, YC = RR + 5, ZC = 70, FAV = 1;
const X1 = (N - 1) * STEP + L;
const ZF = ZC + RR + 3, LF = YC + RR + 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-8, 0, ZC - 58], [X1 + 8, 0, ZC - 58], [X1 + 8, 0, ZF + LF + 6], [-8, 0, ZF + LF + 6], [X1, LF + 4, ZC - 50], [0, LF + 4, ZC - 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-8, -4, X1 + 8, 0, 2, 1);
  put(solid(g), prism(P, front, wr, wi, ZC - 58, ZF + LF + 6));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, x1 = x0 + L, xc = x0 + L / 2, grp = mk("g", {}, g);
    // brackets from the wall to the roll's ends
    for (const bx of [x0 - 2, x1]) {
      const [br, bi] = rings(bx, 0, bx + 2, YC + 2, 1, 0.5);
      put(solid(grp), prism(P, front, br, bi, ZC - 3, ZC + 3));
    }
    const ring = (x, r) => Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * 2 * Math.PI; return P(x, YC + r * Math.cos(t), ZC + r * Math.sin(t)); });
    mk("path", { d: poly(hull(ring(x0, RR).concat(ring(x1, RR)))) }, grp);
    mk("path", { d: poly(ring(x1, RR)), class: "nf lo" }, grp);
    mk("path", { d: poly(ring(x1, 4)), class: "nf lo" }, grp);
    const sheet = mk("path", {}, grp), flap = mk("path", { class: "sil" }, grp);
    const rest = k === FAV ? 0.55 : k === 0 ? 0.12 : 0;
    items.push({ k, x0, x1, xc, sheet, flap, rest, t: tween(rest), last: NaN });
  }

  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const len = 4 + 44 * t, ys = YC + RR, u0 = it.x0 + 1, u1 = it.x1 - 1;
    it.sheet.setAttribute("d", poly([[u0, ys, ZC], [u1, ys, ZC], [u1, ys + 0.6, ZC - len], [u0, ys + 0.6, ZC - len]].map((p) => P(...p))));
    const a = rad(4 + 66 * t), s = Math.sin(a), c = Math.cos(a), pts = [];
    for (const d of [0, LF]) for (const o of [0, 1.6]) for (const u of [it.x0 - 3, it.x1 + 3]) {
      const sag = d === LF ? -5 : 0;
      pts.push(P(u, d * c - (o + sag) * s, ZF + d * s + (o + sag) * c));
    }
    it.flap.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.xc, YC, ZC));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? it.rest : dd === 0 ? 1 : dd === 1 ? 0.25 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.flap.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "roll " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "toiletroll",
  means: "Three paper roll holders on a wall: the flap under the pointer tilts up and its sheet slides down; its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[255, 176], [136, 117], [255, 252], null],
  mount,
});
