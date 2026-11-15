/**
 * Parcel locker: a cabinet with a two-by-three grid of doors on its front.
 * The pointer picks a door on the front plane; it swings wide open and its
 * neighbours come ajar, staggered by distance. At rest one door stands ajar,
 * bright. The slider is the stagger.
 */
const { Cam, clamp, fillet, fit, poly, prism, proj, facing, rings, seg, disposer, mk, pointer, put, register, solid, tween, tset, tval, tdone } = HL;
const D = 30, WY = 84, H = 98, COLS = 2, ROWS = 3, DW = 36, DH = 26, FAV = 2;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [D, WY, 0], [D + DW, 0, 0], [0, WY, H], [D, 0, H], [D + DW, -4, H]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const cab = solid(g), [cr, ci] = rings(0, 0, D, WY, 3, 1.2);
  put(cab, prism(P, front, cr, ci, 0, H));
  const doors = [];
  for (let c = 0; c < COLS; c++) for (let r = 0; r < ROWS; r++) {
    const y0 = 4 + c * 40, z0 = 6 + r * 31, k = c * ROWS + r;
    mk("path", { class: "nf lo", d: poly(fillet([P(D, y0, z0), P(D, y0, z0 + DH), P(D, y0 + DW, z0 + DH), P(D, y0 + DW, z0)], [1.5, 1.5, 1.5, 1.5], 3)) }, g);
    const grp = mk("g", {}, g);
    doors.push({ c, r, y0, z0, k, sil: mk("path", { class: "sil" }, grp), mark: mk("path", { class: "nf lo" }, grp), a: tween(k === FAV ? 26 : 0), last: NaN });
  }
  function draw(d, deg) {
    if (deg === d.last) return;
    d.last = deg;
    const a = (deg * Math.PI) / 180, fx = D + 0.6 + DW * Math.sin(a), fy = d.y0 + DW * Math.cos(a);
    const pts = [P(D + 0.6, d.y0, d.z0), P(D + 0.6, d.y0, d.z0 + DH), P(fx, fy, d.z0 + DH), P(fx, fy, d.z0)];
    d.sil.setAttribute("d", poly(fillet(pts, [1.5, 1.5, 1.5, 1.5], 3)));
    const hx = D + 0.6 + (DW - 5) * Math.sin(a), hy = d.y0 + (DW - 5) * Math.cos(a);
    d.mark.setAttribute("d", seg(P(hx, hy, d.z0 + DH / 2 - 4), P(hx, hy, d.z0 + DH / 2 + 4)));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    doors.forEach((d) => { draw(d, tval(d.a, now)); if (!tdone(d.a, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);
  // the hit: the pointer on the fixed front plane x = D
  const o = P(D, 0, 0), ey = P(D, 1, 0), ez = P(D, 0, 1);
  const ay = [ey[0] - o[0], ey[1] - o[1]], az = [ez[0] - o[0], ez[1] - o[1]], det = ay[0] * az[1] - ay[1] * az[0];
  function hit([sx, sy]) {
    const dx = sx - o[0], dy = sy - o[1], y = (dx * az[1] - dy * az[0]) / det, z = (ay[0] * dy - ay[1] * dx) / det;
    if (y < 0 || y > WY || z < 0 || z > H) return -1;
    return clamp(Math.floor((y - 2) / 40), 0, COLS - 1) * ROWS + clamp(Math.floor((z - 4) / 31), 0, ROWS - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const ch = a < 0 ? FAV : a;
    doors.forEach((d) => {
      const dist = a < 0 ? 0 : Math.abs(d.c - doors[a].c) + Math.abs(d.r - doors[a].r);
      const deg = a < 0 ? (d.k === FAV ? 26 : 0) : [100, 34, 14, 6][dist];
      tset(d.a, deg, now, from < 0 ? 0 : dist * stag);
      d.sil.classList.toggle("hi", d.k === ch);
    });
    read.textContent = a < 0 ? "rest" : "door " + (doors[a].c + 1) + "·" + (doors[a].r + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shippingbox",
  means: "A parcel locker: the door under the pointer swings wide open and its neighbours come ajar after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[164, 179], [225, 202], [152, 122], null],
  mount,
});
