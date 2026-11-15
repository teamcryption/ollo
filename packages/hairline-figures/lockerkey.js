/**
 * Book stand: a reading stand on its base, an open book resting on the tilted
 * board against the front lip, a strut behind. The pointer's height sets the
 * board's tilt: up raises it toward upright, down lays it back. At rest it
 * stands at a reading angle, the book bright.
 *
 * The pattern: a continuous tilt (one spring on an angle); the hit is the
 * pointer's screen height over a stand that never moves its base.
 */
const {
  Cam, fit, proj, prism, rings, facing, poly, open, hull, fillet, clamp, lerp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HW = 30, YH = 10, ZH = 5, L = 52, TMIN = rad(18), TMAX = rad(80), REST = rad(52);

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  const ext = [[-HW - 6, -40, 0], [HW + 6, YH + 8, 0], [-HW, YH - L * Math.cos(TMAX), ZH + L], [HW, YH - L * Math.cos(TMIN), ZH + L * Math.sin(TMIN)]];
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ring, inner] = rings(-HW - 6, -36, HW + 6, YH + 6, 5, 1.6);
  put(solid(g), prism(P, front, ring, inner, 0, ZH));
  const strut = mk("path", { class: "nf sil", d: "" }, g);
  const board = mk("path", { class: "sil", d: "" }, g);
  const boardIn = mk("path", { class: "nf lo", d: "" }, g);
  const book = mk("path", { class: "sil hi", d: "" }, g);
  const lines = mk("path", { class: "nf lo", d: "" }, g);
  const lip = mk("path", { class: "sil", d: "" }, g);

  // a point on the board: x across, h up its face, n off its face
  const on = (t, x, h, n) => P(x, YH - h * Math.cos(t) + n * Math.sin(t), ZH + h * Math.sin(t) + n * Math.cos(t));
  const quad = (t, x0, h0, x1, h1, n, r) => fillet([[x0, h0], [x1, h0], [x1, h1], [x0, h1]], [r, r, r, r]).map(([x, h]) => on(t, x, h, n));
  const sp = spring(REST);
  let drawn = NaN;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const top = on(t, 0, L * 0.7, -1.5), foot = P(0, YH - L * 0.9, 0.5);
    strut.setAttribute("d", open([P(-14, YH - L * 0.9, ZH), on(t, -14, L * 0.62, -1.5)]) + open([P(14, YH - L * 0.9, ZH), on(t, 14, L * 0.62, -1.5)]) + open([top, foot]));
    board.setAttribute("d", poly(hull(quad(t, -HW, 0, HW, L, -2, 3).concat(quad(t, -HW, 0, HW, L, 0, 3)))));
    boardIn.setAttribute("d", poly(quad(t, -HW + 2, 2, HW - 2, L - 2, 0, 2)));
    const lp = quad(t, -HW, -1, HW, 1, 0, 0.8).concat(quad(t, -HW, -1, HW, 1, 6, 0.8));
    lip.setAttribute("d", poly(hull(lp)));
    const pg = (x0, x1, lift) => [[x0, 2], [x1, 2], [x1, 40], [x0, 40]].map(([x, h]) => on(t, x, h, 0.6 + lift * (1 - Math.abs(x) / 24)));
    book.setAttribute("d", poly(hull(pg(-24, 0, 3).concat(pg(0, 24, 3)))));
    let d = open([on(t, 0, 2, 0.6), on(t, 0, 40, 0.6)]);
    for (let k = 0; k < 6; k++) {
      const h = 8 + k * 5.2;
      d += open([on(t, -21, h, 1.8), on(t, -4, h, 3.2)]) + open([on(t, 4, h, 3.2), on(t, k === 5 ? 12 : 21, h, k === 5 ? 2.2 : 1.8)]);
    }
    lines.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function tilt(sy) {
    sp.t = sy == null ? REST : clamp(lerp(TMAX, TMIN, (sy - 70) / 180), TMIN, TMAX);
    read.textContent = sy == null ? "rest" : Math.round((sp.t * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => tilt(p[0] < 60 || p[0] > 340 ? null : p[1]),
    leave: () => tilt(null),
  }));
  bag.add(() => svg.replaceChildren());
  tilt(null);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "lockerkey",
  means: "A book stand holding an open book: the board tilts with the pointer's height, up toward upright, down laid back.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[148, 90], [95, 150], [272, 189], null],
  mount,
});
