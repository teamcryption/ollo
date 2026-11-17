/**
 * Wormery: a square sump with a tap, two stacked worm trays and a lid. The
 * pointer over the stack lifts the top tray and its lid, higher the higher
 * the pointer goes, to show the compost in the tray below; that tray rises
 * a little after it. At rest the lid sits a little ajar, bright. The slider
 * is the highest lift.
 *
 * The pattern: one stack opening (lift).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS, circ,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 84, SUMP = 22, TH = 17, LH = 6, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxL = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-4, -4, 0], [W + 4, W + 4, 0], [W + 4, -4, 0], [-4, W + 4, 0], [0, 0, SUMP + 2 * TH + LH + 1.6 * 36 + 4], [W, W, SUMP + 2 * TH + LH + 1.6 * 36]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, W, W, 5, 1.6);
  const [lr, li] = rings(-2, -2, W + 2, W + 2, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SUMP));
  // the tap on the sump's front-left face
  const disc = (x, z, r) => circ(r, 16).map((q) => P(x + q.u, W, z + q.v));
  const tap = mk("path", { class: "nf" }, g);
  tap.setAttribute("d", poly(hull(disc(W * 0.5, 8, 3.5).concat(circ(3.5, 16).map((q) => P(W * 0.5 + q.u, W + 7, 8 + q.v))))) +
    seg(P(W * 0.5, W + 6, 11), P(W * 0.5, W + 6, 17)));

  const t1 = { g: mk("g", {}, g) }, t2 = { g: mk("g", {}, g) }, lid = { g: mk("g", {}, g) };
  const s1 = solid(t1.g), c1 = mk("path", { class: "nf lo" }, t1.g);
  const s2 = solid(t2.g), c2 = mk("path", { class: "nf lo" }, t2.g);
  const sl = solid(lid.g);
  sl.sil.classList.add("hi");
  const knob = mk("path", { class: "nf" }, lid.g);
  const worms = (z) => {
    let d = "";
    for (const [x, y, dx, dy] of [[18, 16, 14, 5], [50, 24, 11, 14], [28, 46, 16, -4], [58, 58, 8, 12], [16, 66, 12, 3], [42, 36, 7, 10]]) {
      d += open3([P(x, y, z), P(x + dx * 0.5, y + dy * 0.5 + 2, z), P(x + dx, y + dy, z)]);
    }
    return d;
  };
  const open3 = (pts) => "M" + pts.map((p) => p[0].toFixed(2) + " " + p[1].toFixed(2)).join("L");

  const lift = spring(REST);
  let last = NaN;
  function draw(L) {
    if (L === last) return;
    last = L;
    const a = SUMP + L * 0.3, b = SUMP + TH + L, c = SUMP + 2 * TH + L * 1.6;
    put(s1, prism(P, front, sr, si, a, a + TH));
    c1.setAttribute("d", worms(a + TH));
    put(s2, prism(P, front, sr, si, b, b + TH));
    c2.setAttribute("d", worms(b + TH));
    put(sl, prism(P, front, lr, li, c, c + LH));
    knob.setAttribute("d", poly(hull(ringAt(P, circ(4, 16).map((q) => ({ ...q, u: q.u + W / 2, v: q.v + W / 2 })), c + LH).concat(
      ringAt(P, circ(4, 16).map((q) => ({ ...q, u: q.u + W / 2, v: q.v + W / 2 })), c + LH + 3)))));
  }

  const B = register(stage, (dt) => { const m = stepS(lift, dt); draw(lift.x); return m; });
  bag.add(B.unregister);

  // hit: the stack's rest box on screen, which never moves
  const top = P(W / 2, W / 2, SUMP + 2 * TH + LH)[1], bot = P(W, W, 0)[1], xl = P(0, W, 0)[0], xr = P(W, 0, 0)[0];
  let tgt = null, lastP = null;
  function go(p) {
    lastP = p;
    let L = REST;
    if (p && p[0] > xl - 20 && p[0] < xr + 20 && p[1] > top - 60 && p[1] < bot + 10) L = maxL * clamp((bot - p[1]) / (bot - top), 0.35, 1);
    L = Math.round(L);
    if (L === tgt) return;
    tgt = L;
    lift.t = L;
    read.textContent = L === REST ? "rest" : "lift " + L;
    B.wake();
  }
  go(null);
  bag.add(pointer(stage, { move: go, leave: () => go(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxL = v; tgt = null; go(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "compostbin2",
  means: "A wormery of stacked trays on a tapped sump: the top tray and lid lift as the pointer rises over it, showing the compost below.",
  rules: [1, 2, 3, 5],
  range: [14, 26, 36],
  tour: [[200, 230], [200, 166], [200, 132], null],
  mount,
});
