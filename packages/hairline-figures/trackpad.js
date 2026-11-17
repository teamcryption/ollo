/**
 * Keyboard tray: a desk on two panel legs with a tray hung under its top and
 * a keyboard on the tray. The pointer over the desk slides the tray out from
 * under the top toward the sitter; at rest it sits half out, its rim bright.
 * The slider is how far the tray runs out.
 */
const {
  Cam, fit, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DW = 96, DD = 56, DZ = 40, TX0 = 22, TX1 = 74, L = 62, TZ = 25, REST = 30;

function inside(pt, pg) {
  let s = 0;
  for (let i = 0; i < pg.length; i++) {
    const a = pg[i], b = pg[(i + 1) % pg.length];
    const c = (b[0] - a[0]) * (pt[1] - a[1]) - (b[1] - a[1]) * (pt[0] - a[0]);
    if (c !== 0) { if (s && Math.sign(c) !== s) return false; s = Math.sign(c); }
  }
  return true;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, DZ + 4], [DW, 0, 0], [0, DD, 0], [DW, DD, 0], [TX0, DD + REST + 30, TZ], [TX1, DD + REST + 30, TZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const x0 of [2, DW - 6]) {
    const [r, i] = rings(x0, 6, x0 + 4, DD - 6, 2, 0.8);
    put(solid(g), prism(P, front, r, i, 0, DZ));
  }
  const back = solid(g);
  const [dr, di] = rings(0, 0, DW, DD, 4, 1.6);
  put(solid(g), prism(P, front, dr, di, DZ, DZ + 4));
  const tray = solid(g), kb = solid(g);
  tray.sil.classList.add("hi");
  const keys = mk("path", { class: "nf lo" }, kb.g);

  const slide = tween(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const y0 = DD - L + s, y1 = DD + s;
    if (DD - y0 > 3) { const [r, i] = rings(TX0, y0, TX1, DD, 3, 1); put(back, prism(P, front, r, i, TZ, TZ + 2)); }
    else put(back, { sil: "", crease: "" });
    const [fr, fi] = rings(TX0, DD, TX1, y1, 3, 1);
    put(tray, prism(P, front, fr, fi, TZ, TZ + 2));
    const k0 = y1 - 30, k1 = y1 - 5;
    const [kr, ki] = rings(TX0 + 5, k0, TX1 - 5, k1, 2.5, 1.2);
    put(kb, prism(P, front, kr, ki, TZ + 2, TZ + 5));
    let d = "";
    for (let j = 1; j < 5; j++) d += seg(P(TX0 + 8, k0 + j * 5, TZ + 5), P(TX1 - 8, k0 + j * 5, TZ + 5));
    for (let j = 0; j < 9; j++) { const x = TX0 + 12 + j * 4; d += seg(P(x, k0 + 5, TZ + 5), P(x, k0 + 20, TZ + 5)); }
    d += seg(P(TX0 + 20, k0 + 22.5, TZ + 5), P(TX1 - 20, k0 + 22.5, TZ + 5));
    keys.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(slide, now)); return !tdone(slide, now); });
  bag.add(B.unregister);

  const area = hull([[0, 0, DZ + 4], [DW, 0, 0], [DW, DD, 0], [0, DD, 0], [0, 0, 0], [DW, 0, DZ + 4], [TX0, DD + REST, TZ], [TX1, DD + REST, TZ]].map((q) => P(...q)));
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(slide, a < 0 ? REST : REST + maxA, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "out";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p, area) ? 1 : -1), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (act >= 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "trackpad",
  means: "A desk's keyboard tray: the pointer over the desk slides the tray and its keyboard out from under the top.",
  rules: [1, 5, 6, 8],
  range: [10, 22, 30],
  tour: [[152, 189], [205, 225], [250, 150], null],
  mount,
});
