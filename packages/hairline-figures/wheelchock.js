/**
 * Wheel chocks: three tyres standing in a row on a garage slab, each with a
 * wedge chock behind it. The pointer picks a tyre by where it stands: its
 * chock slides in snug against the tread, and the other chocks pull back,
 * staggered from it. At rest one chock sits home, bright.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, fillet,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 64, R = 20, W = 14, CL = 18, CH = 11, FAV = 1;
const REST = [9, 0, 14];
const X0 = CL + 16, X1 = X0 + (N - 1) * STEP + R + 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-4, -10, 0], [X1, W + 10, 0], [X1, -10, 0], [-4, W + 10, 0], [X0, 0, 2 * R + 3], [X1 - 10, W, 2 * R + 3]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-4, -10, X1, W + 10, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 3));

  const circle = (cx, y, r, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push(P(cx + r * Math.cos(t), y, 3 + R + r * Math.sin(t))); } return o; };
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP;
    const chock = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, chock), cr = mk("path", { class: "nf lo" }, chock);
    const tyre = mk("g", {}, g);
    mk("path", { d: poly(hull(circle(x, 0, R).concat(circle(x, W, R)))), class: "sil" }, tyre);
    mk("path", { d: poly(circle(x, W, R - 2)), class: "nf lo" }, tyre);
    mk("path", { d: poly(circle(x, W + 0.5, 8, 24)), class: "nf" }, tyre);
    items.push({ k, x, sil, cr, gap: tween(REST[k]), last: NaN });
  }

  function draw(it, gap) {
    if (gap === it.last) return;
    it.last = gap;
    const b = it.x - Math.sqrt(R * R - (R - 2) * (R - 2)) - gap, a = b - CL;
    const prof = fillet([[a, 0], [b, 0], [a + 4, CH]], [1.5, 1, 1.5]);
    const at = (y) => prof.map(([u, z]) => P(u, y, 3 + z));
    const prof2 = fillet([[a + 1.2, 0.8], [b - 3, 0.8], [a + 4.4, CH - 1.6]], [1, 1, 1]);
    it.sil.setAttribute("d", poly(hull(at(1).concat(at(W - 1)))));
    it.cr.setAttribute("d", poly(prof2.map(([u, z]) => P(u, W - 1, 3 + z))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.gap, now)); if (!tdone(it.gap, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x - R / 2, W / 2, 3 + R / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? REST[k] : dd === 0 ? 0 : 12 + 6 * dd;
      tset(it.gap, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "chock " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "wheelchock",
  means: "Three tyres on a slab, each with a wedge chock: the chock behind the tyre under the pointer slides in snug.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[115, 122], [195, 163], [269, 200], null],
  mount,
});
