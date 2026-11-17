/**
 * Rain chain: a run of cups hung on links from a gutter, down to a stone
 * basin. The pointer pushes the chain: it swings toward the pointer's side
 * on a spring, the lower cups whipping further. The cup nearest the pointer
 * is bright; at rest the chain leans a little and the bottom cup is bright.
 * The slider is how far the chain may swing.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, GAP = 17, TOP = 120, R1 = 7, R0 = 4.2, CH = 8, REST = 6;
const U = [Math.SQRT1_2, -Math.SQRT1_2];
const disc = (r, n = 24) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-56, -8, TOP + 8], [56, 8, TOP + 8], [-56, 8, 0], [56, -8, 0], [-30, 30, 10], [30, -30, 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the basin on the ground
  put(solid(g), prism(P, front, circ(16, 40), circ(13, 40), 0, 7));
  // the gutter
  const [gr, gi] = rings(-54, -7, 54, 7, 4, 1.6);
  put(solid(g), prism(P, front, gr, gi, TOP, TOP + 9));
  const links = mk("path", { class: "nf lo" }, g);
  const cups = [];
  for (let i = 0; i < N; i++) {
    const s = solid(g);
    cups.push({ i, s, last: "" });
  }
  const sw = spring(REST);
  let over = -1;

  function pos(i, a) {
    const d = GAP * (i + 1), w = 1 + 0.06 * i, t = rad(a * w);
    const off = Math.sin(t) * d, z = TOP - Math.cos(t) * d;
    return [U[0] * off, U[1] * off, z];
  }
  function cupPaths(c, i) {
    const ring = (r, z) => ringAt(P, disc(r).map((q) => ({ ...q, u: q.u + c[0], v: q.v + c[1] })), z);
    const top = ring(R1, c[2] + CH / 2), bot = ring(R0, c[2] - CH / 2);
    return { sil: poly(hull(top.concat(bot))), crease: poly(ring(R1 - 1.6, c[2] + CH / 2 - 0.6)) };
  }
  let lastA = NaN;
  function draw() {
    const a = sw.x;
    if (a === lastA) return;
    lastA = a;
    let d = "", prev = [0, 0, TOP];
    for (const cu of cups) {
      const c = pos(cu.i, a);
      put(cu.s, cupPaths(c, cu.i));
      d += seg(P(...prev), P(c[0], c[1], c[2] + CH / 2));
      prev = [c[0], c[1], c[2] - CH / 2];
    }
    d += seg(P(...prev), P(prev[0] * 0.5, prev[1] * 0.5, 7));
    links.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(); return m; });
  bag.add(B.unregister);

  const top = P(0, 0, TOP), rests = cups.map((cu) => P(...pos(cu.i, 0)));
  function setOver(p) {
    if (!p) { over = -1; sw.t = REST; }
    else {
      let best = 0, bd = Infinity;
      rests.forEach((m, k) => { const dd = Math.abs(m[1] - p[1]); if (dd < bd) { bd = dd; best = k; } });
      over = best;
      sw.t = clamp((p[0] - top[0]) / 90, -1, 1) * reach;
    }
    const hiK = over < 0 ? N - 1 : over;
    cups.forEach((cu, k) => cu.s.sil.classList.toggle("hi", k === hiK));
    read.textContent = over < 0 ? "rest" : "cup " + (over + 1);
    B.wake();
  }
  setOver(null);
  bag.add(pointer(stage, { move: setOver, leave: () => setOver(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "rainchain",
  means: "Cups hung on links from a gutter to a basin: the chain swings toward the pointer, lower cups whipping further.",
  rules: [1, 3, 5, 8],
  range: [10, 32, 45],
  tour: [[307, 221], [110, 200], [270, 150], null],
  mount,
});
