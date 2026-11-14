/**
 * Charging dock: five tablets standing in the slots of a charging dock. The
 * pointer picks a tablet by where it stands: it tips forward out of its slot
 * toward the reader, pivoting on its foot, and the tablets beside it tip a
 * little, staggered from it. At rest the row leans back and one tablet stands
 * tipped forward, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), tilting.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, TW = 22, STEP = 28, X0 = 6, W = X0 * 2 + (N - 1) * STEP + TW, DD = 34, BH = 10, TH = 44, T = 2.4, SY = 13;
const BACK = -9, TIP = 34, FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  const ty = SY + TH * Math.sin(rad(TIP));
  fit(C, [[0, 0, 0], [W, 0, 0], [0, Math.max(DD, ty), 0], [W, Math.max(DD, ty), 0], [0, SY, BH + TH], [W, ty, BH + TH * Math.cos(rad(TIP))]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, DD, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  let slots = "";
  for (let k = 0; k < N; k++) { const x = X0 + k * STEP; slots += poly([P(x - 1, SY - 2.5, BH), P(x + TW + 1, SY - 2.5, BH), P(x + TW + 1, SY + 2.5, BH), P(x - 1, SY + 2.5, BH)]); }
  mk("path", { d: slots, class: "nf lo" }, g);

  const face = rrect(0, 0, TW, TH, 3.5, 4), scr = rrect(2.2, 3, TW - 2.2, TH - 3, 1.6, 4);
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), s2 = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, sil, s2, a: tween(k === FAV ? TIP * 0.6 : BACK), last: NaN });
  }

  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = rad(deg), s = Math.sin(a), c = Math.cos(a);
    const W3 = (q, d) => P(it.x + q.u, SY + q.v * s + d * c, BH - 1 + q.v * c - d * s);
    const fr = face.map((q) => W3(q, T / 2)), bk = face.map((q) => W3(q, -T / 2));
    it.sil.setAttribute("d", poly(hull(fr.concat(bk))));
    it.s2.setAttribute("d", poly(scr.map((q) => W3(q, T / 2))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + TW / 2, SY, BH + TH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? (k === FAV ? TIP * 0.6 : BACK) : dd === 0 ? TIP : dd === 1 ? 6 : BACK;
      tset(it.a, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tab " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "vrstation",
  means: "Tablets standing in a charging dock: the tablet under the pointer tips forward out of its slot, its neighbours tipping a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[136, 115], [214, 154], [293, 193], null],
  mount,
});
