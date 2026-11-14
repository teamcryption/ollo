/**
 * Power lines: three tapering pylons in a row, each with a cross arm, two
 * lines hanging between them in sagging spans. The pointer picks a span by
 * where it stands: its lines swing out and sag deeper, the span beside it
 * a little, staggered from it. At rest one span hangs swung, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, GAP = 64, H = 74, ARM = 15, FAV = 0, SW = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.7);
  const X1 = (N - 1) * GAP;
  fit(C, [[-12, -20, 0], [X1 + 12, 20, 0], [0, 0, H + 4], [X1, 0, H + 4], [GAP / 2, -ARM - SW, H - 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g), mid = mk("g", {}, g), near = mk("g", {}, g);

  for (let k = 0; k < N; k++) {
    const x = k * GAP, grp = mk("g", {}, mid);
    const [pr, pi] = rings(x - 9, -9, x + 9, 9, 3, 1.2);
    put(solid(grp), prism(P, front, pr, pi, 0, 2));
    const foot = rrect(x - 7, -7, x + 7, 7, 2, 4), top = rrect(x - 1.8, -1.8, x + 1.8, 1.8, 0.8, 4), inn = rrect(x - 1.2, -1.2, x + 1.2, 1.2, 0.5, 4);
    put(solid(grp), { sil: poly(hull(ringAt(P, foot, 2).concat(ringAt(P, top, H)))), crease: open(ringAt(P, run(inn, front), H)) });
    const [ar, ai] = rings(x - 1.6, -ARM - 2, x + 1.6, ARM + 2, 1.2, 0.5);
    put(solid(grp), prism(P, front, ar, ai, H - 12, H - 9));
    // insulators hanging under the arm's two ends
    for (const y of [-ARM, ARM]) mk("path", { d: open([P(x, y, H - 12), P(x, y, H - 17)]), class: "nf" }, grp);
  }

  const spans = [];
  for (let s = 0; s < N - 1; s++) {
    const far = mk("path", { class: "nf" }, back), nr = mk("path", { class: "nf" }, near);
    spans.push({ s, x0: s * GAP, far, nr, w: tween(s === FAV ? 0.6 : 0), last: NaN });
  }
  function draw(sp, a) {
    if (a === sp.last) return;
    sp.last = a;
    for (const [el, y] of [[sp.far, -ARM], [sp.nr, ARM]]) {
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const t = i / 20, bow = 4 * t * (1 - t);
        pts.push(P(sp.x0 + t * GAP, y - a * SW * bow, H - 17 - (10 + a * 20) * bow));
      }
      el.setAttribute("d", open(pts));
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const sp of spans) { draw(sp, tval(sp.w, now)); if (!tdone(sp.w, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = spans.map((sp) => P(sp.x0 + GAP / 2, 0, H - 30));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 70 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    spans.forEach((sp, k) => {
      const d = Math.abs(k - a), w = a < 0 ? (k === FAV ? 0.6 : 0) : d === 0 ? 1 : 0.25;
      tset(sp.w, w, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      sp.far.classList.toggle("hi", on); sp.nr.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "span " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "powerlines",
  means: "Three pylons with lines hanging between them: the span under the pointer swings out and sags, the one beside it a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[165, 125], [238, 159], [123, 66], null],
  mount,
});
