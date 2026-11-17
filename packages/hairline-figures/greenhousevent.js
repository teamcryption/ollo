/**
 * Vent opener: a greenhouse roof vent, a framed pane hinged along its top,
 * pushed open by a wax-cylinder arm at its side. The pointer is the warmth:
 * the nearer it comes to the pane, the wider the arm pushes it open. At rest
 * the pane stands ajar, bright. The slider is how far the arm can reach.
 *
 * The pattern: a continuous opening on a spring; the hit is on the ground
 * plane, which never moves.
 */
const {
  Cam, clamp, fit, hull, poly, proj, rad, unproj, spring, stepS,
  disposer, mk, pointer, register, solid,
} = HL;

const W = 64, H = 48, PL = 42, REST = 18;

function mount({ stage, svg, read }, value) {
  let reach = value;
  const bag = disposer();
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-4, -4, 0], [W + 10, -4, 0], [W + 10, 0, H + 4], [-4, 0, H + 4], [0, PL, H], [W, PL, H], [W, 30, 10]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (x0, x1, y0, y1, z0, z1) => { const p = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push(P(x, y, z)); return poly(hull(p)); };
  const frame = solid(g);
  frame.sil.setAttribute("d", box(-4, W + 4, -4, 0, 0, H + 4));
  frame.cr.setAttribute("d", poly([P(2, 0.1, 4), P(W - 2, 0.1, 4), P(W - 2, 0.1, H - 2), P(2, 0.1, H - 2)]));
  const arm = mk("path", { class: "sil" }, g), rod = mk("path", { class: "sil" }, g);
  const pane = solid(g);
  pane.sil.classList.add("hi");
  const th = spring(rad(REST));
  let last = NaN, open = false;

  function draw() {
    const t = th.x;
    if (t === last) return;
    last = t;
    const at = (x, d, s) => [x, d * Math.sin(t) + s * Math.cos(t), H - d * Math.cos(t) + s * Math.sin(t)];
    const pts = [];
    for (const x of [0, W]) for (const d of [0, PL]) for (const s of [0, 2.4]) pts.push(P(...at(x, d, s)));
    pane.sil.setAttribute("d", poly(hull(pts)));
    pane.cr.setAttribute("d", poly([at(4, 4, 2.5), at(W - 4, 4, 2.5), at(W - 4, PL - 4, 2.5), at(4, PL - 4, 2.5)].map((q) => P(...q))));
    // the arm: a cylinder pivoting on the frame's side, its rod to the pane's lower corner
    const base = [W + 6, 0, 6], tipP = at(W + 6, PL * 0.75, 1.2);
    const dir = tipP.map((v, i) => v - base[i]), n = Math.hypot(...dir), u = dir.map((v) => v / n);
    const mid = base.map((v, i) => v + u[i] * n * 0.55);
    const tube = (a, b, r) => { const p = []; for (const q of [a, b]) for (let i = 0; i < 10; i++) { const k = (i / 10) * Math.PI * 2; p.push(P(q[0] + r * Math.cos(k), q[1] + r * Math.sin(k), q[2] + r * Math.cos(k + 1))); } return poly(hull(p)); };
    arm.setAttribute("d", tube(base, mid, 3.4));
    rod.setAttribute("d", tube(mid, tipP, 1.3));
  }

  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(target) {
    open = target !== null;
    const deg = open ? target : REST;
    th.t = rad(deg);
    read.textContent = open ? "open " + Math.round(deg) + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -20 || x > W + 30 || y < -10 || y > 110) return set(null);
      set(clamp(10 + (y / 80) * 62 * reach, 10, 72));
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { reach = clamp(v, 0, 1); }, destroy: bag.dispose };
}

hairline({
  name: "greenhousevent",
  means: "A greenhouse vent on its opener arm: the nearer the pointer comes, the wider the arm pushes the hinged pane open.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[141, 209], [66, 310], [98, 300], null],
  mount,
});
