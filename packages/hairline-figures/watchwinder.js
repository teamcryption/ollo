/**
 * Watch winder: a lidded box holding a watch on a cushion. The pointer over
 * the box opens the lid on its back hinge, and the watch turns a full winding
 * as it opens. At rest the lid stands ajar, bright. The slider is how far
 * the lid opens.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 64, Y1 = 46, Z1 = 28, T = 3, AJAR = 0.16;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.8);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, -4, Z1 + Y1], [X1, -4, Z1 + Y1]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, X1, Y1, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, Z1));
  const [wr, wi] = rings(5, 5, X1 - 5, Y1 - 5, 3, 1);
  mk("path", { d: poly(ringAt(P, wr, Z1)), class: "lo" }, g);
  const cx = X1 / 2, cy = Y1 / 2 + 2;
  const [cr, ci] = rings(cx - 16, cy - 12, cx + 16, cy + 12, 8, 1.6);
  put(solid(g), prism(P, front, cr, ci, Z1 - 4, Z1 + 4));
  const face = mk("path", { d: poly(ringAt(P, disc(cx, cy, 9), Z1 + 5)), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, disc(cx, cy, 7), Z1 + 5)), class: "nf lo" }, g);
  const hand = mk("path", { class: "nf" }, g);
  const lid = mk("path", { class: "sil" }, g), lidIn = mk("path", { class: "nf lo" }, g);
  const tw = tween(AJAR);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const th = o * 1.75, c = Math.cos(th), s = Math.sin(th), pts = [], inner = [];
    const at = (x, l, h) => P(x, l * c - h * s, Z1 + l * s + h * c);
    for (const x of [0, X1]) for (const l of [0, Y1]) for (const h of [0, T]) pts.push(at(x, l, h));
    lid.setAttribute("d", poly(hull(pts)));
    for (const [x, l] of [[3, 3], [X1 - 3, 3], [X1 - 3, Y1 - 3], [3, Y1 - 3]]) inner.push(at(x, l, s > 0.5 ? 0 : T));
    lidIn.setAttribute("d", poly(inner));
    const a = o * Math.PI * 2 - 0.6;
    hand.setAttribute("d", "M" + P(cx, cy, Z1 + 5) + "L" + P(cx + 6 * Math.cos(a), cy + 6 * Math.sin(a), Z1 + 5));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 0.3 + 0.7 * reach / 100 : AJAR, performance.now(), 0);
    lid.classList.toggle("hi", !on);
    face.classList.toggle("hi", on);
    read.textContent = on ? "wind" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z1);
    return x > -6 && x < X1 + 6 && y > -6 && y < Y1 + 6;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "watchwinder",
  means: "A watch winder box: the pointer opens its lid on the back hinge, and the watch on its cushion turns as it opens.",
  rules: [1, 3, 5, 6],
  range: [0, 80, 100],
  tour: [[178, 160], [192, 196], [212, 228], null],
  mount,
});
