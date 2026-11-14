/**
 * Wipers: a windscreen lying back on its cowl, two wiper blades parked along
 * its lower edge on their pivots. The pointer over the glass swings both
 * blades round to point at it, together, on a spring. At rest they lie
 * slightly raised off the edge, the driver's blade bright. The slider is the
 * blade length.
 *
 * The pattern: parts turning to face the pointer.
 */
const {
  Cam, circ, clamp, fit, facing, prism, proj, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GX0 = -8, GX1 = 128, GY0 = 0, GY1 = 66, PY = 62, PIV = [20, 76], REST = 14, GZ = 4;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function bar(px, a, L, w) {
  const d = [Math.cos(a), -Math.sin(a)], n = [Math.sin(a), Math.cos(a)];
  const tf = (ring) => ring.map((q) => ({ u: px + q.u * d[0] + q.v * n[0], v: PY + q.u * d[1] + q.v * n[1], nu: q.nu * d[0] + q.nv * n[0], nv: q.nu * d[1] + q.nv * n[1] }));
  return [tf(rrect(-2, -w / 2, L, w / 2, w / 2, 4)), tf(rrect(-1.4, -w / 2 + 0.6, L - 0.6, w / 2 - 0.6, w / 2 - 0.6, 4))];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[GX0, GY0, 0], [GX1, GY1 + 8, 0], [GX1, GY0, 0], [GX0, GY1 + 8, 0], [GX0, GY0, GZ + 3]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(GX0, GY0, GX1, GY1, 12, 2.2);
  put(solid(g), prism(P, front, gr, gi, 0, GZ));
  const [cr, ci] = rings(GX0 + 4, GY1 - 1, GX1 - 4, GY1 + 8, 3, 1.2);
  put(solid(g), prism(P, front, cr, ci, 0, GZ - 1));
  const blades = PIV.map((px, i) => {
    const s = solid(g);
    s.sil.classList.add("sil");
    const cap = solid(g);
    put(cap, prism(P, front, disc(px, PY, 3.2), disc(px, PY, 2.2), GZ, GZ + 3));
    return { px, s, cap, i };
  });
  blades[0].s.sil.classList.add("hi");

  const ang = spring(REST);
  let last = NaN, lastL = NaN;
  function draw() {
    if (ang.x === last && len === lastL) return;
    last = ang.x; lastL = len;
    for (const b of blades) {
      const [r, ri] = bar(b.px, (ang.x * Math.PI) / 180, len, 4);
      put(b.s, prism(P, front, r, ri, GZ + 0.6, GZ + 2.2));
      b.s.g.after(b.cap.g);
    }
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  function aim(sx, sy) {
    const [wx, wy] = unproj(C, sx, sy, GZ);
    if (wx < GX0 - 10 || wx > GX1 + 10 || wy < GY0 - 10 || wy > GY1 + 10) return leave();
    const a = clamp((Math.atan2(PY - wy, wx - PIV[0]) * 180) / Math.PI, 0, 120);
    ang.t = a;
    read.textContent = Math.round(a) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move: ([x, y]) => aim(x, y), leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "wipers",
  means: "A windscreen with two wiper blades: both swing round on their pivots to point at the pointer, and fall back near the edge.",
  rules: [1, 3, 5, 8],
  range: [36, 48, 54],
  tour: [[130, 128], [196, 140], [250, 190], null],
  mount,
});
