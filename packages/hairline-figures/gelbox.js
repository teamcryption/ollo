/**
 * Gel tank: an electrophoresis tank, a long clear box with a gel slab in it
 * and a lid carrying two electrode posts. The pointer over the tank lifts the
 * lid clear to show the gel and its row of wells. At rest the lid sits ajar,
 * bright. The slider is how high the lid lifts.
 *
 * The pattern: one part lifting off its body.
 */
const { Cam, circ, fit, prism, proj, facing, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const X1 = 90, Y1 = 44, TZ = 16, LH = 9, REST = 5;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, 0, TZ + LH + 50], [X1, Y1, TZ + LH + 50]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, X1, Y1, 5, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));
  // the gel slab and its wells, inside the tank
  const [gr, gi] = rings(18, 8, X1 - 18, Y1 - 8, 2, 1);
  put(solid(g), prism(P, front, gr, gi, TZ - 6, TZ - 3));
  for (let k = 0; k < 6; k++) mk("path", { d: "M" + ringAt(P, [{ u: 24, v: 12 + k * 4 }, { u: 26, v: 12 + k * 4 }], TZ - 3).map((p) => p.join(",")).join("L"), class: "lo" }, g);
  mk("path", { d: poly2(ringAt(P, ti, TZ)), class: "nf lo" }, g);

  const lidG = mk("g", {}, g);
  const lid = solid(lidG);
  const posts = [8, X1 - 8].map(() => solid(lidG));
  const [lr, li] = rings(-2, -2, X1 + 2, Y1 + 2, 6, 2);
  const z = tween(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    const z0 = TZ + h;
    put(lid, prism(P, front, lr, li, z0, z0 + LH));
    [8, X1 - 8].forEach((x, k) => put(posts[k], prism(P, front, disc(x, Y1 / 2, 3.2), disc(x, Y1 / 2, 2.2), z0 + LH, z0 + LH + 7)));
  }
  function poly2(pts) { return "M" + pts.map((p) => p.join(",")).join("L") + "Z"; }
  lid.sil.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(X1 / 2, Y1 / 2, TZ / 2);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(z, on ? lift : REST, performance.now(), 0);
    read.textContent = on ? "lid off" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], (sy - mid[1]) * 1.6) < 120), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act) { tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gelbox",
  means: "An electrophoresis tank: the pointer over it lifts the lid with its electrode posts off to show the gel and its wells.",
  rules: [1, 5, 6],
  range: [20, 42, 50],
  tour: [[200, 223], [160, 187], [240, 300], null],
  mount,
});
