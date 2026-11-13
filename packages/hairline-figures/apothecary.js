/**
 * Apothecary cabinet: a chest of sixteen small drawers, four across and four
 * high, each front with a label plate and a round knob. The pointer moves
 * over the cabinet's face: the drawers near it slide open on their own
 * springs, the one under it furthest and bright, the rest less the farther
 * they are. At rest a few drawers stand ajar, one half out and bright. The
 * slider is the reach of the field.
 *
 * The pattern: a field over a grid on a face plane; the hit is read on the
 * cabinet's face (y = D), which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, poly, prism, proj, rings, rrect, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 4, CW = 22, CH = 14, M = 5, BASE = 7, D = 26, IN = 1, OUT = 20;
const W = 2 * M + NC * CW, H = BASE + NR * CH + M, FAV = [2, 2];
const REST = [[0.6, 1.4, 0.6, 3], [2.2, 0.6, 0.6, 0.6], [0.6, 0.6, 10, 1.6], [1.2, 3.4, 0.6, 0.6]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D + OUT, 0], [0, 0, H + 3], [W, 0, H + 3], [0, D + OUT, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (y) => (q) => P(q.u, y, q.v);
  const g = mk("g", {}, svg);

  // the carcass: a cabinet on a plinth, a cornice line on top, the drawer field framed on its face
  const [cr, ci] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  const [tr, ti] = rings(-1.5, -1.5, W + 1.5, D + 1.5, 3.5, 1.2);
  put(solid(g), prism(P, front, tr, ti, H, H + 3));
  mk("path", { d: seg(P(1.5, D, BASE - 3), P(W - 1.5, D, BASE - 3)), class: "nf lo" }, g);

  const dr = [];
  for (let c = 0; c < NC; c++) for (let r = 0; r < NR; r++) {
    const x0 = M + c * CW + IN, x1 = M + (c + 1) * CW - IN, z0 = BASE + r * CH + IN, z1 = BASE + (r + 1) * CH - IN;
    mk("path", { d: poly(rrect(x0 - 0.4, z0 - 0.4, x1 + 0.4, z1 + 0.4, 0.8, 2).map(onFace(D))), class: "nf lo" }, g);
    dr.push({ c, r, x0, x1, z0, z1, cx: (x0 + x1) / 2, cz: (z0 + z1) / 2, rest: REST[c][NR - 1 - r] });
  }
  // left to right, bottom to top: a drawer is only hidden by one to its right or above it
  for (const d of dr) {
    d.el = solid(g);
    d.plate = mk("path", { class: "nf lo" }, d.el.g);
    d.knob = mk("path", { class: "nf" }, d.el.g);
    d.sp = spring(d.rest, { eps: 0.02 });
    d.last = NaN;
  }

  const knob = circ(1.5, 12);
  function draw(d) {
    const s = clamp(d.sp.x, 0.3, OUT);
    if (s === d.last) return;
    d.last = s;
    const y = D + s;
    const [r, i] = rings(d.x0, D, d.x1, y, 1.2, Math.min(0.8, s * 0.35));
    put(d.el, prism(P, front, r, i, d.z0, d.z1));
    d.plate.setAttribute("d", poly(rrect(d.cx - 4.5, d.z1 - 4.2, d.cx + 4.5, d.z1 - 1.6, 0.6, 2).map(onFace(y))));
    d.knob.setAttribute("d", poly(knob.map((q) => P(d.cx + q.u, y + 0.2, d.cz - 1.6 + q.v))));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const d of dr) { if (stepS(d.sp, dt)) m = true; draw(d); }
    return m;
  });
  bag.add(B.unregister);

  /** The pointer on the face plane (y = D), which never moves: [x, z] or null. */
  function onFacePt([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    return x < M - 2 || x > W - M + 2 || z < BASE - 2 || z > BASE + NR * CH + 2 ? null : [x, z];
  }

  let over = null;
  function retarget() {
    let hit = null;
    if (over) {
      const c = clamp(Math.floor((over[0] - M) / CW), 0, NC - 1), r = clamp(Math.floor((over[1] - BASE) / CH), 0, NR - 1);
      hit = dr[c * NR + r];
    }
    for (const d of dr) {
      if (!hit) d.sp.t = d.rest;
      else {
        const dist = Math.hypot(d.cx - over[0], d.cz - over[1]);
        d.sp.t = d === hit ? OUT : clamp(OUT * 0.6 * Math.max(0.08, Math.exp(-((dist / reach) ** 2))), 0.6, OUT * 0.6);
      }
      d.el.sil.classList.toggle("hi", hit ? d === hit : d.c === FAV[0] && NR - 1 - d.r === FAV[1]);
    }
    read.textContent = hit ? `drawer ${hit.c + 1}·${NR - hit.r}` : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = onFacePt(p); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "apothecary",
  means: "An apothecary cabinet of sixteen drawers: the drawers near the pointer slide open, the one under it furthest.",
  rules: [1, 3, 5, 6],
  range: [12, 24, 40],
  tour: [[195, 148], [145, 185], [262, 180], null],
  mount,
});
