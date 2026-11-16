/**
 * Pick holder: a low slotted block with five guitar picks standing in it,
 * each a rounded triangle point down. The pointer picks one by where it
 * stands: it tilts back out of its slot and its neighbours lean a little,
 * staggered from it. At rest one pick leans, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), a tilt instead of a lift.
 */
const {
  Cam, fit, facing, fillet, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 14, W = 15, PH = 30, BZ = 10, TILT = 62, FAV = 3, T = 1.6;
const OUT = fillet([[-W, PH], [W, PH], [0, 0]], [6, 6, 4], 5);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.95);
  const X1 = (N - 1) * STEP;
  fit(C, [[-12, -20, 0], [X1 + 12, 20, 0], [X1 + 12, -20, 0], [-12, 20, 0], [X1 + 36, 0, PH], [0, 0, PH + 8], [X1, -W, PH + 6], [X1, W, PH + 6]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const sil = mk("path", { class: "sil" }, g), cr = mk("path", { class: "nf lo" }, g);
    items.push({ k, x: k * STEP, sil, cr, a: tween(k === FAV ? 22 : (k % 2) * 4), last: NaN });
  }
  const [br, bi] = rings(-10, -10, X1 + 10, 10, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  for (const it of items) { g.append(it.sil, it.cr); }

  function pts(x, deg, dx) {
    const t = (deg * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    return OUT.map(([v, z]) => { const zz = z; return P(x + dx * c + zz * s, v, BZ + zz * c - dx * s); });
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    it.sil.setAttribute("d", poly(hull(pts(it.x, deg, -T).concat(pts(it.x, deg, T)))));
    it.cr.setAttribute("d", poly(pts(it.x, deg, T).map((p, i, A) => p)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, PH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? 22 : (k % 2) * 4) : dd === 0 ? TILT : dd === 1 ? 24 : 0;
      tset(it.a, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pick " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "picks",
  means: "Five guitar picks standing in a slotted holder: the pick under the pointer tilts back out of its slot, its neighbours lean a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[137, 96], [196, 125], [254, 154], null],
  mount,
});
