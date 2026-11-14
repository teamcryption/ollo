/**
 * Travel adapter: a rounded adapter body with a socket on its near face and
 * three plug heads along its top, each carrying its own pin pattern (two
 * flat blades, two round pins, three bars). The pointer picks a head by where
 * it is along the adapter: that head slides out tall with its pins, the
 * others sink back, staggered from it. At rest one head stands half out,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is each head's
 * rest centre, nearest along screen x.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, seg, poly, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 18, GAP = 3, X1 = N * (W + GAP) + GAP, Y1 = 34, BZ = 18, MH = 8, LIFT = 30;
const REST = [3, 12, 1], FAV = 1;
const PINS = [
  { h: 10, p: [[-5, -3.5, -3.4, 3.5], [3.4, -3.5, 5, 3.5]] },
  { h: 11, p: [[-6, -1.6, -2.8, 1.6], [2.8, -1.6, 6, 1.6]] },
  { h: 9, p: [[-6, 2, -2.4, 4], [2.4, 2, 6, 4], [-1, -6, 1, -1.8]] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [GAP + W / 2, 17, BZ + MH + LIFT + 11]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [ring, inner] = rings(0, 0, X1, Y1, 7, 1.4);
  const body = solid(g);
  put(body, prism(P, front, ring, inner, 0, BZ));
  // the socket on the near face: a rounded rim and two slots
  const sx = X1 * 0.55, rim = [];
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; rim.push(P(sx + 6 * Math.cos(a), Y1, 9 + 5.5 * Math.sin(a))); }
  mk("path", { class: "nf lo", d: poly(rim) + seg(P(sx - 2.5, Y1, 7.5), P(sx - 2.5, Y1, 10.5)) + seg(P(sx + 2.5, Y1, 7.5), P(sx + 2.5, Y1, 10.5)) }, body.g);

  const heads = [];
  for (let k = 0; k < N; k++) {
    const cx = GAP + k * (W + GAP) + W / 2, grp = mk("g", {}, g);
    const head = solid(grp), pins = PINS[k].p.map(() => solid(grp));
    heads.push({ k, cx, head, pins, z: tween(REST[k]), last: NaN });
  }
  function draw(s, h) {
    if (h === s.last) return;
    s.last = h;
    const z1 = BZ + MH + h, [r, i] = rings(s.cx - W / 2, 5, s.cx + W / 2, 29, 4, 1.2);
    put(s.head, prism(P, front, r, i, BZ, z1));
    PINS[s.k].p.forEach(([a, b, c, d], j) => {
      const [pr, pi] = rings(s.cx + a, 17 + b, s.cx + c, 17 + d, 0.8, 0.4);
      put(s.pins[j], prism(P, front, pr, pi, z1, z1 + PINS[s.k].h));
    });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    heads.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest head by its rest centre's screen x, inside the adapter's band
  const cxs = heads.map((s) => P(s.cx, 17, BZ + MH)[0]);
  const box = [P(0, Y1, 0)[0] - 6, P(X1, 0, 0)[0] + 6, P(0, 0, BZ + MH + LIFT + 12)[1], P(X1, Y1, 0)[1] + 6];
  function hit([sx, sy]) {
    if (sx < box[0] || sx > box[1] || sy < box[2] || sy > box[3]) return -1;
    let best = 0;
    cxs.forEach((c, k) => { if (Math.abs(c - sx) < Math.abs(cxs[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    heads.forEach((s, k) => {
      tset(s.z, a < 0 ? REST[k] : k === a ? LIFT : 0, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      s.head.sil.classList.toggle("hi", on);
      s.pins.forEach((p) => p.sil.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : ["type A", "type C", "type G"][a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "visa",
  means: "A travel adapter with three plug heads: the head under the pointer slides out tall with its pins, the others sink back.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[157, 148], [200, 170], [243, 192], null],
  mount,
});
