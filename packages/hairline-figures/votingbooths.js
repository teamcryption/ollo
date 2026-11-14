/**
 * Voting booths: four booths in a row, each with an opening in its face and a
 * curtain hung on a rail across it, a writing shelf behind. The pointer picks
 * a booth by where it stands: its curtain draws aside to show the shelf, and
 * the curtains beside it part a little, staggered from it. At rest one
 * curtain is half drawn, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, lerp, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 30, GAP = 9, D = 22, H = 56, FAV = 1, OZ0 = 8, OZ1 = H - 7, IN = 4;
const REST = [0.12, 0.6, 0.04, 0.24];
const X1 = N * W + (N - 1) * GAP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-4, -4, 0], [X1 + 4, D + 6, 0], [X1 + 4, -4, 0], [-4, D + 6, 0], [0, 0, H + 3], [X1, 0, H + 3]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, X1 + 4, D + 6, 4, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 3));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (W + GAP), grp = mk("g", {}, g);
    const [r, i] = rings(x0, 0, x0 + W, D, 3, 1.4);
    put(solid(grp), prism(P, front, r, i, 3, H));
    const yf = D + 0.1, ox0 = x0 + IN, ox1 = x0 + W - IN;
    const q = (x, z) => P(x, yf, z);
    mk("path", { d: poly(fillet([q(ox0, OZ0), q(ox1, OZ0), q(ox1, OZ1), q(ox0, OZ1)], [1.5, 1.5, 1.5, 1.5])), class: "nf lo" }, grp);
    // the shelf behind the curtain, and the rail above it
    mk("path", { d: seg(q(ox0, 30), q(ox1, 30)) + seg(q(ox0 + 2, 30), P(ox0 + 2, yf - 7, 30)) + seg(q(ox1 - 2, 30), P(ox1 - 2, yf - 7, 30)), class: "nf lo" }, grp);
    mk("path", { d: seg(P(ox0 - 2, yf + 1.2, OZ1 + 2), P(ox1 + 2, yf + 1.2, OZ1 + 2)), class: "nf" }, grp);
    const cur = mk("path", { class: "sil" }, grp), folds = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, ox0, ox1, cur, folds, o: tween(REST[k]), last: NaN });
  }

  function draw(it, open) {
    if (open === it.last) return;
    it.last = open;
    const y = D + 1.2, w = lerp(it.ox1 - it.ox0 + 1, 6, open), xa = it.ox0 - 0.5, xb = xa + w, zb = OZ0 + 1 + open * 4;
    const pts = [P(xa, y, zb + 1), P(xb, y, zb), P(xb, y, OZ1 + 2), P(xa, y, OZ1 + 2)];
    it.cur.setAttribute("d", poly(fillet(pts, [1.2, 1.2, 0.6, 0.6])));
    let d = "";
    for (let f = 1; f < 4; f++) { const x = xa + (w * f) / 4; d += seg(P(x, y, OZ1 + 1), P(x, y, zb + 3)); }
    it.folds.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x0 + W / 2, D, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? REST[k] : dd === 0 ? 1 : dd === 1 ? 0.3 : 0.06;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.cur.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "booth " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "votingbooths",
  means: "Four voting booths in a row: the curtain under the pointer draws aside to show the shelf, and its neighbours part a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[97, 129], [163, 162], [285, 222], null],
  mount,
});
