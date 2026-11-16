/**
 * Laptop dock: a low docking slab with a laptop seated on it. The pointer's
 * place across the figure swings the lid on its hinge, shut on the left, wide
 * open on the right, on a spring. At rest the lid stands half open and bright.
 * The slider is how far the lid may open.
 */
const { Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rad, rings, rrect, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 52, D = 36, DZ = 5, BZ = 4, T = 1.6, L = 34, REST = 108;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + 4, 0], [0, 2, DZ + BZ + L], [W, 2, DZ + BZ + L]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the dock: a low slab, wider than the laptop, with a port lip at the back
  const dock = solid(g);
  const [dr, di] = rings(-4, -4, W + 4, D + 4, 5, 1.6);
  put(dock, prism(P, front, dr, di, 0, DZ));
  mk("path", { class: "nf lo", d: seg(P(W + 4, 6, 2.5), P(W + 4, 14, 2.5)) + seg(P(8, D + 4, 2.5), P(12, D + 4, 2.5)) }, dock.g);
  // the laptop base, its keyboard well and trackpad
  const base = solid(g);
  const [br, bi] = rings(0, 0, W, D, 3, 1);
  put(base, prism(P, front, br, bi, DZ, DZ + BZ));
  const z = DZ + BZ;
  mk("path", { class: "nf lo", d: poly([P(5, 4, z), P(W - 5, 4, z), P(W - 5, 20, z), P(5, 20, z)]) + poly([P(W / 2 - 8, 24, z), P(W / 2 + 8, 24, z), P(W / 2 + 8, 32, z), P(W / 2 - 8, 32, z)]) }, base.g);

  // the lid: a thin plate hinged on the base's back edge
  const lid = solid(g);
  const scr = mk("path", { class: "nf lo" }, lid.g);
  const ring = rrect(0, 0, W, L, 3, 4), inner = rrect(3, 3, W - 3, L - 3, 1.5, 4);
  const at = (th, t) => (s) => { const c = Math.cos(th), si = Math.sin(th); return P(s.u, s.v * c - t * si, z + s.v * si + t * c); };
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const th = rad(deg);
    // the lid's hinge sits on y = 0; v runs from the hinge out along the lid
    const a = ring.map(at(th, 0)), b = ring.map(at(th, T));
    lid.sil.setAttribute("d", poly(hull(a.concat(b))));
    lid.cr.setAttribute("d", "");
    scr.setAttribute("d", poly(inner.map(at(th, deg > 75 ? 0 : T))));
  }
  const sp = spring(REST);
  lid.sil.classList.add("hi");

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const xl = P(0, D, 0)[0] - 10, xr = P(W, 0, 0)[0] + 10;
  function move([sx, sy]) {
    if (sx < xl - 20 || sx > xr + 20 || sy < 20 || sy > 300) return leave();
    const f = clamp((sx - xl) / (xr - xl), 0, 1);
    sp.t = lerp(12, 85 + 40 * maxA, f);
    read.textContent = "lid " + Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "dockstation",
  means: "A laptop seated on a dock: the pointer's place across it swings the lid on its hinge, from shut to wide open.",
  rules: [1, 3, 4, 5],
  range: [0, 0.5, 1],
  tour: [[126, 186], [200, 196], [282, 206], null],
  mount,
});
