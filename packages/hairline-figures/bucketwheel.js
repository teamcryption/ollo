/**
 * Bucket wheel excavator: a crawler under a house, a counterweight boom out
 * back and a long digging boom with a bucket wheel at its tip. The pointer's
 * height luffs the boom: up raises the wheel, down sinks it into the cut, and
 * the wheel turns its buckets as it travels. At rest the boom lies slightly
 * raised, one bucket bright. The slider is how far the boom luffs.
 *
 * The pattern: a continuous luff on one spring; the hit is the pointer's
 * height in the frame, which never moves.
 */
const {
  Cam, clamp, fit, fillet, hull, poly, proj, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const V = [0.61, 0.61, 0.5], PIV = [10, 0, 36], LEN = 92, RW = 24, REST = 8, NB = 8;
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const n = Math.hypot(...a) || 1; return a.map((x) => x / n); };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const add = (c, ...ts) => ts.reduce((p, [d, s]) => p.map((x, j) => x + d[j] * s), c);

/** A rounded box on axes ax, ay, az with half sizes h; its crease is the face turned most to us. */
function box(P, c, ax, h) {
  const pts = [];
  for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1]) pts.push(P(...add(c, [ax[0], i * h[0]], [ax[1], j * h[1]], [ax[2], k * h[2]])));
  let best = null, bd = -2;
  for (let a = 0; a < 3; a++) for (const s of [-1, 1]) {
    const d = s * 1, n = ax[a].map((x) => x * d);
    if (dot(n, V) > bd) { bd = dot(n, V); best = [a, s]; }
  }
  const [a, s] = best, b = (a + 1) % 3, e = (a + 2) % 3, q = [];
  for (const [i, j] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) q.push(P(...add(c, [ax[a], s * h[a]], [ax[b], i * h[b] * 0.82], [ax[e], j * h[e] * 0.82])));
  const hl = hull(pts);
  return { sil: poly(fillet(hl, hl.map(() => 2))), crease: poly(fillet(q, q.map(() => 1.5))) };
}

/** A disc along d from c, radius r, thickness len; its crease is the face that looks at us. */
function cyl(P, c, d, r, len, n = 40) {
  const u = nrm(cross(d, Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])), v = cross(u, d);
  const ring = (off, rr) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2;
    return P(...add(c, [d, off], [u, rr * Math.cos(t)], [v, rr * Math.sin(t)]));
  });
  const far = dot(d, V) > 0;
  return { sil: poly(hull(ring(0, r).concat(ring(len, r)))), crease: poly(far ? ring(len, r * 0.42) : ring(0, r * 0.42)) };
}

const X = [1, 0, 0], Y = [0, 1, 0], Z = [0, 0, 1];
const tipAt = (deg) => add(PIV, [[Math.cos(rad(deg)), 0, Math.sin(rad(deg))], LEN]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.68);
  const ext = [[-70, -12, 30], [-70, 12, 46], [-30, -22, 0], [30, 22, 0]];
  for (const a of [REST - 24, REST + 24]) { const t = tipAt(a); ext.push(add(t, [X, 32]), add(t, [X, -32]), add(t, [Z, 32]), add(t, [Z, -32], [Y, 14])); }
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  put(solid(g), box(P, [-40, 0, 41], [X, Y, Z], [24, 3, 2.5]));
  put(solid(g), box(P, [-62, 0, 36], [X, Y, Z], [7, 9, 8]));
  put(solid(g), box(P, [0, 0, 7], [X, Y, Z], [30, 22, 7]));
  put(solid(g), box(P, [-4, 0, 26], [X, Y, Z], [18, 13, 12]));
  const boom = solid(g), wheel = solid(g);
  const buckets = Array.from({ length: NB }, () => solid(g));
  buckets[0].sil.classList.add("hi");
  const luff = spring(REST);
  let amp = value, last = "";

  function draw() {
    const key = luff.x.toFixed(2);
    if (key === last) return;
    last = key;
    const a = rad(luff.x), b = [Math.cos(a), 0, Math.sin(a)], up = cross(Y, b).map((x) => -x);
    put(boom, box(P, add(PIV, [b, LEN / 2]), [b, Y, up], [LEN / 2 + 4, 4, 3.5]));
    const hub = add(tipAt(luff.x), [Y, 6]);
    put(wheel, cyl(P, hub, Y, RW, 6));
    const w = -rad(luff.x - REST) * 5;
    buckets.forEach((s, i) => {
      const f = w + (i / NB) * Math.PI * 2 + 0.4, r = [Math.cos(f), 0, Math.sin(f)], t = [-Math.sin(f), 0, Math.cos(f)];
      put(s, box(P, add(hub, [r, RW + 1], [Y, 3]), [r, t, Y], [5, 4.5, 4.5]));
    });
  }

  const B = register(stage, (dt) => { const m = stepS(luff, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(sy) {
    luff.t = sy == null ? REST : REST + clamp((170 - sy) / 110, -1, 1) * 22 * amp;
    read.textContent = sy == null ? "rest" : `luff ${Math.round(luff.t)}°`;
    B.wake();
  }

  bag.add(pointer(stage, { move: (p) => aim(p[1]), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "bucketwheel",
  means: "A bucket wheel excavator: the pointer's height luffs the long boom up or down, and the bucket wheel turns as it travels.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 60], [200, 300], [200, 20], null],
  mount,
});
