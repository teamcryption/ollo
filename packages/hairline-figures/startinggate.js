/**
 * Starting gate: a horse-racing starting gate, a row of stalls under one
 * top beam, each stall closed by a pair of front doors. The pointer picks a
 * stall by where it stands: its doors swing wide open, and the gate's other
 * doors spring open after it, staggered from it. At rest one stall stands
 * ajar, bright. The slider is how far the doors swing.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 18, D = 40, H = 38, Z0 = 4, Z1 = H - 4, FAV = 1, AJAR = 30, STEP = 45;
const X1 = N * W;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let A = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-3, -3, 0], [X1 + 3, -3, 0], [X1 + 3, D + W / 2 + 2, 0], [-3, D + W / 2 + 2, 0], [-3, -3, H + 6], [X1 + 3, D + 2, H + 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const plate = (pts, cls, parent) => mk("path", { d: poly(fillet(pts, pts.map(() => 3))), class: cls }, parent);

  // the rear beam, the dividers between stalls far to near, then the front beam
  const beam = (y0, y1) => { const [br, bi] = rings(-3, y0, X1 + 3, y1, 2.5, 1); put(solid(g), prism(P, front, br, bi, H, H + 5)); };
  beam(-1, 6);
  for (let k = 0; k <= N; k++) {
    const x = k * W;
    plate([P(x, 2, 1), P(x, D, 1), P(x, D, H), P(x, 2, H)], k === 0 || k === N ? "" : "lo", g);
  }
  beam(D - 6, D + 2);

  const stalls = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), l = mk("path", { class: "sil" }, grp), lb = mk("path", { class: "lo nf" }, grp);
    const r = mk("path", { class: "sil" }, grp), rb = mk("path", { class: "lo nf" }, grp);
    stalls.push({ k, x0: k * W, x1: (k + 1) * W, l, lb, r, rb, a: tween(k === FAV ? AJAR : 0), last: NaN });
  }

  const w = W / 2 - 0.4;
  function door(path, bar, hx, dir, th) {
    const c = Math.cos(rad(th)) * w * dir, s = Math.sin(rad(th)) * w, tx = hx + c, ty = D + s;
    const pts = [P(hx, D, Z0), P(tx, ty, Z0), P(tx, ty, Z1), P(hx, D, Z1)];
    path.setAttribute("d", poly(fillet(pts, [3, 3, 3, 3])));
    const zm = (Z0 + Z1) / 2, f = 0.8;
    bar.setAttribute("d", seg(P(hx + c * 0.12, D + s * 0.12, zm), P(hx + c * f, D + s * f, zm)) + seg(P(hx + c * f, D + s * f, Z0 + 4), P(hx + c * f, D + s * f, Z1 - 4)));
  }
  function draw(st, th) {
    if (th === st.last) return;
    st.last = th;
    door(st.l, st.lb, st.x0 + 0.4, 1, th);
    door(st.r, st.rb, st.x1 - 0.4, -1, th);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const st of stalls) { draw(st, tval(st.a, now)); if (!tdone(st.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = stalls.map((st) => P((st.x0 + st.x1) / 2, D, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    stalls.forEach((st, k) => {
      const th = a < 0 ? (k === FAV ? AJAR : 0) : k === a ? A : A * 0.7;
      tset(st.a, Math.min(th, 120), now, from < 0 ? 0 : Math.abs(k - from) * STEP);
      const on = k === (a < 0 ? FAV : a);
      st.l.classList.toggle("hi", on);
      st.r.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "gate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { A = v; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "startinggate",
  means: "A racing starting gate: the stall under the pointer swings its front doors wide, and the other stalls spring open after it.",
  rules: [1, 2, 5, 6],
  range: [40, 80, 115],
  tour: [[155, 140], [205, 175], [245, 195], null],
  mount,
});
