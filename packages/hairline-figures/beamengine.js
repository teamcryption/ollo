/**
 * Beam engine: a great beam rocking on a column over a cylinder and a flywheel. Near the pointer the flywheel turns and the beam rocks with it.
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
    const pts = (a) => S.parts.flatMap((p) => { const f = p.xf(a); return [p.z0, p.z1].flatMap((z) => p.ring[0].map((q) => f(q.u, q.v, z))); });
    let ext = [];
    for (let i = 0; i <= 6; i++) ext = ext.concat(pts(S.a0 + ((S.a1 - S.a0) * 1.2 * i) / 6));
    fit(C, ext, 200, 166);
    const P = proj(C), g = mk("g", {}, svg);
    const els = S.parts.map((p) => { const gg = mk("g", {}, g); return { p, sil: mk("path", { class: "sil" }, gg), cr: mk("path", { class: "lo nf" }, gg) }; });
    function draw(a) {
      for (const e of els) {
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
// beam engine: a rocking beam on a column, the piston rod in a cylinder at one end, a connecting rod to a flywheel's crank at the other
const HB = 68, FX = 42, FZ = 34, FR = 24, CR = 12, BL = 40;
const crank = (a) => [FX + CR * Math.sin(a * R), FZ + CR * Math.cos(a * R)];
const tilt = (a) => Math.asin(clampB((crank(a)[1] + 34 - HB) / BL));
function clampB(v) { return Math.max(-1, Math.min(1, v)); }
const endR = (a) => { const b = tilt(a); return [BL * Math.cos(b), HB + BL * Math.sin(b)]; };
const endL = (a) => { const b = tilt(a); return [-BL * Math.cos(b), HB - BL * Math.sin(b)]; };
const XZ = () => (u, v, w) => [u, w, v];
// a rod from A to B in the x-z plane; v runs 0..L0 along it
const rod = (A, B, L0) => (a) => { const p = A(a), q = B(a), dx = q[0] - p[0], dz = q[1] - p[1], L = Math.hypot(dx, dz), k = L / L0;
  return (u, v, w) => [p[0] + (dx / L) * v * k - (dz / L) * u, w, p[1] + (dz / L) * v * k + (dx / L) * u]; };
const spin = (a) => (u, v, w) => [FX + u * Math.cos(a * R) + v * Math.sin(a * R), w, FZ - u * Math.sin(a * R) + v * Math.cos(a * R)];
const beam = (a) => { const b = tilt(a); return (u, v, w) => [u * Math.cos(b) - v * Math.sin(b), w, HB + u * Math.sin(b) + v * Math.cos(b)]; };
const rim = Array.from({ length: 14 }, (_, k) => { const t = (k / 14) * 360;
  return { ring: box(-5.6, FR - 3, 5.6, FR, 1.2, 0), z0: -2.5, z1: 2.5, xf: (a) => { const f = spin(a + t); return f; } }; });
const spokes = Array.from({ length: 6 }, (_, k) => ({ ring: box(-1.3, 3, 1.3, FR - 2.5, 0.6, 0), z0: -1.5, z1: 1.5, xf: (a) => spin(a + k * 60) }));
const SPEC = { S: 1.95, a0: 30, a1: 240, word: "rock", parts: [
  { ring: box(-58, -16, 72, 16, 5, 1.5), z0: 0, z1: 8, xf: ID },
  { ring: disc(-40, 0, 11, 1.4), z0: 8, z1: 44, xf: ID },
  { ring: box(-1.4, 0, 1.4, 30, 0.6, 0), z0: -1.4, z1: 1.4, xf: rod((a) => [endL(a)[0], 40], endL, 30) },
  { ring: box(-5, -7, 5, 7, 2, 1), z0: 8, z1: HB - 4, xf: ID },
  ...spokes,
  { ring: disc(0, 0, 4.5, 1), z0: -4, z1: 4, xf: spin },
  ...rim,
  { ring: box(-2.6, -3, 2.6, CR + 3, 1.6, 0.8), z0: 4, z1: 6.5, xf: spin },
  { ring: box(-1.8, 0, 1.8, 34, 0.8, 0), z0: 6.5, z1: 9, xf: rod((a) => crank(a), endR, 34) },
  { ring: box(-47, -4.5, 47, 4.5, 3, 1.2), z0: -3.5, z1: 3.5, xf: beam, hi: true },
  { ring: disc(0, 0, 3, 0.8), z0: 3.5, z1: 6, xf: () => (u, v, w) => [u, w, HB + v] },
] };

hairline({
  name: "beamengine",
  means: "A beam engine: the great beam rocks on its column as the flywheel turns, crank and rods driving it, when the pointer comes near.",
  rules: [1, 3, 4, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[190, 109], [290, 139], [110, 184], null],
  mount: figure(SPEC),
});
