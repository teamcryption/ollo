/**
 * Wi-Fi router: a low rounded box with four hinged antennas along its back
 * and a row of status lights on its front. The pointer is where the signal
 * should go: every antenna tilts toward it on its own spring, the nearest
 * fully and the others less, and the nearest one's light comes on. At rest
 * the antennas stand in a loose fan and the second is bright. The slider is
 * how far the tilt reaches.
 *
 * The pattern: a continuous field (solarfarm): springs, a falloff by rank,
 * and a hit on the box top's plane, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, open, place, poly, prism, proj, rad, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 50, BY = 28, BH = 13, AX = [-36, -12, 12, 36], AY = -BY + 5, L = 44, AR = 2.6, MAX = 48, FAV = 1;
const REST = [[-26, 4], [-9, -5], [7, 3], [24, -4]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value, over = null;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-BX, -BY, 0], [BX, BY, 0], [BX, -BY, 0], [-BX, BY, 0], [-BX - 20, AY, BH + L], [BX + 20, AY, BH + L], [0, AY + 30, BH + L * 0.7], [0, AY - 30, BH + L * 0.7]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the box, its vents, and the lights on its front face
  const [br, bi] = rings(-BX, -BY, BX, BY, 7, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, BH));
  let vents = "";
  for (let k = 0; k < 5; k++) { const x = -14 + k * 7; vents += seg(P(x, -4, BH), P(x, 14, BH)); }
  mk("path", { class: "nf lo", d: vents }, g);
  place(mk("circle", { r: 1.4, class: "dot m" }, g), P(-32, BY, BH * 0.5));
  const lights = AX.map((_, k) => { const el = mk("circle", { r: 1.4, class: "dot off" }, g); place(el, P(-20 + k * 9, BY, BH * 0.5)); return el; });

  // the antennas, left to right: a hinge block and a rounded rod each
  const ants = AX.map((x, k) => {
    const [hr, hi] = rings(x - 4, AY - 3.5, x + 4, AY + 3.5, 1.6, 0.7);
    put(solid(g), prism(P, front, hr, hi, BH, BH + 4));
    const grp = mk("g", {}, g), rod = mk("path", { class: "sil" }, grp), seam = mk("path", { class: "nf lo" }, grp);
    return { k, x, rod, seam, lx: spring(REST[k][0], { eps: 0.05 }), ly: spring(REST[k][1], { eps: 0.05 }), drawn: "" };
  });

  /** A rod leaning (lx, ly) degrees from upright: the hull of two round ends, and a seam at its swivel. */
  function draw(a) {
    const key = a.lx.x.toFixed(2) + "," + a.ly.x.toFixed(2);
    if (key === a.drawn) return;
    a.drawn = key;
    const t = rad(Math.hypot(a.lx.x, a.ly.x)), n = Math.hypot(a.lx.x, a.ly.x) || 1;
    const d = [Math.sin(t) * (a.lx.x / n), Math.sin(t) * (a.ly.x / n), Math.cos(t)];
    const b = [a.x, AY, BH + 2], q = (s) => P(b[0] + d[0] * s, b[1] + d[1] * s, b[2] + d[2] * s);
    const r = AR * C.S, ring = (c) => Array.from({ length: 18 }, (_, i) => [c[0] + r * Math.cos((i / 18) * Math.PI * 2), c[1] + r * Math.sin((i / 18) * Math.PI * 2)]);
    const p0 = q(0), p1 = q(L);
    a.rod.setAttribute("d", poly(hull(ring(p0).concat(ring(p1)))));
    const m = q(L * 0.24), dx = p1[0] - p0[0], dy = p1[1] - p0[1], dl = Math.hypot(dx, dy) || 1, ex = (-dy / dl) * (r - 1), ey = (dx / dl) * (r - 1);
    a.seam.setAttribute("d", open([[m[0] - ex, m[1] - ey], [m[0] + ex, m[1] + ey]]));
  }

  const B = register(stage, (dt) => {
    let mv = false;
    for (const a of ants) { if (stepS(a.lx, dt)) mv = true; if (stepS(a.ly, dt)) mv = true; draw(a); }
    return mv;
  });
  bag.add(B.unregister);

  const falloff = [1, 0.55, 0.32, 0.2], mids = AX.map((x) => P(x, AY, BH + L / 2)[0]);
  let sx = 0;
  function retarget() {
    let mark = FAV;
    if (over) {
      mark = ants.reduce((m, a) => (Math.abs(mids[a.k] - sx) < Math.abs(mids[m] - sx) ? a.k : m), 0);
      for (const a of ants) {
        const dx = over[0] - a.x, dy = over[1] - AY, dd = Math.hypot(dx, dy) || 1;
        const ang = clamp(dd * 0.9, 0, MAX) * (falloff[Math.min(3, Math.round(Math.abs(a.k - mark) / reach))] ?? 0.2);
        a.lx.t = (ang * dx) / dd; a.ly.t = (ang * dy) / dd;
      }
      read.textContent = "antenna " + (mark + 1);
    } else {
      for (const a of ants) { a.lx.t = REST[a.k][0]; a.ly.t = REST[a.k][1]; }
      read.textContent = "rest";
    }
    ants.forEach((a) => a.rod.classList.toggle("hi", a.k === mark));
    lights.forEach((el, k) => el.setAttribute("class", k === mark ? "dot" : "dot off"));
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { sx = p[0]; const w = unproj(C, p[0], p[1], BH); over = [clamp(w[0], -BX - 30, BX + 30), clamp(w[1], -BY - 50, BY + 30)]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "wifirouter",
  means: "A router with four antennas: each tilts toward the pointer, the nearest fully, and its status light comes on.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 2],
  tour: [[170, 112], [240, 147], [275, 164], null],
  mount,
});
