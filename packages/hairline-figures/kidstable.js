/**
 * Kids table: a low play table with crayons on its top and three small
 * chairs along its near side. The pointer picks a chair by where it stands:
 * that chair slides out from the table, its neighbours a little, staggered.
 * At rest one chair is pulled out, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, TX = 96, TY = 40, TZ = 20, CW = 20, OUT = 22, FAV = 1;
const REST = [3, OUT * 0.8, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-4, -4, 0], [TX + 4, TY + 30 + OUT, 0], [TX + 4, -4, 0], [-4, TY + 30 + OUT, 0], [0, 0, TZ + 4], [TX, TY + 30 + OUT, 32]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, z0, z1, r = 1.5, b = 1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, a, i, z0, z1)); return s; };
  for (const [x, y] of [[2, 2], [TX - 6, 2], [2, TY - 6], [TX - 6, TY - 6]]) box(g, x, y, x + 4, y + 4, 0, TZ - 3, 1.5, 0.8);
  box(g, -2, -2, TX + 2, TY + 2, TZ - 3, TZ, 3, 1.6);
  // crayons and a sheet of paper on the top
  mk("path", { d: seg(P(14, 10, TZ), P(44, 10, TZ)) + seg(P(44, 10, TZ), P(44, 30, TZ)) + seg(P(44, 30, TZ), P(14, 30, TZ)) + seg(P(14, 30, TZ), P(14, 10, TZ)), class: "nf lo" }, g);
  for (let k = 0; k < 4; k++) box(g, 58 + k * 6, 10 + k * 2, 61 + k * 6, 26 + k * 2, TZ, TZ + 2.4, 1.2, 0.5);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 8 + k * 30, grp = mk("g", {}, g);
    const seat = solid(grp), back = solid(grp);
    items.push({ k, x, grp, seat, back, y: tween(REST[k]), last: NaN });
  }
  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const y0 = TY + 4 + d, [a, i] = rings(it.x, y0, it.x + CW, y0 + 18, 3, 1.4);
    put(it.seat, prism(P, front, a, i, 0, 12));
    const [ba, bi] = rings(it.x, y0 + 15, it.x + CW, y0 + 18, 1.5, 0.8);
    put(it.back, prism(P, front, ba, bi, 12, 28));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + CW / 2, TY + 13, 10));
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
      const dd = Math.abs(k - a), y = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 5 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.seat.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
      it.back.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "seat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kidstable",
  means: "A low play table with crayons and three small chairs: the chair under the pointer slides out, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[144, 154], [187, 175], [230, 196], null],
  mount,
});
