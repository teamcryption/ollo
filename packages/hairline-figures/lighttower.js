/**
 * Light tower: a generator trailer on two wheels with a telescoping mast and a
 * bar of four lamps on top. The pointer runs the mast up: the higher it rides
 * over the trailer, the further the two inner sections slide out, carrying the
 * lamp bar, and the lamps all light. At rest the mast is nearly stowed and one
 * lens is bright. The slider is how far the mast may extend.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, rrect, seg, spring, stepS, lerp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 34, MX = -20, SEC = 26, E0 = 0.1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let v = value, over = null, last = "";
  const C = Cam(45, 0.5, 1.84);
  const topAt = (e) => BZ + 30 + 2 * (2 + SEC * e);
  fit(C, [[-42, -30, 0], [64, 0, 0], [-42, 30, 0], [42, 20, 0], [MX, -32, topAt(1) + 18], [MX, 32, topAt(1) + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (s, x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const disc = (x, y, z, r, n = 28) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(x + r * Math.cos(t), y, z + r * Math.sin(t)); });
  const wheel = (y, d) => {
    mk("path", { class: "sil", d: poly(hull(disc(0, y - d * 4, 10, 10).concat(disc(0, y + d * 4, 10, 10)))) }, g);
    mk("path", { class: "", d: poly(disc(0, y + 4, 10, 10)) }, g);
    mk("path", { class: "nf lo", d: poly(disc(0, y + 4, 10, 4.5)) }, g);
  };
  wheel(-21, 1);
  // drawbar and jack, then the generator body
  block(solid(g), 30, -3, 64, 3, 1.5, 0.6, 12, 16);
  block(solid(g), 56, -2.5, 61, 2.5, 1.5, 0.6, 0, 14);
  block(solid(g), -42, -17, 42, 17, 4, 1.6, 10, BZ);
  mk("path", { class: "nf lo", d: seg(P(-10, 17, 14), P(-10, 17, BZ - 4)) + seg(P(14, 17, 14), P(14, 17, BZ - 4)) }, g);
  wheel(21, -1);
  // mast: a fixed outer section, then two sliding ones
  block(solid(g), MX - 5, -5, MX + 5, 5, 1.8, 0.8, BZ, BZ + 30);
  const mid = solid(g), inner = solid(g);
  const bar = solid(g);
  const lamps = [-30, -15, 0, 15].map((y) => ({ y, s: solid(g), lens: mk("path", { class: "" }, g) }));
  const ext = spring(E0);

  function draw() {
    const key = ext.x.toFixed(3);
    if (key === last) return;
    last = key;
    const t1 = BZ + 30, t2 = t1 + 2 + SEC * ext.x, t3 = t2 + 2 + SEC * ext.x;
    block(mid, MX - 3.6, -3.6, MX + 3.6, 3.6, 1.4, 0.7, t1, t2);
    block(inner, MX - 2.4, -2.4, MX + 2.4, 2.4, 1, 0.5, t2, t3);
    block(bar, MX - 2.5, -32, MX + 2.5, 32, 1.2, 0.5, t3, t3 + 3);
    for (const l of lamps) {
      block(l.s, MX - 4, l.y + 0.6, MX + 4, l.y + 14.4, 2, 0.8, t3 + 3, t3 + 17);
      l.lens.setAttribute("d", poly(rrect(l.y + 2.4, t3 + 5, l.y + 12.6, t3 + 15, 2, 4).map((q) => P(MX + 4.05, q.u, q.v))));
    }
  }

  const B = register(stage, (dt) => { const m = stepS(ext, dt); draw(); return m; });
  bag.add(B.unregister);

  function retarget() {
    const on = over != null;
    ext.t = on ? v * lerp(0.5, 1, over) : E0;
    lamps.forEach((l, k) => l.lens.classList.toggle("hi", on || k === 1));
    read.textContent = on ? `mast ${Math.round(ext.t * 100)}%` : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      over = p[0] < 40 || p[0] > 360 || p[1] < 4 || p[1] > 316 ? null : clamp((250 - p[1]) / 190, 0, 1);
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return { set: (nv) => { v = nv; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "lighttower",
  means: "A mobile light tower: raise the pointer and the telescoping mast slides up, lifting the bar of lamps as they light.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[180, 210], [179, 125], [179, 60], null],
  mount,
});
