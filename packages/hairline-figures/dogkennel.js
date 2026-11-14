/**
 * Dog kennel: a gabled kennel with an arched door on a garden slab, a water
 * bowl beside it. The pointer over the kennel lifts its roof off to show the
 * rim of the walls; over the bowl, the bowl slides out. At rest the roof sits
 * a little ajar, bright. The slider is how far the roof lifts.
 *
 * The pattern: parts of one object, picked on the ground (terrain).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SZ = 2, WZ = SZ + 26, RZ = WZ + 15, BX = 54, BY = 22;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-10, -10, 0], [72, -10, 0], [72, 46, 0], [-10, 46, 0], [-3, 17, RZ + 24], [43, 17, RZ + 24]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-10, -10, 72, 46, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const [wr, wi] = rings(0, 0, 40, 34, 3, 1.5);
  put(solid(g), prism(P, front, wr, wi, SZ, WZ));
  const door = [];
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI; door.push(P(20 + 7 * Math.cos(a), 34, SZ + 12 + 7 * Math.sin(a))); }
  mk("path", { d: open([P(27, 34, SZ)].concat(door, [P(13, 34, SZ)])), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, rings(2, 2, 38, 32, 2, 1)[0], WZ)), class: "nf lo" }, g);

  const roof = mk("path", { class: "sil" }, g), roofC = mk("path", { class: "nf lo" }, g);
  const bowlG = mk("g", {}, g), bowl = solid(bowlG);
  const water = mk("path", { class: "nf lo" }, bowlG);

  const lift = tween(4), slide = tween(0);
  let lastL = NaN, lastS = NaN;
  function draw(l, s) {
    if (l !== lastL) {
      lastL = l;
      const ez = WZ + l, rz = RZ + l, eave = [P(-3, -3, ez), P(43, -3, ez), P(43, 37, ez), P(-3, 37, ez)];
      roof.setAttribute("d", poly(hull(eave.concat([P(-3, 17, rz), P(43, 17, rz)]))));
      roofC.setAttribute("d", seg(P(-3, 17, rz - 1), P(43, 17, rz - 1)) + open([P(43, 37, ez), P(43, 17, rz), P(43, -3, ez)]) + seg(P(-3, 37, ez + 1.5), P(43, 37, ez + 1.5)));
    }
    if (s !== lastS) {
      lastS = s;
      const x = BX + s;
      put(bowl, prism(P, front, disc(x, BY, 6), disc(x, BY, 4.6), SZ, SZ + 4));
      water.setAttribute("d", poly(ringAt(P, disc(x, BY, 3.6, 24), SZ + 3)));
    }
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(lift, now), tval(slide, now));
    return !tdone(lift, now) || !tdone(slide, now);
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [bx, by] = unproj(C, sx, sy, SZ);
    if (Math.hypot(bx - BX, by - BY) < 10) return 1;
    for (const z of [SZ, WZ, RZ]) { const [x, y] = unproj(C, sx, sy, z); if (x > -4 && x < 44 && y > -4 && y < 38) return 0; }
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    tset(lift, a === 0 ? 8 + 16 * reach : a < 0 ? 4 : 0, now, 0);
    tset(slide, a === 1 ? 9 : 0, now, 0);
    roof.classList.toggle("hi", a <= 0);
    bowl.sil.classList.toggle("hi", a === 1);
    read.textContent = a < 0 ? "rest" : a === 0 ? "roof" : "bowl";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act === 0) { act = -2; setActive(0); } }, destroy: bag.dispose };
}

hairline({
  name: "dogkennel",
  means: "A gabled dog kennel and its water bowl: over the kennel the roof lifts off, over the bowl it slides out.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[200, 120], [250, 190], [190, 150], null],
  mount,
});
