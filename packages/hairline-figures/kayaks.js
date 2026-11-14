/**
 * Kayak: a long pointed kayak on a sheet of water, a double-bladed paddle
 * across its cockpit. The paddle turns about the cockpit so that one blade
 * points at the pointer, on a spring; that blade is the bright mark. At rest
 * the paddle lies at a slant across the deck.
 *
 * The pattern: a part turning to face the pointer (officechairs).
 */
const {
  Cam, fit, hull, poly, proj, rings, prism, facing, spring, stepS, unproj, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HL_ = 64, HW = 15, DECK = 12, PZ = 17, PL = 60, REST = 0.55;
const lens = (s, n = 24) => {
  const out = [];
  for (let i = 0; i < 2 * n; i++) { const t = (i / (2 * n)) * 2 * Math.PI; out.push([HL_ * s * Math.cos(t), HW * s * Math.sin(t) * Math.abs(Math.sin(t)) ** 0.15 * (1 - 0.25 * Math.cos(t) ** 8)]); }
  return out;
};

function mount({ stage, svg, read }) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.72);
  const box = [[-78, -40, 0], [78, 40, 0], [78, -40, 0], [-78, 40, 0], [0, -PL - 8, PZ + 2], [0, PL + 8, PZ + 2], [PL + 8, 0, PZ], [-PL - 8, 0, PZ]];
  fit(C, box, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-78, -40, 78, 40, 10, 2);
  put(solid(g), prism(P, front, wr, wi, 0, 1.5));
  // ripples on the water, dim, behind the boat
  mk("path", { d: "M" + [P(-60, 28, 1.5), P(-30, 30, 1.5)].join("L") + "M" + [P(30, -30, 1.5), P(58, -28, 1.5)].join("L"), class: "nf lo" }, g);

  const boat = solid(g);
  const pts = [...lens(0.82).map(([x, y]) => P(x, y * 0.6, 2)), ...lens(1).map(([x, y]) => P(x, y, DECK))];
  boat.sil.setAttribute("d", poly(hull(pts)));
  boat.cr.setAttribute("d", poly(lens(0.96).map(([x, y]) => P(x, y * 0.94, DECK))));
  const [cr, ci] = rings(-14, -8, 14, 8, 8, 1.4);
  put(solid(g), prism(P, front, cr, ci, DECK, DECK + 2.5));

  const pg = mk("g", {}, g), shaft = solid(pg), bladeA = solid(pg), bladeB = solid(pg);
  const ang = spring(REST);
  let last = NaN;

  function blade(el, a, sgn) {
    const cx = Math.cos(a) * PL * sgn, cy = Math.sin(a) * PL * sgn, ux = Math.cos(a), uy = Math.sin(a), out = [];
    for (let i = 0; i < 20; i++) {
      const t = (i / 20) * 2 * Math.PI, u = 13 * Math.cos(t), v = 7.5 * Math.sin(t);
      for (const z of [PZ - 0.8, PZ + 0.8]) out.push(P(cx + ux * u - uy * v, cy + uy * u + ux * v, z));
    }
    el.sil.setAttribute("d", poly(hull(out)));
    el.cr.setAttribute("d", "");
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    const ex = Math.cos(a) * (PL - 8), ey = Math.sin(a) * (PL - 8), out = [];
    for (const s of [-1, 1]) for (let i = 0; i < 8; i++) { const t = (i / 8) * 2 * Math.PI; for (const z of [PZ - 1.2, PZ + 1.2]) out.push(P(s * ex + 1.2 * Math.cos(t), s * ey + 1.2 * Math.sin(t), z)); }
    shaft.sil.setAttribute("d", poly(hull(out)));
    // paint the farther blade first
    const nearA = Math.cos(a) + Math.sin(a) > 0;
    blade(nearA ? bladeB : bladeA, a, nearA ? -1 : 1);
    blade(nearA ? bladeA : bladeB, a, nearA ? 1 : -1);
    if (nearA) { pg.append(bladeB.g, shaft.g, bladeA.g); } else { pg.append(bladeA.g, shaft.g, bladeB.g); }
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(target, live) {
    let t = target;
    while (t - ang.x > Math.PI) t -= 2 * Math.PI;
    while (t - ang.x < -Math.PI) t += 2 * Math.PI;
    ang.t = t;
    bladeA.sil.classList.add("hi");
    const deg = ((Math.round((target * 180) / Math.PI) % 360) + 360) % 360;
    read.textContent = live ? deg + "°" : "rest";
    B.wake();
  }
  aim(REST, false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, PZ); aim(Math.atan2(clamp(y, -400, 400), clamp(x, -400, 400)), true); },
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "kayaks",
  means: "A kayak on still water with a double paddle across its cockpit: the paddle turns so one blade points at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[285, 183], [115, 183], [127, 92], null],
  mount,
});
