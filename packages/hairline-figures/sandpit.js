/**
 * Sandpit: a square wooden sandpit with a hinged lid along its far edge and a
 * mound of sand inside. The pointer over the pit swings the lid open to show
 * the sand. At rest the lid sits ajar, bright. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, ringAt, circ, tdone, tset, tval, tween, clamp, unproj, disposer, mk, pointer, put, register, solid } = HL;

const W = 90, H = 14, T = 4, LT = 3, REST = 14;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [W + 4, W + 4, 0], [W + 4, -4, 0], [-4, W + 4, 0], [0, -6, H + W], [W, -6, H + W]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [or, ir] = rings(0, 0, W, W, 5, 1.6);
  put(solid(g), prism(P, front, or, ir, 0, H));
  // the inside: the inner well and the sand mound
  const [wr] = rings(T, T, W - T, W - T, 3, 1);
  mk("path", { d: poly(ringAt(P, wr, H)), class: "nf" }, g);
  const mound = [];
  for (const [r, z] of [[30, 0], [24, 4], [15, 7], [6, 9]]) mound.push(...ringAt(P, disc(W / 2 + 4, W / 2 + 2, r), H - 3 + z));
  mk("path", { d: poly(hull(mound)), class: "nf lo" }, g);
  for (const [x, y, r] of [[26, 30, 6], [62, 64, 5]]) mk("path", { d: poly(ringAt(P, disc(x, y, r, 16), H)), class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), slat = mk("path", { class: "nf lo" }, g);
  const ang = tween(REST);
  let last = NaN;
  // a lid point at (x, along y from the hinge, up from the lid's underside), swung by a degrees about the far edge
  const L = (x, y, z, a) => { const r = (a * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r); return P(x, y * c - z * s, H + y * s + z * c); };
  function draw(a) {
    if (a === last) return;
    last = a;
    const pts = [];
    for (const x of [-1, W + 1]) for (const y of [-1, W + 1]) for (const z of [0, LT]) pts.push(L(x, y, z, a));
    lid.setAttribute("d", poly(hull(pts)));
    face.setAttribute("d", poly([L(-1, -1, LT, a), L(W + 1, -1, LT, a), L(W + 1, W + 1, LT, a), L(-1, W + 1, LT, a)]));
    let d = "";
    for (const y of [W / 3, (2 * W) / 3]) d += "M" + L(-1, y, LT, a).join(",") + "L" + L(W + 1, y, LT, a).join(",");
    slat.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? maxA : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); return x > -8 && x < W + 8 && y > -8 && y < W + 8; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = clamp(v, 40, 100); if (act) { tset(ang, maxA, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "sandpit",
  means: "A sandpit with a hinged lid: the pointer over the pit swings the lid open on its far edge to show the sand inside.",
  rules: [1, 3, 5, 6],
  range: [40, 95, 100],
  tour: [[200, 230], [170, 220], [230, 240], null],
  mount,
});
