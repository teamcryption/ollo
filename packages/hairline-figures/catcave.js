/**
 * Cat cave: a felt dome with a round doorway on a cushion; the dome tips back on its far edge to show the bed.
 * The pattern: one part answers the pointer (hinge).
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rrect, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 0.05, OPEN = 0.62, HINGE = [19,19,0], AXIS = [0.7071,-0.7071,0], BOX = [0,0,82,82,0];
const rr = (x0, y0, x1, y1, r) => rrect(x0, y0, x1, y1, r, 6);
const disc = (x, y, R, n = 32) => circ(R, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const lift = (ring, z) => ring.map((q) => [q.u, q.v, z]);
function rot(p, a) {
  const [kx, ky, kz] = AXIS, c = Math.cos(a), s = Math.sin(a);
  const x = p[0] - HINGE[0], y = p[1] - HINGE[1], z = p[2] - HINGE[2], d = kx * x + ky * y + kz * z;
  const cx = ky * z - kz * y, cy = kz * x - kx * z, cz = kx * y - ky * x;
  return [HINGE[0] + x * c + cx * s + kx * d * (1 - c), HINGE[1] + y * c + cy * s + ky * d * (1 - c), HINGE[2] + z * c + cz * s + kz * d * (1 - c)];
}

function mount({ stage, svg, read }) {
  const bag = disposer();
  const S0 = [];
  const Bx = (ring, inner, z0, z1, o = {}) => S0.push({ box: [ring, inner, z0, z1], w: lift(ring, z0).concat(lift(ring, z1)), cls: o.cls || "sil", mv: o.mv, hi: o.hi });
  const B = (x0, y0, x1, y1, r, z0, z1, o) => Bx(rr(x0, y0, x1, y1, r), rr(x0 + 1.5, y0 + 1.5, x1 - 1.5, y1 - 1.5, Math.max(r - 1.5, 0.5)), z0, z1, o);
  const Cy = (x, y, R, z0, z1, o) => Bx(disc(x, y, R), disc(x, y, R - 1.5), z0, z1, o);
  const Hl = (w, o = {}) => S0.push({ t: "hull", w, cls: o.cls || "sil", mv: o.mv, hi: o.hi });
  const Ln = (w, o = {}) => S0.push({ t: o.loop ? "loop" : "line", w, cls: o.cls || "lo nf", mv: o.mv, hi: o.hi });

  Cy(40, 40, 30, 0, 5);
  Cy(40, 40, 20, 5, 7, { cls: "lo" });
  const R = 30, H = 27, dome = [];
  for (let i = 0; i <= 7; i++) { const t = (i / 7) * (Math.PI / 2); dome.push(...lift(disc(40, 40, R * Math.cos(t), 32), 5 + H * Math.sin(t))); }
  Hl(dome, { mv: true, hi: true });
  const door = [];
  for (let i = 0; i < 28; i++) { const th = (i / 28) * 2 * Math.PI, el = Math.max(0.02, 0.38 + 0.34 * Math.sin(th)), az = Math.PI / 4 + (0.42 * Math.cos(th)) / Math.cos(el);
    door.push([40 + R * Math.cos(el) * Math.cos(az), 40 + R * Math.cos(el) * Math.sin(az), 5 + H * Math.sin(el)]); }
  Ln(door, { mv: true, loop: true, cls: "nf" });
 
  // fit: every static point plus the moving parts at rest and open
  const all = [];
  for (const s of S0) for (const p of s.w) { all.push(s.mv ? rot(p, REST) : p); if (s.mv) all.push(rot(p, OPEN)); }
  let C = Cam(45, 0.5, 1); fit(C, all, 200, 165);
  let P = proj(C), xs = all.map((p) => P(...p));
  const w = Math.max(...xs.map((q) => q[0])) - Math.min(...xs.map((q) => q[0])), h = Math.max(...xs.map((q) => q[1])) - Math.min(...xs.map((q) => q[1]));
  C = Cam(45, 0.5, Math.min(300 / w, 236 / h)); fit(C, all, 200, 165);
  P = proj(C);
  const front = facing(C), g = mk("g", {}, svg);
  for (const s of S0) {
    if (s.box) { s.el = solid(g); put(s.el, prism(P, front, s.box[0], s.box[1], s.box[2], s.box[3])); s.el.sil.classList.add(...s.cls.split(" ")); if (!s.mv) continue; s.el.cr.remove(); s.path = s.el.sil; }
    else s.path = mk("path", { class: s.cls }, g);
    s.draw = (a) => {
      const pts = s.w.map((p) => P(...(s.mv ? rot(p, a) : p)));
      s.path.setAttribute("d", s.t === "line" ? open(pts) : s.t === "loop" ? poly(pts) : poly(hull(pts)));
    };
    s.draw(REST);
  }
  const hiS = S0.filter((s) => s.hi);
  const ang = tween(REST);
  let last = NaN;
  const LOOP = register(stage, (_dt, now) => {
    const a = tval(ang, now);
    if (a !== last) { last = a; for (const s of S0) if (s.mv) s.draw(a); }
    return !tdone(ang, now);
  });
  bag.add(LOOP.unregister);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? OPEN : REST, performance.now(), 0);
    read.textContent = on ? "peek" : "rest";
    LOOP.wake();
  }
  for (const s of hiS) s.path.classList.add("hi");
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, BOX[4]); return x > BOX[0] && x < BOX[2] && y > BOX[1] && y < BOX[3]; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: () => {}, destroy: bag.dispose };
}

hairline({
  name: "catcave",
  means: "A felt cat cave on a cushion: the pointer over it tips the dome back on its far edge to show the bed inside.",
  rules: [1, 4, 5, 8],
  range: [0, 50, 100],
  tour: [[200, 228], [200, 165], [200, 290], null],
  mount,
});
