/**
 * Voting urn: a ballot box with a deep hinged lid. Over the box the lid
 * swings open on its back hinge and a ballot rises from the slot. At rest
 * the lid stands ajar, bright. The slider is how far the lid opens.
 */
const { Cam, fit, facing, hull, poly, prism, proj, rings, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 60, D = 40, H = 30, LH = 12, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, -14, 0], [W, D, 0], [W, -14, H + 46], [0, D, H + LH], [0, -14, H + 46]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 3, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, H));
  const card = mk("path", { class: "sil" }, g), lid = mk("path", { class: "sil hi" }, g), top = mk("path", { class: "nf" }, g), slot = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  const tf = (a) => (x, y, z) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)), dz = z - H; return [x, y * c - dz * s, H + y * s + dz * c]; };
  const box = (x0, y0, z0, x1, y1, z1, f) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(P(...f(x, y, z))); return o; };
  const face = (x0, y0, x1, y1, z, f) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(([x, y]) => P(...f(x, y, z)));
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = tf(a);
    lid.setAttribute("d", poly(hull(box(0, 0, H, W, D, H + LH, f))));
    top.setAttribute("d", poly(face(2, 2, W - 2, D - 2, H + LH, f)));
    slot.setAttribute("d", poly(face(20, 18, 40, 22, H + LH + 0.1, f)));
    const h = Math.max(0, (a - 30) / 80) * 30, id = (x, y, z) => [x, y, z];
    card.setAttribute("d", h > 0.5 ? poly(hull(box(21, 19, H, 39, 21, H + h, id))) : "");
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = box(0, 0, 0, W, D, H + LH, (x, y, z) => [x, y, z]);
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 30 && sy < Math.max(...ys) + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? amp : REST, performance.now(), 0);
    read.textContent = a ? "open" : "shut";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { tset(tw, amp, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "ballotbox2",
  means: "A ballot box: over it the deep lid swings open on its back hinge and a ballot rises out of the slot.",
  rules: [1, 3, 4],
  range: [60, 100, 115],
  tour: [[200, 150], [210, 140], [190, 160], null],
  mount,
});
