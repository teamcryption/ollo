/**
 * Garment steamer: a water tank on the floor, a telescoping pole standing
 * from it and a steam head paddle hanging on the pole's top, joined to the
 * tank by a hose. The pointer raises the inner pole by how high it stands:
 * the head rides up and the hose pulls taut. At rest the pole is low and
 * the head is bright. The slider is how far the pole extends.
 *
 * The pattern: one sliding part on a spring.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const TX = 24, TY = 20, TZ = 26, OUT = 52, IN0 = 68;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [48, 40, 0], [48, 0, 0], [0, 40, 0], [TX, TY, IN0 + 8 + 40], [70, 20, 6]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [tr, ti] = rings(0, 0, 48, 40, 9, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  put(solid(g), prism(P, front, disc(TX, TY, 6), disc(TX, TY, 4.4), TZ, TZ + 3));
  put(solid(g), prism(P, front, disc(TX, TY, 2.6), disc(TX, TY, 1.6), TZ + 3, OUT));
  const inner = solid(g), hook = mk("path", { class: "nf" }, g), hose = mk("path", { class: "sil nf" }, g);
  const head = mk("path", { class: "sil hi" }, g), face = mk("path", { class: "lo nf" }, g);
  const plate = rrect(-11, -9, 11, 9, 5, 4), plin = rrect(-9, -7, 9, 7, 3.5, 4);

  const sp = spring(0);
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const top = IN0 + reach * f;
    put(inner, prism(P, front, disc(TX, TY, 1.8), disc(TX, TY, 1), OUT - 2, top));
    hook.setAttribute("d", open([P(TX, TY, top), P(TX, TY, top + 4), P(TX + 6, TY, top + 4), P(TX + 6, TY, top - 1)]));
    const hc = [TX + 8, TY, top - 13];
    const at = (q, x) => P(x, hc[1] + q.u, hc[2] + q.v);
    head.setAttribute("d", poly(hull(plate.map((q) => at(q, hc[0])).concat(plate.map((q) => at(q, hc[0] + 4))))));
    face.setAttribute("d", poly(plin.map((q) => at(q, hc[0] + 4))));
    const a = [48, 20, 9], b = [hc[0] + 2, hc[1], hc[2] - 9], m = [74, 20, 0], pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = i / 24, u = 1 - t;
      pts.push(P(u * u * a[0] + 2 * u * t * m[0] + t * t * b[0], u * u * a[1] + 2 * u * t * m[1] + t * t * b[1], u * u * a[2] + 2 * u * t * m[2] + t * t * b[2]));
    }
    hose.setAttribute("d", open(pts));
  }

  const B = register(stage, (dt) => { const mv = stepS(sp, dt); draw(sp.x); return mv; });
  bag.add(B.unregister);

  function aim(p) {
    const y0 = P(TX + 8, TY, IN0 - 4)[1], y1 = P(TX + 8, TY, IN0 - 4 + reach)[1];
    const f = p ? clamp((p[1] - y0) / (y1 - y0), 0, 1) : 0;
    sp.t = f;
    read.textContent = p ? "+" + Math.round(f * reach) : "rest";
    B.wake();
  }
  draw(0);
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "garmentsteamer",
  means: "A garment steamer: the pointer raises the telescoping pole, and the steam head rides up on its hose.",
  rules: [1, 3, 5, 8],
  range: [20, 32, 40],
  tour: [[214, 120], [214, 69], [214, 47], null],
  mount,
});
