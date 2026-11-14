/**
 * Gondola lift: two pylons carrying a sloping cable, three cabins hanging
 * from it on their grips. The pointer picks a cabin by where it stands: that
 * cabin swings out on its hanger and its neighbours sway a little after it,
 * staggered. At rest the middle cabin hangs with a slight swing, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SPAN = 150, Z0 = 70, Z1 = 92, HANG = 16, N = 3, FAV = 1, SW = 22;
const cz = (x) => Z0 + ((x + 10) / (SPAN + 20)) * (Z1 - Z0);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-20, -14, 0], [SPAN + 20, 14, 0], [-10, 0, Z0 + 8], [SPAN + 10, 0, Z1 + 8], [SPAN / 2, 30, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pylon = (x, z) => {
    const [r, i] = rings(x - 6, -6, x + 6, 6, 3, 1.2);
    put(solid(g), prism(P, front, r, i, 0, 3));
    const [r2, i2] = rings(x - 2, -2, x + 2, 2, 1.5, 0.6);
    put(solid(g), prism(P, front, r2, i2, 3, z));
    const [r3, i3] = rings(x - 2, -9, x + 2, 9, 1.5, 0.6);
    put(solid(g), prism(P, front, r3, i3, z, z + 3));
  };
  pylon(-10, Z0); pylon(SPAN + 10, Z1);
  mk("path", { d: seg(P(-10, 0, cz(-10) + 3), P(SPAN + 10, 0, cz(SPAN + 10) + 3)), class: "nf" }, g);

  const cabs = [];
  for (let k = 0; k < N; k++) {
    const x = 35 + k * 45, grp = mk("g", {}, g);
    const hang = mk("path", { class: "nf" }, grp), box = mk("path", { class: "sil" }, grp), win = mk("path", { class: "nf lo" }, grp);
    cabs.push({ k, x, hang, box, win, a: tween(k === FAV ? 8 : 0), last: NaN });
  }
  function draw(c, deg) {
    if (deg === c.last) return;
    c.last = deg;
    const a = rad(deg), top = cz(c.x) + 3;
    // swing in the y–z plane about the grip on the cable
    const at = (dx, dy, dz) => { const y = dy * Math.cos(a) - dz * Math.sin(a), z = dy * Math.sin(a) + dz * Math.cos(a); return P(c.x + dx, y, top + z); };
    c.hang.setAttribute("d", seg(at(0, 0, 0), at(0, 0, -HANG)) + seg(at(-4, 0, -HANG), at(4, 0, -HANG)));
    const pts = [];
    for (const dx of [-9, 9]) for (const dy of [-7, 7]) for (const dz of [-HANG - 1, -HANG - 24]) {
      for (let j = 0; j < 4; j++) { const f = (j / 4) * 2 * Math.PI; pts.push(at(dx + 1.5 * Math.cos(f), dy + 1.5 * Math.sin(f), dz)); }
    }
    c.box.setAttribute("d", poly(hull(pts)));
    c.win.setAttribute("d", poly([at(-7, 7.2, -HANG - 5), at(7, 7.2, -HANG - 5), at(7, 7.2, -HANG - 13), at(-7, 7.2, -HANG - 13)]));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const c of cabs) { draw(c, tval(c.a, now)); if (!tdone(c.a, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  const mids = cabs.map((c) => P(c.x, 0, cz(c.x) - HANG - 10));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    cabs.forEach((c, k) => {
      const d = Math.abs(k - a), t = a < 0 ? (k === FAV ? 8 : 0) : d === 0 ? SW : d === 1 ? 7 : 2;
      tset(c.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      c.box.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cab " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "gondolalift",
  means: "Three cabins hanging from a sloping cable between two pylons: the cabin under the pointer swings out, its neighbours sway after it.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[155, 121], [206, 136], [257, 145], null],
  mount,
});
