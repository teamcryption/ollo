/**
 * Fireproof box: a squat document box with a hinged lid and a carry handle on
 * top. The pointer over the box swings the lid up and back on its hinge to
 * show the well inside. At rest the lid sits a little ajar, bright. The slider
 * is how far the lid swings.
 *
 * The pattern: one hinged part on a tween; the hit is the box's rest outline.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 64, D = 44, H = 22, LT = 10, REST = 14, OPEN = 108;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-2, -2, 0], [W + 2, D + 2, 0], [W, D, H + LT], [0, -LT, H + D], [W, -LT, H + D]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lidG), face = mk("path", { class: "nf lo" }, lidG), handle = mk("path", { class: "nf" }, lidG);
  const base = solid(g);
  const [br, bi] = rings(0, 0, W, D, 4, 2);
  put(base, prism(P, front, br, bi, 0, H));
  mk("path", { class: "nf lo", d: open([P(4, D, 6), P(W - 4, D, 6)]) }, g);
  const latch = mk("path", { class: "nf", d: poly([P(W / 2 - 5, D, H - 1), P(W / 2 + 5, D, H - 1), P(W / 2 + 5, D, H - 8), P(W / 2 - 5, D, H - 8)]) }, g);
  const tw = tween(REST);
  let last = NaN, behind = null;

  // lid point: x, v along the lid's depth, w through its thickness, turned up about the back hinge
  const L = (x, v, w, th) => P(x, v * Math.cos(th) - w * Math.sin(th), H + v * Math.sin(th) + w * Math.cos(th));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg), pts = [];
    for (const x of [0, W]) for (const v of [0, D]) for (const w of [0, LT]) pts.push(L(x, v, w, th));
    lid.setAttribute("d", poly(hull(pts)));
    face.setAttribute("d", poly([L(2, 2, LT, th), L(W - 2, 2, LT, th), L(W - 2, D - 2, LT, th), L(2, D - 2, LT, th)]));
    handle.setAttribute("d", open([L(W / 2 - 14, D / 2, LT, th), L(W / 2 - 12, D / 2, LT + 6, th), L(W / 2 + 12, D / 2, LT + 6, th), L(W / 2 + 14, D / 2, LT, th)]));
    const b = deg > 70;
    if (b !== behind) { behind = b; if (b) g.prepend(lidG); else g.append(lidG); }
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const box = [P(0, 0, H + LT), P(W, 0, H + LT), P(W, D, 0), P(0, D, 0), P(W, D, H + LT), P(0, 0, 0)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([x, y]) => x > Math.min(...xs) - 6 && x < Math.max(...xs) + 6 && y > Math.min(...ys) - 30 && y < Math.max(...ys) + 6;
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? REST + (OPEN - REST) * amt : REST, performance.now(), 0);
    lid.classList.add("hi");
    latch.classList.toggle("hi", false);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: (p) => set(inside(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "securitybox",
  means: "A fireproof document box: the pointer over it swings the lid up on its hinge to show the well inside.",
  rules: [1, 5, 6, 8],
  range: [0.4, 1, 1],
  tour: [[200, 160], [180, 190], [220, 150], null],
  mount,
});
