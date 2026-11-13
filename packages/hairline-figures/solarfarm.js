/**
 * Solar farm: twelve single-axis trackers on a rounded pad, each a cell-ruled
 * panel on a post. The pointer is the sun, put on the ground: every panel
 * turns about its north-south axis to face it, the near ones fully, the far
 * ones a little, each on its own spring. At rest the rows hold a morning
 * tilt that eases across the field. The slider is the reach, in rows.
 *
 * The pattern: a continuous field (terrain). Springs, a falloff by distance,
 * a hit test on the ground plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 4, NY = 3, SX = 36, SY = 34, W = 24, L = 28, ZA = 14, TK = 1.4, MAX = 48;
const X0 = -10, Y0 = -10, X1 = (NX - 1) * SX + W / 2 + 10 + W / 2, Y1 = (NY - 1) * SY + L + 10;

/** The share of full turn at u reaches from the sun: 1 near, a floor far. */
const falloff = (u) => (u <= 0.4 ? 1 : u <= 1 ? 1 - ((u - 0.4) / 0.6) * 0.82 : 0.18);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value * SX, sun = null;

  const C = Cam(45, 0.5, 1.6);
  const hi = ZA + (W / 2) * Math.sin(rad(MAX)) + 2;
  fit(C, [[X0, Y0, 0], [X1, Y1, 0], [X1, Y0, 0], [X0, Y1, 0], [X0, Y0, hi], [X1, Y0, hi], [X0, Y1, -5]], 200, 168);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(X0, Y0, X1, Y1, 10, 2);
  put(solid(g), prism(P, front, pr, pi, -5, 0));

  // trackers, row by row from the far corner: appending is painting back to front
  const units = [];
  for (let s = 0; s <= NX + NY - 2; s++) for (let i = 0; i < NX; i++) {
    const j = s - i;
    if (j < 0 || j >= NY) continue;
    const xc = W / 2 + i * SX, y0 = j * SY, y1 = y0 + L;
    const a0 = -30 + i * 9 + j * 4; // the morning: a tilt that eases across the field
    const [ring, inner] = rings(xc - 1.6, (y0 + y1) / 2 - 1.6, xc + 1.6, (y0 + y1) / 2 + 1.6, 1, 0.5);
    put(solid(g), prism(P, front, ring, inner, 0, ZA - 1));
    const grp = mk("g", {}, g);
    const edge = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp), cells = mk("path", { class: "nf lo" }, grp);
    units.push({ i, j, xc, y0, y1, a0, sp: spring(a0, { eps: 0.05 }), edge, face, cells, drawn: NaN });
  }

  /** A panel turned a degrees about its axis: its face, its edge below, and the cell rules. */
  function draw(u) {
    const a = u.sp.x;
    if (a === u.drawn) return;
    u.drawn = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const w = (t, y, d = 0) => P(u.xc + t * c - d * s, y, ZA + t * s + d * c);
    const h = W / 2;
    u.face.setAttribute("d", poly([w(-h, u.y0), w(h, u.y0), w(h, u.y1), w(-h, u.y1)]));
    u.edge.setAttribute("d", poly([w(-h, u.y0, -TK), w(h, u.y0, -TK), w(h, u.y1, -TK), w(-h, u.y1, -TK)]));
    let d = "";
    for (const t of [-h / 3, h / 3]) d += seg(w(t, u.y0 + 1.5), w(t, u.y1 - 1.5));
    for (let k = 1; k < 4; k++) { const y = u.y0 + (L * k) / 4; d += seg(w(-h + 1.5, y), w(h - 1.5, y)); }
    u.cells.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const u of units) { if (stepS(u.sp, dt)) m = true; draw(u); }
    return m;
  });
  bag.add(B.unregister);

  const nearest = () => units.reduce((a, b) => {
    const da = Math.hypot(a.xc - sun[0], (a.y0 + a.y1) / 2 - sun[1]), db = Math.hypot(b.xc - sun[0], (b.y0 + b.y1) / 2 - sun[1]);
    return db < da ? b : a;
  });
  const restMark = units.find((u) => u.i === 1 && u.j === 1);

  function retarget() {
    let mark = restMark;
    for (const u of units) {
      if (!sun) { u.sp.t = u.a0; continue; }
      const dx = sun[0] - u.xc, dy = sun[1] - (u.y0 + u.y1) / 2;
      u.sp.t = clamp(dx * 1.4, -MAX, MAX) * falloff(Math.hypot(dx, dy) / R);
    }
    if (sun) { mark = nearest(); read.textContent = `panel ${mark.i + 1}·${mark.j + 1}`; } else read.textContent = "rest";
    for (const u of units) u.face.classList.toggle("hi", u === mark);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const q = unproj(C, p[0], p[1], 0); sun = [clamp(q[0], X0, X1), clamp(q[1], Y0, Y1)]; retarget(); },
    leave: () => { sun = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();

  return {
    set: (v) => { R = v * SX; if (sun) retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "solarfarm",
  means: "Twelve solar trackers turn to face the pointer, the nearest fully and the farther ones less.",
  rules: [1, 3, 5, 8],
  range: [1, 2, 3.5],
  tour: [[130, 140], [270, 150], [210, 230], null],
  mount,
});
