/**
 * Newton cradle: five steel balls hung in a row from a frame on a base.
 * The pointer picks a ball by where it stands: that ball and the ones on
 * its outer side swing out, staggered from it. At rest the end ball is held
 * out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, R = 9, STEP = 2 * R, L = 52, H = 78, W = 16, BZ = 5, SW = 0.75;
const X0 = -22, X1 = (N - 1) * STEP + 22;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[X0, -W - 6, 0], [X1, W + 6, 0], [X0, W + 6, 0], [X1, -W - 6, 0], [X0 - 30, 0, H], [X1 + 30, 0, H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(X0, -W - 6, X1, W + 6, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const back = mk("path", { class: "nf", d: seg(P(X0 + 4, -W, BZ), P(X0 + 4, -W, H)) + seg(P(X1 - 4, -W, BZ), P(X1 - 4, -W, H)) + seg(P(X0 + 4, -W, H), P(X1 - 4, -W, H)) }, g);
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const str = mk("path", { class: "nf lo" }, grp), ball = mk("path", { class: "sil" }, grp);
    items.push({ k, x: k * STEP, grp, str, ball, a: tween(k === 0 ? -SW : 0), last: NaN });
  }
  mk("path", { class: "nf", d: seg(P(X0 + 4, W, BZ), P(X0 + 4, W, H)) + seg(P(X1 - 4, W, BZ), P(X1 - 4, W, H)) + seg(P(X0 + 4, W, H), P(X1 - 4, W, H)) }, g);

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const cx = it.x + L * Math.sin(a), cz = H - L * Math.cos(a), pts = [];
    for (let i = -4; i <= 4; i++) { const t = i / 4.2, r = R * Math.sqrt(1 - t * t); pts.push(...ringAt(P, disc(cx, 0, r), cz + R * t)); }
    it.ball.setAttribute("d", poly(hull(pts)));
    const top = [it.x + (L - R) * Math.sin(a), 0, H - (L - R) * Math.cos(a)];
    it.str.setAttribute("d", seg(P(it.x, -W, H), P(...top)) + seg(P(it.x, W, H), P(...top)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, H - L));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      let t = 0;
      if (a < 0) t = k === 0 ? -SW : 0;
      else if (a < N / 2 && k <= a) t = -SW;
      else if (a >= N / 2 && k >= a) t = SW;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.ball.classList.toggle("hi", k === (a < 0 ? 0 : a));
    });
    read.textContent = a < 0 ? "rest" : "ball " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pendulum",
  means: "A Newton cradle: the ball under the pointer and those outside it swing out from the row, staggered.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[172, 174], [228, 202], [256, 216], null],
  mount,
});
