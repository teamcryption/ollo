/**
 * Wall map: a rolled map on a stand, its roller case on two posts, the sheet
 * hanging below with a pull ring at its foot. The pointer pulls the sheet
 * down, or lets it roll up, to the height it points at. At rest the map
 * hangs half down, bright. The slider is how much graticule the map shows.
 *
 * The pattern: one part slid along a guide (slide).
 */
const { Cam, clamp, fit, facing, poly, prism, proj, rings, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 96, TOP = 120, LO = 14, HI = 100, REST = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let grid = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-14, -14, 0], [W + 14, 14, 0], [W + 14, -14, 0], [-14, 14, 0], [-10, 0, TOP + 8], [W + 10, 0, TOP + 8]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const x of [-8, W + 8]) {
    put(solid(g), prism(P, front, ...rings(x - 7, -12, x + 7, 12, 4, 1.5), 0, 4));
  }
  put(solid(g), prism(P, front, ...rings(-10, -2, -6, 2, 1, 0.6), 4, TOP));
  const sheet = solid(g), lines = mk("path", { class: "nf lo" }, g), ring = mk("path", { class: "nf" }, g);
  put(solid(g), prism(P, front, ...rings(-6, -5, W + 6, 5, 5, 1.5), TOP - 4, TOP + 6));
  put(solid(g), prism(P, front, ...rings(W + 6, -2, W + 10, 2, 1, 0.6), 4, TOP));
  const h = spring(REST, { k: 70, c: 15 });
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const zb = TOP - 4 - d;
    put(sheet, prism(P, front, ...rings(2, -1, W - 2, 1, 0.8, 0.4), zb, TOP - 4));
    let s = "";
    const n = Math.round(3 + grid * 5);
    for (let i = 1; i < n; i++) { const x = 2 + ((W - 4) * i) / n; s += seg(P(x, 1.2, zb + 3), P(x, 1.2, TOP - 6)); }
    for (let z = TOP - 16; z > zb + 4; z -= 14) s += seg(P(5, 1.2, z), P(W - 5, 1.2, z));
    lines.setAttribute("d", s);
    const c = W / 2;
    ring.setAttribute("d", seg(P(c, 1, zb), P(c, 1, zb - 4)) + poly([[0, 0], [1, 0], [1, 1]].map(() => P(c, 1, zb - 7)).concat([P(c - 4, 1, zb - 4), P(c - 4, 1, zb - 10), P(c + 4, 1, zb - 10), P(c + 4, 1, zb - 4)]).slice(3)));
  }
  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(h.x); return m; });
  bag.add(B.unregister);

  const xl = P(0, 0, 0)[0], xr = P(W, 0, 0)[0];
  function aim(p) {
    let t = REST;
    if (p) {
      const u = clamp((p[0] - xl) / (xr - xl), 0, 1);
      if (p[0] > xl - 20 && p[0] < xr + 20) {
        let best = REST, bd = Infinity;
        for (let d = 0; d <= TOP; d++) { const e = Math.abs(P(u * W, 0, TOP - 4 - d)[1] - p[1]); if (e < bd) { bd = e; best = d; } }
        if (bd < 4) t = clamp(best, LO, HI);
      }
    }
    h.t = t;
    sheet.sil.classList.toggle("hi", true);
    read.textContent = p && t !== REST ? Math.round((t / HI) * 100) + "%" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { grid = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "mapstand",
  means: "A pull-down wall map on a stand: the sheet rolls down or up to the height of the pointer, its pull ring leading.",
  rules: [1, 3, 5, 6],
  range: [0, 0.5, 1],
  tour: [[200, 95], [200, 236], [200, 233], null],
  mount,
});
