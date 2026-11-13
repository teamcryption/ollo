/**
 * Bike rack: four bicycles parked side by side, front wheels in a low street
 * rack, each with two wheels, a diamond frame, a saddle and a handlebar. The
 * pointer picks a bike by where it stands: it rolls out toward the reader,
 * and the bikes beside it roll a little, staggered from it. At rest one bike
 * is half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the bike
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 17, R = 9, WB = 22, Y0 = 4, OUT = 20, FAV = 2, REST = [0, 3, 10, 1];
const X1 = (N - 1) * STEP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-12, -10, 0], [X1 + 12, Y0 + WB + R + OUT + 4, 0], [X1 + 12, -10, 0], [-12, Y0 + WB + R + OUT + 4, 0], [0, 0, 2 * R + 10], [X1, 0, 2 * R + 10]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-12, -10, X1 + 12, Y0 + WB + R + OUT + 4, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, -3, 0));
  // the rack: a low rail on two feet, behind the front wheels
  for (const x of [-8, X1 + 8]) { const [r, i] = rings(x - 1.5, -4, x + 1.5, -1, 1.2, 0.5); put(solid(g), prism(P, front, r, i, 0, 13)); }
  { const [r, i] = rings(-9.5, -4, X1 + 9.5, -1, 1.4, 0.6); put(solid(g), prism(P, front, r, i, 11, 14)); }

  const wheel = (x, yc, rr) => Array.from({ length: 32 }, (_, i) => { const t = (i / 32) * Math.PI * 2; return P(x, yc + rr * Math.cos(t), R + rr * Math.sin(t)); });
  const bikes = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const parts = { w0: mk("path", { class: "sil" }, grp), t0: mk("path", { class: "nf lo" }, grp), w1: mk("path", { class: "sil" }, grp), t1: mk("path", { class: "nf lo" }, grp), fr: mk("path", { class: "nf sil" }, grp), bar: mk("path", { class: "nf sil" }, grp) };
    bikes.push({ k, x: k * STEP, grp, parts, y: tween(REST[k]), last: NaN });
  }

  function draw(b, dy) {
    if (dy === b.last) return;
    b.last = dy;
    const x = b.x, yf = Y0 + dy, yr = Y0 + WB + dy, p = b.parts;
    p.w0.setAttribute("d", poly(wheel(x, yf, R))); p.t0.setAttribute("d", poly(wheel(x, yf, R - 2)));
    p.w1.setAttribute("d", poly(wheel(x, yr, R))); p.t1.setAttribute("d", poly(wheel(x, yr, R - 2)));
    const F = P(x, yf, R), Rh = P(x, yr, R), BB = P(x, yf + 12, R - 1), S = P(x, yf + 15, R + 12), H = P(x, yf + 3, R + 12), HT = P(x, yf + 1.5, R + 16);
    p.fr.setAttribute("d", open([F, H, S, Rh, BB, S]) + seg(H, BB) + seg(P(x, yf + 13, R + 13.5), P(x, yf + 19, R + 13.5)));
    p.bar.setAttribute("d", open([H, HT]) + seg(P(x - 5, yf + 2.5, R + 16), P(x + 5, yf + 2.5, R + 16)));
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bikes) { draw(b, tval(b.y, now)); if (!tdone(b.y, now)) moving = true; }
    const order = bikes.slice().sort((a, c) => a.x + tval(a.y, now) * 1.2 - (c.x + tval(c.y, now) * 1.2));
    const key = order.map((b) => b.k).join();
    if (key !== painted) { painted = key; for (const b of order) g.appendChild(b.grp); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = bikes.map((b) => P(b.x, Y0 + WB / 2, R));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bikes.forEach((b, k) => {
      const d = Math.abs(k - a), y = a < 0 ? REST[k] : d === 0 ? OUT : d === 1 ? 5 : 1;
      tset(b.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const key of ["w0", "w1", "fr", "bar"]) b.parts[key].classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "bike " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bikerack",
  means: "Four bicycles in a street rack: the bike under the pointer rolls out toward you, and its neighbours roll a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[174, 140], [229, 168], [257, 182], null],
  mount,
});
