/**
 * Plumb bob: a brass bob on a cord under a wall bracket, with the true
 * vertical dashed beneath it. The pointer's x on the ground swings the bob
 * on a spring; at rest it hangs a little off true. The slider is the reach.
 */
const { Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, seg, unproj, spring, stepS, rad, flatDot, place,
  disposer, mk, pointer, put, register, solid } = HL;

const PIV = [0, 0, 128], CORD = 46, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-40, -40, 0], [40, 40, 0], [0, 0, 136], [-50, 0, 60], [50, 0, 60]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-30, -30, 30, 30, 10, 1.6);
  put(solid(g), prism(P, front, pr, pi, -3, 0));
  mk("path", { class: "dash", d: seg(P(0, 0, 0), P(0, 0, PIV[2] - 4)) }, g);
  const mark = flatDot(g, C, 3, "dot m"); place(mark, P(0, 0, 0));
  const [br, bi] = rings(-12, -7, 12, 7, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, PIV[2], PIV[2] + 8));
  const cord = mk("path", { class: "nf sil" }, g);
  const bob = mk("path", { class: "sil hi" }, g), band = mk("path", { class: "nf lo" }, g);
  let amp = value;
  const th = spring(REST);
  let last = null, over = null;
  // profile of the bob along its axis: [distance below cord end, radius]
  const PROF = [[0, 3.5], [6, 9], [14, 15], [26, 15], [34, 10]];
  function draw() {
    if (last === th.x.toFixed(2)) return;
    last = th.x.toFixed(2);
    const t = rad(th.x), s = Math.sin(t), c = Math.cos(t);
    const at = (ox, oy, oz) => P(PIV[0] + ox * c - oz * s, PIV[1] + oy, PIV[2] + ox * s + oz * c);
    const top = at(0, 0, -CORD);
    cord.setAttribute("d", seg(P(...PIV), top));
    const ringPts = (d, r) => circ(r, 28).map((q) => at(q.u, q.v, -CORD - d));
    let pts = [];
    for (const [d, r] of PROF) pts = pts.concat(ringPts(d, r));
    pts.push(at(0, 0, -CORD - 52));
    bob.setAttribute("d", poly(hull(pts)));
    band.setAttribute("d", poly(ringPts(14, 15)));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  function retarget() {
    th.t = over == null ? REST : clamp(over, -1, 1) * 30 * amp;
    read.textContent = over == null ? "rest" : `${Math.round(th.t)}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); over = Math.hypot(x, y) > 110 ? null : (x - y) / 70; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "plumbbob",
  means: "A plumb bob on its cord: it swings toward the pointer and settles back near true over the ground mark.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[142, 158], [258, 216], [200, 151], null],
  mount,
});
