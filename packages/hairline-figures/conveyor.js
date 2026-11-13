/**
 * Conveyor: a factory belt on legs, fed by a chute at one end and running into
 * a hood at the other, with a scanner arch over its middle. Five boxes drop
 * from the chute, ride the belt under the arch and leave through the hood,
 * all the time the figure is in view. Hovering slows the belt, on a spring
 * on its rate, so a box can be read, and the box nearest the pointer is
 * bright. At rest the scanner's beam is bright. The slider is the slowed rate.
 *
 * The pattern: slow (dilate time); depth order changes as a box leaves the
 * chute, so its group moves between two layers instead of being redrawn.
 */
const {
  Cam, fit, facing, open, prism, proj, reducedMotion, rings, seg, spring, stepS,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const L = 168, W = 24, Z = 26, AX = 76, CH = 22, HD = 142, DROP = 12, RIDE = 139, U = DROP + RIDE, V0 = 16, FALL = 19;
// width along the belt, depth across it, height
const BOX = [[16, 14, 12], [13, 13, 10], [15, 16, 13], [12, 12, 9], [14, 15, 11]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let slow = value, over = null;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[0, -7, 0], [L, W + 7, 0], [L, -7, Z - 6], [0, W + 7, 0], [2, 1, Z + 36], [AX, -7, Z + 28]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (parent, x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(parent), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };

  // legs, far row then near, each pair on a foot rail, then the belt over them
  for (const y of [1, W - 4]) for (const x of [12, 84, 150]) block(g, x - 1.6, y, x + 1.6, y + 3, 0.8, 0.5, 0, Z - 5);
  block(g, 0, 0, L, W, 3, 1.2, Z - 5, Z);
  place(mk("circle", { r: 1.6, class: "dot off" }, g), P(3, W, Z - 2.5));
  const cleats = mk("path", { class: "nf lo" }, g);
  mk("path", { class: "nf dash", d: seg(P(AX, 1, Z), P(AX, W - 1, Z)) }, g);

  const layA = mk("g", {}, g);
  block(g, 2, 1, CH, W - 1, 3, 1.2, Z + 16, Z + 36);
  block(g, AX - 2, -7, AX + 2, -3, 1, 0.5, 0, Z + 26);
  const layB = mk("g", {}, g);
  block(g, AX - 2, W + 3, AX + 2, W + 7, 1, 0.5, 0, Z + 26);
  const beam = block(g, AX - 2.6, -8, AX + 2.6, W + 8, 1.4, 0.7, Z + 24, Z + 28.5);
  block(g, HD, -3, L + 2, W + 3, 4, 1.6, Z - 6, Z + 18);

  const boxes = BOX.map(([w, d, h], k) => {
    const s = solid(layA), tape = mk("path", { class: "nf lo" }, s.g);
    return { k, w, d, h, s, tape, u: ((BOX.length - k) * U) / BOX.length % U, lay: layA, xc: 0, z: 0, last: "" };
  });

  /** Where a box is along its path: dropping out of the chute, then riding to the hood. */
  function pose(b) {
    if (b.u < DROP) { const t = b.u / DROP; b.xc = CH / 2 + 1; b.z = Z + FALL * (1 - t * t); }
    else { b.xc = CH / 2 + 1 + b.u - DROP; b.z = Z; }
  }
  function draw(b) {
    pose(b);
    const key = b.xc.toFixed(2) + b.z.toFixed(2);
    if (key === b.last) return;
    b.last = key;
    const x0 = b.xc - b.w / 2, y0 = (W - b.d) / 2, top = b.z + b.h;
    const [o, i] = rings(x0, y0, x0 + b.w, y0 + b.d, 1.6, 0.8);
    put(b.s, prism(P, front, o, i, b.z, top));
    b.tape.setAttribute("d", seg(P(x0 + 1, W / 2, top), P(x0 + b.w, W / 2, top)) + seg(P(x0 + b.w, W / 2, top), P(x0 + b.w, W / 2, top - 4)));
    const lay = x0 < CH ? layA : layB;
    if (lay !== b.lay) { b.lay = lay; lay.prepend(b.s.g); }
  }

  let phase = 0, drawnPhase = NaN;
  function drawCleats() {
    if (phase === drawnPhase) return;
    drawnPhase = phase;
    let d = "";
    for (let x = 3 + (phase % 10); x < HD; x += 10) d += seg(P(x, 1.5, Z), P(x, W - 1.5, Z));
    cleats.setAttribute("d", d);
  }

  let lit;
  const rate = spring(V0, { eps: 0.05 }), still = reducedMotion();
  const B = register(stage, (dt) => {
    let m = stepS(rate, dt);
    if (!still) {
      const du = rate.x * dt;
      phase = (phase + du) % 10;
      for (const b of boxes) b.u = (b.u + du) % U;
      m = true;
    }
    for (const b of boxes) draw(b);
    drawCleats();
    pick();
    return m;
  });
  bag.add(B.unregister);

  /** The box nearest the pointer on screen, from the top of where it is now; boxes in the chute or hood do not count. */
  function pick() {
    let best = null, bd = Infinity;
    if (over) for (const b of boxes) {
      if (b.xc + b.w / 2 > HD || b.z > Z + FALL / 2) continue;
      const [sx, sy] = P(b.xc, W / 2, b.z + b.h / 2), d = Math.hypot(sx - over[0], sy - over[1]);
      if (d < bd) { bd = d; best = b; }
    }
    if (best === lit && (over || lit === null)) return;
    lit = best;
    for (const b of boxes) b.s.sil.classList.toggle("hi", b === lit);
    beam.sil.classList.toggle("hi", !lit);
    read.textContent = lit ? "box " + (lit.k + 1) : over ? "belt" : "rest";
  }

  function retarget() { rate.t = over ? slow : V0; pick(); B.wake(); }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  for (const b of boxes) draw(b);
  drawCleats();
  lit = undefined;
  pick();
  return { set: (v) => { slow = v; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "conveyor",
  means: "Boxes ride a conveyor belt through a scanner arch: hovering slows the belt, and the box nearest the pointer is bright.",
  rules: [1, 5, 7, 8],
  range: [0, 4, 10],
  tour: [[150, 140], [189, 156], [245, 185], null],
  mount,
});
