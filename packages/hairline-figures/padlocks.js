/**
 * Padlocks: five padlocks hung on a rail, each a rounded body with a keyhole
 * under a U-shaped shackle. The pointer picks a lock: its shackle springs up
 * open, and the shackles beside it lift a little, staggered from it. At rest
 * one lock hangs open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the lock
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const N = 5, BW = 20, BD = 12, BH = 22, GAP = 12, SR = 6, LEG = 9, OPEN = 11, FAV = 2;
const X1 = N * BW + (N - 1) * GAP, RAIL = BH + LEG + SR + 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-8, 0, 0], [X1 + 8, BD, 0], [X1 + 8, 0, 0], [-8, BD, 0], [-8, BD / 2, RAIL + 4], [X1 + 8, BD / 2, RAIL + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rail the locks hang from: a bar on two posts
  const [pr, pi] = rings(-8, BD / 2 - 2, -4, BD / 2 + 2, 1, 0.5);
  put(solid(g), prism(P, front, pr, pi, 0, RAIL + 3));
  const [rr, ri] = rings(-8, BD / 2 - 1.6, X1 + 8, BD / 2 + 1.6, 1.4, 0.5);
  const rail = solid(g);

  const locks = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (BW + GAP), cx = x0 + BW / 2;
    const shackle = mk("path", { class: "nf sil" }, g);
    const body = solid(g), hole = mk("path", { class: "nf" }, body.g);
    const [r, i] = rings(x0, 0, x0 + BW, BD, 3.5, 1.4);
    put(body, prism(P, front, r, i, 0, BH));
    const kz = BH * 0.45;
    hole.setAttribute("d", seg(P(cx, BD, kz - 1), P(cx, BD, kz - 5)));
    place(mk("circle", { r: 1.6, class: "dot m" }, body.g), P(cx, BD, kz));
    locks.push({ k, cx, shackle, body, z: tween(k === FAV ? OPEN : 0), last: NaN });
  }
  put(rail, prism(P, front, rr, ri, RAIL, RAIL + 3));
  const [qr, qi] = rings(X1 + 4, BD / 2 - 2, X1 + 8, BD / 2 + 2, 1, 0.5);
  put(solid(g), prism(P, front, qr, qi, 0, RAIL + 3));

  /** The shackle lifted z: two legs and the arch, in the lock's middle plane; open, the left leg clears the body. */
  function draw(l, z) {
    if (z === l.last) return;
    l.last = z;
    const y = BD / 2, base = BH + z, top = base + LEG, arc = [];
    for (let i = 0; i <= 12; i++) { const t = Math.PI - (Math.PI * i) / 12; arc.push(P(l.cx + SR * Math.cos(t), y, top + SR * Math.sin(t))); }
    const leftFoot = z > 0.5 ? base + Math.min(z, 5) : BH - 1;
    l.shackle.setAttribute("d", open([P(l.cx - SR, y, leftFoot), ...arc, P(l.cx + SR, y, BH - 1)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const l of locks) { draw(l, tval(l.z, now)); if (!tdone(l.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = locks.map((l) => P(l.cx, BD, BH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    locks.forEach((l, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? OPEN : 0) : dd === 0 ? OPEN : dd === 1 ? 3 : 0;
      tset(l.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      l.shackle.setAttribute("class", on ? "nf hi" : "nf sil");
      l.body.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "lock " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "padlocks",
  means: "Five padlocks on a rail: the shackle of the one under the pointer springs open, and its neighbours lift a little.",
  rules: [1, 2, 5, 10],
  range: [0, 45, 90],
  tour: [[115, 150], [233, 206], [272, 224], null],
  mount,
});
