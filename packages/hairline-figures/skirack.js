/**
 * Ski rack: five pairs of skis stand in a floor tray, their tips resting on a
 * rail along the wall. The pointer chooses a pair, and it tilts off the wall
 * toward the reader, its neighbours easing forward less the farther they
 * stand. At rest the pairs lean at slightly different angles, one bright.
 * The slider is how far the chosen pair tips out.
 *
 * The pattern: a single row picked by its rest centre's screen x; a tween per
 * pair, staggered by distance.
 */
const {
  Cam, facing, fit, prism, proj, rings, fillet, poly, rad, clamp,
  tween, tset, tval, tdone, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const XS = [-48, -24, 0, 24, 48], YB = -12, L = 84, W = 4.2, FAV = 3;
const LEAN = [9, 7.5, 10, 8, 6.5], FALL = [1, 0.42, 0.14, 0.05, 0.02];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.85);
  let out = value;
  const tip = (x, th) => [x, YB - Math.sin(th) * L, 3 + Math.cos(th) * L];
  const ext = [[-74, -34, 0], [74, -34, 0], [-74, -34, 96], [74, -34, 96], [-70, -8, 0], [70, -8, 0]];
  for (const x of XS) { ext.push(tip(x, rad(-16)), [x, YB + 10, 0]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [wr, wi] = rings(-74, -34, 74, -31, 1.2, 0.6);
  put(solid(g), prism(P, front, wr, wi, 0, 96));
  const [rr, ri] = rings(-70, -31, 70, -25, 1.6, 0.8);
  put(solid(g), prism(P, front, rr, ri, 76, 80));
  const [tr, ti] = rings(-70, -31, 70, -6, 3, 1.4);
  put(solid(g), prism(P, front, tr, ti, 0, 3.5));

  const pairs = XS.map((x, i) => {
    const grp = mk("g", {}, g), skis = [];
    for (const dx of [-2.6, 2.6]) {
      const s = solid(grp);
      s.dot = flatDot(grp, C, 0.9, "dot off");
      skis.push({ x: x + dx, s });
    }
    return { i, x, grp, skis, tw: tween(LEAN[i]), drawn: NaN, cx: P(x, YB - 6, 42)[0] };
  });

  function shape(xc, th) {
    const b = (t, n = 0) => {
      const c = Math.cos(th), s = Math.sin(th);
      return [YB - s * t + c * n, 3.5 + c * t + s * n];
    };
    const pts = [];
    const path = [[0, 0], [L - 10, 0], [L - 4, 1.4], [L, 4.6]];
    for (const [t, n] of path) { const [y, z] = b(t, n); pts.push(P(xc - W / 2, y, z)); }
    for (const [t, n] of path.slice().reverse()) { const [y, z] = b(t, n); pts.push(P(xc + W / 2, y, z)); }
    return { d: poly(fillet(pts, pts.map(() => 1.2))), bind: (() => { const [y, z] = b(L * 0.42, 1.2); return P(xc, y, z); })() };
  }

  function draw(p, now) {
    const th = rad(tval(p.tw, now));
    if (Math.abs(th - p.drawn) < 1e-5) return;
    p.drawn = th;
    for (const k of p.skis) {
      const sh = shape(k.x, th);
      k.s.sil.setAttribute("d", sh.d);
      k.s.cr.setAttribute("d", "");
      place(k.s.dot, sh.bind);
    }
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const p of pairs) { draw(p, now); if (!tdone(p.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let cur = -2;
  function choose(a) {
    if (a === cur) return;
    cur = a;
    const now = performance.now();
    for (const p of pairs) {
      const to = a < 0 ? LEAN[p.i] : LEAN[p.i] - (8 + 16 * out) * FALL[Math.abs(p.i - a)];
      tset(p.tw, to, now, a < 0 ? 0 : Math.abs(p.i - a) * 40);
      const on = a < 0 ? p.i === FAV : p.i === a;
      for (const k of p.skis) k.s.sil.classList.toggle("hi", on);
    }
    read.textContent = a < 0 ? "rest" : "pair " + (a + 1);
    B.wake();
  }

  const top = P(0, -30, 96)[1], bot = P(0, 0, 0)[1];
  bag.add(pointer(stage, {
    move: (q) => {
      let a = -1, bd = Infinity;
      for (const p of pairs) { const d = Math.abs(q[0] - p.cx); if (d < bd) { bd = d; a = p.i; } }
      choose(bd > 30 || q[1] < top - 20 || q[1] > bot + 30 ? -1 : a);
    },
    leave: () => choose(-1),
  }));
  bag.add(() => svg.replaceChildren());
  choose(-1);
  for (const p of pairs) draw(p, performance.now());
  return {
    set: (v) => { out = clamp(v, 0, 1.2); const a = cur; cur = -2; choose(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "skirack",
  means: "Five pairs of skis against a wall rail: the pair under the pointer tilts off the wall, its neighbours easing out less.",
  rules: [1, 2, 4, 5],
  range: [0.4, 1, 1.2],
  tour: [[133, 149], [196, 181], [259, 212], null],
  mount,
});
