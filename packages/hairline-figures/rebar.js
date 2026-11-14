/**
 * Rebar bundle: six steel bars stacked in a pyramid, their ends ragged from the
 * cut. The pointer chooses a bar: it slides out of the bundle along its length,
 * its neighbours drawn a little way with it, staggered by distance. At rest one
 * bar already stands proud, bright. The slider is how far a bar slides.
 *
 * The pattern: a discrete pick (the 700ms tween, staggered); the hit is each
 * bar's rest axis on screen, which never moves.
 */
const {
  Cam, fit, proj, circ, hull, poly, clamp, tween, tset, tval, tdone,
  disposer, mk, solid, put, pointer, register,
} = HL;

const R = 6, L = 52, OUT = 46;
const ROWS = [[-2, 0], [0, 0], [2, 0], [-1, 1], [1, 1], [0, 2]];
const REST = [3, -4, 6, -2, 2, 14], FAV = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  const bars = ROWS.map(([j, row], i) => ({ i, y: j * R, z: R + row * R * Math.sqrt(3), tw: tween(REST[i]), drawn: NaN }));
  const ext = [];
  for (const b of bars) ext.push([-L - 8, b.y - R, b.z - R], [L + OUT * 1.5, b.y + R, b.z + R], [-L, b.y + R, 0]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const ring = circ(R, 24), capR = circ(R - 1.6, 24);
  const cyl = (x, b, rg) => rg.map((q) => P(x, b.y + q.u, b.z + q.v));

  bars.sort((p, q) => 0.61 * p.y + 0.5 * p.z - (0.61 * q.y + 0.5 * q.z));
  for (const b of bars) { b.s = solid(g); b.cap = mk("path", { class: "nf lo" }, b.s.g); }
  bars.sort((p, q) => p.i - q.i);
  for (const b of bars) {
    const a = P(-L, b.y, b.z), e = P(L, b.y, b.z);
    b.ax = [a, e];
  }

  function draw(b, now) {
    const x = tval(b.tw, now);
    if (Math.abs(x - b.drawn) < 1e-3) return;
    b.drawn = x;
    const x0 = -L + x, x1 = L + x;
    b.s.sil.setAttribute("d", poly(hull(cyl(x0, b, ring).concat(cyl(x1, b, ring)))));
    b.s.cr.setAttribute("d", poly(cyl(x1, b, ring)));
    b.cap.setAttribute("d", poly(cyl(x1, b, capR)));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const b of bars) { draw(b, now); if (!tdone(b.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let chosen = -1;
  function choose(a) {
    if (a === chosen) return;
    chosen = a;
    const now = performance.now(), out = clamp(OUT * value, 12, OUT * 1.5);
    for (const b of bars) {
      if (a < 0) { tset(b.tw, REST[b.i], now, 0); continue; }
      const d = Math.hypot(b.y - bars[a].y, b.z - bars[a].z) / (2 * R);
      tset(b.tw, b.i === a ? out : clamp(out * (0.42 - 0.2 * d), 0, out), now, d * 45);
    }
    for (const b of bars) b.s.sil.classList.toggle("hi", a < 0 ? b.i === FAV : b.i === a);
    read.textContent = a < 0 ? "rest" : "bar " + (a + 1);
    B.wake();
  }

  const dist = (p, [a, e]) => {
    const dx = e[0] - a[0], dy = e[1] - a[1];
    const t = clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy), 0, 1);
    return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
  };
  bag.add(pointer(stage, {
    move: (p) => {
      let best = -1, bd = R * 2.3 * 2.4;
      for (const b of bars) { const d = dist(p, b.ax); if (d < bd) { bd = d; best = b.i; } }
      choose(best);
    },
    leave: () => choose(-1),
  }));
  bag.add(() => svg.replaceChildren());
  chosen = 0; choose(-1);
  for (const b of bars) draw(b, performance.now() + 1e4);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "rebar",
  means: "A bundle of six rebar bars: the bar under the pointer slides out along its length, its neighbours drawn a little after it.",
  rules: [1, 2, 4, 5],
  range: [0.5, 1, 1.5],
  tour: [[124, 123], [134, 167], [154, 115], null],
  mount,
});
