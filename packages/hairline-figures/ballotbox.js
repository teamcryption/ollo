/**
 * Ballot box: a lidded box with a long slot in its lid and a hasp on its
 * front, and beside it a low tray of six sealed envelopes standing on edge,
 * leaning back, each with its flap. The pointer picks an envelope by its
 * top edge: it stands up and rises to hang over the slot, ready to drop,
 * and the envelopes beside it lift a little, staggered from it. At rest one
 * envelope sits a little proud of the others, bright. The slider is the
 * stagger.
 *
 * The pattern: discrete items in a tray (riffle). Tweens, a stagger by
 * distance, and a hit test on static bands along the resting top edges.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rad, ringAt, rings, rrect, run, seg,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, EW = 40, EH = 28, G = 7, TK = 1.2, REST = -10, FAV = 2, UP = 44;
const X0 = -4, X1 = EW + 4, Y0 = -7, Y1 = (N - 1) * G + 7, WH = 10, WR = 4, WT = 2;
const BX0 = -68, BX1 = -14, BY0 = -6, BY1 = 41, BH = 36, SY = (BY0 + BY1) / 2, SX = (BX0 + BX1) / 2;
const REST_LIFT = (i) => (i === FAV ? 6 : 0);
const LR = (pts) => (pts[0][0] <= pts[pts.length - 1][0] ? pts : pts.slice().reverse());

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[BX0 - 1, BY0 - 1, 0], [BX1, BY1, 0], [X1, Y1, 0], [X1, Y0, 0], [BX0, BY0, BH], [SX, SY, UP + EH], [X0, Y0, EH + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the ballot box: body, lid, the slot in the lid, and a hasp under the lid's lip
  const [br, bi] = rings(BX0, BY0, BX1, BY1, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, BH - 4));
  const [lr, li] = rings(BX0 - 1.2, BY0 - 1.2, BX1 + 1.2, BY1 + 1.2, 3.6, 1.6);
  put(solid(g), prism(P, front, lr, li, BH - 4, BH));
  mk("path", { d: poly(ringAt(P, rrect(SX - 23, SY - 1.8, SX + 23, SY + 1.8, 1.6, 4), BH)), class: "nf" }, g);
  mk("path", { d: seg(P(SX - 21.5, SY - 1.8, BH - 1.6), P(SX + 21.5, SY - 1.8, BH - 1.6)), class: "nf lo" }, g);
  const onFront = (ring) => ring.map((q) => P(q.u, BY1, q.v));
  mk("path", { d: poly(onFront(rrect(SX - 3, BH - 13, SX + 3, BH - 4, 1.2, 3))), class: "nf" }, g);
  mk("path", { d: poly(onFront(rrect(SX - 1, BH - 10, SX + 1, BH - 7, 0.9, 2))), class: "nf lo" }, g);
  mk("path", { d: seg(P(BX0 + 3, BY1, 5), P(BX1 - 3, BY1, 5)), class: "nf lo" }, g);

  // the tray's far half, painted before the envelopes
  const outer = rrect(X0, Y0, X1, Y1, WR, 6), inner = rrect(X0 + WT, Y0 + WT, X1 - WT, Y1 - WT, WR - WT, 6);
  mk("path", { d: poly(hull(ringAt(P, outer, 0).concat(ringAt(P, outer, WH)))), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, inner, WH)), class: "nf" }, g);
  mk("path", { d: open(ringAt(P, run(inner, (q) => !front(q)), 2)), class: "nf lo" }, g);

  const shape = fillet([[0, 0], [EW, 0], [EW, EH], [0, EH]], [1.2, 1.2, 1.2, 1.2]);
  const envs = [];
  for (let i = 0; i < N; i++) {
    const grp = mk("g", {}, g);
    const back = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    const flap = mk("path", { class: "nf lo" }, grp);
    envs.push({ i, back, face, flap, a: tween(REST), z: tween(REST_LIFT(i)), m: tween(0), last: "" });
  }

  // the tray's near half: one opaque piece from the rim's inner edge down to the floor
  const iF = LR(ringAt(P, run(inner, front), WH)), oT = LR(ringAt(P, run(outer, front), WH)), oB = LR(ringAt(P, run(outer, front), 0));
  mk("path", { d: poly([...iF, oT[oT.length - 1], ...oB.slice().reverse(), oT[0]]), class: "fo" }, g);
  mk("path", { d: open(oT), class: "nf lo" }, g);
  mk("path", { d: open(iF), class: "nf" }, g);
  mk("path", { d: open([oT[0], ...oB, oT[oT.length - 1]]), class: "nf sil" }, g);

  /** Envelope i leaning th degrees, lifted by z, and carried m of the way over the slot. */
  function draw(e, th, z, m) {
    const key = th.toFixed(2) + "," + z.toFixed(2) + "," + m.toFixed(3);
    if (key === e.last) return;
    e.last = key;
    const s = Math.sin(rad(th)), c = Math.cos(rad(th));
    const x0 = m * (SX - EW / 2), y0 = e.i * G + m * (SY - e.i * G);
    const w = (u, v) => P(x0 + u, y0 + v * s, v * c + z);
    const wb = (u, v) => P(x0 + u, y0 + v * s - TK * c, v * c + TK * s + z);
    e.back.setAttribute("d", poly(shape.map((p) => wb(p[0], p[1]))));
    e.face.setAttribute("d", poly(shape.map((p) => w(p[0], p[1]))));
    e.flap.setAttribute("d", open([w(1.6, EH - 1.6), w(EW / 2, EH - 13), w(EW - 1.6, EH - 1.6)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const e of envs) {
      draw(e, tval(e.a, now), tval(e.z, now), tval(e.m, now));
      if (!tdone(e.a, now) || !tdone(e.z, now) || !tdone(e.m, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // hit bands: oblique strips along the RESTING top edges. They never move, and nothing draws them.
  const top = (i) => P(EW / 2, i * G + EH * Math.sin(rad(REST)), EH * Math.cos(rad(REST)));
  const c0 = top(0), c1 = top(1), d = [c1[0] - c0[0], c1[1] - c0[1]];
  const px0 = P(0, 0, 0), px1 = P(1, 0, 0), ex = [px1[0] - px0[0], px1[1] - px0[1]];
  const HALF = EW / 2 + 4, det = d[0] * ex[1] - d[1] * ex[0];
  function hit([x, y]) {
    const qx = x - c0[0], qy = y - c0[1];
    const s = (qx * ex[1] - qy * ex[0]) / det, r = (d[0] * qy - d[1] * qx) / det;
    if (Math.abs(r) > HALF || s < -0.6 || s > N - 0.4) return -1;
    return clamp(Math.round(s), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    envs.forEach((e, i) => {
      const dd = Math.abs(i - a), delay = from < 0 ? 0 : Math.abs(i - from) * stag;
      const z = a < 0 ? REST_LIFT(i) : dd === 0 ? UP : dd === 1 ? 7 : dd === 2 ? 3 : 0;
      tset(e.a, a === i ? 0 : REST, now, delay); tset(e.z, z, now, delay); tset(e.m, a === i ? 1 : 0, now, delay);
      e.face.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "envelope " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ballotbox",
  means: "A ballot box and a tray of six envelopes: the envelope under the pointer rises over the slot, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[223, 157], [227, 181], [219, 211], null],
  mount,
});
