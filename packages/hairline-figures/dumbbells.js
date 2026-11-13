/**
 * Dumbbells: six dumbbells resting across a rack, light to heavy, each two
 * round plates on a short grip. The pointer picks one by where it rests: it
 * lifts off the rack, and the ones beside it rise a little, staggered from
 * it. At rest the heaviest pair is lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = [4.5, 5, 5.6, 6.2, 6.8, 7.6], PT = 3.6, GRIP = 9, STEP = 19, RACK = 16, LIFT = 18, FAV = 5;
const X1 = (R.length - 1) * STEP + 20, YL = PT * 2 + GRIP;

/** A round plate with its axis along y, from y0 to y1, centred at (x, z): its outline and its front face. */
function plate(P, x, z, r, y0, y1) {
  const ring = (y) => Array.from({ length: 28 }, (_, i) => { const t = (i / 28) * Math.PI * 2; return P(x + r * Math.cos(t), y, z + r * Math.sin(t)); });
  return { sil: poly(hull(ring(y0).concat(ring(y1)))), face: poly(ring(y1)) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-6, -6, 0], [X1 + 6, YL + 8, 0], [X1 + 6, -6, 0], [-6, YL + 8, 0], [0, 0, RACK + 8 + LIFT + 2], [X1, 0, RACK + 8 + LIFT + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the rack: a board on two feet
  for (const x0 of [2, X1 - 8]) { const [r, i] = rings(x0, -2, x0 + 6, YL + 4, 1.2, 0.6); put(solid(g), prism(P, front, r, i, 0, RACK - 3)); }
  const [br, bi] = rings(-4, -4, X1 + 4, YL + 6, 2.5, 1.2);
  put(solid(g), prism(P, front, br, bi, RACK - 3, RACK));

  const bells = R.map((r, k) => {
    const x = 10 + k * STEP, grp = mk("g", {}, g);
    const back = mk("path", { class: "sil" }, grp), backFace = mk("path", { class: "nf lo" }, grp);
    const grip = mk("path", { class: "nf sil" }, grp);
    const frontP = mk("path", { class: "sil" }, grp), frontFace = mk("path", { class: "nf lo" }, grp);
    return { k, x, r, grp, back, backFace, grip, frontP, frontFace, z: tween(k === FAV ? LIFT * 0.75 : 0), last: NaN };
  });

  function draw(b, lift) {
    if (lift === b.last) return;
    b.last = lift;
    const z = RACK + b.r + lift, y0 = 1, y1 = y0 + PT, y2 = y1 + GRIP, y3 = y2 + PT;
    const a = plate(P, b.x, z, b.r, y0, y1), c = plate(P, b.x, z, b.r, y2, y3);
    b.back.setAttribute("d", a.sil); b.backFace.setAttribute("d", a.face);
    b.grip.setAttribute("d", seg(P(b.x, y1, z + 1.3), P(b.x, y2, z + 1.3)) + seg(P(b.x, y1, z - 1.3), P(b.x, y2, z - 1.3)));
    b.frontP.setAttribute("d", c.sil); b.frontFace.setAttribute("d", c.face);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of bells) { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = bells.map((b) => P(b.x, YL / 2, RACK + b.r));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bells.forEach((b, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.75 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      b.back.classList.toggle("hi", on); b.frontP.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "dumbbell " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "dumbbells",
  means: "Six dumbbells on a rack, light to heavy: the one under the pointer lifts off, and its neighbours rise a little.",
  rules: [1, 2, 5, 9],
  range: [0, 45, 90],
  tour: [[122, 121], [185, 152], [282, 196], null],
  mount,
});
