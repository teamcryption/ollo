/**
 * Football goal: a goal frame with its net pulled back, three balls waiting
 * on the spots in front of it. The pointer picks a ball by where it stands:
 * it pops up off the grass, the balls beside it hop a little, staggered from
 * it. At rest one ball is up, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const W = 110, H = 40, D = 26, BR = 7, N = 3, BY = 40, LIFT = 26, FAV = 2, S = 2.0;
const BX = [22, 55, 88];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-4, -D - 4, 0], [W + 4, -D, 0], [W + 4, BY + BR + 4, 0], [-4, BY + BR, 0], [0, 0, H], [W, 0, H], [BX[0], BY, 2 * BR + LIFT], [BX[2], BY, 2 * BR + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the net: guides from the frame back to the ground, behind the posts
  let nd = "";
  for (let i = 0; i <= 10; i++) { const x = (W * i) / 10; nd += seg(P(x, 0, H), P(x, -D, H * 0.55)) + seg(P(x, -D, H * 0.55), P(x, -D, 0)); }
  for (let j = 0; j <= 4; j++) { const z = (H * 0.55 * j) / 4; nd += seg(P(0, -D, z), P(W, -D, z)); }
  for (const x of [0, W]) nd += seg(P(x, 0, 0), P(x, -D, 0)) + seg(P(x, 0, H), P(x, -D, H * 0.55)) + seg(P(x, -D, 0), P(x, -D, H * 0.55));
  mk("path", { d: nd, class: "nf lo" }, g);
  mk("path", { d: seg(P(-14, 0, 0), P(W + 14, 0, 0)), class: "nf dash" }, g);
  // the frame: two posts and the bar
  for (const x of [0, W]) { const [r, i] = rings(x - 2, -2, x + 2, 2, 2, 0.6); put(solid(g), prism(P, front, r, i, 0, H)); }
  const [br, bi] = rings(-2, -2, W + 2, 2, 2, 0.6);
  const bar = solid(g);
  put(bar, prism(P, front, br, bi, H - 4, H));

  const balls = BX.map((x, k) => {
    const grp = mk("g", {}, g);
    const shadow = flatDot(grp, C, 2.4, "dot off");
    place(shadow, P(x, BY, 0));
    const body = mk("ellipse", { class: "sil", rx: BR * S, ry: BR * S }, grp);
    const seam = mk("ellipse", { class: "nf lo", rx: BR * S * 0.92, ry: BR * S * 0.36 }, grp);
    const patch = mk("ellipse", { class: "nf lo", rx: BR * S * 0.3, ry: BR * S * 0.3 }, grp);
    return { k, x, body, seam, patch, z: tween(k === FAV ? LIFT * 0.55 : 0), last: NaN };
  });

  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    const [cx, cy] = P(b.x, BY, BR + lift);
    for (const e of [b.body, b.seam]) { e.setAttribute("cx", cx); e.setAttribute("cy", cy); }
    b.patch.setAttribute("cx", cx - BR * S * 0.25); b.patch.setAttribute("cy", cy - BR * S * 0.5);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of balls) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = balls.map((b) => P(b.x, BY, BR));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && sy > mids[best][1] - 90 && sy < mids[best][1] + 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    balls.forEach((b, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.55 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "footballgoal",
  means: "A goal with its net and three balls on the spots: the ball under the pointer pops up off the grass, its neighbours hop a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[112, 178], [158, 201], [205, 225], null],
  mount,
});
