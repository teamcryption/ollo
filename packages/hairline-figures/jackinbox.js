/**
 * Jackinbox: three jack-in-the-box toys in a row, each a rounded cube with a
 * crank on its face and a lid hinged at the back, a coiled spring and a ball
 * head inside. The pointer picks a box by where it stands: its lid flips open
 * and the spring pops the ball up, and the lids beside it lift slightly,
 * staggered from it. At rest one jack is half out, bright, the cranks at
 * different turns. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the box
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 22, H = 22, STEP = 36, T = 2, POP = 30, BR = 5.5, S = 2.5, FAV = 1;
const REST = [0, 100, 7], CRANK = [30, 150, 250];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, S);
  const X1 = (N - 1) * STEP + W;
  fit(C, [[0, 0, 0], [X1, W + 6, 0], [X1, 0, 0], [0, W + 6, 0], [0, -6, H + W], [W / 2, W / 2, H + POP + 2 * BR + 2], [X1 - W / 2, W / 2, H + POP + 2 * BR + 2]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const boxes = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, cx = x0 + W / 2, grp = mk("g", {}, g);
    const [r, i] = rings(x0, 0, x0 + W, W, 3, 1.4);
    put(solid(grp), prism(P, front, r, i, 0, H));
    // the crank on the near face: an axle, an arm, a knob
    const a = rad(CRANK[k]), hx = cx + 6 * Math.cos(a), hz = H / 2 + 6 * Math.sin(a);
    mk("path", { class: "nf lo", d: open([P(cx, W, H / 2), P(cx, W + 3, H / 2), P(hx, W + 3, hz)]) }, grp);
    const [kr, ki] = rings(hx - 1.4, W + 3, hx + 1.4, W + 7, 1.3, 0.5);
    put(solid(grp), prism(P, front, kr, ki, hz - 1.4, hz + 1.4));
    const lid = mk("path", { class: "sil" }, grp), lidCr = mk("path", { class: "nf lo" }, grp);
    const coil = mk("path", { class: "nf sil" }, grp), ball = mk("path", { class: "sil" }, grp);
    boxes.push({ k, x0, cx, lid, lidCr, coil, ball, th: tween(REST[k]), last: NaN });
  }

  // a point of the lid: u along x, v from the hinge, w up through its thickness, turned by th about the back top edge
  const lidRing = (b) => rrect(b.x0 - 0.8, 0, b.x0 + W + 0.8, W + 0.8, 3, 4);
  const at = (th) => (s, w) => P(s.u, s.v * Math.cos(th) - w * Math.sin(th), H + s.v * Math.sin(th) + w * Math.cos(th));
  function draw(b, deg) {
    if (deg === b.last) return;
    b.last = deg;
    const th = rad(deg), f = at(th), ring = lidRing(b);
    b.lid.setAttribute("d", poly(hull(ring.map((s) => f(s, 0)).concat(ring.map((s) => f(s, T))))));
    const up = -0.61 * Math.sin(th) + 0.5 * Math.cos(th) > 0;
    const inner = rrect(b.x0 + 1.2, 2, b.x0 + W - 1.2, W - 1.2, 2, 4);
    b.lidCr.setAttribute("d", deg < 1 ? "" : poly(inner.map((s) => f(s, up ? T : 0))));
    const h = POP * clamp((deg - 55) / 50, 0, 1), cy = W / 2;
    if (h < 1) { b.coil.setAttribute("d", ""); b.ball.setAttribute("d", ""); return; }
    const pts = [];
    for (let i = 0; i <= 60; i++) { const t = (i / 60) * Math.PI * 2 * 5; pts.push(P(b.cx + 4 * Math.cos(t), cy + 4 * Math.sin(t), H + 1 + (h * i) / 60)); }
    b.coil.setAttribute("d", open(pts));
    const [bx, by] = P(b.cx, cy, H + h + BR), ring2 = [];
    for (let i = 0; i < 32; i++) { const t = (i / 32) * Math.PI * 2; ring2.push([bx + BR * S * Math.cos(t), by + BR * S * Math.sin(t)]); }
    b.ball.setAttribute("d", poly(ring2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boxes) { draw(b, tval(b.th, now)); if (!tdone(b.th, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = boxes.map((b) => P(b.cx, W / 2, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boxes.forEach((b, k) => {
      const d = Math.abs(k - a), th = a < 0 ? REST[k] : d === 0 ? 118 : d === 1 ? 16 : 5;
      tset(b.th, th, now, from < 0 ? 0 : d * stag);
      const on = k === (a < 0 ? FAV : a);
      b.lid.classList.toggle("hi", on); b.ball.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "jackinbox",
  means: "Three jack-in-the-boxes: the lid under the pointer flips open and the jack springs up, the lids beside it lift slightly.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[142, 147], [205, 178], [269, 210], null],
  mount,
});
