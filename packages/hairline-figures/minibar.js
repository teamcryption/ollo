/**
 * Minibar: a small hotel fridge, two shelves of bottles and cans behind a
 * door hinged on its far edge. Over the fridge the pointer swings the door
 * open, and the drink nearest it goes bright. At rest the door stands ajar,
 * its handle bright. The slider is how far the door swings.
 *
 * The pattern: open a door, pick one inside (riffle behind a lid).
 */
const {
  Cam, circ, fit, facing, fillet, hull, open, poly, prism, proj, rad, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 36, D = 40, H = 46, T = 3, AJAR = 22;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
// shelf height, y, radius, body height, neck height
const DRINKS = [[24, 9, 3.4, 8, 0], [24, 18, 3.4, 8, 0], [24, 28, 2.6, 9, 4], [5, 10, 3, 11, 5], [5, 20, 3.4, 13, 5], [5, 30, 3, 11, 5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 2.7);
  const fx = X1 + D * Math.sin(rad(130)), fy = D * Math.cos(rad(130));
  fit(C, [[-4, -4, 0], [X1 + 4, D + 4, 0], [X1 + 4, -4, 0], [-4, D + 4, 0], [0, 0, H], [fx, fy, 0], [fx, fy, H]], 196, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, X1 + 4, D + 4, 4, 1.5);
  put(solid(g), prism(P, front, pr, pi, -3, 0));
  const [br, bi] = rings(0, 0, X1, D, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // the cavity on the front face, and the shelf across it
  const face = (y, z) => P(X1, y, z);
  mk("path", { d: poly(fillet([face(3, 3), face(37, 3), face(37, 43), face(3, 43)], [2, 2, 2, 2])) }, g);
  mk("path", { d: seg(face(3, 23), face(37, 23)), class: "lo" }, g);
  const items = DRINKS.map(([z, y, r, h, nk], k) => {
    const x = X1 - 6, s = solid(g);
    const body = ringAt(P, disc(x, y, r), z).concat(ringAt(P, disc(x, y, r), z + h));
    const neck = nk ? ringAt(P, disc(x, y, 1.2, 10), z + h + nk) : [];
    s.sil.setAttribute("d", poly(hull(body.concat(neck))));
    s.cr.setAttribute("d", open(ringAt(P, disc(x, y, r - 0.8).filter(front), z + h - 0.8)));
    s.cr.setAttribute("class", "lo nf");
    return { k, sil: s.sil, mid: P(x, y, z + h / 2) };
  });
  // the door: a thin plate turning on the hinge at y = 0
  const door = mk("path", { class: "" }, g), handle = mk("path", { class: "sil nf" }, g);
  const ang = tween(AJAR);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (w, o, z) => P(X1 + w * s + o * c, w * c - o * s, z);
    const pts = [];
    for (const [w, o] of [[0, 0], [D, 0], [D, T], [0, T]]) pts.push(at(w, o, 0.5), at(w, o, H - 0.5));
    door.setAttribute("d", poly(fillet(hull(pts), hull(pts).map(() => 1.5))));
    handle.setAttribute("d", open([at(D - 4, T, 16), at(D - 4, T + 2, 17), at(D - 4, T + 2, 31), at(D - 4, T, 32)]));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit against the rest pose: the closed fridge's screen box, and drinks by their rest centres
  const box = [P(0, 0, H), P(X1, 0, H), P(X1, D, 0), P(0, D, 0), P(X1, 0, 0), P(0, D, H)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  function hit([sx, sy]) {
    if (sx < Math.min(...xs) - 6 || sx > Math.max(...xs) + 30 || sy < Math.min(...ys) - 6 || sy > Math.max(...ys) + 6) return -1;
    let best = 0, bd = Infinity;
    items.forEach((it, k) => { const d = Math.hypot(it.mid[0] - sx, it.mid[1] - sy); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a < 0 ? AJAR : wide, performance.now(), 0);
    handle.classList.toggle("hi", a < 0);
    items.forEach((it, k) => it.sil.classList.toggle("hi", k === a));
    read.textContent = a < 0 ? "rest" : "shelf " + (a < 3 ? 1 : 2) + "·" + ((a % 3) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; if (act >= 0) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "minibar",
  means: "A hotel minibar: over it the pointer swings the door open, and the drink nearest the pointer goes bright.",
  rules: [1, 4, 5, 6, 8],
  range: [70, 110, 130],
  tour: [[196, 148], [154, 169], [173, 201], null],
  mount,
});
