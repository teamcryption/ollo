/**
 * Show kitchen: a kitchen island with a stone top, a sink and a tall mixer
 * tap, and three deep drawers along its front. The pointer picks a drawer by
 * where it stands: it slides out, and the drawers beside it ease open a
 * little, staggered from it. At rest the middle drawer stands half open,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), sliding out.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, rrect, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, W = 150, D = 58, ZT = 54, FAV = 1, OUT = 36, Z0 = 26, Z1 = 48;
const DX = (k) => [k * 50 + 4, k * 50 + 46];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-4, -4, 0], [W + 4, -4, ZT + 6], [W + 4, D + OUT + 2, 0], [-4, D + OUT + 2, 0], [110, 18, 86]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [bR, bI] = rings(2, 2, W - 2, D, 4, 1.5);
  put(solid(g), prism(P, front, bR, bI, 0, ZT));
  const [tR, tI] = rings(-4, -4, W + 4, D + 2, 5, 2);
  put(solid(g), prism(P, front, tR, tI, ZT, ZT + 6));
  // the sink, sunk in the top, and the mixer tap behind it
  mk("path", { d: poly(ringAt(P, rrect(84, 22, 136, 50, 6, 4), ZT + 6)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, rrect(88, 26, 132, 46, 4, 4), ZT + 6)), class: "nf lo" }, g);
  const [cR, cI] = rings(106, 8, 114, 16, 4, 1);
  put(solid(g), prism(P, front, cR, cI, ZT + 6, ZT + 30));
  const arc = [];
  for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI; arc.push(P(110, 12 + 10 - 10 * Math.cos(t), ZT + 30 + 8 * Math.sin(t))); }
  mk("path", { d: open(arc), class: "nf" }, g);
  mk("path", { d: seg(P(110, 32, ZT + 30), P(110, 32, ZT + 25)), class: "nf" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), s = solid(grp), h = mk("path", { class: "nf" }, grp);
    items.push({ k, s, h, o: tween(k === FAV ? OUT * 0.55 : 0), last: NaN });
  }
  function draw(it, out) {
    if (out === it.last) return;
    it.last = out;
    const [x0, x1] = DX(it.k), y1 = D + 1.5 + out;
    const [r, i] = rings(x0, D, x1, y1, 2, 0.6);
    put(it.s, prism(P, front, r, i, Z0, Z1));
    const cx = (x0 + x1) / 2;
    it.h.setAttribute("d", poly([P(cx - 9, y1, Z1 - 5), P(cx + 9, y1, Z1 - 5), P(cx + 9, y1 + 2, Z1 - 6), P(cx - 9, y1 + 2, Z1 - 6)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => { const [x0, x1] = DX(it.k); return P((x0 + x1) / 2, D + 12, (Z0 + Z1) / 2); });
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 8 : 0;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "drawer " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "mixertap",
  means: "A show kitchen island with sink and mixer tap: the drawer under the pointer slides out, and its neighbours ease open.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[98, 112], [167, 146], [236, 181], null],
  mount,
});
