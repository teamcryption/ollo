/**
 * Pill reminder: a tower of seven drawers, one per day, each with a pull dot
 * on its front. The pointer picks a drawer by its height: it slides out to
 * show its pills, and the drawers above and below slide a little, staggered
 * from it. At rest the fourth drawer stands half out, bright.
 */
const { Cam, circ, fit, flatDot, hull, place, poly, proj, rings, tset, tval, tdone, tween, disposer, mk, pointer, register, solid } = HL;

const N = 7, DH = 11, OUT = 24, REST = [0.05, 0.15, 0.3, 0.6, 0.2, 0.05, 0.1], FAV = 3, AMT = [1, 0.45, 0.2, 0.08, 0.03, 0.01, 0];
const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-2, -2, 0], [38 + OUT, 42, 0], [-2, 42, 0], [38 + OUT, -2, 0], [-2, -2, 86], [38, 42, 86]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const W = (dx, ring, z) => ring.map((q) => P(q.u + dx, q.v, z));
  const body = (s, [o, i], z0, z1, dx = 0) => {
    s.sil.setAttribute("d", poly(hull(W(dx, o, z0).concat(W(dx, o, z1)))));
    s.cr.setAttribute("d", poly(W(dx, i, z1)));
  };
  body(solid(g), rings(-2, -2, 38, 42, 4, 1.5), 0, 3);

  const items = [];
  for (let k = 0; k < N; k++) {
    const z0 = 3 + k * DH, grp = mk("g", {}, g), s = solid(grp);
    const R = rings(0, 1, 36, 39, 3, 1.4), pills = [[24, 12], [28, 24], [22, 30]].map(() => solid(grp));
    const pull = flatDot(grp, C, 1.4, "dot off");
    const draw = (v) => {
      const dx = v * OUT;
      body(s, R, z0, z0 + DH - 1, dx);
      [[24, 12], [28, 22], [21, 28]].forEach(([u, w], j) => {
        if (v > 0.25) body(pills[j], [disc(u + dx, w, 2.4), disc(u + dx, w, 1.4)], z0 + DH - 1, z0 + DH + 0.5);
        else { pills[j].sil.setAttribute("d", ""); pills[j].cr.setAttribute("d", ""); }
      });
      place(pull, P(36 + dx, 20, z0 + DH / 2));
    };
    items.push({ s, draw, tw: tween(REST[k]), last: NaN, mid: P(36, 20, z0 + DH / 2) });
  }
  const capg = solid(g);
  body(capg, rings(-2, -2, 38, 42, 4, 1.5), 3 + N * DH, 6 + N * DH);

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { const v = tval(it.tw, now); if (v !== it.last) { it.last = v; it.draw(v); } if (!tdone(it.tw, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.abs(it.mid[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 16 && Math.abs(items[best].mid[0] - sx) < 80 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      tset(it.tw, a < 0 ? REST[k] : AMT[Math.abs(k - a)], now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "day " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pillboxweek",
  means: "A pill reminder tower of seven day drawers: the drawer under the pointer slides out to show its pills, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 30, 60],
  tour: [[211, 231], [211, 176], [211, 121], null],
  mount,
});
