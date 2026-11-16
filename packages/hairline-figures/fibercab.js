/**
 * Fiber box: a splice enclosure whose lid is hinged at the back. The pointer
 * over the box swings the lid open, as far as the slider allows, to show a
 * splice tray with two fiber coils; the tray takes the bright. At rest the
 * lid stands ajar, bright.
 */
const { Cam, fit, proj, facing, rings, prism, put, solid, mk, poly, hull, circ, ringAt, unproj, tween, tset, tval, tdone, register, pointer, disposer } = HL;
const bx = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const W = 36, D = 24, H = 26, AJAR = 0.32;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-W, -D, 0], [W, D, 0], [-W, D, 0], [W, -D, 0], [-W, -D, H + 50], [W, -D, H + 50], [-W, D, H + 6], [W, D, H + 6]], 200, 165);
  const P = proj(C), front = facing(C), Pp = (q) => P(q[0], q[1], q[2]);
  const sy = Math.sign(P(0, 1, 0)[1] - P(0, 0, 0)[1]) || 1, yb = -sy * D;
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(-W, -D, W, D, 5, 3);
  put(solid(g), prism(P, front, r0, r1, 0, H));
  const tray = mk("path", { class: "nf", d: poly(ringAt(P, rings(-W + 7, -D + 7, W - 7, D - 7, 4, 0)[0], H)) }, g);
  for (const x of [-12, 12]) { mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x, 0, 9), H)) }, g); mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x, 0, 5), H)) }, g); }
  const lid = mk("path", { class: "sil" }, g), lidTop = mk("path", { class: "nf" }, g), latch = mk("path", { class: "nf" }, g);
  const a = tween(AJAR);
  let last = NaN;
  const T = (p, t) => { const yy = p[1] - yb, zz = p[2] - H, c = Math.cos(t), s = Math.sin(sy * t) * 1; return [p[0], yb + yy * c - zz * s * sy * sy, H + sy * yy * Math.sin(t) * 1 + zz * c]; };
  function draw(t) {
    if (t === last) return; last = t;
    const pts = bx(-W - 1, yb, H, W + 1, yb + sy * (2 * D + 1), H + 4).map((p) => Pp(T(p, t)));
    lid.setAttribute("d", poly(hull(pts)));
    lidTop.setAttribute("d", poly(pts.slice(4)));
    latch.setAttribute("d", poly(bx(-6, yb + sy * (2 * D + 1), H + 0.5, 6, yb + sy * (2 * D + 3), H + 3.5).slice(4).map((p) => Pp(T(p, t)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(a, now)); return !tdone(a, now); });
  bag.add(B.unregister);
  let act = null;
  function setOpen(on) {
    if (on === act) return; act = on;
    tset(a, on ? open : AJAR, performance.now(), 0);
    lid.classList.toggle("hi", !on); tray.classList.toggle("hi", on);
    read.textContent = on ? Math.round((open * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  setOpen(false);
  const over = (p) => { const [x, y] = unproj(C, p[0], p[1], H); return Math.abs(x) < W + 14 && Math.abs(y) < D + 14; };
  bag.add(pointer(stage, { move: (p) => setOpen(over(p)), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { act = null; setOpen(true); } }, destroy: bag.dispose };
}

hairline({
  name: "fibercab",
  means: "A fiber splice box: the pointer over it swings the hinged lid open to show the splice tray and its two coils.",
  rules: [1, 3, 4, 5],
  range: [1.1, 1.5, 1.85],
  tour: [[200, 170], [180, 190], [220, 160], null],
  mount,
});
