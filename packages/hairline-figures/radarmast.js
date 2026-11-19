/**
 * Radar antenna: a lattice-free mast on a square plinth carrying a turntable
 * and a long flat antenna with a feed boom. The pointer is a bearing: the
 * antenna sweeps round on a spring to face it. At rest it faces a little off
 * broadside, bright. The slider is how far of the way round it sweeps.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZM = 58, ZA0 = 66, ZA1 = 92, HL2 = 54, D = 3.5, BOOM = 26, REST = -0.4;

function rot(ring, a) {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-HL2, -HL2, 0], [HL2, HL2, 0], [HL2, -HL2, ZA1], [-HL2, HL2, ZA1], [-HL2, -HL2, ZA1], [HL2, HL2, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-16, -16, 16, 16, 3, 1.2);
  put(solid(g), prism(P, front, pr, pi, 0, 8));
  const foot = rrect(-6, -6, 6, 6, 2, 6), top = rrect(-3.5, -3.5, 3.5, 3.5, 1.5, 6), tin = rrect(-2.5, -2.5, 2.5, 2.5, 1, 6);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 8).concat(ringAt(P, top, ZM)))), crease: open(ringAt(P, run(tin, front), ZM)) });
  put(solid(g), prism(P, front, circ(9, 32), circ(7.6, 32), ZM, ZA0 - 2));
  const back = mk("g", {}, g), ant = solid(g), slats = mk("path", { class: "nf lo" }, g), fore = mk("g", {}, g);
  ant.sil.classList.add("hi");
  const boom = mk("path", { class: "nf lo" }, back), horn = mk("path", { class: "sil" }, back);
  const [ar, ai] = rings(-HL2, -D, HL2, D, 2, 1);
  const [hr] = rings(-4, -3, 4, 3, 1.5, 0.8);

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    put(ant, prism(P, front, rot(ar, a), rot(ai, a), ZA0, ZA1));
    const c = Math.cos(a), s = Math.sin(a), nx = -s, ny = c;
    let sl = "";
    for (const t of [-36, -18, 0, 18, 36]) sl += seg(P(t * c + nx * D, t * s + ny * D, ZA0 + 3), P(t * c + nx * D, t * s + ny * D, ZA1 - 3));
    slats.setAttribute("d", sl);
    const fx = nx * (D + BOOM), fy = ny * (D + BOOM);
    boom.setAttribute("d", seg(P(nx * D, ny * D, ZA0 + 4), P(fx, fy, ZA0 + 10)) + seg(P(nx * D, ny * D, ZA1 - 4), P(fx, fy, ZA0 + 10)));
    const hrr = hr.map((q) => ({ u: fx + q.u * c - q.v * s, v: fy + q.u * s + q.v * c }));
    horn.setAttribute("d", poly(hull(ringAt(P, hrr, ZA0 + 6).concat(ringAt(P, hrr, ZA0 + 14)))));
    const toCam = nx + ny > 0;
    if (toCam && boom.parentNode !== fore) { fore.append(boom, horn); }
    if (!toCam && boom.parentNode !== back) { back.append(boom, horn); }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let tgt = REST;
    if (over != null) {
      let d = over - REST;
      d = Math.atan2(Math.sin(d), Math.cos(d));
      tgt = REST + reach * d;
    }
    let dd = tgt - ang.t;
    dd = Math.atan2(Math.sin(dd), Math.cos(dd));
    ang.t += dd;
    const deg = Math.round((((-tgt * 180) / Math.PI) % 360 + 360) % 360);
    read.textContent = over == null ? "rest" : `brg ${deg}`;
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, (ZA0 + ZA1) / 2), r = Math.hypot(x, y);
    over = r < 6 || r > 150 ? null : Math.atan2(y, x) - Math.PI / 2;
    retarget();
  }
  bag.add(pointer(stage, { move, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  draw(ang.x);
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "radarmast",
  means: "A radar mast whose long flat antenna and feed boom sweep round on a spring to face the pointer's bearing.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[294, 109], [106, 72], [260, 230], null],
  mount,
});
