/**
 * Racket press: a racket lying in a wooden press, the press's top board
 * hinged at the throat. The pointer over the press swings the board open to
 * show the strung head; at rest the board lies nearly shut and is bright.
 * The slider is how far it opens.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const A = 26, Bh = 20, X0 = -32, X1 = 32, Y = 26, Z = 6, T = 3;
const ell = (a, b, n = 40) => { const r = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; r.push([a * Math.cos(t), b * Math.sin(t)]); } return r; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-74, 0, 0], [X1, -Y, 0], [X1, Y, 0], [X0, -Y, 0], [X0 + 4, Y, 70], [X0 + 4, -Y, 70]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(X0, -Y, X1, Y, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, Z - 2));
  put(solid(g), prism(P, front, rings(-76, -2.6, -A + 1, 2.6, 2.4, 0.8)[0], rings(-76, -2.6, -A + 1, 2.6, 2.4, 0.8)[1], Z - 2, Z));
  const head = mk("path", { class: "sil" }, g);
  head.setAttribute("d", poly(ell(A, Bh).map(([x, y]) => P(x, y, Z))));
  let s = "";
  for (let i = -3; i <= 3; i++) { const y = i * 5, x = A * Math.sqrt(1 - (y / Bh) ** 2) - 2; s += seg(P(-x, y, Z), P(x, y, Z)); }
  for (let i = -4; i <= 4; i++) { const x = i * 5, y = Bh * Math.sqrt(1 - (x / A) ** 2) - 2; s += seg(P(x, -y, Z), P(x, y, Z)); }
  mk("path", { class: "nf lo", d: s }, g);
  const board = solid(g);
  const face = rrect(0, -Y, X1 - X0, Y, 6, 4), inner = rrect(2, -Y + 2, X1 - X0 - 2, Y - 2, 4, 4);
  const tw = tween(0.12);
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const a = f * (Math.PI / 2) * 0.95, c = Math.cos(a), sn = Math.sin(a);
    const W = (u, v, w) => P(X0 + u * c - w * sn, v, Z + u * sn + w * c);
    const pts = [];
    for (const q of face) pts.push(W(q.u, q.v, 0), W(q.u, q.v, T));
    board.sil.setAttribute("d", poly(hull(pts)));
    board.cr.setAttribute("d", poly(inner.map((q) => W(q.u, q.v, T))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const box = [P(-76, 0, 0), P(X1, -Y, 0), P(X1, Y, 0), P(X0, 0, 40)];
  const x0 = Math.min(...box.map((p) => p[0])), x1 = Math.max(...box.map((p) => p[0]));
  const y0 = Math.min(...box.map((p) => p[1])), y1 = Math.max(...box.map((p) => p[1]));
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? wide : 0.12, performance.now(), 0);
    board.sil.classList.toggle("hi", !v);
    head.classList.toggle("hi", v);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(sx > x0 && sx < x1 && sy > y0 && sy < y1), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "squashracket",
  means: "A squash racket in a wooden press: the pointer swings the top board open on its hinge to show the strung head.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1],
  tour: [[215, 226], [250, 210], [150, 200], null],
  mount,
});
