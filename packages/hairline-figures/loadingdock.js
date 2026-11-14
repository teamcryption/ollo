/**
 * Loading dock: a warehouse wall with three bay doors over a raised dock
 * platform. The pointer picks a bay by where it stands: its roller shutter
 * rolls up, bright, and the shutters beside it rise a little, staggered.
 * At rest the middle shutter is half open. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, fillet, poly, prism, proj, rings, tdone, tset, tval, tween, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, BW = 30, GAP = 12, M = 12, W = M * 2 + N * BW + (N - 1) * GAP, D = 26, H = 62, PZ = 7, OH = 40, PD = 18, FAV = 1;
const REST = [0.12, 0.55, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + PD, 0], [W, D + PD, 0], [0, 0, H], [W, 0, H]], 200, 166);
  const P = proj(C);
  const front = (q) => q.nu * 0.7 + q.nv * 0.7 > 0;
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, 0, W, D, 3, 1.6);
  put(solid(g), prism(P, front, wr, wi, 0, H));
  const [pr, pi] = rings(4, D - 2, W - 4, D + PD, 2, 1.4);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));
  // bumpers under each bay, on the dock's front
  const items = [];
  for (let k = 0; k < N; k++) {
    const x0 = M + k * (BW + GAP), x1 = x0 + BW, grp = mk("g", {}, g);
    mk("path", { d: poly(fillet([P(x0 - 2, D, PZ), P(x1 + 2, D, PZ), P(x1 + 2, D, PZ + OH + 2), P(x0 - 2, D, PZ + OH + 2)], [0.8, 0.8, 1, 1])), class: "nf lo" }, grp);
    for (const bx of [x0 + 4, x1 - 4]) mk("path", { d: poly(fillet([P(bx - 2, D + PD, PZ - 1.5), P(bx + 2, D + PD, PZ - 1.5), P(bx + 2, D + PD, 1.5), P(bx - 2, D + PD, 1.5)], [0.8, 0.8, 0.8, 0.8])), class: "nf lo" }, grp);
    const sh = mk("path", { class: "sil" }, grp), sl = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x0, x1, sh, sl, t: tween(REST[k]), last: NaN });
  }

  function draw(it, f) {
    if (f === it.last) return;
    it.last = f;
    const zb = PZ + OH * f, zt = PZ + OH, y = D + 0.3;
    it.sh.setAttribute("d", poly(fillet([P(it.x0, y, zb), P(it.x1, y, zb), P(it.x1, y, zt), P(it.x0, y, zt)], [0.8, 0.8, 0.8, 0.8])));
    let s = "";
    for (let z = zt - 6; z > zb + 2; z -= 6) s += seg(P(it.x0 + 1.5, y, z), P(it.x1 - 1.5, y, z));
    it.sl.setAttribute("d", s || "M0 0");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D, PZ + OH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), f = a < 0 ? REST[k] : dd === 0 ? 0.97 : dd === 1 ? 0.4 : 0.08;
      tset(it.t, f, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sh.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "loadingdock",
  means: "A warehouse wall with three bay doors over a dock: the shutter under the pointer rolls up, its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 145], [194, 158], [245, 197], null],
  mount,
});
