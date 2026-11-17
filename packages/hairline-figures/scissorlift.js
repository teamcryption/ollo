/**
 * Scissor lift: a wheeled chassis whose crossed arms push a railed deck up.
 * Over the lift the deck rises to its top on the 700ms ease; leaving lowers
 * it to a part-raised rest, the deck bright. The slider is how high it goes.
 *
 * The pattern: one part answering a discrete choice (tween).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, clamp, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 30, BASE = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-46, -20, 0], [46, 20, 0], [46, -20, 0], [-46, 20, 0], [-46, -20, BASE + 75 + 15], [46, 20, BASE + 75 + 15]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-40, -17, 40, 17, 5, 1.6);
  put(solid(g), prism(P, front, cr, ci, 5, BASE));
  const wheels = [[-28, 17], [28, 17]].map(([x, y]) => {
    const pts = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; pts.push(P(x + 5.5 * Math.cos(a), y + 0.5, 6 + 5.5 * Math.sin(a))); }
    return mk("path", { d: poly(pts) }, g);
  });
  const back = mk("g", {}, g), fr = mk("g", {}, g);
  const N = 3;
  const armsB = [], armsF = [];
  for (let i = 0; i < N * 2; i++) { armsB.push(mk("path", { class: "lo" }, back)); armsF.push(mk("path", {}, fr)); }
  const deck = solid(g);
  deck.sil.classList.add("hi");
  const rail = mk("path", { class: "nf" }, g);
  const [dr, di] = rings(-46, -20, 46, 20, 3, 1.4);
  const L = 34;

  function strip(a, b, y) {
    const t = 1.6;
    return poly([P(a[0], y, a[1] - t), P(b[0], y, b[1] - t), P(b[0], y, b[1] + t), P(a[0], y, a[1] + t)]);
  }
  const lift = tween(REST);
  let last = NaN;
  function draw(H) {
    if (H === last) return;
    last = H;
    const h = H / N;
    for (let s = 0; s < N; s++) {
      const z0 = BASE + s * h, z1 = z0 + h;
      const A = [[-L, z0], [L, z1]], Bb = [[L, z0], [-L, z1]];
      armsB[2 * s].setAttribute("d", strip(A[0], A[1], -14));
      armsB[2 * s + 1].setAttribute("d", strip(Bb[0], Bb[1], -14));
      armsF[2 * s].setAttribute("d", strip(A[0], A[1], 14));
      armsF[2 * s + 1].setAttribute("d", strip(Bb[0], Bb[1], 14));
    }
    const zt = BASE + H;
    put(deck, prism(P, front, dr, di, zt, zt + 4));
    const zr = zt + 15, c = [[-44, -18], [44, -18], [44, 18], [-44, 18]];
    let d = "M" + c.map(([x, y]) => P(x, y, zr).join(",")).join("L") + "Z";
    for (const [x, y] of c) d += "M" + P(x, y, zt + 4).join(",") + "L" + P(x, y, zr).join(",");
    d += "M" + P(-44, 18, zt + 10).join(",") + "L" + P(44, 18, zt + 10).join(",");
    rail.setAttribute("d", d);
  }

  const B = register(stage, (dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  function move([sx, sy]) {
    if (Math.abs(sx - 200) > 115 || sy < 20 || sy > 300) return leave();
    tset(lift, top, performance.now(), 0);
    read.textContent = "up " + Math.round(top);
    B.wake();
  }
  function leave() { tset(lift, REST, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = clamp(v, 40, 75); }, destroy: bag.dispose };
}

hairline({
  name: "scissorlift",
  means: "A scissor lift: over it the crossed arms unfold and push the railed deck up; the slider sets how high it climbs.",
  rules: [3, 5, 8],
  range: [40, 60, 75],
  tour: [[200, 181], [200, 250], [175, 120], null],
  mount,
});
