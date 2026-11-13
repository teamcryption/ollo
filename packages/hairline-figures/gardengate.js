/**
 * Garden gate: a picket fence on two rails, broken by a gate between two
 * capped posts, with a path of stepping stones leading through it toward the
 * reader. The gate is a frame of two rails, a brace and four pickets, hinged
 * on the left post. As the pointer nears it the gate swings open toward the
 * reader on a spring, and the gate is bright while it stands open. At rest it
 * hangs ajar, bright. The slider is how far off the gate starts to open.
 *
 * The pattern: a continuous aim (terrain's spring, on one angle); the hit is
 * on the ground plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fillet, fit, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 136, G0 = 52, G1 = 84, GW = G1 - G0 - 1, PH = 46, FH = 34, AJAR = 18, MAX = 90;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v * 0.7 + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, -3, 0], [L, -3, 0], [0, 0, FH + 3], [L, 0, FH + 3], [G0, -3, PH + 3], [G1 + 4, 0, PH + 3], [G0, GW + 2, 0], [G0 + 20, 60, 0], [G0, GW, FH + 3]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const flat = (pts, cls) => mk("path", { d: poly(fillet(pts, pts.map(() => 0.7), 3)), class: cls || "" }, g);

  // the path: stepping stones from the gate toward the reader
  [[68, 9, 6], [70, 23, 6.5], [67, 37, 6], [71, 51, 5.5]].forEach(([x, y, r]) => mk("path", { d: poly(ringAt(P, disc(x, y, r), 0)) }, g));

  // the fence: two rails behind, pickets on their face
  for (const [a, b] of [[0, G0 - 4], [G1 + 4, L]]) {
    for (const z of [9, 25]) flat([P(a, -1.5, z), P(b, -1.5, z), P(b, -1.5, z + 3), P(a, -1.5, z + 3)]);
    for (let x = a + 1; x + 4 <= b; x += 7) {
      const h = FH - Math.abs(x + 2 - (a + b) / 2) * 0.06;
      flat([P(x, 0, 2), P(x + 4, 0, 2), P(x + 4, 0, h), P(x + 2, 0, h + 3), P(x, 0, h)]);
    }
  }
  for (const x of [G0 - 4, G1]) {
    const [r, i] = rings(x, -2, x + 4, 2, 1, 0.6);
    put(solid(g), prism(P, front, r, i, 0, PH));
    const [cr, ci] = rings(x - 0.8, -2.8, x + 4.8, 2.8, 1.2, 0.7);
    put(solid(g), prism(P, front, cr, ci, PH, PH + 2.5));
  }

  // the gate, hinged on the left post: pieces in its own (s along, z up) plane
  const pieces = [
    [[0, 8], [GW, 8], [GW, 11], [0, 11]],
    [[0, 25], [GW, 25], [GW, 28], [0, 28]],
    [[1, 10], [3.5, 10], [GW - 1, 25], [GW - 3.5, 25]],
  ];
  for (let k = 0; k < 4; k++) { const s = 2 + k * 7.6, h = FH - 1 + (k === 1 || k === 2 ? 1.5 : 0); pieces.push([[s, 3], [s + 4, 3], [s + 4, h], [s + 2, h + 3], [s, h]]); }
  const gate = mk("g", {}, svg), els = pieces.map(() => mk("path", { class: "sil" }, gate));
  const sp = spring(AJAR);
  let last = NaN;
  function draw() {
    if (Math.abs(sp.x - last) < 1e-3) return;
    last = sp.x;
    const a = (sp.x * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    // pieces nearer the reader are painted last: when open, the far side of the gate is its face
    pieces.forEach((pc, k) => els[k].setAttribute("d", poly(fillet(pc.map(([u, z]) => P(G0 + 0.5 + u * c, 0.5 + u * s, z)), pc.map(() => 0.7), 3))));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    if (over) {
      const d = Math.hypot(over[0] - (G0 + G1) / 2, over[1] - 6);
      sp.t = MAX * clamp(1 - (d - 14) / reach, 0, 1);
    } else sp.t = AJAR;
    const on = sp.t >= 10;
    for (const el of els) el.classList.toggle("hi", on);
    read.textContent = over ? "gate " + Math.round(sp.t / 5) * 5 + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = x < -10 || x > L + 10 || y < -40 || y > 70 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "gardengate",
  means: "A picket fence with a garden gate: the gate swings open toward the reader as the pointer nears it, bright while open.",
  rules: [1, 3, 5, 8],
  range: [30, 55, 90],
  tour: [[118, 168], [184, 209], [262, 236], null],
  mount,
});
