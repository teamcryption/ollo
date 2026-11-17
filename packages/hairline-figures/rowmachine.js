/**
 * Rowmachine: a climbing hold board, a hangboard hung on two ropes from a
 * bar, its face cut with finger pockets and a jug along the top. Over it, the
 * board swings out on its ropes as if just let go. At rest it hangs with a
 * slight lean, bright.
 * The slider is how far it swings.
 *
 * The pattern: one discrete choice (over it or not) on the 700ms tween; the
 * hit is a fixed plane under the bar, which never moves.
 */
const {
  Cam, fit, facing, hull, poly, proj, rings, prism, rrect, seg, unproj, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Z = 120, R = 64, W = 46, BH = 26, T = 5, RX = 34;
const REST = -0.14, OUT = 0.72;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  let amp = value;
  const at = (a, x, t, h) => { const d = R - h; return [x, d * Math.sin(a) + t * Math.cos(a), Z - d * Math.cos(a) + t * Math.sin(a)]; };
  const ext = [];
  for (const a of [REST, OUT * 1.3]) for (const x of [-W, W]) for (const h of [0, -BH]) ext.push(at(a, x, 0, h));
  fit(C, ext.concat([[-56, 0, Z + 4], [56, 0, Z + 4]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-56, -3, 56, 3, 2.5, 1);
  put(solid(g), prism(P, front, br, bi, Z, Z + 6));
  const ropes = mk("path", { class: "nf sil" }, g);
  const board = solid(g), face = mk("path", { class: "nf lo" }, g);
  board.sil.classList.add("hi");
  const outline = rrect(-W, -BH, W, 0, 5, 4), inner = rrect(-W + 2, -BH + 2, W - 2, -2, 3.5, 4);
  const pockets = [[-30, -18], [-10, -18], [10, -18], [30, -18]].map(([x, h]) => rrect(x - 6, h - 3, x + 6, h + 3, 2.5, 3));
  const jug = rrect(-W + 6, -8, W - 6, -4, 2, 3);
  const sw = tween(0);
  let last = "";

  function draw(now) {
    const a = REST + (OUT * amp - REST) * tval(sw, now), key = a.toFixed(4);
    if (key === last) return;
    last = key;
    const ring = (rr, t) => rr.map((q) => P(...at(a, q.u, t, q.v)));
    board.sil.setAttribute("d", poly(hull(ring(outline, -T).concat(ring(outline, T)))));
    board.cr.setAttribute("d", poly(ring(inner, T)));
    face.setAttribute("d", pockets.concat([jug]).map((p) => poly(ring(p, T))).join(" "));
    ropes.setAttribute("d", [-RX, RX].map((x) => seg(P(x, 0, Z), P(...at(a, x, 0, 0)))).join(" "));
  }

  const B = register(stage, (dt, now) => { draw(now); return !tdone(sw, now); });
  bag.add(B.unregister);

  function set(on) {
    tset(sw, on ? 1 : 0, performance.now(), 0);
    read.textContent = on ? "swing" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], Z - R); set(Math.abs(x) < 60 && y > -40 && y < 50); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { amp = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "rowmachine",
  means: "A hangboard on two ropes, cut with finger pockets and a jug: over it, the board swings out on its ropes.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[255, 205], [225, 190], [285, 222], null],
  mount,
});
