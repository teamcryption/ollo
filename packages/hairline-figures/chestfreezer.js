/**
 * Chest freezer: a long white chest with its lid hinged along the back edge.
 * At rest the lid sits a little ajar, bright. Over the freezer the lid swings
 * up on its hinge to show the well and the wire basket inside.
 * The slider is how far the lid opens.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const X = 70, D = 38, H = 36, T = 5, REST = 9;
const toR = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[0, 0, 0], [X, D, 0], [X, 0, 0], [0, D, 0], [0, -T, H + D], [X, -T, H + D], [X, D + 2, H + T]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the plinth and the cabinet
  const [pr, pi] = rings(2, 2, X - 2, D - 2, 4, 1);
  put(solid(g), prism(P, front, pr, pi, 0, 3));
  const [br, bi] = rings(0, 0, X, D, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 3, H));
  // the well and its basket
  mk("path", { d: poly(rrect(4, 4, X - 4, D - 4, 3, 6).map((q) => P(q.u, q.v, H))), class: "nf lo" }, g);
  mk("path", { d: poly(rrect(8, 7, 30, D - 7, 2, 4).map((q) => P(q.u, q.v, H))), class: "nf lo" }, g);
  const dot = mk("circle", { r: 2.2, class: "dot off" }, g);
  const dp = P(X - 8, D, 8); dot.setAttribute("cx", dp[0]); dot.setAttribute("cy", dp[1]);
  // the lid, hinged along y = 0 at the top
  const lid = solid(g), handle = mk("path", { class: "nf" }, g);
  lid.sil.classList.add("hi");
  const lr = rrect(0, 0, X, D, 5, 6), li = rrect(3, 3, X - 3, D - 3, 3.5, 6);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(toR(a)), s = Math.sin(toR(a));
    const Tf = (x, u, w) => P(x, u * c - w * s, H + u * s + w * c);
    const pts = lr.map((q) => Tf(q.u, q.v, 0)).concat(lr.map((q) => Tf(q.u, q.v, T)));
    put(lid, { sil: poly(hull(pts)), crease: poly(li.map((q) => Tf(q.u, q.v, T))) });
    const hp = [];
    for (const x of [X / 2 - 9, X / 2 + 9]) for (const u of [D, D + 2.5]) for (const w of [0.5, 3.5]) hp.push(Tf(x, u, w));
    handle.setAttribute("d", poly(hull(hp)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  const mid = P(X / 2, D / 2, H / 2);
  let on = false;
  function setOn(v) {
    on = v;
    tset(ang, on ? reach : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([x, y]) => { const v = Math.abs(x - mid[0]) < 140 && Math.abs(y - mid[1]) < 110; if (v !== on) setOn(v); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "chestfreezer",
  means: "A chest freezer: over it, the long lid swings up on its back hinge to show the cold well and wire basket inside.",
  rules: [1, 3, 5, 8],
  range: [40, 75, 100],
  tour: [[196, 205], [165, 160], [225, 262], null],
  mount,
});
