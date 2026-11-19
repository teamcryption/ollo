/**
 * Tide gauge: a stilling well on a pier deck, its float rod rising out of the
 * top, wired to a round dial whose long pointer reads the tide. The pointer
 * over the gauge brings the tide in: the float rod climbs out of the well, the
 * wire follows and the dial's hand swings up across the scale. At rest the
 * tide is low and the hand is bright. The slider is how high the tide comes.
 *
 * The pattern: one part answering (a hand turning on a tween); the hit is the
 * rest pose's screen box, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, open, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const WX = -28, WY = -2, WR = 13, WH = 42, DX = 16, DY = 6, DZ = 40, DR = 27, RISE = 54, H0 = 0.12;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let val = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-48, -24, -3], [48, 26, -3], [-48, 26, -3], [48, -24, -3], [WX, WY, WH + RISE + 8], [DX, DY, DZ + DR + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-48, -24, 48, 26, 5, 2);
  put(solid(g), prism(P, front, sr, si, -3, 0));
  const wire = mk("path", { class: "nf dash" }, g);
  const rod = solid(g), cap = solid(g);
  put(solid(g), prism(P, front, disc(WX, WY, WR), disc(WX, WY, WR - 2), 0, WH));
  put(solid(g), prism(P, front, disc(DX, DY, 3.2, 16), disc(DX, DY, 2, 16), 0, DZ - DR + 2));
  // the dial: a disc standing in the x-z plane, its face toward +y
  const dial = (y, r) => circ(r, 48).map((q) => P(DX + q.u, y, DZ + q.v));
  put(solid(g), { sil: poly(hull(dial(DY - 1.4, DR).concat(dial(DY + 1.4, DR)))), crease: poly(dial(DY + 1.4, DR - 2.2)) });
  for (let a = -60; a <= 60; a += 20) {
    const t = rad(90 - a), s = P(DX + (DR - 5) * Math.cos(t), DY + 1.5, DZ + (DR - 5) * Math.sin(t));
    mk("ellipse", { class: a === 0 ? "dot m" : "dot off", cx: s[0], cy: s[1], rx: 1.4, ry: 1.4 }, g);
  }
  const hand = mk("path", { class: "sil hi" }, g), hub = solid(g);
  put(hub, { sil: poly(hull(circ(3.6, 16).map((q) => P(DX + q.u, DY + 1.5, DZ + q.v)).concat(circ(3.6, 16).map((q) => P(DX + q.u, DY + 3.6, DZ + q.v))))), crease: "" });
  const tw = tween(H0);
  let last = NaN, over = false;

  function draw(h) {
    if (h === last) return;
    last = h;
    const top = WH + 4 + RISE * h;
    put(rod, prism(P, front, disc(WX, WY, 2.8, 14), disc(WX, WY, 1.8, 14), WH - 1, top));
    put(cap, prism(P, front, disc(WX, WY, 8, 24), disc(WX, WY, 6, 24), top, top + 4.5));
    const t = rad(90 + 70 - 140 * h), L = DR - 3, y = DY + 2.6;
    const tip = P(DX + L * Math.cos(t), y, DZ + L * Math.sin(t)), tail = P(DX - 10 * Math.cos(t), y, DZ - 10 * Math.sin(t));
    const n = [-Math.sin(t), Math.cos(t)], w = 3.6;
    const side = (k) => P(DX + k * w * n[0], y, DZ + k * w * n[1]);
    hand.setAttribute("d", poly(hull([tip, side(1), tail, side(-1)])));
    wire.setAttribute("d", open([P(WX, WY, top + 4.5), P(DX, DY, DZ + DR + 10 - 8 * h), P(DX, DY + 2, DZ)]));
    read.textContent = over ? `${(h * 4.8).toFixed(1)} m` : "rest";
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const box = [P(-48, -24, -3), P(48, 26, -3), P(-48, 26, -3), P(48, -24, -3), P(WX, WY, WH + 10), P(DX, DY, DZ + DR)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  function set(o) {
    if (o === over && !Number.isNaN(last)) return;
    over = o;
    tset(tw, o ? clamp(H0 + 0.62 * val, H0, 1) : H0, performance.now(), 0);
    last = NaN; B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys)),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { val = v; if (over) { over = !over; set(!over); } }, destroy: bag.dispose };
}

hairline({
  name: "tidegauge",
  means: "A tide gauge on a pier: the pointer brings the tide in, the float rod climbs out of its well and the dial's hand swings up.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[214, 187], [160, 180], [235, 240], null],
  mount,
});
