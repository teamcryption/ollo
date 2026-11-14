/**
 * Vanity desk: a slim desk on four legs, an oval mirror standing on its back
 * edge and three drawers in the apron. The pointer picks a drawer by where it
 * stands: it slides out, and the drawers beside it open a little, staggered
 * from it. At rest the middle drawer stands half open, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 140, D = 44, LZ = 40, AZ = 54, TZ = 57, OUT = 26, FAV = 1;
const DX = [[6, 46], [50, 90], [94, 134]], REST = [4, 14, 0];
const MX = W / 2, MZ = 86, MA = 26, MB = 25;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.5);
  fit(C, [[-3, -3, 0], [W + 3, D + OUT, 0], [W + 3, -3, 0], [-3, D + OUT, 0], [MX - MA, 4, MZ + MB + 2], [MX + MA, 4, MZ + MB + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, r, b, z0, z1, s) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(s || solid(parent), prism(P, front, o, i, z0, z1)); };

  for (const [x, y] of [[0, 0], [W - 4, 0], [0, D - 6], [W - 4, D - 6]]) box(g, x, y, x + 4, y + 4, 1.5, 0.8, 0, LZ);
  box(g, 0, 0, W, D - 2, 2, 1.4, LZ, AZ);
  box(g, -3, -3, W + 3, D, 3, 2, AZ, TZ);
  // the mirror: an oval frame on a low foot, standing at the back edge
  box(g, MX - 12, 1, MX + 12, 9, 2, 1.2, TZ, TZ + 3);
  const oval = (a, b, y) => { const pts = []; for (let i = 0; i < 48; i++) { const t = (i / 48) * Math.PI * 2; pts.push(P(MX + a * Math.cos(t), y, MZ + b * Math.sin(t))); } return pts; };
  mk("path", { d: poly(hull(oval(MA, MB, 3).concat(oval(MA, MB, 7)))), class: "sil" }, g);
  mk("path", { d: poly(oval(MA - 4, MB - 4, 7)), class: "nf lo" }, g);

  const items = DX.map(([x0, x1], k) => {
    const grp = mk("g", {}, g);
    const tray = solid(grp), plate = solid(grp), knob = mk("path", { class: "nf" }, grp);
    return { k, x0, x1, tray, plate, knob, o: tween(REST[k]), last: NaN };
  });

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const y1 = D + o, xm = (it.x0 + it.x1) / 2;
    if (o > 3) box(null, it.x0 + 2, D - 2, it.x1 - 2, y1 - 1.5, 1.5, 1.2, LZ + 2, AZ - 2, it.tray);
    else { it.tray.sil.setAttribute("d", ""); it.tray.cr.setAttribute("d", ""); }
    box(null, it.x0, y1 - 2, it.x1, y1, 1, 0.6, LZ + 1, AZ - 1, it.plate);
    const ring = (y) => { const pts = []; for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; pts.push(P(xm + 3 * Math.cos(t), y, (LZ + AZ) / 2 + 2.4 * Math.sin(t))); } return pts; };
    it.knob.setAttribute("d", poly(hull(ring(y1).concat(ring(y1 + 2)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D, (LZ + AZ) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 45 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? REST[k] : dd === 0 ? OUT : dd === 1 ? 6 : 0;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.plate.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "vanitydesk",
  means: "A vanity desk with an oval mirror: the drawer under the pointer slides out, and its neighbours open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 146], [189, 170], [236, 193], null],
  mount,
});
