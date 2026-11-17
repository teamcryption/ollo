/**
 * Pan tilt head: a pan servo standing on the bench, a turntable on its shaft,
 * a U-bracket rising from the turntable and, held between its arms, a small
 * camera block with its lens. The pointer over the head aims it: the bracket
 * pans round and the camera tilts up on its axle. At rest the camera looks a
 * little off to one side, bright. The slider is how far the head swings.
 *
 * The pattern: nested turns, a pan about z carrying a tilt about y.
 */
const { Cam, fit, facing, circ, hull, poly, prism, proj, rad, rings, rrect, tset, tval, tdone, tween, disposer, flatDot, mk, place, pointer, put, register, solid } = HL;

const AZ = 38;
// [ring, extrusion range, mapping (u, v, w) -> local x, y, z]
const box = (x0, y0, x1, y1, z0, z1, r) => ({ ring: rrect(x0, y0, x1, y1, r, 4), inner: rrect(x0 + 1.4, y0 + 1.4, x1 - 1.4, y1 - 1.4, r - 1, 4), w: [z0, z1], map: (u, v, w) => [u, v, w] });
const side = (y, x0, x1, z0, z1) => ({ ring: rrect(x0, z0, x1, z1, 2.5, 4), inner: null, w: [y - 1, y + 1], map: (u, v, w) => [u, w, v] });
const lens = { ring: circ(5.2, 20), inner: circ(3.8, 20), w: [13, 20], map: (u, v, w) => [w, u, AZ + v] };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 4.4);
  fit(C, [[-17, -13, 0], [17, 13, 0], [-17, 13, 0], [17, -13, 0], [-22, -22, 50], [22, 22, 50], [-22, 22, 30], [22, -22, 30], [0, 0, 56]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-15, -11, 15, 11, 3, 1.4);
  put(solid(g), prism(P, front, sr, null, 0, 13));
  put(solid(g), prism(P, front, rings(-19, -5, 19, 5, 2, 1)[0], rings(-19, -5, 19, 5, 2, 1)[1], 13, 15));
  for (const x of [-16.5, 16.5]) place(flatDot(g, C, 1, "dot off"), P(x, 0, 15));
  put(solid(g), prism(P, front, sr, si, 15, 19));

  const parts = [
    { s: box(-13, -14, 13, 14, 19, 22, 12) },
    { s: side(-13, -5, 5, 21, 42), z: 1 },
    { s: side(13, -5, 5, 21, 42), z: 1 },
    { s: box(-11, -9, 13, 9, AZ - 7, AZ + 7, 3), tilt: true, hi: true },
    { s: lens, tilt: true },
  ];
  for (const p of parts) { p.el = solid(g); if (p.hi) p.el.sil.classList.add("hi"); }
  const axle = [flatDot(g, C, 1.2, "dot m"), flatDot(g, C, 1.2, "dot m")];

  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const pa = rad(12 + 80 * amp * t), ta = rad(8 + 32 * amp * t);
    const cp = Math.cos(pa), sp = Math.sin(pa), ct = Math.cos(ta), st = Math.sin(ta);
    const W = ([x, y, z], tl) => {
      if (tl) { const dz = z - AZ; [x, z] = [x * ct - dz * st, AZ + x * st + dz * ct]; }
      return [x * cp - y * sp, x * sp + y * cp, z];
    };
    const depth = [];
    for (const p of parts) {
      const { ring, inner, w, map } = p.s;
      const pts = [];
      for (const ww of w) for (const q of ring) pts.push(P(...W(map(q.u, q.v, ww), p.tilt)));
      p.el.sil.setAttribute("d", poly(hull(pts)));
      p.el.cr.setAttribute("d", inner ? poly(inner.map((q) => P(...W(map(q.u, q.v, w[1]), p.tilt)))) : "");
      const c = W(map(0, p.s === lens ? 0 : (p.s.ring[0].v + p.s.ring[8].v) / 2, (w[0] + w[1]) / 2), p.tilt);
      depth.push([c[0] + c[1] + (p.s === lens ? 0 : 0), p]);
    }
    const [base, ...rest] = depth;
    rest.sort((a, b) => a[0] - b[0]);
    let prev = base[1].el.g;
    for (const [, p] of rest) { prev.after(p.el.g); prev = p.el.g; }
    [-14.5, 14.5].forEach((y, i) => place(axle[i], P(...W([0, y, AZ], false))));
    for (let i = 0; i < 2; i++) parts[1 + i].el.g.after(axle[i]);
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, 25);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "aim" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 140 && Math.abs(sy - mid[1]) < 120), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; draw(tval(tw, performance.now())); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pantilt",
  means: "A pan tilt head on its servo: the pointer aims it, the bracket panning round and the camera tilting up between its arms.",
  rules: [1, 4, 5, 6, 8],
  range: [0.4, 1, 1.3],
  tour: [[200, 101], [150, 170], [262, 151], null],
  mount,
});
