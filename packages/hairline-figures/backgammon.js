/**
 * Backgammon case: a flat wooden case hinged along its back edge, the board
 * inside laid out as two rows of long points. The pointer over the case
 * swings the lid up and back to open the board; at rest the lid stands ajar,
 * bright. The slider is how far the lid opens.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 104, D = 72, T = 8, LT = 7, REST = 24;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -16, T + D + 2], [W, -16, T + D + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const baseG = mk("g", {}, g);
  const [r0, i0] = rings(0, 0, W, D, 6, 1.8);
  put(solid(baseG), prism(P, front, r0, i0, 0, T));
  // the board: a rim, a bar down the middle and two rows of points
  const pts = (zf, tf) => {
    let d = "";
    const half = (x0) => {
      for (let k = 0; k < 6; k++) {
        const x = x0 + k * 7.6;
        d += open([tf(x, 5), tf(x + 3.8, 30), tf(x + 7.6, 5)]) + open([tf(x, D - 5), tf(x + 3.8, D - 30), tf(x + 7.6, D - 5)]);
      }
    };
    half(5); half(W / 2 + 2.4);
    return d;
  };
  mk("path", { d: poly(rrect(4, 4, W - 4, D - 4, 2, 2).map((q) => P(q.u, q.v, T))), class: "nf lo" }, baseG);
  mk("path", { d: pts(T, (x, y) => P(x, y, T)), class: "nf lo" }, baseG);
  mk("path", { d: poly([P(W / 2 - 2.4, 4, T), P(W / 2 + 2.4, 4, T), P(W / 2 + 2.4, D - 4, T), P(W / 2 - 2.4, D - 4, T)]), class: "nf lo" }, baseG);
  const lidG = mk("g", {}, g), lid = mk("path", { class: "sil hi" }, lidG), face = mk("path", { class: "nf lo" }, lidG), lpts = mk("path", { class: "nf lo" }, lidG);
  const tw = tween(REST);
  const outer = rrect(0, 0, W, D, 6, 6), inner = rrect(1.8, 1.8, W - 1.8, D - 1.8, 4.2, 6), board = rrect(4, 4, W - 4, D - 4, 2, 2);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = (deg * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
    // the lid turns about the hinge line y = 0, z = T; zl = 0 is its board face
    const L = (x, y, zl) => P(x, y * c - zl * s, T + y * s + zl * c);
    const ring = (rg, zl) => rg.map((q) => L(q.u, q.v, zl));
    lid.setAttribute("d", poly(hull(ring(outer, 0).concat(ring(outer, LT)))));
    if (deg < 62) { face.setAttribute("d", poly(ring(inner, LT))); lpts.setAttribute("d", ""); }
    else { face.setAttribute("d", poly(ring(board, 0))); lpts.setAttribute("d", pts(0, (x, y) => L(x, y, 0))); }
    if (deg > 70) g.insertBefore(lidG, baseG); else g.appendChild(lidG);
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(W / 2, D / 2, T);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 100 * reach : REST, performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot((sx - mid[0]) / 1.6, sy - mid[1]) < 85),
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, 100 * v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "backgammon",
  means: "A backgammon case: the pointer swings the hinged lid up and back, opening the board of long points.",
  rules: [1, 4, 5, 6, 8],
  range: [0.6, 1, 1],
  tour: [[188, 234], [168, 205], [214, 262], null],
  mount,
});
