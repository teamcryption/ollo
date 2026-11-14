/**
 * Sample rack: five capped sample tubes standing in a rack, each filled to a
 * different line. The pointer picks a tube by where it stands: it tips
 * forward out of the rack on its foot, and the tubes beside it lean a little,
 * staggered from it. At rest one tube leans, bright. The slider is the stagger.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, run, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 18, TR = 6, TL = 50, RZ = 12, TIP = 38, FAV = 3;
const FILL = [0.55, 0.35, 0.7, 0.45, 0.6];
const X1 = (N - 1) * STEP;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  const tipY = TL * Math.sin(rad(TIP)), tipZ = RZ + TL * Math.cos(rad(TIP));
  fit(C, [[-12, -12, 0], [X1 + 12, 12, 0], [-12, 12, 0], [X1 + 12, -12, 0], [0, 0, RZ + TL + 4], [X1, 0, RZ + TL + 4], [X1, tipY + 8, tipZ], [0, tipY + 8, tipZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-12, -12, X1 + 12, 12, 5, 1.8);
  put(solid(g), prism(P, front, rr, ri, 0, RZ));
  for (let k = 0; k < N; k++) mk("path", { d: poly(ringAt(P, disc(k * STEP, 0, TR + 1.2), RZ)), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), s = solid(grp);
    const line = mk("path", { class: "nf lo" }, grp), cap = solid(grp);
    items.push({ k, x: k * STEP, grp, s, line, cap, t: tween(k === FAV ? 14 : 0), last: NaN });
  }

  const at = (it, sl, t) => [Math.sin(rad(t)) * sl, RZ + Math.cos(rad(t)) * sl];
  function draw(it, t) {
    if (t === it.last) return;
    it.last = t;
    const [y1, z1] = at(it, TL, t), [yc, zc] = at(it, TL - 6, t), [yf, zf] = at(it, TL * FILL[it.k], t);
    const foot = ringAt(P, disc(it.x, 0, TR), RZ), top = ringAt(P, disc(it.x, y1, TR), z1);
    it.s.sil.setAttribute("d", poly(hull(foot.concat(top))));
    it.s.cr.setAttribute("d", "");
    it.line.setAttribute("d", open(ringAt(P, run(disc(it.x, yf, TR - 1), front), zf)));
    const cb = ringAt(P, disc(it.x, yc, TR + 1.2), zc), ct = ringAt(P, disc(it.x, y1, TR + 1.2), z1 + 1);
    it.cap.sil.setAttribute("d", poly(hull(cb.concat(ct))));
    it.cap.cr.setAttribute("d", open(ringAt(P, run(disc(it.x, y1, TR - 0.2), front), z1 + 1)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, RZ + TL / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < STEP * 1.6 && Math.abs(mids[best][1] - sy) < TL * 1.6 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), t = a < 0 ? (k === FAV ? 14 : 0) : d === 0 ? TIP : d === 1 ? 8 : 0;
      tset(it.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    // the tipped tube comes nearest the viewer: paint it last
    for (const it of items) g.appendChild(it.grp);
    g.appendChild(items[a < 0 ? FAV : a].grp);
    read.textContent = a < 0 ? "rest" : "tube " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "petridish2",
  means: "Five capped sample tubes in a rack: the tube under the pointer tips forward on its foot, its neighbours lean a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[147, 113], [214, 146], [280, 179], null],
  mount,
});
