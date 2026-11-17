/**
 * Ticket punch: a conductor's punch lying on its side, two long handles hinged at the jaw. Near the pointer the upper handle tilts open on its hinge.
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
const up = (a) => (u, v, w) => [44 - u * Math.cos(a * R) + w * Math.sin(a * R), v, 11 + u * Math.sin(a * R) + w * Math.cos(a * R)];
const SPEC = { S: 3.0, a0: 7, a1: 36, word: "open", hit: [-3, 0, 56, 18, 6], parts: [
  { ring: box(-50, -6, 40, 6, 5, 1.5), z0: 0, z1: 5, xf: ID },
  { ring: box(26, -8, 48, 8, 5, 1.5), z0: 0, z1: 9, xf: ID },
  { ring: disc(38, 0, 2.4, 0), z0: 9, z1: 11, xf: ID },
  { ring: box(-4, -8, 16, 8, 5, 1.5), z0: -2, z1: 5, xf: up },
  { ring: box(0, -6, 88, 6, 5, 1.5), z0: 0, z1: 5, xf: up, hi: true },
] };

hairline({
  name: "ticketpunch",
  means: "A ticket punch: the upper handle tilts open on its hinge at the jaw when the pointer comes near.",
  rules: [1, 3, 4, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[165, 171], [250, 240], [120, 190], null],
  mount: figure(SPEC),
});
