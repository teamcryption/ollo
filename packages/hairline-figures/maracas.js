/**
 * Maracas: one maraca standing in a round socket, its gourd head on a turned
 * handle. The pointer shakes it: the head swings about the socket away from
 * the pointer's side, broadly, then settles back to a slight lean. At rest
 * the head's outline is bright. The slider is how far it swings.
 */
const { Cam, circ, fit, hull, poly, prism, proj, facing, rings, spring, stepS, clamp, mk, pointer, put, register, solid, disposer } = HL;

const PZ = 8, REST = 0.3, SQ = Math.SQRT1_2;
const HEAD = [[5, 40], [11, 43], [16, 49], [19, 57], [20, 65], [19, 73], [15.5, 80], [9, 85], [3, 87]];
const HANDLE = [[3.2, 0], [3.6, 30], [5, 40]];
const c28 = circ(1, 28);

function rotW(th, a, b, z) {
  const c = Math.cos(th), s = Math.sin(th), a2 = a * c - z * s, z2 = a * s + z * c;
  return [(a2 + b) * SQ, (b - a2) * SQ, PZ + z2];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.5);
  const ext = [];
  for (const th of [-1.15, 1.15, REST]) for (const [r, z] of [[20, 65], [3, 87]]) { ext.push(rotW(th, r, 0, z), rotW(th, -r, 0, z)); }
  fit(C, ext.concat([[-26, -26, 0], [26, 26, 0], [26, -26, 0], [-26, 26, 0]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const disc = (r, n = 40) => circ(r, n);
  put(solid(g), prism(P, front, disc(26), disc(23.5), 0, 4));
  put(solid(g), prism(P, front, disc(7, 24), disc(5.5, 24), 4, PZ));
  const handle = mk("path", { class: "sil" }, g), grip = mk("path", { class: "nf lo" }, g);
  const head = mk("path", { class: "sil hi" }, g), band = mk("path", { class: "nf lo" }, g), seam = mk("path", { class: "nf lo" }, g);
  const ringPts = (th, r, z) => c28.map((q) => P(...rotW(th, q.u * r, q.v * r, z)));
  const A = spring(REST);
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    handle.setAttribute("d", poly(hull(HANDLE.flatMap(([r, z]) => ringPts(th, r, z)))));
    grip.setAttribute("d", poly(ringPts(th, 3.5, 22)) + poly(ringPts(th, 3.6, 28)));
    head.setAttribute("d", poly(hull(HEAD.flatMap(([r, z]) => ringPts(th, r, z)))));
    band.setAttribute("d", "M" + ringPts(th, 20, 63).filter((_, i) => c28[i].v > 0).map((p) => p.join(",")).join("L"));
    seam.setAttribute("d", "M" + ringPts(th, 17.6, 76).filter((_, i) => c28[i].v > 0).map((p) => p.join(",")).join("L"));
  }
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(A.x); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: ([sx]) => {
      A.t = -clamp((sx - 140) / 90, -1, 1) * 1.1 * reach;
      read.textContent = "shake " + Math.round(Math.abs(A.t * 180) / Math.PI) + "°";
      B.wake();
    },
    leave: () => { A.t = REST; read.textContent = "rest"; B.wake(); },
  }));
  read.textContent = "rest";
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "maracas",
  means: "A maraca standing in its socket: the pointer shakes it, swinging the gourd head on its handle away from the pointer's side.",
  rules: [3, 5, 8],
  range: [0, 100, 100],
  tour: [[200, 91], [108, 243], [292, 243], null],
  mount,
});
