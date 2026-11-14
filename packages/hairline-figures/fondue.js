/**
 * Fondue: a pot of melted cheese on a burner stand, four long forks dipped in
 * it. The pointer picks a fork by its handle: it draws up out of the pot
 * along its own shaft, and the forks beside it rise a little, staggered from
 * it. At rest one fork is half out, bright. The slider is the stagger.
 *
 * The pattern: one of many round a centre.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PR = 26, PZ0 = 12, PZ1 = 36, LIFT = 34, FAV = 2;
const ANG = [-140, -55, 25, 115], DIP = 9, OUT = 50, TOPZ = 84;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const axes = ANG.map((a) => {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    const D = [DIP * c, DIP * s, PZ1 - 4], E = [OUT * c, OUT * s, TOPZ];
    const L = Math.hypot(E[0] - D[0], E[1] - D[1], E[2] - D[2]);
    return { D, E, u: [(E[0] - D[0]) / L, (E[1] - D[1]) / L, (E[2] - D[2]) / L], c, s };
  });
  const ext = [[-34, -34, 0], [34, 34, 0], [34, -34, 0], [-34, 34, 0]];
  axes.forEach((a) => ext.push(a.E.map((v, i) => v + a.u[i] * LIFT)));
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the stand: a round foot, three short posts, the burner cup
  const [fr, fi] = [disc(0, 0, 32, 48), disc(0, 0, 30, 48)];
  put(solid(g), prism(P, front, fr, fi, 0, 3));
  for (const a of [200, 320]) { const c = Math.cos(a * Math.PI / 180) * 24, s = Math.sin(a * Math.PI / 180) * 24; put(solid(g), prism(P, front, disc(c, s, 2.4, 16), disc(c, s, 1.6, 16), 3, PZ0)); }
  put(solid(g), prism(P, front, disc(0, 0, 10, 28), disc(0, 0, 8.5, 28), 3, 9));
  for (const a of [80]) { const c = Math.cos(a * Math.PI / 180) * 24, s = Math.sin(a * Math.PI / 180) * 24; put(solid(g), prism(P, front, disc(c, s, 2.4, 16), disc(c, s, 1.6, 16), 3, PZ0)); }
  // the pot: a round body, a lip, the cheese inside
  put(solid(g), prism(P, front, disc(0, 0, PR, 56), disc(0, 0, PR - 2, 56), PZ0, PZ1));
  mk("path", { d: poly(ringAt(P, disc(0, 0, PR - 2, 56), PZ1)), class: "nf" }, g);
  mk("path", { d: open(ringAt(P, disc(0, 0, PR - 4, 56), PZ1 - 4).filter((p, i, arr) => i > arr.length * 0.08 && i < arr.length * 0.42)), class: "nf lo" }, g);
  // a handle on the pot
  put(solid(g), prism(P, front, rings(PR - 2, -3, PR + 12, 3, 3, 1)[0], rings(PR - 2, -3, PR + 12, 3, 3, 1)[1], PZ1 - 9, PZ1 - 5));

  const forks = axes.map((a, k) => {
    const grp = mk("g", {}, g);
    return { k, a, grp, shaft: mk("path", { class: "nf" }, grp), tines: mk("path", { class: "nf lo" }, grp), handle: mk("path", { class: "sil" }, grp), z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN };
  });
  // nearer forks paint last
  forks.slice().sort((p, q) => (p.a.c + p.a.s) - (q.a.c + q.a.s)).forEach((f) => g.appendChild(f.grp));

  const at = (a, t, l) => P(...a.D.map((v, i) => v + (a.E[i] - a.D[i]) * t + a.u[i] * l));
  function draw(f, l) {
    if (l === f.last) return;
    f.last = l;
    const a = f.a;
    f.shaft.setAttribute("d", open([at(a, 0, l), at(a, 0.72, l)]));
    const px = -a.s * 1.6, py = a.c * 1.6, tip = (sg) => P(a.D[0] + px * sg - a.u[0] * 5 + a.u[0] * l, a.D[1] + py * sg - a.u[1] * 5 + a.u[1] * l, a.D[2] - a.u[2] * 5 + a.u[2] * l);
    const b = at(a, 0, l);
    f.tines.setAttribute("d", seg(tip(1), b) + seg(tip(-1), b));
    const h0 = a.D.map((v, i) => v + (a.E[i] - a.D[i]) * 0.7 + a.u[i] * l), h1 = a.E.map((v, i) => v + a.u[i] * l);
    f.handle.setAttribute("d", poly(hull(ringAt(P, disc(h0[0], h0[1], 2.6, 16), h0[2]).concat(ringAt(P, disc(h1[0], h1[1], 3, 16), h1[2])))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const f of forks) { draw(f, tval(f.z, now)); if (!tdone(f.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const ends = axes.map((a) => at(a, 0.86, 0));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    ends.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 48 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    forks.forEach((f, k) => {
      const dd = Math.min(Math.abs(k - a), 4 - Math.abs(k - a)), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 10 : 0;
      const df = Math.min(Math.abs(k - from), 4 - Math.abs(k - from));
      tset(f.z, z, now, from < 0 ? 0 : df * stag);
      f.handle.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "fork " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fondue",
  means: "A fondue pot with four long forks: the fork under the pointer draws up out of the cheese, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[190, 89], [275, 141], [197, 205], null],
  mount,
});
