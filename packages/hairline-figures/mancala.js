/**
 * Mancala board: a folding wooden board with two rows of six pits and a long store at each end, the other half of the board hinged on as its lid.
 * The pointer over the case opens the lid on its back hinge and picks the
 * pit under it, bright. At rest the lid stands ajar, bright. The slider
 * is how far the lid opens.
 *
 * The pattern: one hinged part swinging open (lid).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  clamp, disposer, mk, pointer, put, register, solid,
} = HL;

const W = 150, D = 52, H = 7, LT = 6, REST = 22;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 1.75);
  const rad = (d) => (d * Math.PI) / 180;
  const lidPt = (x, y, zr, a) => [x, y * Math.cos(a) - zr * Math.sin(a), H + y * Math.sin(a) + zr * Math.cos(a)];
  const ext = [];
  for (const a of [REST, 130]) for (const [x, y] of [[0, 0], [W, 0], [0, D], [W, D]]) ext.push(lidPt(x, y, LT, rad(a)), lidPt(x, y, 0, rad(a)));
  ext.push([0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0]);
  fit(C, ext, 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g);
  const baseG = mk("g", {}, g);
  const [br, bi] = rings(0, 0, W, D, 6, 3);
  put(solid(baseG), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(ringAt(P, bi, H)), class: "nf lo" }, baseG);
  const items = [];
  const ctx = { P, front, g: baseG, W, D, H, disc, ringAt, poly, hull, prism, put, solid, mk, items };
  ((c) => {
      const st = (x0) => { const pts = []; for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI * 2; pts.push(c.P(x0 + 6 * Math.cos(t), 26 + 18 * Math.sin(t), c.H)); } return pts; };
      c.mk("path", { d: c.poly(st(13)), class: "nf" }, c.g);
      c.mk("path", { d: c.poly(st(137)), class: "nf" }, c.g);
      for (const y of [15, 37]) for (let i = 0; i < 6; i++) {
        const x = 32 + i * 17.2;
        const el = c.mk("path", { d: c.poly(c.ringAt(c.P, c.disc(x, y, 7), c.H)), class: "nf" }, c.g);
        c.mk("path", { d: c.poly(c.ringAt(c.P, c.disc(x + 1, y + 1, 3.6), c.H)), class: "nf lo" }, c.g);
        c.items.push({ el, x, y });
      }
    })(ctx);
  const sil = mk("path", { class: "sil" }, lidG), face = mk("path", { class: "nf" }, lidG), inset = mk("path", { class: "nf lo" }, lidG);
  const [lr, li] = rings(0, 0, W, D, 6, 4);
  const ang = spring(REST, { k: 90, c: 15 });
  let last = NaN, behind = null;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = rad(a), pts = [];
    const ring = (rg, zr) => rg.map((q) => P(...lidPt(q.u, q.v, zr, r)));
    const top = ring(lr, LT), bot = ring(lr, 0);
    sil.setAttribute("d", poly(hull(top.concat(bot))));
    const up = Math.cos(r) * 1.4 - Math.sin(r) > 0;
    face.setAttribute("d", poly(up ? top : bot));
    inset.setAttribute("d", poly(ring(li, up ? LT : 0)));
    const b = a > 60;
    if (b !== behind) { behind = b; if (b) g.insertBefore(lidG, baseG); else baseG.after(lidG); }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H);
    if (x < -10 || x > W + 10 || y < -10 || y > D + 10) return -1;
    let best = 0, bd = Infinity;
    items.forEach((it, k) => { const d = Math.hypot(it.x - x, it.y - y); if (d < bd) { bd = d; best = k; } });
    return best;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    ang.t = a < 0 ? REST : clamp(open, 60, 130);
    sil.classList.toggle("hi", a < 0);
    items.forEach((it, k) => it.el.classList.toggle("hi", k === a));
    read.textContent = a < 0 ? "rest" : "pit " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act >= 0) { ang.t = clamp(v, 60, 130); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "mancala",
  means: "A folding mancala board: the pointer swings its lid open and lights the pit beneath.",
  rules: [1, 3, 5, 6],
  range: [70, 105, 125],
  tour: [[152,201],[200,215],[110,190],null],
  mount,
});
