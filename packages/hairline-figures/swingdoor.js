/**
 * Saloon doors: two short louvred leaves hung between two tall posts under
 * a lintel. The pointer near the doorway pushes both leaves open on a
 * spring, wider the closer it comes. At rest they hang just ajar, the right
 * leaf bright. The slider is how far they can swing.
 *
 * The pattern: a continuous swing, hit on a fixed plane (unproj).
 */
const {
  Cam, clamp, fit, hull, poly, proj, rings, rrect, seg, unproj, spring, stepS, rad,
  disposer, mk, pointer, put, prism, facing, register, solid,
} = HL;

const LW = 30, Z0 = 22, Z1 = 60, PH = 86, REST = 14, ZM = (Z0 + Z1) / 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-LW - 4, -4, 0], [LW + 4, 4, 0], [-LW - 4, 0, PH + 6], [LW + 4, 0, PH + 6], [-LW, LW, Z0], [LW, LW, Z0], [0, LW, Z1]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const add = (a, b, s) => a.map((x, i) => x + b[i] * s);
  function slab(c, U, V, W, a, b, t, r) {
    const pts = [], at = (u, v, z) => P(...add(add(add(c, U, u), V, v), W, z));
    for (const q of rrect(-a, -b, a, b, r, 4)) pts.push(at(q.u, q.v, -t / 2), at(q.u, q.v, t / 2));
    const s = W[0] + W[1] >= 0 ? 1 : -1;
    const inner = rrect(-a + 2.4, -b + 2.4, a - 2.4, b - 2.4, Math.max(1, r - 2), 4).map((q) => at(q.u, q.v, s * t / 2));
    let lv = "";
    for (let v = -b + 8; v < b - 6; v += 4.5) lv += seg(at(-a + 5, v, s * t / 2), at(a - 5, v, s * t / 2));
    return { sil: poly(hull(pts)), cr: poly(inner), lv };
  }
  // sill, far post, lintel
  const [sr, si] = rings(-LW - 6, -5, LW + 6, 5, 3, 1.2);
  put(solid(g), prism(P, front, sr, si, 0, 3));
  const post = (x) => { const [r, i] = rings(x - 3, -3, x + 3, 3, 2, 1); put(solid(g), prism(P, front, r, i, 3, PH)); };
  post(-LW - 2);
  const [lr, li] = rings(-LW - 6, -4, LW + 6, 4, 2.5, 1.2);
  put(solid(g), prism(P, front, lr, li, PH, PH + 6));
  const leaf = () => ({ sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g), lv: mk("path", { class: "lo" }, g) });
  const L = leaf(), R = leaf();
  post(LW + 2);
  R.sil.classList.add("hi");

  const th = spring(REST);
  let last = NaN;
  function hang(el, a, side) {
    const U = [side * Math.cos(a), Math.sin(a), 0], W = [-Math.sin(a) * side, Math.cos(a) * side, 0];
    const c = add([-side * LW, 0, ZM], U, LW / 2);
    const s = slab(c, U, [0, 0, 1], W, LW / 2 - 0.6, (Z1 - Z0) / 2, 3, 3);
    el.sil.setAttribute("d", s.sil); el.cr.setAttribute("d", s.cr); el.lv.setAttribute("d", s.lv);
  }
  function draw() {
    if (th.x === last) return;
    last = th.x;
    hang(L, rad(th.x), 1); hang(R, rad(th.x * 0.92), -1);
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(p) {
    let d = Infinity;
    if (p) { const [x, y] = unproj(C, p[0], p[1], ZM); d = Math.hypot(x, y); }
    const on = d < 90;
    th.t = on ? clamp(1 - d / 90, 0.2, 1) * 80 * reach + 6 : REST;
    L.sil.classList.toggle("hi", on);
    read.textContent = on ? "swing " + Math.round(th.t) : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "swingdoor",
  means: "Saloon doors between two posts: both louvred leaves swing open as the pointer comes near, wider the closer it is.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.85, 1],
  tour: [[223, 175], [170, 215], [205, 184], null],
  mount,
});
