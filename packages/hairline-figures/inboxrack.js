/**
 * Letter rack: a desk sorter, a slotted base between two end cheeks, with
 * four envelopes standing in its slots. The pointer picks an envelope by
 * where it stands: it tips forward out of its slot to be read, and the ones
 * beside it lean a little, staggered from it. At rest the envelopes stand
 * unevenly and one leans out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), tilting.
 */
const {
  Cam, fillet, fit, facing, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 28, X0 = 16, Y0 = 6, Y1 = 46, ZB = 8, FAV = 2, TIP = 26;
const HS = [50, 42, 54, 38], REST = [-4, 5, 15, -2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-4, -4, 0], [124, -4, 0], [124, 54, 0], [-4, 54, 0], [X0, 20, ZB + 56], [X0 + 3 * STEP + 22, 30, ZB + 40], [0, 0, 36]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fR, fI] = rings(-4, -4, 124, 0, 2, 0.8);
  put(solid(g), prism(P, front, fR, fI, 0, 34)); // the far cheek
  const [bR, bI] = rings(-4, -2, 124, 52, 4, 1.6);
  put(solid(g), prism(P, front, bR, bI, 0, ZB));
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    mk("path", { d: seg(P(x - 2, Y0 - 2, ZB), P(x - 2, Y1 + 2, ZB)) + seg(P(x + 2, Y0 - 2, ZB), P(x + 2, Y1 + 2, ZB)), class: "nf lo" }, g);
  }

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), sil = mk("path", { class: "sil" }, grp), flap = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x: X0 + k * STEP, h: HS[k], sil, flap, a: tween(REST[k]), last: NaN });
  }
  const [nR, nI] = rings(-4, 48, 124, 52, 2, 0.8);
  put(solid(g), prism(P, front, nR, nI, 0, 20)); // the near cheek, low

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const s = Math.sin(rad(deg)), c = Math.cos(rad(deg));
    const q = (y, h) => P(it.x + h * s, y, ZB - 2 + h * c);
    it.sil.setAttribute("d", poly(fillet([q(Y0, 0), q(Y1, 0), q(Y1, it.h), q(Y0, it.h)], [1, 1, 2.5, 2.5])));
    it.flap.setAttribute("d", open([q(Y0 + 1, it.h - 1), q((Y0 + Y1) / 2, it.h - 15), q(Y1 - 1, it.h - 1)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, (Y0 + Y1) / 2, ZB + 20));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? REST[k] : dd === 0 ? TIP : dd === 1 ? 8 : 0;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "inboxrack",
  means: "A desk letter rack with four envelopes in its slots: the one under the pointer tips forward, and its neighbours lean a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[133, 125], [216, 167], [258, 187], null],
  mount,
});
