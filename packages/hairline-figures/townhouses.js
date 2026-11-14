/**
 * Townhouses: a terrace of four houses sharing walls along a street, each a
 * different height, each with two windows and a front door. The pointer picks
 * a house by where it stands: its door swings open onto the pavement, and the
 * doors beside it crack open, staggered from it. At rest one door stands ajar,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 30, D = 34, HS = [50, 62, 46, 56], DW = 12, DH = 25, OPEN = 85, FAV = 2;
const X1 = N * W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-4, -4, 0], [X1 + 4, D + 16, 0], [X1 + 4, -4, 0], [-4, D + 16, 0], [0, 0, 62], [X1, D, 62]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the pavement
  const [pr, pi] = rings(-4, -4, X1 + 4, D + 16, 4, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, 2));

  const rect = (x0, x1, z0, z1, y) => fillet([P(x0, y, z0), P(x1, y, z0), P(x1, y, z1), P(x0, y, z1)], [0.8, 0.8, 0.8, 0.8], 2);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * W, h = HS[k], grp = mk("g", {}, g);
    const [r, ri] = rings(x0 + 0.5, 0, x0 + W - 0.5, D, 2, 1.4);
    put(solid(grp), prism(P, front, r, ri, 2, 2 + h));
    for (const wx of [x0 + 6, x0 + 17]) mk("path", { d: poly(rect(wx, wx + 7, 2 + h - 20, 2 + h - 8, D)), class: "nf lo" }, grp);
    const hx = x0 + (k % 2 ? W - 6 - DW : 6);
    mk("path", { d: poly(rect(hx, hx + DW, 2, 2 + DH, D)), class: "nf lo" }, grp);
    items.push({ k, x0, hx, flip: k % 2 === 1, t: tween(k === FAV ? 40 : 0), last: NaN });
  }
  // doors swing out in front of every facade, so they paint last
  for (const it of items) it.door = mk("path", { class: "sil" }, g);

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const th = rad(a), hx = it.flip ? it.hx + DW : it.hx, dir = it.flip ? -1 : 1;
    const ex = hx + dir * DW * Math.cos(th), ey = D + DW * Math.sin(th);
    it.door.setAttribute("d", poly(fillet([P(hx, D, 2), P(ex, ey, 2), P(ex, ey, 2 + DH), P(hx, D, 2 + DH)], [0.8, 0.8, 0.8, 0.8], 2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, D / 2, 2 + HS[it.k] / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? (k === FAV ? 40 : 0) : dd === 0 ? OPEN : dd === 1 ? 30 : 0;
      tset(it.t, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.door.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "no " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "townhouses",
  means: "A terrace of four townhouses on a street: the door of the house under the pointer swings open, its neighbours' doors crack.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[123, 178], [198, 215], [235, 234], null],
  mount,
});
