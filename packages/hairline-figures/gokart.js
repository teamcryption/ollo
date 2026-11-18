/**
 * Go-kart: a low tray chassis, a bucket seat, fat rear wheels and a steering
 * wheel on its column. The pointer's side steers: the front wheels turn on
 * their kingpins and the steering wheel turns with them, on a spring. At rest
 * the wheels sit a little off straight, the steering wheel bright. The
 * slider is the steering lock.
 *
 * The pattern: parts turning on an axis, driven by the pointer's x.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RW = 9, FW = 9, REST = 10, SX = 34, SZ = 20, SR = 8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lock = value;
  const C = Cam(45, 0.5, 3.35);
  fit(C, [[-4, -24, 0], [58, 24, 0], [58, -24, 0], [-4, 24, 0], [10, 0, 26], [SX, 0, SZ + SR]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const wheel = (cx, cy, r, w, s) => {
    const d = [Math.cos(s), Math.sin(s)], a = [-d[1], d[0]], pts = [];
    for (let i = 0; i < 24; i++) { const t = (i / 24) * Math.PI * 2; for (const sgn of [-1, 1]) pts.push(P(cx + d[0] * r * Math.cos(t) + a[0] * w * sgn / 2, cy + d[1] * r * Math.cos(t) + a[1] * w * sgn / 2, r + r * Math.sin(t))); }
    return poly(hull(pts));
  };
  const rearFar = mk("path", { class: "sil", d: wheel(8, -17, RW, 8, 0) }, g);
  const ff = mk("path", { class: "sil" }, g);
  const [cr, ci] = rings(-2, -12, 54, 12, 6, 1.6);
  put(solid(g), prism(P, front, cr, ci, 4, 7));
  const [sr, si] = rings(6, -8, 18, 8, 4, 1.4);
  put(solid(g), prism(P, front, sr, si, 7, 22));
  mk("path", { class: "nf lo", d: open([P(SX + 6, 0, 7), P(SX - 1, 0, SZ)]) + open([P(46, -15, 6), P(46, 15, 6)]) }, g);
  const sw = mk("path", { class: "sil hi" }, g), spoke = mk("path", { class: "nf lo" }, g);
  mk("path", { class: "sil", d: wheel(8, 17, RW, 8, 0) }, g);
  const fn = mk("path", { class: "sil" }, g);
  void rearFar;
  // the steering wheel: a ring tilted back toward the driver
  const tilt = rad(55);
  const swp = (r, t) => P(SX + r * Math.cos(t) * Math.cos(tilt), r * Math.sin(t), SZ + r * Math.cos(t) * Math.sin(tilt));
  const ang = spring(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    ff.setAttribute("d", wheel(46, -17, FW, 8, rad(s)));
    fn.setAttribute("d", wheel(46, 17, FW, 8, rad(s)));
    const ring = [], rot = rad(s * 3);
    for (let i = 0; i < 32; i++) ring.push(swp(SR, (i / 32) * Math.PI * 2));
    sw.setAttribute("d", poly(ring));
    spoke.setAttribute("d", open([swp(SR, rot), swp(0, 0), swp(SR, rot + Math.PI)]) + open([swp(0, 0), swp(SR, rot - Math.PI / 2)]));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  function aim(p) {
    const u = p ? clamp((p[0] - 200) / 90, -1, 1) : null;
    ang.t = u === null ? REST : u * lock;
    read.textContent = u === null ? "rest" : "steer " + Math.round(ang.t) + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lock = v; }, destroy: bag.dispose };
}

hairline({
  name: "gokart",
  means: "A go-kart: the front wheels and the steering wheel turn toward the pointer's side, as far as the steering lock allows.",
  rules: [3, 5, 8, 9],
  range: [20, 40, 55],
  tour: [[330, 190], [70, 173], [260, 150], null],
  mount,
});
