/**
 * Breadboard: a solderless breadboard, rows of contact holes either side of
 * the centre channel and a power rail along each edge, one jumper wire arched
 * across the channel on its two plugs. The pointer over the board pulls the
 * jumper's far plug out and swings it round to a new row. At rest the jumper
 * spans the channel, bright. The slider is how far it swings.
 *
 * The pattern: one part turning about a fixed pivot, lifting as it goes.
 */
const { Cam, fit, facing, poly, prism, proj, rad, rings, open, tset, tval, tdone, tween, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

const BZ = 6, A = [-20, 11], B0 = [12, -13], PH = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[-46, -30, 0], [46, 30, 0], [-46, 30, 0], [46, -30, 0], [-20, 11, 44], [-46, -30, 30]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-46, -30, 46, 30, 4, 1.6), 0, BZ));
  mk("path", { class: "nf lo", d: open([P(-42, -1.2, BZ), P(42, -1.2, BZ)]) + open([P(-42, 1.2, BZ), P(42, 1.2, BZ)]) }, g);
  for (const y of [-26, 26]) mk("path", { class: "nf lo", d: open([P(-40, y + (y < 0 ? 3.5 : -3.5), BZ), P(40, y + (y < 0 ? 3.5 : -3.5), BZ)]) }, g);
  for (let x = -40; x <= 40; x += 6) for (const y of [-21, -16, -11, -6, 6, 11, 16, 21, -26, 26]) if (Math.abs(y) < 26 || (x + 46) % 12 !== 0) place(flatDot(g, C, 0.6, "dot off"), P(x, y, BZ));

  const plugA = solid(g);
  put(plugA, prism(P, front, ...rings(A[0] - 2, A[1] - 2, A[0] + 2, A[1] + 2, 0.8, 0.5), BZ, BZ + PH));
  const wire = mk("path", { class: "sil hi" }, g);
  const plugB = solid(g);
  const pin = flatDot(g, C, 0.9, "dot m");

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = rad(-118 * amp * t), ca = Math.cos(a), sa = Math.sin(a);
    const dx = B0[0] - A[0], dy = B0[1] - A[1];
    const B = [A[0] + dx * ca - dy * sa, A[1] + dx * sa + dy * ca], lift = 13 * t;
    put(plugB, prism(P, front, ...rings(B[0] - 2, B[1] - 2, B[0] + 2, B[1] + 2, 0.8, 0.5), BZ + lift, BZ + PH + lift));
    place(pin, P(B[0], B[1], BZ + lift));
    const c = [];
    for (let i = 0; i <= 24; i++) {
      const s = i / 24, e = s * s * (3 - 2 * s);
      c.push(P(A[0] + (B[0] - A[0]) * e, A[1] + (B[1] - A[1]) * e, BZ + PH + lift * s + 22 * Math.sin(Math.PI * s)));
    }
    const L = [], R = [];
    for (let i = 0; i < c.length; i++) {
      const p = c[Math.max(0, i - 1)], q = c[Math.min(c.length - 1, i + 1)];
      const tx = q[0] - p[0], ty = q[1] - p[1], n = Math.hypot(tx, ty) || 1, w = 1.6;
      L.push([c[i][0] - (ty / n) * w, c[i][1] + (tx / n) * w]);
      R.push([c[i][0] + (ty / n) * w, c[i][1] - (tx / n) * w]);
    }
    wire.setAttribute("d", poly(L.concat(R.reverse())));
    if ((B[0] + B[1]) > (A[0] + A[1])) wire.after(plugB.g); else plugB.g.after(wire);
    plugB.g.after(pin);
  }
  const tw = tween(0);
  const Bk = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(Bk.unregister);

  const mid = P(0, 0, BZ);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "row 9" : "rest";
    Bk.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 160 && Math.abs(sy - mid[1]) < 100), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; draw(tval(tw, performance.now())); Bk.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "breadboard2",
  means: "A solderless breadboard with one jumper wire: the pointer pulls the jumper's far plug out and swings it round to a new row.",
  rules: [1, 4, 5, 6, 8],
  range: [0.4, 1, 1.3],
  tour: [[194, 128], [120, 200], [300, 215], null],
  mount,
});
