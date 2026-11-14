/**
 * Treehouse: a hut on a platform round a trunk, a ladder leaning up to it.
 * The pointer over the tree lifts the hut's pitched roof off its walls to
 * look inside; leaving sets it back. At rest the roof sits a little ajar and
 * the platform's edge is bright. The slider is how far the roof lifts.
 *
 * The pattern: one lid, lifting (cloches).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, tdone, tset, tval, tween, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 40, WZ = 62, RH = 12, REST = 3;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-24, -24, 0], [36, 24, 0], [24, 24, 0], [-24, 24, 0], [24, -24, 0], [0, 0, WZ + RH + 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // ground disc and trunk
  mk("path", { d: poly(ringAt(P, disc(2, 2, 26, 48), 0)), class: "nf lo" }, g);
  put(solid(g), prism(P, front, disc(0, 0, 6), disc(0, 0, 4.5), 0, PZ));
  // platform
  const [pr, pi] = rings(-22, -22, 22, 22, 4, 2);
  const plat = solid(g);
  put(plat, prism(P, front, pr, pi, PZ, PZ + 3));
  // walls with a door on the +x face
  const [wr, wi] = rings(-14, -14, 14, 14, 2, 1.2);
  put(solid(g), prism(P, front, wr, wi, PZ + 3, WZ));
  mk("path", { d: poly([P(14, -4, PZ + 3), P(14, 4, PZ + 3), P(14, 4, PZ + 14), P(14, -4, PZ + 14)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(-3, 14, PZ + 9), P(4, 14, PZ + 9), P(4, 14, PZ + 15), P(-3, 14, PZ + 15)]), class: "nf lo" }, g);
  // roof: tapered solid, drawn per lift
  const roof = solid(g);
  const foot = rrect(-18, -18, 18, 18, 3, 4), top = rrect(-5, -5, 5, 5, 2, 4), inner = rrect(-4, -4, 4, 4, 1.5, 4);
  // ladder leaning on the +x edge
  const lad = mk("path", { class: "nf" }, g);
  let d = "";
  for (const y of [-5, 5]) d += seg(P(36, y, 0), P(22, y, PZ + 3));
  for (let i = 1; i <= 6; i++) { const t = i / 7, x = 36 - 14 * t, z = (PZ + 3) * t; d += seg(P(x, -5, z), P(x, 5, z)); }
  lad.setAttribute("d", d);

  const z = tween(REST);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const z0 = WZ + l, z1 = z0 + RH;
    roof.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    roof.cr.setAttribute("d", open(ringAt(P, run(inner, front), z1)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(4, 0, PZ), box = [mid[0] - 110, mid[1] - 150, mid[0] + 110, mid[1] + 110];
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? reach : REST, performance.now(), 0);
    roof.sil.classList.toggle("hi", on);
    plat.sil.classList.toggle("hi", !on);
    read.textContent = on ? "roof up" : "rest";
    B.wake();
  }
  setActive(false);
  const inside = ([sx, sy]) => sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "treehouse",
  means: "A hut on a platform round a trunk with a ladder up: the pointer over the tree lifts the hut's roof to look in.",
  rules: [3, 5, 6, 9],
  range: [8, 22, 30],
  tour: [[200, 84], [258, 242], [180, 170], null],
  mount,
});
