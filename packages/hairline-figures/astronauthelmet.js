/**
 * Helmet rack: three space helmets on a shelf, each a dome on a ringed collar
 * with a visor over the face opening. The pointer picks a helmet by where it
 * stands: its visor slides up over the dome to open the face, and the visors
 * beside it lift a little, staggered from it. At rest the middle visor is
 * half raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 40, R = 15, CR = 10.5, SZ = 5, ZC = SZ + 5 + R * 0.72, FAV = 1, AZ = Math.PI / 4, W = 0.95;
const X1 = (N - 1) * STEP + 2 * (R + 4);
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const Y0 = -R - 6, Y1 = R + 6;
  fit(C, [[-4, Y0, 0], [X1 + 4, Y1, 0], [X1 + 4, Y0, 0], [-4, Y1, 0], [R + 4, 0, ZC + R + 4], [X1 - R - 4, 0, ZC + R + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-4, Y0, X1 + 4, Y1, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = R + 4 + k * STEP, grp = mk("g", {}, g);
    put(solid(grp), prism(P, front, disc(x, 0, CR + 1.5), disc(x, 0, CR), SZ, SZ + 3));
    put(solid(grp), prism(P, front, disc(x, 0, CR), null, SZ + 3, SZ + 6.5));
    const pts = [];
    for (let i = 0; i <= 8; i++) { const e = rad(-40 + (i / 8) * 130); pts.push(...ringAt(P, disc(x, 0, R * Math.cos(e) + 0.01, 32), ZC + R * Math.sin(e))); }
    mk("path", { d: poly(hull(pts)), class: "sil" }, grp);
    const S = (e, a, r = R) => P(x + r * Math.cos(e) * Math.cos(a), r * Math.cos(e) * Math.sin(a), ZC + r * Math.sin(e));
    const face = [];
    for (let i = 0; i <= 12; i++) face.push(S(rad(-22), AZ - W + (i / 12) * 2 * W, R - 0.6));
    for (let i = 0; i <= 12; i++) face.push(S(rad(28), AZ + W - (i / 12) * 2 * W, R - 0.6));
    mk("path", { d: poly(face), class: "nf lo" }, grp);
    const visor = mk("path", { class: "sil" }, grp);
    items.push({ k, x, S, visor, f: tween(k === FAV ? 0.5 : 0), last: NaN });
  }

  function draw(it, f) {
    if (f === it.last) return;
    it.last = f;
    const e0 = rad(-26 + 52 * f), e1 = rad(32 + 48 * f), pts = [];
    for (let i = 0; i <= 14; i++) pts.push(it.S(e0, AZ - W + (i / 14) * 2 * W, R + 0.9));
    for (let i = 0; i <= 14; i++) pts.push(it.S(e1, AZ + W - (i / 14) * 2 * W, R + 0.9));
    it.visor.setAttribute("d", poly(pts));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.f, now)); if (!tdone(it.f, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, ZC));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 38 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), f = a < 0 ? (k === FAV ? 0.5 : 0) : d === 0 ? 1 : d === 1 ? 0.35 : 0;
      tset(it.f, f, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.visor.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "helmet " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "astronauthelmet",
  means: "Three space helmets on a shelf: the visor of the helmet under the pointer slides up, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 92], [200, 114], [258, 150], null],
  mount,
});
