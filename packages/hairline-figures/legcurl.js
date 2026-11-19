/**
 * Leg curl: a lying bench on two posts and a rail, and at its foot a lever on
 * a pivot carrying the ankle roller and a pair of weight plates. The pointer's
 * place along the bench is the curl: the lever swings up and back over the
 * pad on a spring, plates and all. At rest it hangs a little raised, the
 * roller bright. The slider is how far the curl goes.
 *
 * The pattern: a continuous input driving one hinged part (spring).
 */
const { Cam, clamp, fillet, fit, hull, lerp, open, poly, proj, rings, prism, facing, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const PX = 24, PZ = 31, REST = 0.35;
const rot = (a) => ([x, z]) => [PX + (x - PX) * Math.cos(a) - (z - PZ) * Math.sin(a), PZ + (x - PX) * Math.sin(a) + (z - PZ) * Math.cos(a)];
function beam(P, A, B, t, y0, y1) {
  const dx = B[0] - A[0], dz = B[1] - A[1], L = Math.hypot(dx, dz) || 1, nx = (-dz / L) * t / 2, nz = (dx / L) * t / 2, pts = [];
  for (const [x, z] of [A, B]) for (const s of [1, -1]) for (const y of [y0, y1]) pts.push(P(x + s * nx, y, z + s * nz));
  const h = hull(pts);
  return { sil: poly(fillet(h, h.map(() => 1.2), 3)), crease: open([P(A[0] + nx * 0.6, y1 - 1, A[1] + nz * 0.6), P(B[0] + nx * 0.6, y1 - 1, B[1] + nz * 0.6)]) };
}
function cylY(P, cx, cz, R, y0, y1) {
  const pts = [], face = [];
  for (let i = 0; i < 32; i++) { const a = (i / 32) * Math.PI * 2, x = cx + R * Math.cos(a), z = cz + R * Math.sin(a); pts.push(P(x, y0, z), P(x, y1, z)); face.push(P(cx + (R - 1.2) * Math.cos(a), y1, cz + (R - 1.2) * Math.sin(a))); }
  return { sil: poly(hull(pts)), crease: open(face.concat([face[0]])) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let vmax = value, tt = null;
  const C = Cam(45, 0.5, 3.0);
  const ext = [[-44, -16, 0], [30, 16, 0], [-44, 16, 0], [30, -16, 0], [-40, 0, 32]];
  for (const a of [0, -1, -1.8, -2.7]) for (const p of [[PX, 4], [PX, 22], [PX - 9, 13], [PX + 9, 13]]) { const [x, z] = rot(a)(p); ext.push([x, -16, z], [x, 16, z]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r) => { const [a, b] = rings(x0, y0, x1, y1, r, 1); put(solid(g), prism(P, front, a, b, z0, z1)); };
  const farPlate = solid(g);
  box(-44, -6, 30, 6, 0, 3, 2);
  box(-36, -4, -30, 4, 3, 26, 1.5);
  box(16, -4, 22, 4, 3, PZ - 2, 1.5);
  box(-42, -10, 20, 10, 26, 31, 3);
  const lever = solid(g), roller = solid(g), nearPlate = solid(g);
  put(solid(g), cylY(P, PX, PZ, 2.2, -5, 5));
  roller.sil.classList.add("hi");

  const sp = spring(-REST * vmax);
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const R = rot(a);
    put(lever, beam(P, R([PX, PZ]), R([PX, 4]), 3, -2, 2));
    const [rx, rz] = R([PX, 7]), [qx, qz] = R([PX, 15]);
    put(roller, cylY(P, rx, rz, 3.6, -11, 11));
    put(farPlate, cylY(P, qx, qz, 9, -16, -12.5));
    put(nearPlate, cylY(P, qx, qz, 9, 12.5, 16));
  }
  const target = () => { sp.t = tt === null ? -REST * vmax : -vmax * lerp(0, 2, tt); };
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const xa = P(-42, 0, 31)[0], xb = P(PX, 0, 10)[0];
  bag.add(pointer(stage, {
    move: (p) => { tt = clamp((p[0] - xa) / (xb - xa), 0, 1); target(); read.textContent = Math.round((-sp.t * 180) / Math.PI) + "°"; B.wake(); },
    leave: () => { tt = null; target(); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest"; draw();
  return { set: (v) => { vmax = v; target(); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "legcurl",
  means: "A leg curl: the lever with its ankle roller and plates swings up over the bench as far as the pointer takes it.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.3],
  tour: [[123, 90], [263, 223], [193, 156], null],
  mount,
});
