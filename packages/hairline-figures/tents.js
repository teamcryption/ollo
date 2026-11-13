/**
 * Tents: a campsite with three ridge tents of different sizes around a ring
 * of stones with two crossed logs. Each tent has a pole tip at both ends of
 * its ridge and a triangular door on its front gable. The pointer picks a
 * tent: its door flap rolls aside, and the flaps of the others open a little,
 * staggered from it. At rest the middle tent's flap is half rolled, bright.
 * The slider is the stagger.
 *
 * The pattern: tents stand at different heights, so the hit unprojects onto
 * each tent's own mid-height plane and takes the one nearest its middle.
 */
const {
  Cam, circ, fillet, fit, facing, hull, lerp, poly, prism, proj, rings, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TENTS = [
  { c: [-42, -8], f: "x", L: 26, w: 11, h: 17 },
  { c: [4, -42], f: "y", L: 36, w: 16, h: 25 },
  { c: [42, 8], f: "y", L: 30, w: 13, h: 20 },
];
const REST = [0.12, 0.5, 0.04], FAV = 1, NEAR = [1, 0.4, 0.18];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.1);
  const W = (t, a, b, z) => (t.f === "x" ? [t.c[0] + a, t.c[1] + b, z] : [t.c[0] + b, t.c[1] + a, z]);
  const ext = [[-66, -66, -4], [66, 36, -4], [66, -66, -4], [-66, 36, -4]];
  for (const t of TENTS) ext.push(W(t, 0, 0, t.h + 3));
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const root = mk("g", {}, svg);
  const [pr, pi] = rings(-66, -66, 66, 36, 10, 2);
  put(solid(root), prism(P, front, pr, pi, -4, 0));

  function fire() {
    put(solid(root), prism(P, front, circ(9, 36), circ(7.4, 36), 0, 2.5));
    mk("path", { class: "nf lo", d: seg(P(-5, -2, 2.5), P(5, 2, 2.5)) + seg(P(-2, 5, 2.5), P(2, -5, 2.5)) }, root);
  }

  const tents = TENTS.map((t, k) => {
    if (k === 2) fire();
    const Q = (a, b, z) => P(...W(t, a, b, z)), { L, w, h } = t, F = L / 2;
    const g = mk("g", {}, root), pts = [];
    for (const a of [-F, F]) pts.push(Q(a, -w, 0), Q(a, w, 0), Q(a, 0, h));
    const hl = hull(pts);
    mk("path", { class: "sil", d: poly(fillet(hl, hl.map(() => 1.6))) }, g);
    mk("path", {
      class: "nf lo",
      d: seg(Q(F, 0, h), Q(F, w, 0)) + seg(Q(F, 0, h), Q(F, 0, h + 3)) + seg(Q(-F, 0, h), Q(-F, 0, h + 3)),
    }, g);
    const D = Q(F, 0, 0.9 * h), dl = 0.78 * w;
    mk("path", { class: "nf lo", d: poly([D, Q(F, dl, 0), Q(F, -dl, 0)]) }, g);
    const flap = mk("path", { class: "lo" }, g), roll = mk("path", { class: "nf lo" }, g);
    return { k, t, Q, F, D, dl, flap, roll, o: tween(REST[k]), last: "" };
  });

  function draw(s, o) {
    const key = o.toFixed(3);
    if (key === s.last) return;
    s.last = key;
    const { Q, F, D, dl } = s, b = lerp(dl, -dl, 0.86 * o), q = Q(F, b, 0);
    s.flap.setAttribute("d", poly([D, q, Q(F, -dl, 0)]));
    s.roll.setAttribute("d", o > 0.02 ? seg(Q(F, 0, 0.86 * s.t.h), Q(F, b - 2.4 * o, 0)) : "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of tents) { draw(s, tval(s.o, now)); if (!tdone(s.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The tent whose middle, on its own mid-height plane, is nearest the pointer. */
  function hit([sx, sy]) {
    let best = -1, bd = 1.25;
    tents.forEach((s, k) => {
      const t = s.t, [x, y] = unproj(C, sx, sy, t.h / 2);
      let a = x - t.c[0], b = y - t.c[1];
      if (t.f === "y") [a, b] = [b, a];
      const d = Math.hypot(a / (t.L / 2 + 4), b / (t.w + 4));
      if (d < bd) { bd = d; best = k; }
    });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tents.forEach((s, k) => {
      const d = Math.abs(k - a), o = a < 0 ? REST[k] : NEAR[d];
      tset(s.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.flap.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tent " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tents",
  means: "Three ridge tents round a campfire: the door flap of the tent under the pointer rolls open, and its neighbours' open a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[145, 127], [219, 135], [206, 203], null],
  mount,
});
