/**
 * Tandem bike: one long frame with two saddles, two handlebars and two
 * crank sets joined by a timing chain. The pointer along the bike rolls it
 * toward the pointer, its spoked wheels and both cranks turning as it goes.
 * At rest it stands a little back, the cranks bright.
 */
const { Cam, circ, fit, hull, poly, open, seg, proj, clamp, spring, stepS, disposer, mk, pointer, register, solid, unproj } = HL;

const R = 18, RX = -58, FX = 58, B1 = -26, B2 = 22, BZ = 13, CR = 8, REST = -8, D = 26, A0 = 0.7;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[RX - R - D, 0, 0], [FX + R + D, 0, 0], [RX - R - D, 0, 2 * R], [FX + R + D, 0, 2 * R], [46, -12, 56], [46, 12, 56], [-34, 0, 56]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const Q = (x, z, y = 0) => P(x, y, z);
  const rimD = (cx) => poly(circ(R, 40).map((q) => Q(cx + q.u, R + q.v))) + poly(circ(R - 2.5, 40).map((q) => Q(cx + q.u, R + q.v)));
  const rims = mk("path", { class: "sil nf", d: rimD(RX) + rimD(FX) }, g);
  const spokes = mk("path", { class: "nf lo" }, g);
  const S1 = [-36, 48], S2 = [12, 48], HT = [44, 50], HB = [47, 36];
  const tubes = [[[RX, R], [B1, BZ]], [[RX, R], S1], [[B1, BZ], S1], [S1, S2], [[B1, BZ], [B2, BZ]], [[B2, BZ], S2], [S2, HT], [[B2, BZ], HB], [HT, [FX, R]]];
  mk("path", { class: "sil nf", d: tubes.map(([a, b]) => seg(Q(a[0], a[1]), Q(b[0], b[1]))).join("") }, g);
  mk("path", { class: "nf lo", d: seg(Q(B1, BZ + 4.5, 1), Q(B2, BZ + 4.5, 1)) + seg(Q(B1, BZ - 4.5, 1), Q(B2, BZ - 4.5, 1)) }, g);
  const box = (pts) => { const s = solid(g); s.sil.setAttribute("d", poly(hull(pts))); s.cr.setAttribute("d", ""); };
  const saddle = ([x, z]) => box([Q(x - 7, z + 2, -2.5), Q(x - 7, z + 2, 2.5), Q(x + 5, z + 2, -1), Q(x + 5, z + 2, 1), Q(x - 6, z + 4.5, -3), Q(x - 6, z + 4.5, 3), Q(x + 5, z + 4.5, -1), Q(x + 5, z + 4.5, 1)]);
  saddle(S1); saddle(S2);
  const bar = (x, z, w) => box([...circ(1.6, 8).map((q) => Q(x + q.u, z + q.v, -w)), ...circ(1.6, 8).map((q) => Q(x + q.u, z + q.v, w))]);
  bar(2, 52, 8); bar(HT[0], HT[1] + 2, 13);
  const cranks = mk("path", { class: "sil nf hi" }, g);
  const ang = spring(REST);
  let last = NaN;
  const o = P(0, 0, 0);
  function draw(d) {
    if (d === last) return;
    last = d;
    const sh = P(d, 0, 0);
    g.setAttribute("transform", `translate(${(sh[0] - o[0]).toFixed(2)} ${(sh[1] - o[1]).toFixed(2)})`);
    const a = A0 - d / R / 1.8;
    let sd = "";
    for (const cx of [RX, FX]) for (let i = 0; i < 4; i++) {
      const f = a * 1.8 + (i * Math.PI) / 4;
      sd += seg(Q(cx + (R - 2.5) * Math.cos(f), R + (R - 2.5) * Math.sin(f)), Q(cx - (R - 2.5) * Math.cos(f), R - (R - 2.5) * Math.sin(f)));
    }
    spokes.setAttribute("d", sd);
    let cd = "";
    for (const bx of [B1, B2]) for (const [s, y] of [[1, 3], [-1, -3]]) {
      const ex = bx + s * CR * Math.cos(a), ez = BZ + s * CR * Math.sin(a);
      cd += seg(Q(bx, BZ, y), Q(ex, ez, y)) + seg(Q(ex, ez, y), Q(ex, ez, y + 4 * Math.sign(y)));
    }
    cd += poly(circ(4.5, 16).map((q) => Q(B1 + q.u, BZ + q.v, 1))) + poly(circ(4.5, 16).map((q) => Q(B2 + q.u, BZ + q.v, 1)));
    cranks.setAttribute("d", cd);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function set(p) {
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > RX - 30 && x < FX + 30 && Math.abs(y) < 40) {
        const t = clamp(x / FX, -1, 1), d = t * D * (0.3 + 0.7 * reach / 100);
        ang.t = d;
        read.textContent = (d > 0 ? "+" : "") + Math.round(d);
        B.wake();
        return;
      }
    }
    ang.t = REST;
    read.textContent = "rest";
    B.wake();
  }
  set(null);
  draw(REST);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "tandem",
  means: "A tandem bicycle: it rolls toward the pointer, its spoked wheels and both linked crank sets turning as it goes.",
  rules: [1, 3, 4, 5],
  range: [0, 70, 100],
  tour: [[261, 230], [94, 146], [200, 200], null],
  mount,
});
