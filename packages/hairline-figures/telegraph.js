/**
 * Engine telegraph: a ship's bridge telegraph, a round dial on a column with
 * notched orders round its rim and a long lever over the face. The pointer
 * picks an order by where it stands across the dial: the lever swings to that
 * notch. At rest the lever stands at stop, bright. The slider is the throw.
 *
 * The pattern: a choice between notches (a tween on one angle).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 34, ZC = 70, TH = 8, L = 44, NS = 3, ST = 0.38, REST = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let throwK = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-14, -40, 0], [14, 40, 0], [TH, -L, ZC + L], [TH, L, ZC + L], [TH, 0, ZC - R - 4], [-TH, 0, ZC + R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(16, 32), circ(13.5, 32), 0, 5));
  put(solid(g), prism(P, front, circ(8, 24), circ(6.5, 24), 5, ZC - R + 6));
  // the dial: a drum on its side, face toward +x
  const face = (x, r, n = 48) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return P(x, r * Math.cos(t), ZC + r * Math.sin(t)); });
  mk("path", { d: poly(hull(face(-TH, R).concat(face(TH, R)))), class: "sil" }, g);
  mk("path", { d: poly(face(TH, R - 3)), class: "nf lo" }, g);
  for (let k = -NS; k <= NS; k++) {
    const a = k * ST - Math.PI / 2, p = P(TH, (R - 6) * Math.cos(a + Math.PI / 2 - Math.PI / 2) * 0 + (R - 7) * Math.sin(k * ST), ZC + (R - 7) * Math.cos(k * ST));
    const q = P(TH, (R - 3) * Math.sin(k * ST), ZC + (R - 3) * Math.cos(k * ST));
    mk("path", { d: `M${p[0]},${p[1]}L${q[0]},${q[1]}`, class: "nf lo" }, g);
  }
  const lever = mk("g", {}, g), lsil = mk("path", { class: "sil hi" }, lever), grip = mk("path", { class: "nf" }, lever);
  mk("path", { d: poly(face(TH + 1, 4, 16)), class: "nf" }, g);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(a), c = Math.cos(a), w = 3, pts = [];
    for (const [r, o] of [[-6, -w], [-6, w], [L, w], [L, -w]]) for (const x of [TH + 1, TH + 4]) pts.push(P(x, r * s + o * c, ZC + r * c - o * s));
    lsil.setAttribute("d", poly(hull(pts)));
    const gp = [];
    for (const [r, o] of [[L - 2, -7], [L - 2, 7], [L + 3, 7], [L + 3, -7]]) for (const x of [TH + 2, TH + 9]) gp.push(P(x, r * s + o * c, ZC + r * c - o * s));
    grip.setAttribute("d", poly(hull(gp)));
    lever.appendChild(grip);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const ctr = P(TH, 0, ZC), span = R * C.S * 0.9;
  let act = 99;
  function setActive(k) {
    if (k === act) return;
    act = k;
    tset(ang, k === null ? REST : k * ST * throwK, performance.now(), 0);
    read.textContent = k === null ? "rest" : k === 0 ? "stop" : (k > 0 ? "ahd " : "ast ") + Math.abs(k);
    B.wake();
  }
  function hit([sx, sy]) {
    if (Math.abs(sy - ctr[1]) > 130 || Math.abs(sx - ctr[0]) > span * 1.6) return null;
    return Math.max(-NS, Math.min(NS, Math.round(((sx - ctr[0]) / span) * NS)));
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { throwK = v; const k = act; act = 99; setActive(k); }, destroy: bag.dispose };
}

hairline({
  name: "telegraph",
  means: "A ship's engine telegraph: the lever swings across the dial to the order notch under the pointer, ahead or astern.",
  rules: [1, 4, 5, 8],
  range: [0.6, 1, 1.2],
  tour: [[250, 73], [144, 167], [256, 110], null],
  mount,
});
