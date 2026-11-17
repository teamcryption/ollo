/**
 * Packing cube: a soft zip-round travel cube, a rounded body with the zip
 * seam running round it and a carry loop on its end, and a mesh-panelled lid
 * hinged along the back. At rest the zip is half undone and the lid stands
 * ajar, bright. The pointer over the cube unzips it: the lid swings open.
 * The slider is how far it opens.
 *
 * The pattern: one part answering (a tilt on a tween); the hit is on fixed
 * planes through the rest pose.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, run, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 70, Y1 = 46, HZ = 28, AJAR = 14, WIDE = 72;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [0, Y1, 0], [X1, 0, 0], [0, 0, HZ + 48], [X1, 0, HZ + 48]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body, its zip seam round the near sides and the carry loop on the end
  const [br, bi] = rings(0, 0, X1, Y1, 10, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, HZ));
  const seam = rrect(-0.01, -0.01, X1 + 0.01, Y1 + 0.01, 10, 10);
  mk("path", { class: "nf dash", d: open(ringAt(P, run(seam, front), HZ - 5)) }, g);
  const loop = [];
  for (let i = 0; i <= 12; i++) { const a = (i / 12) * Math.PI; loop.push(P(X1 + 3.5 * Math.sin(a), 16 + 7 * (1 - Math.cos(a)), HZ - 8)); }
  mk("path", { class: "nf sil", d: open(loop) }, g);

  // the lid: a thick rounded panel hinged along the back edge, mesh inset on top
  const lid = solid(g);
  lid.cr.setAttribute("class", "nf lo");
  const LR = rrect(0, 0, X1, Y1, 10, 10), LI = rrect(7, 7, X1 - 7, Y1 - 7, 5, 8);
  const ang = tween(AJAR);
  let last = NaN;
  function at(q, w, a) {
    const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    return P(q.u, q.v * c - w * s, HZ + q.v * s + w * c);
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    lid.sil.setAttribute("d", poly(hull(LR.map((q) => at(q, 5, a)).concat(LR.map((q) => at(q, 0, a))))));
    lid.cr.setAttribute("d", poly(LI.map((q) => at(q, 5, a))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = null;
  const wide = (v) => AJAR + (WIDE - AJAR) * clamp(v, 0, 1);
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? wide(amt) : AJAR, performance.now(), 0);
    lid.sil.classList.add("hi");
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    return [0, HZ, HZ + 14].some((z) => {
      const [x, y] = unproj(C, sx, sy, z);
      return x > -4 && x < X1 + 6 && y > -4 && y < Y1 + 4;
    });
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "packcube",
  means: "A zip-round packing cube: the pointer over it unzips the lid and swings it open on its back hinge.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[168, 186], [210, 220], [260, 240], null],
  mount,
});
