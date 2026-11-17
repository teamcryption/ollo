/**
 * Casement window: a wall with one tall casement, its sash hinged on the
 * left jamb and a crank stay on the sill. Over the wall the crank winds the
 * sash wide open on its hinge; leaving, it swings back to ajar. At rest the
 * sash stands ajar, bright. The slider is how wide the sash opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, fit, fillet, open, poly, prism, proj, rings, seg, facing, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X0 = 30, W = 60, Z0 = 32, Z1 = 100, REST = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, -10, 0], [120, -10, 0], [120, 0, 0], [0, 0, 130], [X0, W, Z0], [X0 + 30, W * 0.9, Z1]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(0, -10, 120, 0, 3, 1.4);
  put(solid(g), prism(P, front, wr, wi, 0, 130));
  mk("path", { d: poly([P(X0, 0, Z0), P(X0 + W, 0, Z0), P(X0 + W, 0, Z1), P(X0, 0, Z1)]), class: "lo" }, g);
  mk("path", { d: seg(P(X0 + 4, 0, Z0 + 4), P(X0 + 4, -9, Z0 + 4)) + seg(P(X0 + W, 0, Z1), P(X0 + W, -9, Z1)), class: "nf lo" }, g);
  const [sr, si] = rings(X0 - 5, 0, X0 + W + 5, 8, 1.5, 0.8);
  put(solid(g), prism(P, front, sr, si, Z0 - 5, Z0));
  const stay = mk("path", { class: "nf" }, g);
  const crank = mk("path", { class: "nf" }, g);
  const sash = mk("path", { class: "sil hi" }, g);
  const pane = mk("path", { class: "nf lo" }, g);
  const bars = mk("path", { class: "nf lo" }, g);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    const Q = (u, z) => P(X0 + u * c, 1 + u * s, z);
    sash.setAttribute("d", poly(fillet([Q(0, Z0 + 1), Q(W, Z0 + 1), Q(W, Z1), Q(0, Z1)], [1.5, 1.5, 1.5, 1.5])));
    pane.setAttribute("d", poly([Q(6, Z0 + 7), Q(W - 6, Z0 + 7), Q(W - 6, Z1 - 6), Q(6, Z1 - 6)]));
    const zm = (Z0 + Z1) / 2;
    bars.setAttribute("d", seg(Q(6, zm), Q(W - 6, zm)) + seg(Q(W - 3, zm - 4), Q(W - 3, zm + 4)));
    const tip = Q(W * 0.55, Z0 + 1), base = P(X0 + 10, 4, Z0);
    stay.setAttribute("d", open([base, P(X0 + 18 + 10 * s, 4 + 14 * s, Z0), tip]));
    crank.setAttribute("d", seg(base, P(X0 + 10 - 6 * c, 4 + 6 * s, Z0 + 2)) + seg(P(X0 + 10 - 6 * c, 4 + 6 * s, Z0 + 2), P(X0 + 10 - 6 * c, 4 + 6 * s, Z0 + 7)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const box = [P(0, 0, 130), P(120, -10, 0), P(0, 0, 0), P(120, -10, 130), P(X0, W * 0.7, Z0)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? wide : REST, performance.now(), 0);
    read.textContent = v ? "open " + Math.round(wide) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(inside(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "windowlatch",
  means: "A casement window in a wall: over it, the crank winds the sash wide open on its hinge; leaving, it swings back ajar.",
  rules: [1, 4, 5, 6],
  range: [45, 85, 110],
  tour: [[214, 157], [180, 110], [236, 200], null],
  mount,
});
