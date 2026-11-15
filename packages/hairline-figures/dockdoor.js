/**
 * Dock door: a loading-dock wall with a roll-up sectional door, the coil
 * hood above it, rubber bumpers either side and the dock plate below. The
 * pointer over the opening rolls the door up into its hood, slat by slat.
 * At rest it stands just cracked open, its bottom bar bright. The slider is how far it opens.
 */
const { Cam, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 56, T = 4, HW = 46, DX0 = 10, DX1 = 46, DH = 32, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[0, 0, -6], [W, T + 10, -6], [0, T + 10, HW], [W, 0, HW]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const bx = (x0, y0, z0, x1, y1, z1) => { const c = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) c.push(P(x, y, z)); return poly(hull(c)); };
  const ed = (x0, y0, z0, x1, y1, z1) => seg(P(x1, y1, z1), P(x0, y1, z1)) + seg(P(x1, y1, z1), P(x1, y0, z1)) + seg(P(x1, y1, z1), P(x1, y1, z0));
  const plat = solid(g);
  put(plat, { sil: bx(0, 0, -6, W, T + 10, 0), crease: ed(0, 0, -6, W, T + 10, 0) + poly([P(DX0, T, 0), P(DX1, T, 0), P(DX1, T + 7, 0), P(DX0, T + 7, 0)]) });
  const wall = solid(g);
  const ins = seg(P(DX0, T, DH), P(DX0 + 3, T - 3, DH - 3)) + seg(P(DX0 + 3, T - 3, DH - 3), P(DX0 + 3, T - 3, 0)) + seg(P(DX0 + 3, T - 3, DH - 3), P(DX1, T - 3, DH - 3));
  put(wall, { sil: bx(0, 0, 0, W, T, HW), crease: ed(0, 0, 0, W, T, HW) + poly([P(DX0, T, 0), P(DX1, T, 0), P(DX1, T, DH), P(DX0, T, DH)]) + ins });
  for (const [x0, z0, x1, z1] of [[14, 0, 26, 11], [27, 0, 40, 13], [16, 11, 25, 20], [29, 13, 38, 22]]) { const b = solid(g); put(b, { sil: bx(x0, 0.4, z0, x1, T, z1), crease: ed(x0, 0.4, z0, x1, T, z1) + seg(P((x0 + x1) / 2, T, z0 + 1), P((x0 + x1) / 2, T, z1 - 1)) }); }
  const door = solid(g), bar = solid(g);
  const hood = solid(g);
  put(hood, { sil: bx(DX0 - 2, T, DH, DX1 + 2, T + 4, DH + 6), crease: ed(DX0 - 2, T, DH, DX1 + 2, T + 4, DH + 6) });
  for (const x of [DX0 - 5, DX1 + 1]) { const b = solid(g); put(b, { sil: bx(x, T, 3, x + 4, T + 3, 9), crease: ed(x, T, 3, x + 4, T + 3, 9) }); }
  const tw = tween(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    const y = T + 0.6, xm = (DX0 + DX1) / 2;
    door.sil.setAttribute("d", poly([P(DX0, y, h), P(DX1, y, h), P(DX1, y, DH), P(DX0, y, DH)]));
    let c = "";
    for (let z = DH - 3; z > h + 0.5; z -= 3) c += seg(P(DX0, y, z), P(DX1, y, z));
    door.cr.setAttribute("d", c);
    bar.sil.setAttribute("d", bx(DX0, y, h, DX1, y + 1.2, h + 1.6));
    bar.cr.setAttribute("d", seg(P(xm - 3, y + 1.2, h + 0.8), P(xm + 3, y + 1.2, h + 0.8)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? ((DH - 2) * open) / 100 : REST, performance.now(), 0);
    door.sil.classList.toggle("hi", !!a);
    bar.sil.classList.toggle("hi", !a);
    read.textContent = a ? "open " + open + "%" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > 60 && sx < 340 && sy > 30 && sy < 300 ? 1 : 0), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act === 1) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "dockdoor",
  means: "A loading-dock door: the pointer over the opening rolls the sectional door up into its hood, slat by slat.",
  rules: [3, 4, 5, 8],
  range: [60, 100, 100],
  tour: [[205, 149], [150, 168], [250, 253], null],
  mount,
});
