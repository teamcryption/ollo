/**
 * Type case: a printer's cabinet of shallow drawers. The pointer picks a
 * drawer by its height: it slides out to show its grid of compartments for
 * the letters, and the drawers beside it ease out a little, staggered. At
 * rest one drawer stands half open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single stack (riffle).
 */
const {
  Cam, fit, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const N = 4, H = 15, D = 56, WY = 100, OUT = 58, FAV = 1, REST = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const TOP = N * H + 6;
  fit(C, [[0, 0, 0], [D + OUT, WY, 0], [D + OUT, 0, 0], [0, WY, 0], [0, 0, TOP], [D + OUT, WY, TOP]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, -3, D, WY + 3, 4, 2);
  put(solid(g), prism(P, front, cr, ci, 0, TOP));
  const items = [];
  for (let k = 0; k < N; k++) {
    const zb = 3 + k * H, grp = mk("g", {}, g);
    const s = solid(grp), grid = mk("path", { class: "nf lo" }, grp), pull = mk("path", { class: "nf" }, grp);
    items.push({ k, zb, s, grid, pull, o: tween(k === FAV ? REST : 0), last: NaN });
  }
  function draw(it, off) {
    if (off === it.last) return;
    it.last = off;
    const z0 = it.zb + 1, z1 = it.zb + H - 1, xf = D + off;
    const [r, ri] = rings(D - 2, 3, xf + 2, WY - 3, 2, 1.5);
    put(it.s, prism(P, front, r, ri, z0, z1));
    let d = "";
    for (let gx = xf - 12; gx > D + 1; gx -= 13) d += seg(P(gx, 6, z1), P(gx, WY - 6, z1));
    for (let gy = 6 + 15; gy < WY - 6; gy += 15) if (xf - 2 > D + 1) d += seg(P(D + 1, gy, z1), P(xf - 2, gy, z1));
    it.grid.setAttribute("d", d || "M0 0");
    const m = (z0 + z1) / 2, hy = WY / 2;
    it.pull.setAttribute("d", poly([P(xf + 2, hy - 9, m - 2), P(xf + 2, hy + 9, m - 2), P(xf + 2, hy + 9, m + 2), P(xf + 2, hy - 9, m + 2)]));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.o, now)); if (!tdone(it.o, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);
  const mids = items.map((it) => P(D, WY / 2, it.zb + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < H * 1.75 && Math.abs(mids[best][0] - sx) < 110 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), o = a < 0 ? (k === FAV ? REST : 0) : dd === 0 ? OUT : dd === 1 ? 10 : 0;
      tset(it.o, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "case " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "typecase",
  means: "A printer's cabinet of type drawers: the drawer under the pointer slides out to show its letter compartments.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[199, 194], [199, 149], [199, 126], null],
  mount,
});
