/**
 * Fuse box: a wall cabinet with a row of breakers on its back panel, closed
 * by one hinged door. The door swings on its hinge to face the pointer,
 * uncovering the breakers. At rest the door stands ajar and is bright.
 * The slider is how far the door may open.
 */
const { Cam, clamp, fit, prism, proj, facing, rings, unproj, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const W = 44, D = 12, H = 56, HX = 0, HY = D + 3.2, REST = 0.42, AMIN = 0.08;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: HX + q.u * c - q.v * s, v: HY + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[0, 0, 0], [W, 0, H], [W, D, 0], [0, D + W, 0], [0, D + W, H], [W, 0, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  // breakers: two rows of switches standing proud of the back panel
  for (const z of [H * 0.58, H * 0.22]) for (let i = 0; i < 6; i++) {
    const x0 = 5 + i * 6;
    const [r, n] = rings(x0, D, x0 + 4.6, D + 2.2, 0.8, 0.5);
    put(solid(g), prism(P, front, r, n, z, z + 12));
    mk("path", { d: seg(P(x0 + 2.3, D + 2.2, z + 4 + (i % 3 === 1 ? 0 : 3)), P(x0 + 2.3, D + 2.2, z + 7 + (i % 3 === 1 ? 0 : 3))), class: "nf" }, g);
  }
  const door = solid(g);
  const handle = mk("path", { class: "nf" }, door.g);
  const [dr, di] = rings(0, -0.8, W, 0.8, 0.8, 0.35);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    put(door, prism(P, front, turn(dr, a), turn(di, a), 1, H - 1));
    const c = Math.cos(a), s = Math.sin(a), hx = HX + (W - 4) * c - 0.8 * s, hy = HY + (W - 4) * s + 0.8 * c;
    handle.setAttribute("d", seg(P(hx, hy, H * 0.42), P(hx, hy, H * 0.6)));
  }
  door.sil.classList.add("hi");
  const L = register(stage, (dt) => {
    const m = stepS(sp, dt);
    if (sp.x !== last) { draw(sp.x); last = sp.x; }
    return m;
  });
  bag.add(L.unregister);
  function aim(p) {
    if (!p) { sp.t = REST; read.textContent = "rest"; L.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const a = clamp(Math.atan2(y - HY, x - HX), AMIN, amax);
    sp.t = a;
    read.textContent = `${Math.round((a * 180) / Math.PI)}°`;
    L.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; }, destroy: bag.dispose };
}

hairline({
  name: "fusepanel",
  means: "A fuse box on the wall: its door swings on the hinge to face the pointer, uncovering two rows of breakers.",
  rules: [1, 3, 4, 5],
  range: [0.8, 1.7, 1.75],
  tour: [[89, 270], [214, 285], [150, 262], null],
  mount,
});
