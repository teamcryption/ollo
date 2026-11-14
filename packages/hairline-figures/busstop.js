/**
 * Bus stop: a shelter with a back panel, a roof on two posts and a bench,
 * and beside it a pole carrying a flag sign. The sign turns on its pole to
 * face the pointer, on a spring, as if looking up the road for the bus.
 * At rest it stands angled toward the kerb, bright. The slider is how far
 * it may turn from that rest.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, rrect, unproj, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PX = 118, PY = 34, PZ = 92, SW = 40, SH = 30, REST = 30;
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: PX + c * q.u - s * q.v, v: PY + s * q.u + c * q.v, nu: c * q.nu - s * q.nv, nv: s * q.nu + c * q.nv }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-6, -6, 0], [90, -6, 0], [-6, 40, 0], [PX + SW, PY, 0], [PX, PY + SW, 0], [PX - SW, PY, PZ], [PX, PY - SW, PZ], [-6, -6, 62]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1, parent = g) => { const [o, i] = rings(x0, y0, x1, y1, r, b); return put(solid(parent), prism(P, front, o, i, z0, z1)); };

  box(-4, -4, 84, 40, 3, 1.2, 0, 2);            // pavement slab
  box(0, 0, 80, 3, 1.2, 0.5, 2, 56);             // back panel
  box(10, 6, 70, 16, 2, 1, 14, 17);              // bench seat
  box(12, 7, 15, 10, 1, 0.4, 2, 14);
  box(65, 7, 68, 10, 1, 0.4, 2, 14);
  box(1, 33, 4, 36, 1, 0.4, 2, 56);              // posts
  box(76, 33, 79, 36, 1, 0.4, 2, 56);
  box(-6, -6, 86, 40, 3, 1.4, 56, 60);           // roof

  const pole = mk("g", {}, g);
  box(PX - 8, PY - 8, PX + 8, PY + 8, 4, 1.4, 0, 2, pole);
  put(solid(pole), prism(P, front, disc(PX, PY, 2), disc(PX, PY, 1.2), 2, PZ + 4));
  const sign = solid(g);
  sign.sil.classList.add("hi");

  const ang = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const r = rad(a);
    const o = turn(rrect(3, -1.6, 3 + SW, 1.6, 1.4, 4), r), i = turn(rrect(3.7, -0.9, 2.3 + SW, 0.9, 0.7, 4), r);
    put(sign, prism(P, front, o, i, PZ - SH, PZ));
    // paint order: the sign goes in front of the pole when its middle is nearer the viewer
    if (Math.cos(r) + Math.sin(r) > 0) pole.after(sign.g); else pole.before(sign.g);
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    let d = (Math.atan2(wy - PY, wx - PX) * 180) / Math.PI;
    d = REST + clamp(((d - REST + 540) % 360) - 180, -reach * 1.6, reach * 1.6);
    ang.t = d;
    read.textContent = String(Math.round(((d % 360) + 360) % 360)).padStart(3, "0") + "°";
    B.wake();
  }
  function rest() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  draw(REST); rest();
  bag.add(pointer(stage, { move: aim, leave: rest }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "busstop",
  means: "A bus shelter with a bench and a stop pole: the flag sign turns on its pole to face the pointer, looking up the road.",
  rules: [1, 3, 5, 8],
  range: [0, 80, 110],
  tour: [[171, 231], [65, 285], [330, 150], null],
  mount,
});
