/**
 * Plug door: one side of a railway carriage with its door. The pointer over
 * the carriage opens the door: it plugs out of the wall, then slides along
 * the outside of the body. At rest the door stands just ajar, bright. The
 * slider is how far it slides.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, W = 30, Z0 = 9, Z1 = 64, DX0 = 34, DX1 = 64, DZ0 = 13, DZ1 = 58, REST = 0.18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[0, 0, 0], [L + 46, W + 8, 0], [L + 46, W + 8, DZ1], [0, 0, Z1 + 6], [L, 0, Z1 + 6], [0, W + 8, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ur, ui] = rings(12, 6, L - 12, W - 6, 3, 1.2);
  put(solid(g), prism(P, front, ur, ui, 2, Z0));
  const [br, bi] = rings(0, 0, L, W, 5, 1.6);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  const [rr, ri] = rings(3, 3, L - 3, W - 3, 10, 2);
  put(solid(g), prism(P, front, rr, ri, Z1, Z1 + 5));
  const face = (x0, x1, z0, z1, y, r) => poly(rrect(x0, z0, x1, z1, r, 4).map((q) => P(q.u, y, q.v)));
  mk("path", { d: face(DX0 - 1, DX1 + 1, DZ0 - 1, DZ1 + 1, W, 1.5), class: "nf lo" }, g);
  for (const [a, b] of [[7, 25], [74, 90]]) mk("path", { d: face(a, b, 36, 52, W, 3), class: "nf lo" }, g);
  const door = solid(g), win = mk("path", { class: "nf lo" }, g), grip = mk("path", { class: "nf" }, g);
  const tw = tween(REST);
  let last = NaN;

  function draw(p) {
    const key = p * 7 + reach;
    if (key === last) return;
    last = key;
    const dy = 7 * clamp(p / 0.3, 0, 1), dx = 44 * reach * clamp((p - 0.3) / 0.7, 0, 1);
    const [dr, di] = rings(DX0 + dx, W - 1 + dy, DX1 + dx, W + 3 + dy, 2, 0.8);
    put(door, prism(P, front, dr, di, DZ0, DZ1));
    win.setAttribute("d", face(DX0 + 6 + dx, DX1 - 6 + dx, 36, 52, W + 3 + dy, 3));
    grip.setAttribute("d", face(DX1 - 5 + dx, DX1 - 3 + dx, 24, 32, W + 3 + dy, 0.8));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  door.sil.classList.add("hi");

  const box = hull([[0, 0, 0], [L, 0, 0], [L, W, 0], [0, W, 0], [0, 0, Z1], [L, 0, Z1], [L, W, Z1], [0, W, Z1]].map((q) => P(...q)));
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let on = null;
  function setOpen(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? 1 : REST, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOpen(false);
  bag.add(pointer(stage, { move: (p) => setOpen(inside(p)), leave: () => setOpen(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "plugdoor",
  means: "A carriage side with a plug door: the pointer opens it, out of the wall and sliding along the body.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[179, 142], [253, 140], [147, 157], null],
  mount,
});
