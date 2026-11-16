/**
 * Eyelettool: a bench eyelet press, a column on a base plate with a die head
 * and a long lever. The pointer pulls the lever down by how low it stands;
 * the punch drops to the die. At rest the lever is raised, bright. The
 * slider is the lever's swing.
 *
 * The pattern: one part following the pointer (swing).
 */
const { Cam, circ, rrect, fit, hull, poly, proj, clamp, spring, stepS, mk, pointer, register, disposer } = HL;

const rot = (p, o, a) => { const x = p[0] - o[0], z = p[2] - o[2], c = Math.cos(a), s = Math.sin(a); return [o[0] + x * c - z * s, p[1], o[2] + x * s + z * c]; };
const lev = (r, x, y, z, n = 24) => circ(r, n).map((q) => [x + q.u, y + q.v, z]);
const box = (x0, y0, x1, y1, z0, z1, r = 3) => { const g = rrect(x0, y0, x1, y1, r, 6); return g.map((q) => [q.u, q.v, z0]).concat(g.map((q) => [q.u, q.v, z1])); };
const PIV = [-8, 0, 58], UP = 0.75;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sw = value;
  const C = Cam(45, 0.5, 2.25);
  const ext = [[-40, -24, 0], [40, 24, 0], [40, -24, 0], [-40, 24, 0], rot([62, 0, 58], PIV, UP), rot([62, 0, 58], PIV, -0.35)];
  fit(C, ext, 200, 160);
  const P = proj(C), T = (p) => P(...p);
  const g = mk("g", {}, svg);
  const path = (pts, cls = "sil") => { const e = mk("path", { class: cls }, g); e.setAttribute("d", poly(hull(pts.map(T)))); return e; };
  path(box(-40, -24, 40, 24, 0, 6, 6));
  mk("path", { class: "nf lo", d: poly(rrect(-37, -21, 37, 21, 4, 6).map((q) => T([q.u, q.v, 6]))) }, g);
  path(box(-30, -9, -14, 9, 6, 64, 4));
  path(lev(7, 6, 0, 6).concat(lev(7, 6, 0, 12)));
  path(box(-32, -11, 14, 11, 52, 66, 5));
  const punch = mk("path", { class: "sil" }, g);
  const lg = mk("g", {}, g);
  const bar = mk("path", { class: "sil hi" }, lg), knob = mk("path", { class: "sil hi" }, lg);
  const sp = spring(UP);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const drop = clamp((a - UP) / (-0.35 - UP), 0, 1) * 30;
    punch.setAttribute("d", poly(hull(lev(3, 6, 0, 22 - drop + 30).concat(lev(3, 6, 0, 52)).map(T))));
    const R = (p) => T(rot(p, PIV, a));
    const bp = []; for (const x of [-12, 56]) for (const z of [55, 61]) for (const y of [-3, 3]) bp.push(R([x, y, z]));
    bar.setAttribute("d", poly(hull(bp)));
    knob.setAttribute("d", poly(hull([...lev(7, 64, 0, 52), ...lev(7, 64, 0, 64), ...lev(4.5, 64, 0, 48), ...lev(4.5, 64, 0, 68)].map(R))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const hi = T(rot([62, 0, 58], PIV, UP)), lo = T(rot([62, 0, 58], PIV, -0.35));
  function aim(p) {
    const inside = p && p[0] > Math.min(hi[0], lo[0]) - 70 && p[0] < Math.max(hi[0], lo[0]) + 40 && p[1] > hi[1] - 30 && p[1] < lo[1] + 60;
    const t = inside ? clamp((p[1] - hi[1]) / (lo[1] - hi[1]), 0, 1) : null;
    sp.t = t === null ? UP : UP + t * (-0.35 - UP) * (sw / 100);
    read.textContent = t === null ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sw = v; }, destroy: bag.dispose };
}

hairline({
  name: "eyelettool",
  means: "A bench eyelet press: the long lever swings down as the pointer drops, and the punch comes down to the die.",
  rules: [1, 3, 4, 5],
  range: [50, 100, 100],
  tour: [[299, 192], [299, 94], [299, 150], null],
  mount,
});
