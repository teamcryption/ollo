/**
 * Gritter lorry: a cab, a tipped V hopper of salt, and a spinner disc hung
 * under its tail. The pointer's place across the frame spins the disc round
 * and throws a fan of grit behind it, wider and further the further across.
 * At rest the disc is bright and a little grit lies close. The slider is how
 * far the grit is thrown.
 *
 * The pattern: one turning part with a spread it throws.
 */
const { Cam, clamp, circ, facing, fit, hull, poly, prism, proj, rad, rings, ringAt, seg, spring, stepS, disposer, mk, pointer, place, put, register, solid } = HL;

const L = 112, W = 46, Z0 = 9, SX = L + 10, SZ = 12, SR = 15, N = 42;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[0, 0, 0], [0, W, 0], [L, 0, 60], [SX + 70, W / 2 - 40, 0], [SX + 70, W / 2 + 40, 0], [0, 0, 56]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (x, y) => poly(Array.from({ length: 24 }, (_, i) => { const t = (i / 24) * Math.PI * 2; return P(x + 11 * Math.cos(t), y, 11 + 11 * Math.sin(t)); }));
  for (const x of [22, 88]) mk("path", { d: wheel(x, 4) }, g);
  const [chr, chi] = rings(0, 6, L, W - 6, 3, 1);
  put(solid(g), prism(P, front, chr, chi, Z0, 20));
  const [cr, ci] = rings(0, 2, 36, W - 2, 6, 1.6);
  put(solid(g), prism(P, front, cr, ci, 20, 54));
  mk("path", { d: seg(P(0, 8, 42), P(0, W - 8, 42)), class: "nf lo" }, g);
  // the V hopper: a narrow foot, a wide top
  const hop = solid(g);
  const foot = rings(46, W / 2 - 8, L - 2, W / 2 + 8, 3, 1)[0], top = rings(42, 0, L + 2, W, 4, 1.4);
  hop.sil.setAttribute("d", poly(hull(ringAt(P, foot, 20).concat(ringAt(P, top[0], 58)))));
  hop.cr.setAttribute("d", poly(ringAt(P, top[1], 58)));
  for (const x of [22, 88]) mk("path", { d: wheel(x, W - 4) }, g);
  mk("path", { d: seg(P(L - 4, W / 2, 22), P(SX, W / 2, SZ + 3)), class: "nf" }, g);
  const disc = solid(g); disc.sil.classList.add("hi");
  const mv = (r) => r.map((q) => ({ ...q, u: q.u + SX, v: q.v + W / 2 }));
  put(disc, prism(P, front, mv(circ(SR, 32)), mv(circ(SR - 2, 32)), SZ - 2, SZ));
  const vanes = mk("path", { class: "nf" }, g);
  const grains = Array.from({ length: N }, () => mk("circle", { r: 2.2, class: "dot m" }, g));
  const spin = spring(0), reach = spring(0.25);
  let last = "";

  function draw() {
    const key = spin.x.toFixed(2) + reach.x.toFixed(3);
    if (key === last) return;
    last = key;
    let d = "";
    for (let k = 0; k < 4; k++) {
      const a = rad(spin.x + k * 90);
      d += seg(P(SX + 3 * Math.cos(a), W / 2 + 3 * Math.sin(a), SZ + 0.2), P(SX + (SR - 3) * Math.cos(a), W / 2 + (SR - 3) * Math.sin(a), SZ + 3));
    }
    vanes.setAttribute("d", d);
    const r = reach.x;
    grains.forEach((el, i) => {
      const ray = (i % 6) / 5 - 0.5, ring = Math.floor(i / 6) / 6;
      const a = rad(ray * 170 * r), dist = SR + 6 + (8 + ring * 70) * r;
      place(el, P(SX + dist * Math.cos(a), W / 2 + dist * Math.sin(a), 0));
    });
  }
  const B = register(stage, (dt) => { const m = stepS(spin, dt), n = stepS(reach, dt); draw(); return m || n; });
  bag.add(B.unregister);

  function aim(t, r) {
    reach.t = r ? 0.25 : 0.3 + 0.7 * t * max; spin.t = r ? 0 : 720 * t;
    read.textContent = r ? "rest" : Math.round(reach.t * 100) + "%"; B.wake();
  }
  draw();
  aim(0, true);
  bag.add(pointer(stage, { move: ([sx]) => aim(clamp((sx - 40) / 300, 0, 1)), leave: () => aim(0, true) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "gritter",
  means: "A gritter lorry with a spinner disc under its tail: the pointer spins the disc and throws a fan of grit wider behind it.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[120, 160], [330, 200], [250, 230], null],
  mount,
});
