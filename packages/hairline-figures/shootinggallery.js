/**
 * Shooting gallery: a fairground booth, its back wall and counter, with a
 * row of round tin targets standing on a shelf rail between them. The
 * pointer picks the target nearest it by screen x: that target flips back on
 * its hinge, the ones beside it tip a little less, spreading outward. At
 * rest the targets lean unevenly and the middle one is bright. The slider
 * is how far the targets flip.
 *
 * The pattern: a single row picked by screen x, parts turning on a hinge.
 */
const { Cam, circ, fit, hull, open, poly, prism, proj, facing, rings, clamp, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, GAP = 28, R = 12, HC = 15, ZR = 38, REST = [8, 0, 3, 14, 5];
const X = Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * GAP);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-70, -26, 0], [70, 30, 0], [-70, -26, 96], [70, -26, 96], [-70, 30, 0], [70, 30, 34]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-70, -26, 70, -21, 2, 1, 0, 96);
  // bunting holes along the top of the wall
  for (let i = 0; i < 7; i++) mk("path", { d: poly(circ(2.2, 12).map((q) => P(-54 + i * 18 + q.u, -21, 84 + q.v))), class: "nf lo" }, g);
  box(-66, -21, 66, 4, 2, 1.4, ZR - 4, ZR);
  const tg = X.map(() => ({ stem: mk("path", { class: "nf lo" }, g), sil: mk("path", { class: "sil" }, g), eye: mk("path", { class: "nf lo" }, g) }));
  box(-70, 12, 70, 30, 4, 1.6, 0, 34);
  mk("path", { d: open([P(-66, 21, 34), P(66, 21, 34)]), class: "nf lo" }, g);

  function pt(x, u, h, th, off) {
    const s = Math.sin(th), c = Math.cos(th);
    return P(x + u, -h * s - off * c, ZR + h * c - off * s);
  }
  const ring = circ(1, 24);
  const last = X.map(() => NaN);
  function draw(i, deg) {
    if (deg === last[i]) return;
    last[i] = deg;
    const th = (deg * Math.PI) / 180, x = X[i], t = tg[i];
    const f = ring.map((q) => pt(x, q.u * R, HC + q.v * R, th, 0)), b = ring.map((q) => pt(x, q.u * R, HC + q.v * R, th, -2.4));
    t.sil.setAttribute("d", poly(hull(f.concat(b))));
    t.eye.setAttribute("d", poly(ring.map((q) => pt(x, q.u * 5, HC + q.v * 5, th, 0.3))));
    t.stem.setAttribute("d", open([pt(x, 0, 0, th, -1), pt(x, 0, HC - R, th, -1)]));
  }
  const tw = X.map((_, i) => tween(REST[i]));
  const B = register(stage, (_dt, now) => {
    let busy = false;
    tw.forEach((w, i) => { draw(i, tval(w, now)); if (!tdone(w, now)) busy = true; });
    return busy;
  });
  bag.add(B.unregister);

  const cx = X.map((x) => P(x, 0, ZR + HC)[0]);
  const top = P(-70, -26, 96)[1], bot = P(70, 30, 0)[1];
  let act = -2;
  function choose(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tw.forEach((w, i) => {
      const k = a < 0 ? 0 : [1, 0.45, 0.15][Math.min(2, Math.abs(i - a))];
      tset(w, clamp(REST[i] + k * 84 * amp, 0, 86), now, a < 0 ? Math.abs(i - 2) * 40 : Math.abs(i - a) * 45);
    });
    tg.forEach((t, i) => t.sil.classList.toggle("hi", a < 0 ? i === 2 : i === a));
    read.textContent = a < 0 ? "rest" : "tgt " + (a + 1);
    B.wake();
  }
  choose(-1);
  function hit([sx, sy]) {
    if (sy < top || sy > bot) return -1;
    let best = -1, d = 1e9;
    cx.forEach((x, i) => { const e = Math.abs(sx - x); if (e < d) { d = e; best = i; } });
    return d < GAP * 1.2 ? best : -1;
  }
  bag.add(pointer(stage, { move: (p) => choose(hit(p)), leave: () => choose(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; const a = act; act = -2; choose(a); }, destroy: bag.dispose };
}

hairline({
  name: "shootinggallery",
  means: "A shooting gallery booth: the tin target nearest the pointer flips back on its rail hinge, its neighbours tip less.",
  rules: [1, 2, 3, 4, 5, 8],
  range: [0.3, 1, 1],
  tour: [[127, 99], [240, 155], [278, 174], null],
  mount,
});
