/**
 * Platen letterpress: a body holding the upright type bed, a round ink disc
 * on top, a platen hinged at its foot in front of the bed, and a long lever
 * on the near side. The pointer's place in front of the press sets how far
 * the platen swings open, on a spring, and the lever swings back with it. At
 * rest the platen stands half open and the ink disc is bright. The slider is
 * how far the platen can open.
 *
 * The pattern: a continuous input on a spring (terrain), on one hinged part.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, rrect, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = 4, HZ = 16, PH = 50, PT = 4, Y0 = 2, Y1 = 42, LX = -18, LZ = 34, LL = 52, LY = 52, REST = 24;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-34, -4, 0], [HX + PH * Math.sin(rad(78)), Y1, HZ + PH * Math.cos(rad(78))], [-34, 48, 0], [40, 48, 0], [-18, 22, 82], [LX + LL * Math.sin(rad(55)), LY, LZ + LL * Math.cos(rad(55))], [LX - LL * Math.sin(rad(40)), LY, LZ + LL * Math.cos(rad(40))]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g); put(s, prism(P, front, ...rings(x0, y0, x1, y1, r, b), z0, z1)); return s; };

  block(-34, -4, 40, 48, 4, 2, 0, 4);
  block(-32, 0, -8, 44, 4, 1.5, 4, 72);
  block(-8, 3, -2, 41, 2, 1, 14, 68);
  put(solid(g), prism(P, front, disc(-20, 22, 3), disc(-20, 22, 1.5), 72, 76));
  const ink = solid(g);
  put(ink, prism(P, front, disc(-20, 22, 17, 48), disc(-20, 22, 15, 48), 76, 79));
  const plat = solid(g);
  const hub = mk("path", { class: "sil" }, g);
  const lever = mk("path", { class: "nf sil" }, g);
  const ring = rrect(Y0, 0, Y1, PH, 3, 4), inner = rrect(Y0 + 2, 2, Y1 - 2, PH - 2, 2, 4);
  const pt = (dx, y, dz, a) => P(HX + dx * Math.cos(a) + dz * Math.sin(a), y, HZ - dx * Math.sin(a) + dz * Math.cos(a));
  const roundXZ = (x, z, r, y) => { const o = []; for (let i = 0; i < 20; i++) { const t = (i / 20) * 2 * Math.PI; o.push(P(x + r * Math.cos(t), y, z + r * Math.sin(t))); } return o; };
  hub.setAttribute("d", poly(hull(roundXZ(LX, LZ, 5, 44).concat(roundXZ(LX, LZ, 5, LY - 1)))));

  const ang = spring(REST);
  let last = NaN;
  function draw() {
    const d = ang.x;
    if (d === last) return;
    last = d;
    const a = rad(d), pts = [];
    for (const q of ring) pts.push(pt(0, q.u, q.v, a), pt(PT, q.u, q.v, a));
    plat.sil.setAttribute("d", poly(hull(pts)));
    plat.cr.setAttribute("d", poly(inner.map((q) => pt(PT, q.u, q.v, a))));
    const b = rad(50 - d * 1.3), ex = LX + LL * Math.sin(b), ez = LZ + LL * Math.cos(b);
    lever.setAttribute("d", poly(hull(roundXZ(LX, LZ, 3.2, LY).concat(roundXZ(ex, ez, 3.2, LY)))) + poly(hull(roundXZ(ex, ez, 4.5, LY))));
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);

  function setTarget(t, on) {
    ang.t = t;
    ink.sil.classList.toggle("hi", !on);
    plat.sil.classList.toggle("hi", on);
    read.textContent = on ? "open " + Math.round(t) + "°" : "rest";
    B.wake();
  }
  setTarget(REST, false);
  let pp = null;
  const move = (p) => {
    pp = p;
    const [x, y] = unproj(C, p[0], p[1], 40);
    if (x < -50 || x > 80 || y < -30 || y > 80) return setTarget(REST, false);
    setTarget(clamp((x + 20) / 70, 0, 1) * maxA, true);
  };
  bag.add(pointer(stage, { move, leave: () => { pp = null; setTarget(REST, false); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (pp) move(pp); }, destroy: bag.dispose };
}

hairline({
  name: "letterpress",
  means: "A platen letterpress: the platen swings open off the type bed toward the pointer and the side lever swings back.",
  rules: [1, 3, 5, 6],
  range: [30, 55, 78],
  tour: [[291, 173], [200, 128], [262, 158], null],
  mount,
});
