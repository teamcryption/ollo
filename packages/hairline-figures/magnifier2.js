/**
 * Hand lens: a folding pocket magnifier, a round case with its lens frame
 * hinged at the far edge. The pointer over it swings the lens open on its
 * hinge; leaving folds it back to a slight lift. The lens frame is the bright
 * mark. The slider is the swing.
 */
const { Cam, fit, proj, facing, circ, prism, put, solid, mk, hull, poly, tween, tset, tval, tdone, register, pointer, disposer, unproj, clamp, rad } = HL;

const RC = 24, RL = 22, HY = -26, HZ = 7, REST = 70, OPEN = 160;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, on = false;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-RC, -RC, 0], [RC, RC, 0], [-RC, HY - 2 * RL - 4, 0], [RC, HY - 2 * RL - 4, 0], [0, HY, HZ + 2 * RL + 4]], 268, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lens = mk("g", {}, g), body = mk("g", {}, g);
  put(solid(body), prism(P, front, disc(RC), disc(RC - 2), 0, HZ - 1));
  const knuckle = mk("path", { class: "" }, body);
  { const pts = []; for (const x of [-9, 9]) for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; pts.push(P(x, HY + 2.5 * Math.cos(t), HZ + 2.5 * Math.sin(t))); } knuckle.setAttribute("d", poly(hull(pts))); }
  const frame = mk("path", { class: "sil hi" }, lens), glass = mk("path", { class: "lo" }, lens), inner = mk("path", { class: "nf lo" }, lens);
  const tw = tween(REST);
  let last = NaN;
  function ring(a, r, lift) {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), o = [];
    for (let i = 0; i < 44; i++) { const t = (i / 44) * Math.PI * 2, d = RL + 2 + r * Math.sin(t); o.push(P(r * Math.cos(t), HY + d * c - s * lift, HZ + d * s + c * lift)); }
    return o;
  }
  function draw(a) {
    if (a === last) return;
    last = a;
    frame.setAttribute("d", poly(hull(ring(a, RL, 0).concat(ring(a, RL, 3)))));
    glass.setAttribute("d", poly(ring(a, RL - 3, a < 90 ? 3 : 0)));
    inner.setAttribute("d", poly(ring(a, RL - 6, a < 90 ? 3 : 0)));
    if (a > 80) g.insertBefore(lens, body); else g.insertBefore(body, lens);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? clamp(REST + (OPEN - REST) * amt, REST, 172) : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  B.wake();
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], HZ); setOn(Math.abs(x) < RC + 8 && y > HY - 20 && y < RC + 8); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { on = false; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "magnifier2",
  means: "A folding hand lens: the pointer swings the lens frame open on its hinge, leaving folds it back over the case.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.1],
  tour: [[147, 221], [198, 128], [175, 200], null],
  mount,
});
