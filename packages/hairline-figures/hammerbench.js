/**
 * Hammer bench: a wooden bench on two end blocks with four pegs standing
 * through its top, and a mallet over them. The pointer picks a peg by where
 * its top stands: the mallet slides over it and pounds it down into the
 * bench. At rest the mallet hangs raised over the second peg, bright. The
 * slider is how deep each blow drives the peg.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 34, X0 = 22, BW = 36, TZ = 22, PH = 16, PR = 6, HR = 9, HL2 = 17, HAND = 54, REST = 1, UP = 36;
const LEN = X0 * 2 + (N - 1) * STEP;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[0, 0, 0], [LEN, BW, 0], [LEN, 0, 0], [0, BW, 0], [X0, BW / 2, TZ + PH + UP + HR + 4], [LEN - X0 + HL2, BW / 2 + HAND, TZ + 4], [X0 - HL2, BW / 2, TZ + PH + UP + HR + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const x of [0, LEN - 14]) { const [r, i] = rings(x + 2, 2, x + 12, BW - 2, 3, 1.2); put(solid(g), prism(P, front, r, i, 0, TZ - 6)); }
  const [tr, ti] = rings(0, 0, LEN, BW, 5, 2);
  put(solid(g), prism(P, front, tr, ti, TZ - 6, TZ));
  const pegs = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, y = BW / 2;
    mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x, y, PR + 1.5), TZ)) }, g);
    pegs.push({ k, x, y, s: solid(g), h: tween(k === REST ? PH * 0.55 : PH - (k === 3 ? 4 : 0)), last: NaN });
  }
  const mal = mk("g", {}, g), handle = mk("path", { class: "" }, mal), head = solid(mal), face = mk("path", { class: "nf lo" }, mal);
  const mx = tween(X0 + REST * STEP), mz = tween(TZ + PH * 0.55 + UP);

  let last = "";
  function draw(now) {
    for (const p of pegs) {
      const h = tval(p.h, now);
      if (h === p.last) continue;
      p.last = h;
      const [r, i] = [disc(p.x, p.y, PR), disc(p.x, p.y, PR - 1.6)];
      put(p.s, prism(P, front, r, i, TZ, TZ + Math.max(1, h)));
    }
    const x = tval(mx, now), z = tval(mz, now) + HR, y = BW / 2, key = x.toFixed(3) + z.toFixed(3);
    if (key === last) return;
    last = key;
    const hp = [];
    for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; hp.push(P(x - 4, y + 2 + 2.5 * Math.cos(a), z + 2.5 * Math.sin(a)), P(x + 4, y + HAND + 2.5 * Math.cos(a), z + 2.5 * Math.sin(a))); }
    handle.setAttribute("d", poly(hull(hp)));
    const cy = [], cap = [];
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2, dy = HR * Math.cos(a), dz = HR * Math.sin(a);
      cy.push(P(x - HL2, y + dy, z + dz), P(x + HL2, y + dy, z + dz));
      cap.push(P(x + HL2, y + (HR - 2) * Math.cos(a), z + (HR - 2) * Math.sin(a)));
    }
    head.sil.setAttribute("d", poly(hull(cy)));
    head.cr.setAttribute("d", seg(P(x - HL2 + 2, y + HR - 1, z + 2), P(x + HL2 - 2, y + HR - 1, z + 2)));
    face.setAttribute("d", poly(cap));
  }

  const B = register(stage, (_dt, now) => {
    draw(now);
    return !tdone(mx, now) || !tdone(mz, now) || pegs.some((p) => !tdone(p.h, now));
  });
  bag.add(B.unregister);

  const tops = pegs.map((p) => P(p.x, p.y, TZ + PH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    tops.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(tops[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    const now = performance.now(), deep = 3 + (value / 100) * (PH - 4);
    pegs.forEach((p, k) => {
      tset(p.h, a < 0 ? (k === REST ? PH * 0.55 : PH - (k === 3 ? 4 : 0)) : k === a ? PH - deep : PH, now, 0);
      p.s.sil.classList.toggle("hi", k === a);
    });
    const k = a < 0 ? REST : a;
    tset(mx, X0 + k * STEP, now, 0);
    tset(mz, a < 0 ? TZ + PH * 0.55 + UP : TZ + PH - deep, now, a < 0 ? 0 : 120);
    head.sil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "peg " + (a + 1) + "·" + Math.round(deep);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { value = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "hammerbench",
  means: "A toy hammer bench: the mallet slides over the peg under the pointer and pounds it down into the bench.",
  rules: [1, 4, 5, 6],
  range: [0, 60, 100],
  tour: [[135, 135], [265, 200], [200, 168], null],
  mount,
});
