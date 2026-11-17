/**
 * Key ring: a split ring hung from a wall peg, three keys threaded on it.
 * The pointer's side is where the ring swings: the whole ring tilts toward
 * it on a spring, and the keys swing further, lagging on their own spring.
 * The key nearest the pointer is bright; at rest the middle key is. The
 * slider is how far the ring swings.
 *
 * The pattern: a continuous swing (spotlights' spring, on an angle); the
 * key is picked from its rest position, which never moves.
 */
const {
  Cam, circ, clamp, fillet, fit, facing, poly, prism, proj, rad, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 13, ATT = -2 * R - 2, REST = -9, FAN = [-16, 3, 21], OFF = [-2.5, 1, 3.5];
const HN = Math.hypot(1, 0.55), H = [1 / HN, -0.55 / HN], N = [0.55 / HN, 1 / HN];
const BLADE = [[-4.6, 12], [4.6, 12], [4.6, 16], [2.6, 16], [2.6, 21], [4.4, 23], [2.6, 25.5], [4.4, 28.5], [2.6, 30.5],
  [4.6, 33.5], [2.6, 36], [2.6, 42], [0, 46], [-2.6, 43.5], [-2.6, 16], [-4.6, 16]];
const BR = BLADE.map(() => 0.7);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  // world point from assembly-local (u along the hanging plane, w up), at depth off
  const W = (u, w, off) => [H[0] * u + N[0] * off, H[1] * u + N[1] * off, w];
  const rot = (u, w, a) => [u * Math.cos(a) - w * Math.sin(a), u * Math.sin(a) + w * Math.cos(a)];
  // a key point (t across, s down its length) under swing a and key angle b
  const kp = (k, t, s, a, b) => {
    const f = rad(FAN[k]) + b, u = t * Math.cos(f) + s * Math.sin(f), w = ATT + t * Math.sin(f) - s * Math.cos(f);
    return rot(u, w, a);
  };
  const ext = [];
  for (const sg of [-1, 1]) {
    const a = rad(REST + sg * 30), b = rad(sg * 12);
    for (let k = 0; k < 3; k++) for (const [t, s] of [[-7.5, 7], [7.5, 7], [0, 46], [4.6, 30]]) ext.push(W(...kp(k, t, s, a, b), OFF[k]));
  }
  ext.push(W(-8, 10, 0), W(8, 10, 0));
  const C = Cam(45, 0.5, 3.65);
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the peg block on the wall, and its pin
  const [br, bi] = rings(-5, -3.5, 5, 3.5, 2.5, 1);
  put(solid(g), prism(P, front, br.map((q) => ({ ...q, v: q.v - 6 })), bi.map((q) => ({ ...q, v: q.v - 6 })), 2, 10));
  mk("path", { d: seg(P(0, -3, 4), P(0, 0, -1.2)), class: "nf" }, g);

  const keyEls = [0, 1, 2].map(() => ({ back: mk("path", { class: "lo" }), body: mk("path", { class: "sil" }), bow: mk("path", { class: "sil" }), hole: mk("path", { class: "nf lo" }) }));
  const ringEls = { outer: mk("path", { class: "nf sil" }), inner: mk("path", { class: "nf lo" }) };
  // paint far to near: key 0, the ring, keys 1 and 2
  const order = [keyEls[0], ringEls, keyEls[1], keyEls[2]];
  for (const o of order) for (const el of Object.values(o)) g.appendChild(el);

  const A = spring(rad(REST)), K = spring(0, { k: 70, c: 9 });
  let last = "", act = -1;

  function draw() {
    const key = A.x.toFixed(4) + "," + K.x.toFixed(4);
    if (key === last) return;
    last = key;
    const a = A.x, b = K.x, cw = -R - 2;
    const ringPath = (r) => poly(circ(r, 40).map((q) => P(...W(...rot(q.u, cw + q.v, a), 0))));
    ringEls.outer.setAttribute("d", ringPath(R + 1.3));
    ringEls.inner.setAttribute("d", ringPath(R - 1.3));
    keyEls.forEach((e, k) => {
      const pt = (t, s, off) => P(...W(...kp(k, t, s, a, b), OFF[k] + off));
      const blade = fillet(BLADE.map(([t, s]) => [t, s]), BR, 3);
      const bow = circ(7.5, 28).map((q) => [q.u, 7 + q.v]);
      e.back.setAttribute("d", poly(blade.map(([t, s]) => pt(t, s, -1.3))) + poly(bow.map(([t, s]) => pt(t, s, -1.3))));
      e.body.setAttribute("d", poly(blade.map(([t, s]) => pt(t, s, 0))));
      e.bow.setAttribute("d", poly(bow.map(([t, s]) => pt(t, s, 0))));
      e.hole.setAttribute("d", poly(circ(2.4, 16).map((q) => pt(q.u, 3.6 + q.v, 0))));
    });
  }

  const B = register(stage, (dt) => { const m1 = stepS(A, dt), m2 = stepS(K, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);

  const cx0 = P(0, 0, 0)[0];
  const tips = [0, 1, 2].map((k) => P(...W(...kp(k, 0, 30, rad(REST), 0), OFF[k]))[0]);
  function aim(sx) {
    if (sx == null) { A.t = rad(REST); K.t = 0; act = -1; }
    else {
      const d = clamp((sx - cx0) / 30, -1, 1);
      A.t = rad(REST + d * 30 * reach); K.t = rad(d * 12 * reach);
      let bd = Infinity;
      tips.forEach((x, k) => { if (Math.abs(x - sx) < bd) { bd = Math.abs(x - sx); act = k; } });
    }
    keyEls.forEach((e, k) => { const on = k === (act < 0 ? 1 : act); e.body.classList.toggle("hi", on); e.bow.classList.toggle("hi", on); });
    read.textContent = act < 0 ? "rest" : `key ${act + 1} · ${Math.round(A.t * 180 / Math.PI)}°`;
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => aim(p[0]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "keyring",
  means: "A key ring on a wall peg: it swings toward the pointer's side, the keys swinging further, and the nearest key lights.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[151, 250], [300, 262], [205, 245], null],
  mount,
});
