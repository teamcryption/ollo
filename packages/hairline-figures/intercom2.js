/**
 * Door phone: a tall wall unit with a speaker grille and a call button, and
 * a handset hanging on its face, earpiece cup at the top, mouthpiece cup at
 * the bottom, tied to the unit by a coiled cord. The pointer over the unit
 * lifts the handset off its hook, up and out, tipping it toward the ear.
 * At rest it hangs in place, bright. The slider is how far it is lifted.
 *
 * The pattern: one part lifting and tilting off a fixed body.
 */
const { Cam, fit, hull, open, poly, prism, proj, rad, rings, rrect, tset, tval, tdone, tween, facing, disposer, mk, pointer, put, register, solid } = HL;

const PW = 34, PH = 100, HY0 = -28, HY1 = -14;
const box = (x0, x1, y0, y1, z0, z1) => { const o = [], r = rrect(x0, z0, x1, z1, Math.min(x1 - x0, z1 - z0) / 2.2, 4); for (const y of [y0, y1]) for (const q of r) o.push([q.u, y, q.v]); return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-7, -PW, 0], [0, PW, 0], [-7, PW, PH], [-7, -PW, PH], [46, HY0, 106], [36, HY1, 20], [20, HY1, 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the wall unit, its face at x = 0 looking at us
  const [pr, pi] = rings(-7, -PW, 0, PW, 3, 1.4);
  put(solid(g), prism(P, front, pr, pi, 0, PH));
  const F = (y, z) => P(0, y, z);
  const det = [];
  for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
    const cy = 6 + i * 6, cz = 64 + j * 6, d = [];
    for (let k = 0; k < 10; k++) { const t = (k / 10) * 2 * Math.PI; d.push(F(cy + 1.4 * Math.cos(t), cz + 1.4 * Math.sin(t))); }
    det.push(poly(d));
  }
  det.push(poly(rrect(5, 30, 19, 44, 3, 4).map((q) => F(q.u, q.v))), poly(rrect(8, 33, 16, 41, 2, 4).map((q) => F(q.u, q.v))));
  det.push(poly(rrect(HY0 - 1, 49, HY1 + 1, 55, 2, 4).map((q) => F(q.u, q.v))));
  mk("path", { class: "nf lo", d: det.join("") }, g);

  // the handset, in its own frame: two cups facing the wall and a grip bar
  const cord = mk("path", { class: "nf lo" }, g);
  const hg = mk("g", {}, g);
  const parts = [box(0.5, 9, HY0, HY1, 76, 92), box(0.5, 9, HY0, HY1, 16, 32), box(5, 10, HY0 + 1, HY1 - 1, 22, 86)];
  const sols = parts.map(() => { const s = solid(hg); s.sil.classList.add("hi"); return s; });

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const k = Math.min(1.25, amp) * t, a = rad(28 * k), ca = Math.cos(a), sa = Math.sin(a), ox = 22 * k, oz = 12 * k;
    const W = ([x, y, z]) => { const dx = x - 5, dz = z - 16; return P(5 + ox + dx * ca + dz * sa, y, 16 + oz - dx * sa + dz * ca); };
    parts.forEach((pts, i) => {
      const s = pts.map(W);
      sols[i].sil.setAttribute("d", poly(hull(s)));
      
      if (i === 2) sols[i].cr.setAttribute("d", open([W([10, HY0 + 2.5, 24]), W([10, HY0 + 2.5, 84])]));
      else sols[i].cr.setAttribute("d", open([W([9, HY0 + 2, i ? 18 : 78]), W([9, HY0 + 2, i ? 30 : 90])]));
    });
    // the coiled cord: from the mouthpiece down and back into the unit
    const end = W([3, HY0 + 3, 16]), st = P(0, HY0 + 3, 6), c = [];
    for (let i = 0; i <= 40; i++) { const u = i / 40, w = Math.sin(u * Math.PI * 12) * 2.6; c.push([end[0] + (st[0] - end[0]) * u + w, end[1] + (st[1] - end[1]) * u + 22 * Math.sin(u * Math.PI)]); }
    cord.setAttribute("d", open(c));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, PH / 2);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "lift" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 130), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "intercom2",
  means: "A door phone on the wall: the pointer lifts the handset off its hook, up and out toward the ear, and it hangs back up on leaving.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.25],
  tour: [[171, 163], [205, 118], [150, 222], null],
  mount,
});
