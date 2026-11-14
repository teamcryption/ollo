/**
 * Ladders: four stepladders standing in a row on a site board, each a front
 * frame of rails and rungs leaning on a plain back frame. The pointer picks a
 * ladder by where it stands: it opens wide and lowers, ready to climb, and
 * its neighbours ease open a little, staggered from it. At rest one ladder
 * stands open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 40, W = 8, LEN = [54, 66, 60, 48], FAV = 1, CZ = 3, Y0 = 20;
const OPEN = 17, SHUT = 5, MID = 10;
const disc = (x, y, r, n = 12) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const restS = (k) => (k === FAV ? OPEN * 0.85 : [8, 0, 11, 6][k]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  const X1 = (N - 1) * STEP + 2 * W + 12;
  fit(C, [[-8, -4, 0], [X1, 2 * Y0 + 4, 0], [X1, -4, 0], [-8, 2 * Y0 + 4, 0], [W + 2 + STEP, Y0, CZ + 66], [X1 - W, Y0, CZ + 48]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-8, -4, X1, 2 * Y0 + 4, 6, 2);
  put(solid(g), prism(P, front, br, bi, 0, CZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = W + 6 + k * STEP, grp = mk("g", {}, g);
    const back = mk("path", { class: "sil" }, grp), brace = mk("path", { class: "nf lo" }, grp);
    const railA = mk("path", { class: "sil" }, grp), railB = mk("path", { class: "sil" }, grp);
    const rungs = mk("path", { class: "nf" }, grp), cap = mk("path", { class: "sil" }, grp);
    items.push({ k, x, L: LEN[k], back, brace, railA, railB, rungs, cap, s: tween(restS(k)), last: NaN });
  }

  const rail = (x, y0, y1, h) => poly(hull(ringAt(P, disc(x, y0, 1.4), CZ).concat(ringAt(P, disc(x, y1, 1.4), CZ + h))));
  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    const h = Math.sqrt(it.L * it.L - s * s), x = it.x, yf = Y0 + s, yb = Y0 - s;
    // back frame: a flat plate between its two legs, behind everything
    const bk = ringAt(P, disc(x - W + 1, yb, 1.4), CZ).concat(ringAt(P, disc(x + W - 1, yb, 1.4), CZ), ringAt(P, disc(x - W + 3, Y0, 1.4), CZ + h - 2), ringAt(P, disc(x + W - 3, Y0, 1.4), CZ + h - 2));
    it.back.setAttribute("d", poly(hull(bk)));
    const at = (f, xx, y) => P(xx, lerp(y, Y0, f), CZ + h * f);
    it.brace.setAttribute("d", seg(at(0.42, x + W - 2, yb), at(0.42, x + W, yf)));
    it.railA.setAttribute("d", rail(x - W, yf, Y0, h));
    it.railB.setAttribute("d", rail(x + W, yf, Y0, h));
    let d = "";
    for (let i = 1; i <= 4; i++) { const f = i / 5.2; d += seg(at(f, x - W + 1, yf), at(f, x + W - 1, yf)); }
    it.rungs.setAttribute("d", d);
    const top = ringAt(P, disc(x, Y0, W + 1.5, 20).map((q) => ({ ...q, v: Y0 + (q.v - Y0) * 0.25 })), CZ + h);
    it.cap.setAttribute("d", poly(hull(top.concat(top.map(([a, b]) => [a, b - 2])))));
  }
  const lerp = (a, b, t) => a + (b - a) * t;

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.s, now)); if (!tdone(it.s, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, Y0, CZ + 28));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), s = a < 0 ? restS(k) : dd === 0 ? OPEN : dd === 1 ? MID : SHUT;
      tset(it.s, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      for (const el of [it.railA, it.railB, it.cap]) el.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "ladder " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ladders",
  means: "Four stepladders in a row: the one under the pointer opens wide to climb, and its neighbours ease open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[181, 138], [229, 162], [277, 186], null],
  mount,
});
