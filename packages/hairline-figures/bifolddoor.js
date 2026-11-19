/**
 * Bifold door: a closet opening with two pairs of hinged leaves, each pair
 * hung from the jamb and running its far edge along the track in the header.
 * The pointer on the doorway folds both pairs open toward the room, each
 * leaf turning on its hinge into a V against its jamb. At rest the leaves
 * stand nearly flat, slightly creased, and the track is bright. The slider
 * is how far the leaves fold.
 *
 * The pattern: one part folding; the hit is the rest pose's frame outline.
 */
const {
  Cam, fit, facing, hull, prism, proj, rings, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const WP = 24, OW = 4 * WP, H = 92, TOP = 102, REST = 9;
const xf = (ring, ox, oy, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: ox + q.u * c - q.v * s, v: oy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.62);
  fit(C, [[-12, -12, -3], [OW + 12, -12, -3], [OW + 12, 36, -3], [-12, 36, -3], [-6, 0, TOP], [OW + 6, 0, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-12, -12, OW + 12, 36, 5, 2); put(solid(g), prism(P, front, r, i, -3, 0)); }
  for (const [x0, x1] of [[-6, 0], [OW, OW + 6]]) { const [r, i] = rings(x0, -3, x1, 3, 1.2, 0.6); put(solid(g), prism(P, front, r, i, 0, H)); }
  const header = solid(g);
  { const [r, i] = rings(-6, -3, OW + 6, 3, 1.2, 0.6); put(header, prism(P, front, r, i, H, TOP)); }
  const LEAF = rings(0.6, -1, WP - 0.6, 1, 0.8, 0.4);
  const dg = mk("g", {}, g);
  // paint order: nearer leaves (larger x + y) last
  const L = [solid(dg), solid(dg), solid(dg), solid(dg)];
  const knobs = [flatDot(dg, C, 1.3, "dot off"), flatDot(dg, C, 1.3, "dot off")];
  const ang = tween(REST * Math.PI / 180);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a) * WP, s = Math.sin(a) * WP;
    const pose = [[0, 0, a], [c, s, -a], [OW - c, s, Math.PI + a], [OW, 0, Math.PI - a]];
    pose.forEach(([ox, oy, t], k) => put(L[k], prism(P, front, xf(LEAF[0], ox, oy, t), xf(LEAF[1], ox, oy, t), 2, H - 1)));
    place(knobs[0], P(2 * c - 3 * Math.cos(a), 1 + 3 * Math.sin(a), 46));
    place(knobs[1], P(OW - 2 * c + 3 * Math.cos(a), 1 + 3 * Math.sin(a), 46));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const outline = hull([[-6, -3, 0], [OW + 6, -3, 0], [OW + 6, 3, 0], [-6, 3, 0], [-6, -3, TOP], [OW + 6, -3, TOP], [OW + 6, 3, TOP], [-6, 3, TOP]].map((p) => P(...p)));
  function inside([x, y]) {
    let s = 0;
    for (let i = 0; i < outline.length; i++) {
      const a = outline[i], b = outline[(i + 1) % outline.length], cr = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]);
      if (cr !== 0) { if (s && Math.sign(cr) !== s) return false; s = Math.sign(cr); }
    }
    return true;
  }
  let open = null;
  function setOpen(o) {
    if (o === open) return;
    open = o;
    tset(ang, (o ? max : REST) * Math.PI / 180, performance.now(), 0);
    L.forEach((l) => l.sil.classList.toggle("hi", o));
    header.sil.classList.toggle("hi", !o);
    read.textContent = o ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  setOpen(false);
  bag.add(pointer(stage, { move: (p) => setOpen(inside(p)), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { max = v; if (open) { open = null; setOpen(true); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "bifolddoor",
  means: "A closet's bifold doors: the pointer folds each pair of hinged leaves open into a V against its jamb.",
  rules: [1, 4, 5, 8],
  range: [35, 75, 82],
  tour: [[175, 165], [203, 149], [238, 138], null],
  mount,
});
