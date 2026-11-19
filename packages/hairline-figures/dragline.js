/**
 * Dragline excavator: a walking dragline on its round tub, the house with
 * its A-frame, the long boom held up by its pendant, and the bucket hanging
 * from the hoist rope and pulled by the drag rope. Over the machine the house
 * swings round on the 700ms ease while the bucket is dragged in and hoisted;
 * leaving swings it back with the bucket out on the ground, bright. The
 * slider is how far the house swings.
 *
 * The pattern: one part answering a discrete choice (tween); the boom is
 * painted behind the house once it swings to the far side.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, seg, prism, proj, rings, rrect, clamp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid,
} = HL;

const YR = -20, EL = 32, L = 96;
const norm = (v) => { const n = Math.hypot(...v) || 1; return v.map((x) => x / n); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const add = (a, d, s) => a.map((x, j) => x + d[j] * s);
const turn = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };

function beam(P, a, d, len, w, h, r, b) {
  d = norm(d);
  const e1 = norm(cross([0, 0, 1], d)), e2 = cross(d, e1);
  const at = (ring, s) => ring.map((q) => { const p = [0, 1, 2].map((j) => a[j] + d[j] * s + e1[j] * q.u + e2[j] * q.v); return P(p[0], p[1], p[2]); });
  const R = rrect(-w / 2, -h / 2, w / 2, h / 2, r, 4), I = rrect(-w / 2 + b, -h / 2 + b, w / 2 - b, h / 2 - b, Math.max(0.3, r - b), 4);
  return { sil: poly(hull(at(R, 0).concat(at(R, len)))), crease: poly(at(I, len)) };
}

function pose(t, top) {
  const a = rad(YR - top * t), c = Math.cos(a), s = Math.sin(a), at = (u, z) => [u * c, u * s, z];
  const d = [Math.cos(rad(EL)) * c, Math.cos(rad(EL)) * s, Math.sin(rad(EL))], R = at(14, 12), T = add(R, d, L);
  const D = 94 - 40 * t, bz = 2 + 22 * t;
  return { a, at, d, R, T, K: at(D, bz), D };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value, on = false;
  const C = Cam(45, 0.5, 2.1);
  const pts = [[-28, -28, 0], [28, 28, 0], [28, -28, 0], [-28, 28, 0]];
  for (const v of [50, 100]) for (const t of [0, 0.5, 1]) { const q = pose(t, v); pts.push(q.T, q.K, add(q.K, [0, 0, -2], 1)); }
  fit(C, pts, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(26, 64), circ(24.6, 64), 0, 5));
  const back = mk("g", {}, g), house = mk("g", {}, g), fore = mk("g", {}, g);
  const boomG = mk("g", {}, fore);
  const hb = solid(house), cab = solid(house);
  const frame = mk("path", { class: "nf sil" }, house);
  const boom = solid(boomG), lace = mk("path", { class: "lo nf" }, boomG), pend = mk("path", { class: "lo nf" }, boomG);
  const ropes = mk("path", { class: "nf" }, boomG), bucket = solid(boomG);
  bucket.sil.classList.add("hi");
  const sheave = mk("circle", { class: "dot m", r: 2.2 }, boomG);
  const HB = rings(-24, -15, 18, 15, 4, 1.4), CB = rings(8, 4, 20, 14, 2.5, 1);

  const sw = tween(0);
  let last = NaN, behind = null;
  function draw(t) {
    if (t === last) return;
    last = t;
    const { a, at, d, R, T, K } = pose(t, top), u = [Math.cos(a), Math.sin(a), 0];
    put(hb, prism(P, front, turn(HB[0], a), turn(HB[1], a), 5, 24));
    put(cab, prism(P, front, turn(CB[0], a), turn(CB[1], a), 24, 32));
    const M = at(-14, 44);
    frame.setAttribute("d", seg(P(...at(-4, 24)), P(...M)) + seg(P(...at(-22, 24)), P(...M)));
    put(boom, beam(P, R, d, L, 5, 5, 1.8, 0.9));
    const z = [];
    for (let i = 1; i < 16; i++) z.push(P(...add(R, d, (i / 16) * L).map((x, j) => x + (j === 2 ? (i % 2 ? 2 : -2) : 0))));
    lace.setAttribute("d", open(z));
    pend.setAttribute("d", seg(P(...M), P(...add(T, [0, 0, 2], 1))));
    const B0 = add(K, u, -6), B1 = add(K, u, 8);
    ropes.setAttribute("d", seg(P(...T), P(...add(K, [0, 0, 9], 1))) + seg(P(...at(18, 9)), P(...add(B0, [0, 0, 4], 1))));
    put(bucket, beam(P, add(B1, [0, 0, 4], 1), u.map((x) => -x), 15, 13, 9, 3, 1.3));
    const [sx, sy] = P(...T);
    sheave.setAttribute("cx", sx); sheave.setAttribute("cy", sy);
    const b = Math.cos(a) + Math.sin(a) < -0.2;
    if (b !== behind) { behind = b; (b ? back : fore).append(boomG); }
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  const sp = pts.map((p) => P(...p)), X0 = Math.min(...sp.map((p) => p[0])) - 10, X1 = Math.max(...sp.map((p) => p[0])) + 10;
  const Y0 = Math.min(...sp.map((p) => p[1])) - 10, Y1 = Math.max(...sp.map((p) => p[1])) + 10;
  const say = () => { read.textContent = "swing " + Math.round(top) + "°"; };
  function move([sx, sy]) {
    if (sx < X0 || sx > X1 || sy < Y0 || sy > Y1) return leave();
    on = true;
    tset(sw, 1, performance.now(), 0);
    say();
    B.wake();
  }
  function leave() { on = false; tset(sw, 0, performance.now(), 0); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { top = clamp(v, 50, 100); last = NaN; if (on) say(); B.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dragline",
  means: "A dragline on its tub: over it the house swings round as the bucket is dragged in and hoisted; the slider sets the swing.",
  rules: [3, 5, 6, 8],
  range: [50, 75, 100],
  tour: [[141, 201], [165, 192], [122, 206], null],
  mount,
});
