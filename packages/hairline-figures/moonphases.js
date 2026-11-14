/**
 * Moon phases: a moon disc stands on a post above a round plinth, ringed by
 * eight orbit studs. The pointer's x sweeps the lunar month: the lit part of
 * the disc, its outline bright, grows from a sliver to full and wanes again.
 * At rest a waxing crescent is lit. The slider is the month's start.
 *
 * The pattern: one continuous value on a spring.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, clamp, open, spring, stepS,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const R = 34, ZC = 62, T = 2.2, PZ = 6, OR = 40, REST = 0.32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let off = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-OR - 6, -OR - 6, 0], [OR + 6, OR + 6, 0], [-R, 0, ZC + R], [R, 0, ZC + R], [R, 0, ZC - R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const disc = (r, n = 48) => circ(r, n);
  put(solid(g), prism(P, front, disc(OR + 4), disc(OR + 2), 0, PZ));
  const studs = [];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, d = flatDot(g, C, 2.2, "dot off");
    place(d, P(OR * Math.cos(a) * 0.82, OR * Math.sin(a) * 0.82, PZ));
    studs.push(d);
  }
  const [pr, pi] = rings(-4, -4, 4, 4, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, PZ, ZC - R + 4));
  // the disc: a thin plate standing in the x-z plane
  const face = (y) => { const o = []; for (let i = 0; i <= 64; i++) { const t = (i / 64) * Math.PI * 2; o.push(P(R * Math.cos(t), y, ZC + R * Math.sin(t))); } return o; };
  const back = face(-T), fr = face(T);
  const sh = solid(g);
  const hl = (pts) => { const { hull } = HL; return poly(hull(pts)); };
  sh.sil.setAttribute("d", hl(back.concat(fr)));
  sh.cr.setAttribute("d", open(fr));
  sh.cr.setAttribute("class", "nf lo");
  const lit = mk("path", { class: "nf hi" }, g);

  function litPath(s) {
    const wax = s < 1, f = wax ? s : 2 - s, k = 1 - 2 * f, sg = wax ? 1 : -1, pts = [];
    for (let i = 0; i <= 32; i++) { const t = -Math.PI / 2 + (i / 32) * Math.PI; pts.push(P(sg * R * Math.cos(t), T + 0.2, ZC + R * Math.sin(t))); }
    for (let i = 0; i <= 32; i++) { const t = Math.PI / 2 - (i / 32) * Math.PI; pts.push(P(sg * k * R * Math.cos(t), T + 0.2, ZC + R * Math.sin(t))); }
    return poly(pts);
  }

  const sp = spring(REST);
  let last = NaN;
  function draw() {
    const s = clamp(sp.x, 0.03, 1.97);
    if (s === last) return;
    last = s;
    lit.setAttribute("d", litPath(s));
    const day = Math.round(((s / 2 + off) % 1) * 29.5);
    studs.forEach((d, i) => d.setAttribute("class", i === Math.round(s * 4) % 8 ? "dot m" : "dot off"));
    return day;
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const x0 = P(-R - 10, 0, ZC)[0], x1 = P(R + 10, 0, ZC)[0];
  function setS(s, label) { sp.t = s; read.textContent = label; B.wake(); }
  bag.add(pointer(stage, {
    move: ([sx]) => { const s = clamp(((sx - x0) / (x1 - x0)) * 2, 0.03, 1.97); setS(s, "day " + Math.round(((s / 2 + off) % 1) * 29.5)); },
    leave: () => setS(REST, "rest"),
  }));
  draw();
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { off = v; last = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "moonphases",
  means: "A moon disc on a plinth: the pointer sweeps the month across it, and the lit part waxes from a sliver to full and wanes again.",
  rules: [1, 3, 4, 5, 8],
  range: [0, 0, 0.5],
  tour: [[154, 101], [200, 123], [246, 146], null],
  mount,
});
