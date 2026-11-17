/**
 * Stage trapdoor: a square of stage floor with a trap cut in it, its lid
 * hinged on the far edge over a dashed shaft. The pointer near the trap
 * swings the lid open on a spring, wider the closer it comes. At rest the
 * lid stands ajar, bright. The slider is how wide it can open.
 *
 * The pattern: a continuous swing, hit on the ground plane (unproj).
 */
const {
  Cam, clamp, fit, hull, poly, proj, rrect, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, register,
} = HL;

const F = 66, T = 6, H = 24, REST = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-F, -F, 0], [F, F, -T], [F, -F, 0], [-F, F, -T], [0, -H, T + 2 * H]], 200, 168);
  const P = proj(C), g = mk("g", {}, svg);
  const add = (a, b, s) => a.map((x, i) => x + b[i] * s);
  function slab(c, U, V, W, a, b, t, r) {
    const pts = [], at = (q, z) => P(...add(add(add(c, U, q.u), V, q.v), W, z));
    for (const q of rrect(-a, -b, a, b, r, 4)) pts.push(at(q, -t / 2), at(q, t / 2));
    const inner = rrect(-a + 2, -b + 2, a - 2, b - 2, Math.max(1, r - 2), 4).map((q) => at(q, t / 2));
    return { sil: poly(hull(pts)), cr: poly(inner) };
  }
  const floor = slab([0, 0, -T / 2], [1, 0, 0], [0, 1, 0], [0, 0, 1], F, F, T, 6);
  mk("path", { d: floor.sil, class: "sil" }, g);
  mk("path", { d: floor.cr, class: "nf lo" }, g);
  // boards across the floor, then the trap's opening and its shaft
  for (let x = -F + 22; x < F - 4; x += 22) if (Math.abs(x) > H + 4) mk("path", { d: seg(P(x, -F + 3, 0), P(x, F - 3, 0)), class: "lo" }, g);
  mk("path", { d: poly(rrect(-H, -H, H, H, 2, 4).map((q) => P(q.u, q.v, 0))), class: "nf" }, g);
  for (const [x, y] of [[-H, H], [H, H], [H, -H]]) mk("path", { d: seg(P(x, y, 0), P(x, y, -T)), class: "dash" }, g);
  const lid = mk("path", { class: "sil hi" }, g), lcr = mk("path", { class: "nf lo" }, g), ring = mk("path", { class: "nf" }, g);

  const th = spring(REST);
  let last = NaN;
  function draw() {
    if (th.x === last) return;
    last = th.x;
    const a = rad(th.x), V = [0, Math.cos(a), Math.sin(a)], W = [0, -Math.sin(a), Math.cos(a)];
    const c = add(add([0, -H, 0], V, H), W, 1.5);
    const s = slab(c, [1, 0, 0], V, W, H - 1, H - 1, 3, 2);
    lid.setAttribute("d", s.sil); lcr.setAttribute("d", s.cr);
    const k = add(add([0, -H, 0], V, 2 * H - 7), W, 3.2);
    ring.setAttribute("d", poly(rrect(-4, -2.4, 4, 2.4, 2.4, 4).map((q) => P(...add(add(k, [1, 0, 0], q.u), V, q.v)))));
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(p) {
    let d = Infinity;
    if (p) { const [x, y] = unproj(C, p[0], p[1], 0); d = Math.hypot(x, y); }
    const on = d < 110;
    th.t = on ? clamp(1 - d / 110, 0.15, 1) * 105 * reach : REST;
    read.textContent = on ? "open " + Math.round(th.t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "trapdoor",
  means: "A trap in a stage floor: its lid swings open on the far hinge as the pointer comes near, wider the closer it is.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.85, 1],
  tour: [[200, 230], [200, 170], [120, 170], null],
  mount,
});
