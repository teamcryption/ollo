/**
 * Planetarium projector: a twin-ball star projector on a fork over a round pedestal. Near the pointer the dumbbell tilts on its axle, the lenses turning with the balls.
 *
 * The pattern: one discrete choice (a 700ms tween) moving a hinged or turning
 * part; the hit is the rest pose's outline, which never moves.
 */
const { Cam, fit, proj, rrect, circ, hull, poly, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;
const V = [0.61, 0.61, 0.5], R = Math.PI / 180;
const box = (u0, v0, u1, v1, r, b) => [rrect(u0, v0, u1, v1, r, 4), b ? rrect(u0 + b, v0 + b, u1 - b, v1 - b, Math.max(0.3, r - b), 4) : null];
const disc = (cu, cv, r, b) => [r, r - b].map((q, i) => (i && !b ? null : circ(q, 24).map((s) => ({ ...s, u: s.u + cu, v: s.v + cv }))));
const ID = () => (u, v, w) => [u, v, w];
const rotZ = (a, cx = 0, cy = 0) => (u, v, w) => [cx + u * Math.cos(a * R) - v * Math.sin(a * R), cy + u * Math.sin(a * R) + v * Math.cos(a * R), w];

function figure(S) {
  return function mount({ stage, svg, read }, value) {
    const bag = disposer(), C = Cam(45, 0.5, S.S);
    let amp = value;
    const pts = (a) => S.parts.flatMap((p) => { if (p.pts) return p.pts(a); const f = p.xf(a); return [p.z0, p.z1].flatMap((z) => p.ring[0].map((q) => f(q.u, q.v, z))); });
    let ext = [];
    for (let i = 0; i <= 6; i++) ext = ext.concat(pts(S.a0 + ((S.a1 - S.a0) * 1.2 * i) / 6));
    fit(C, ext, 200, 166);
    const P = proj(C), g = mk("g", {}, svg);
    const els = S.parts.map((p) => { const gg = mk("g", {}, g); return { p, sil: mk("path", { class: "sil" }, gg), cr: mk("path", { class: "lo nf" }, gg) }; });
    function draw(a) {
      for (const e of els) {
        if (e.p.pts) { e.sil.setAttribute("d", poly(hull(e.p.pts(a).map((q) => P(...q))))); continue; }
        const p = e.p, f = p.xf(a), [ring, inner] = p.ring, Q = (z) => (q) => P(...f(q.u, q.v, z));
        if (p.vis && !p.vis(a)) { e.sil.setAttribute("d", ""); e.cr.setAttribute("d", ""); continue; }
        e.sil.setAttribute("d", poly(hull(ring.map(Q(p.z0)).concat(ring.map(Q(p.z1))))));
        if (!inner) continue;
        const A = f(0, 0, p.z0), B = f(0, 0, p.z1), up = (B[0] - A[0]) * V[0] + (B[1] - A[1]) * V[1] + (B[2] - A[2]) * V[2] > 0;
        e.cr.setAttribute("d", poly(inner.map(Q(up ? p.z1 : p.z0))));
      }
    }
    // the hit is the rest pose's outline, grown a little: it never moves with the part
    const H = hull(pts(S.a0).map((q) => P(...q))), cx = H.reduce((s, q) => s + q[0], 0) / H.length, cy = H.reduce((s, q) => s + q[1], 0) / H.length;
    const HG = H.map((q) => [cx + (q[0] - cx) * 1.12, cy + (q[1] - cy) * 1.12]);
    const side = (p, sg) => HG.every((q, i) => { const r = HG[(i + 1) % HG.length]; return sg * ((r[0] - q[0]) * (p[1] - q[1]) - (r[1] - q[1]) * (p[0] - q[0])) >= 0; });
    const inside = (p) => side(p, 1) || side(p, -1);
    for (const e of els) if (e.p.hi) e.sil.classList.add("hi");
    const tw = tween(0);
    let drawn = NaN, on = false;
    const B = register(stage, (_dt, now) => {
      const a = S.a0 + (S.a1 - S.a0) * tval(tw, now) * amp;
      if (a !== drawn) { drawn = a; draw(a); }
      return !tdone(tw, now);
    });
    bag.add(B.unregister);
    const set = (v) => {
      if (v === on) return;
      on = v;
      tset(tw, v ? 1 : 0, performance.now(), 0);
      read.textContent = v ? S.word : "rest";
      B.wake();
    };
    bag.add(pointer(stage, {
      move: (p) => set(inside(p)),
      leave: () => set(false),
    }));
    bag.add(() => svg.replaceChildren());
    read.textContent = "rest";
    return { set: (v) => { amp = v; drawn = NaN; B.wake(); }, destroy: bag.dispose };
  };
}
// a twin-ball star projector: a dumbbell of two lens-studded star balls on a fork, tilting about the fork's axle
const HP = 74, L = 34, RB = 13;
const ax = (a) => [[Math.cos(a * R), 0, Math.sin(a * R)], [0, 1, 0], [-Math.sin(a * R), 0, Math.cos(a * R)]];
const at = (a, s, t, n) => { const [d, e1, e2] = ax(a); return [0, 1, 2].map((j) => (j === 2 ? HP : 0) + d[j] * s + e1[j] * t + e2[j] * n); };
const bar = (a) => (u, v, w) => at(a, w, u, v);
const ballPts = (sg) => (a) => { const c = at(a, sg * L, 0, 0), out = [];
  for (let i = 1; i < 8; i++) for (let k = 0; k < 16; k++) { const th = (i / 8) * Math.PI, ph = (k / 16) * 2 * Math.PI;
    out.push([c[0] + RB * Math.sin(th) * Math.cos(ph), c[1] + RB * Math.sin(th) * Math.sin(ph), c[2] + RB * Math.cos(th)]); }
  return out.concat([[c[0], c[1], c[2] + RB], [c[0], c[1], c[2] - RB]]); };
const DIRS = Array.from({ length: 18 }, (_, i) => { const y = 1 - (2 * (i + 0.5)) / 18, r = Math.sqrt(1 - y * y), t = i * 2.39996; return [y, r * Math.cos(t), r * Math.sin(t)]; });
const nrm = (a, q) => { const [d, e1, e2] = ax(a); return [0, 1, 2].map((j) => d[j] * q[0] + e1[j] * q[1] + e2[j] * q[2]); };
const lens = (sg, q) => ({ ring: disc(0, 0, 2.3, 0.7), z0: RB - 1, z1: RB + 2.2,
  vis: (a) => { const n = nrm(a, q); return n[0] * V[0] + n[1] * V[1] + n[2] * V[2] > 0.25; },
  xf: (a) => { const n = nrm(a, q), c = at(a, sg * L, 0, 0), h = Math.abs(n[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    let p = [n[1] * h[2] - n[2] * h[1], n[2] * h[0] - n[0] * h[2], n[0] * h[1] - n[1] * h[0]]; const pl = Math.hypot(...p); p = p.map((x) => x / pl);
    const b = [n[1] * p[2] - n[2] * p[1], n[2] * p[0] - n[0] * p[2], n[0] * p[1] - n[1] * p[0]];
    return (u, v, w) => [0, 1, 2].map((j) => c[j] + n[j] * w + p[j] * u + b[j] * v); } });
const ball = (sg, hi) => [{ pts: ballPts(sg), hi }, ...DIRS.map((q) => lens(sg, q))];
const SPEC = { S: 2.4, a0: 12, a1: 52, word: "tilt", parts: [
  { ring: disc(0, 0, 26, 2), z0: 0, z1: 6, xf: ID },
  { ring: disc(0, 0, 6, 1.2), z0: 6, z1: 60, xf: ID },
  { ring: box(-4, -17, 4, 17, 2, 1), z0: 58, z1: 63, xf: ID },
  { ring: box(-3, -17, 3, -12, 1.5, 0.8), z0: 63, z1: HP + 4, xf: ID },
  ...ball(-1, false),
  { ring: disc(0, 0, 3.6, 0.8), z0: -L + RB * 0.7, z1: L - RB * 0.7, xf: bar },
  { ring: disc(0, 0, 7.5, 1.4), z0: -10, z1: 10, xf: bar },
  ...ball(1, true),
  { ring: box(-3, 12, 3, 17, 1.5, 0.8), z0: 63, z1: HP + 4, xf: ID },
] };

hairline({
  name: "planetarium",
  means: "A planetarium projector: two lens-studded star balls on a fork, tilting the whole sky over when the pointer comes near.",
  rules: [1, 3, 4, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[250, 117], [267, 74], [200, 225], null],
  mount: figure(SPEC),
});
