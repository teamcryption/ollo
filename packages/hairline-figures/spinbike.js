/**
 * Spin bike: a studio cycle on a rocker base, two foot bars, a heavy front
 * flywheel, a crank with pedals, a saddle on its post and a handlebar on its
 * stem. The pointer is the side the rider leans to: the whole bike above the
 * base rocks toward it on a spring, the crank and the flywheel's spokes turn
 * with the lean, and the handlebar is bright. At rest it stands a touch off
 * true with the flywheel bright. The slider is how far the frame may rock.
 *
 * The pattern: a continuous aim (a spring on one angle); the hit is on the
 * floor's plane, which never moves.
 */
const {
  Cam, fit, hull, open, poly, prism, proj, rings, rrect, unproj, spring, stepS, clamp, rad,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const REST = rad(4), MAX = rad(15);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => mul(a, 1 / Math.hypot(a[0], a[1], a[2]));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.95);
  const ext = [];
  for (const s of [-1, 1]) for (const x of [-38, 46]) for (const y of [-18, 18]) for (const z of [0, 62]) {
    const t = s * MAX * 1.5, c = Math.cos(t), n = Math.sin(t);
    ext.push([x, y * c + z * n, -y * n + z * c]);
  }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the rocker base stays on the floor
  const base = [[-36, -17, -27, 17], [-30, -2.6, 36, 2.6], [30, -16, 39, 16]];
  for (const [x0, y0, x1, y1] of base) { const [r, i] = rings(x0, y0, x1, y1, 2.4, 0.9); put(solid(g), prism(P, front, r, i, 0, 4)); }

  let th = REST;
  const T = (p) => {
    const c = Math.cos(th), s = Math.sin(th);
    return P(p[0], p[1] * c + p[2] * s, -p[1] * s + p[2] * c);
  };
  const tube = (a, b, r) => {
    const d = unit([b[0] - a[0], b[1] - a[1], b[2] - a[2]]);
    const u = unit(cross(d, Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0])), v = cross(d, u), pts = [];
    for (let k = 0; k < 14; k++) {
      const q = (k / 14) * Math.PI * 2, o = add(mul(u, r * Math.cos(q)), mul(v, r * Math.sin(q)));
      pts.push(T(add(a, o)), T(add(b, o)));
    }
    return { sil: poly(hull(pts)), crease: "" };
  };
  const block = (x0, y0, x1, y1, z0, z1, r, b) => {
    const ring = rrect(x0, y0, x1, y1, r, 4), inner = rrect(x0 + b, y0 + b, x1 - b, y1 - b, r - b, 4);
    const pts = [];
    for (const q of ring) pts.push(T([q.u, q.v, z0]), T([q.u, q.v, z1]));
    return { sil: poly(hull(pts)), crease: open(inner.map((q) => T([q.u, q.v, z1])).concat([T([inner[0].u, inner[0].v, z1])])) };
  };
  const W = [27, 0, 24], WR = 18, WT = 2.6, K = [4, 0, 13];
  const wheel = (phi) => {
    const pts = [], rim = [];
    for (let k = 0; k < 40; k++) {
      const q = (k / 40) * Math.PI * 2, c = Math.cos(q), s = Math.sin(q);
      pts.push(T([W[0] + WR * c, -WT, W[2] + WR * s]), T([W[0] + WR * c, WT, W[2] + WR * s]));
      rim.push(T([W[0] + (WR - 2.4) * c, WT, W[2] + (WR - 2.4) * s]));
    }
    let cr = open(rim.concat([rim[0]]));
    for (let k = 0; k < 5; k++) {
      const q = phi + (k / 5) * Math.PI * 2;
      cr += open([T([W[0] + 3 * Math.cos(q), WT, W[2] + 3 * Math.sin(q)]), T([W[0] + (WR - 3.4) * Math.cos(q), WT, W[2] + (WR - 3.4) * Math.sin(q)])]);
    }
    return { sil: poly(hull(pts)), crease: cr };
  };
  const arm = (phi, side) => [K[0] + 9 * Math.cos(phi) * side, 5 * side, K[2] + 9 * Math.sin(phi) * side];

  // painted far to near: far pedal, seat post and saddle, frame, flywheel, stem and bars, near pedal
  const S = {};
  for (const n of ["farArm", "farPedal", "post", "saddle", "down", "beam", "wheel", "stem", "bars", "nearArm", "nearPedal"]) S[n] = solid(g);

  let drawn = NaN;
  function draw(a) {
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a; th = a;
    const phi = 0.7 + a * 7;
    const fa = arm(phi, -1), na = arm(phi, 1);
    put(S.farArm, tube([K[0], -4, K[2]], fa, 1.2));
    put(S.farPedal, tube(fa, add(fa, [0, -6, 0]), 1.7));
    put(S.post, tube([-6, 0, 6], [-12, 0, 42], 2.2));
    put(S.saddle, block(-21, -5.5, -3, 5.5, 42, 45.5, 4, 1.2));
    put(S.down, tube([-6, 0, 6], [28, 0, 4], 2.4));
    put(S.beam, tube([-6, 0, 6], [22, 0, 48], 2.6));
    put(S.wheel, wheel(phi * 1.6));
    put(S.stem, tube([22, 0, 46], [24, 0, 58], 1.8));
    put(S.bars, tube([24, -13, 58], [24, 13, 58], 1.8));
    put(S.nearArm, tube([K[0], 4, K[2]], na, 1.2));
    put(S.nearPedal, tube(na, add(na, [0, 6, 0]), 1.7));
  }

  const sp = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let lim = value;
  let over = null;
  function retarget() {
    sp.t = over === null ? REST : clamp(over / 40, -1, 1) * MAX * lim;
    S.wheel.sil.classList.toggle("hi", over === null);
    S.bars.sil.classList.toggle("hi", over !== null);
    const d = Math.round((sp.t * 180) / Math.PI);
    read.textContent = over === null ? "rest" : (d < 0 ? "L" : "R") + String(Math.abs(d)).padStart(2, "0");
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      over = Math.abs(x) > 80 || Math.abs(y) > 80 ? null : y;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(REST);
  retarget();
  return { set: (v) => { lim = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "spinbike",
  means: "A spin bike on a rocker base: the frame leans toward the pointer, crank and flywheel turning with it, the handlebar bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.5],
  tour: [[98, 277], [317, 167], [192, 300], null],
  mount,
});
