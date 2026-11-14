/**
 * Space suit: a suit standing on its display stand, backpack on, helmet
 * seated on the collar. The pointer near the suit lifts the helmet off the
 * collar, higher the nearer it comes to the head. At rest the helmet sits
 * bright on the ring. The slider is how far it lifts.
 *
 * The pattern: one part lifts off a whole (cloche).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const HR = 10, NZ = 52, MAXL = 27;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-24, -24, 0], [24, 24, 0], [24, -24, 0], [-24, 24, 0], [0, 0, NZ + 2 * HR + MAXL + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 22, 48), disc(0, 0, 19.5, 48), 0, 3));
  mk("path", { d: seg(P(0, -9, 3), P(0, -9, 34)), class: "lo" }, g);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-10, -13, 10, -7, 3, 1, 28, 50);           // backpack
  box(-17, -4, -12, 4, 2.4, 0.8, 27, 46);        // far arm
  box(-9, -4, -2, 4, 3, 1, 3, 9);                // far boot
  box(-8, -3.5, -2.5, 3.5, 2.7, 0.9, 9, 28);     // far leg
  box(2, -4, 9, 4, 3, 1, 3, 9);                  // near boot
  box(2.5, -3.5, 8, 3.5, 2.7, 0.9, 9, 28);       // near leg
  box(-12, -7, 12, 7, 5, 1.5, 26, 49);           // torso
  box(-5, 7, 5, 8.5, 1, 0.5, 34, 42);            // chest unit
  box(12, -4, 17, 4, 2.4, 0.8, 27, 46);          // near arm
  put(solid(g), prism(P, front, disc(0, 0, 8, 32), disc(0, 0, 6.5, 32), 49, NZ));   // collar ring
  for (const [x, y, z] of [[-14.5, 0, 25], [14.5, 0, 25]]) put(solid(g), prism(P, front, disc(x, y, 2.6, 20), disc(x, y, 1.8, 20), z, z + 3));  // gloves

  const hg = mk("g", {}, g), helm = mk("path", { class: "sil" }, hg), rim = mk("path", { class: "nf lo" }, hg), visor = mk("path", { class: "nf lo" }, hg);
  const z = tween(0);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const b = NZ + l, pts = [];
    for (let i = 0; i <= 8; i++) { const t = (i / 8) * Math.PI; pts.push(...ringAt(P, disc(0, 0, HR * Math.sin(Math.max(t, 0.9)), 28), b + HR - HR * Math.cos(t))); }
    helm.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ringAt(P, disc(0, 0, HR * Math.sin(0.9), 32), b + 0.5)));
    const vis = [];
    for (let i = 0; i <= 10; i++) { const a = -0.5 + (i / 10) * 1.0 + Math.PI / 4; vis.push(P(HR * 0.95 * Math.cos(a), HR * 0.95 * Math.sin(a), b + HR * 0.65)); }
    for (let i = 10; i >= 0; i--) { const a = -0.5 + (i / 10) * 1.0 + Math.PI / 4; vis.push(P(HR * 0.82 * Math.cos(a), HR * 0.82 * Math.sin(a), b + HR * 1.35)); }
    visor.setAttribute("d", poly(vis));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const head = P(0, 0, NZ + HR), chest = P(0, 0, 38);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a === 2 ? MAXL * (0.55 + amt / 200) : a === 1 ? 6 : 0, performance.now(), 0);
    read.textContent = a === 2 ? "helmet" : a === 1 ? "suit" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    if (Math.hypot(sx - head[0], sy - head[1]) < 34) return 2;
    return Math.abs(sx - chest[0]) < 50 && Math.abs(sy - chest[1]) < 70 ? 1 : 0;
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act === 2) { act = -1; setActive(2); } }, destroy: bag.dispose };
}

hairline({
  name: "spacesuit",
  means: "A space suit on its stand: the pointer at the head lifts the helmet off the collar ring, the pointer at the body raises it a little.",
  rules: [1, 3, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 194], [200, 118], [228, 160], null],
  mount,
});
