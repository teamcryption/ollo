/**
 * Defibrillator cabinet: a wall cabinet on a low plinth, a beacon on its top,
 * the AED unit standing inside behind a windowed door. The pointer over the
 * cabinet swings the door open on its hinge; leaving lets it fall back ajar.
 * At rest the door stands slightly open, bright. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, circ, fillet, fit, facing, poly, prism, proj, rings, ringAt, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, open, hull,
} = HL;

const W = 60, D = 24, H = 84, Z0 = 8, REST = 16;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let ang = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-6, -6, 0], [W + 6, D + 6, 0], [-40, D + 62, Z0], [W + 6, -6, H + 12], [-40, D + 62, H]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, W + 6, D + 6, 4, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));
  const [br, bi] = rings(0, 0, W, D, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, Z0, Z0 + H));
  put(solid(g), prism(P, front, disc(W / 2, D / 2, 6), disc(W / 2, D / 2, 4.4), Z0 + H, Z0 + H + 7));
  const onFace = (pts) => pts.map(([x, z]) => P(x, D, z));
  // the opening and the unit inside: a case with a carry handle
  mk("path", { d: poly(fillet(onFace([[5, Z0 + 5], [W - 5, Z0 + 5], [W - 5, Z0 + H - 5], [5, Z0 + H - 5]]), [3, 3, 3, 3])), class: "lo" }, g);
  mk("path", { d: poly(fillet(onFace([[14, Z0 + 14], [W - 14, Z0 + 14], [W - 14, Z0 + 52], [14, Z0 + 52]]), [4, 4, 4, 4])), class: "nf" }, g);
  mk("path", { d: open(onFace([[22, Z0 + 52], [22, Z0 + 60], [W - 22, Z0 + 60], [W - 22, Z0 + 52]])), class: "nf" }, g);
  mk("path", { d: poly(fillet(onFace([[22, Z0 + 26], [W - 22, Z0 + 26], [W - 22, Z0 + 42], [22, Z0 + 42]]), [2, 2, 2, 2])), class: "nf lo" }, g);

  const door = mk("path", { class: "sil hi" }, g), win = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  const Wd = W - 3, hx = 1.5, za = Z0 + 3, zb = Z0 + H - 3;
  const at = (s, z, a) => P(hx + s * Math.cos(rad(a)), D + 0.5 + s * Math.sin(rad(a)), z);
  const sw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    door.setAttribute("d", poly(fillet([at(0, za, a), at(Wd, za, a), at(Wd, zb, a), at(0, zb, a)], [3, 3, 3, 3])));
    win.setAttribute("d", poly(fillet([at(7, za + 8, a), at(Wd - 7, za + 8, a), at(Wd - 7, zb - 8, a), at(7, zb - 8, a)], [3, 3, 3, 3])));
    knob.setAttribute("d", poly(fillet([at(Wd - 4.5, Z0 + 36, a), at(Wd - 2.5, Z0 + 36, a), at(Wd - 2.5, Z0 + 50, a), at(Wd - 4.5, Z0 + 50, a)], [1, 1, 1, 1])));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  const box = hull(ringAt(P, br, Z0).concat(ringAt(P, br, Z0 + H)));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 10 && sx < Math.max(...xs) + 10 && sy > Math.min(...ys) - 10 && sy < Math.max(...ys) + 10;
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(sw, on ? ang : REST, performance.now(), 0);
    read.textContent = on ? "open " + Math.round(ang) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { ang = v; if (act) { tset(sw, ang, performance.now(), 0); read.textContent = "open " + Math.round(ang) + "°"; B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "defib",
  means: "A defibrillator cabinet on the wall: the pointer swings its windowed door open on the hinge to show the unit inside.",
  rules: [1, 4, 5, 6],
  range: [50, 105, 135],
  tour: [[234, 152], [258, 190], [214, 210], null],
  mount,
});
