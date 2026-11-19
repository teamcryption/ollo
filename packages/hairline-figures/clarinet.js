/**
 * Clarinet: a clarinet standing on a three-legged peg stand, bell down, its
 * lower joint, upper joint, barrel and mouthpiece stacked with ring keys
 * down the front. The pointer over it draws the upper joint, barrel and
 * mouthpiece up off the lower tenon, as when taking it apart. At rest the
 * bell is bright. The slider is how far the upper half comes off.
 *
 * The pattern: one object answering as a whole; the hit is the rest pose.
 */
const {
  Cam, clamp, fit, hull, poly, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const S = 1.3, LIFT = 28, LEG = 62;
const SQ = Math.SQRT1_2;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function ring3(c, a, r, n = 18) {
  const h = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [a[1] * h[2] - a[2] * h[1], a[2] * h[0] - a[0] * h[2], a[0] * h[1] - a[1] * h[0]];
  const lu = Math.hypot(...u); u = u.map((q) => q / lu);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  return Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2, c1 = Math.cos(t) * r, s1 = Math.sin(t) * r; return [0, 1, 2].map((j) => c[j] + u[j] * c1 + v[j] * s1); });
}
const cyl = (a, b, r0, r1) => { const d = sub(b, a), l = Math.hypot(...d), ax = d.map((q) => q / l); return ring3(a, ax, r0).concat(ring3(b, ax, r1)); };
const ball = (c, r) => { let o = []; for (let i = -3; i <= 3; i++) { const z = (i / 3) * r; o = o.concat(ring3([c[0], c[1], c[2] + z], [0, 0, 1], Math.sqrt(Math.max(0, r * r - z * z)) + 0.01, 14)); } return o; };
const up = (z0, z1, r0, r1) => cyl([0, 0, z0], [0, 0, z1], r0, r1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-LEG, -LEG, 0], [LEG, LEG, 0], [LEG, -LEG, 0], [-LEG, LEG, 0], [0, 0, 190 + LIFT]], 200, 162);
  const P = proj(C);
  const pp = (pts) => pts.map((q) => P(...q));
  const shape = (pts, parent, cls = "sil") => mk("path", { d: poly(hull(pp(pts))), class: cls }, parent);
  const g = mk("g", {}, svg);
  const legs = [Math.PI / 4 + 2.09, Math.PI / 4 - 2.09, Math.PI / 4];
  const leg = (a) => { const f = [Math.cos(a) * LEG, Math.sin(a) * LEG, 2.5]; shape(cyl([Math.cos(a) * 14, Math.sin(a) * 14, 8], f, 1.8, 1.8), g); shape(ball(f, 3), g); };
  leg(legs[0]); leg(legs[1]);
  // the bell, flaring onto the stand's peg
  const bellPts = [];
  for (let i = 0; i <= 6; i++) { const t = i / 6; bellPts.push(...ring3([0, 0, 8 + t * 20], [0, 0, 1], 6 + 10 * Math.pow(1 - t, 2.2), 24)); }
  const bell = shape(bellPts, g);
  leg(legs[2]);
  // the lower joint with its tenon ring and keys
  shape(up(26, 92, 5.5, 5.5), g);
  const keys = (z0, z1, parent) => {
    let rd = "";
    const off = [SQ * 5.6, SQ * 5.6];
    for (let z = z0; z <= z1; z += 11) {
      const c = ring3([off[0], off[1], z], [SQ, SQ, 0], 2.1, 12).map((q) => P(...q));
      rd += "M" + c.map((p) => p.join(",")).join("L") + "Z";
    }
    const a = P(off[0] - 3.2, off[1] + 3.2, z0 - 4), b = P(off[0] - 3.2, off[1] + 3.2, z1 + 4);
    rd += `M${a[0]},${a[1]}L${b[0]},${b[1]}`;
    mk("path", { d: rd, class: "nf lo" }, parent);
  };
  keys(36, 80, g);
  shape(up(90, 97, 6.6, 6.6), g);
  // the upper half: upper joint, barrel, mouthpiece and reed, which come off together
  const top = mk("g", {}, g);
  const upper = shape(up(97, 150, 5.5, 5.5), top);
  keys(106, 140, top);
  shape(up(148, 155, 6.6, 6.6), top);
  shape(up(155, 172, 6.8, 6.2), top);
  shape(up(172, 190, 5.2, 2.8), top);
  shape(cyl([SQ * 3.6, SQ * 3.6, 176], [SQ * 2.4, SQ * 2.4, 189], 1.4, 1.1), top);
  const lift = tween(0);
  let last = NaN;

  function draw(now) {
    const z = tval(lift, now) * LIFT * amp;
    if (z === last) return;
    last = z;
    const dy = P(0, 0, z)[1] - P(0, 0, 0)[1];
    top.setAttribute("transform", `translate(0 ${dy.toFixed(2)})`);
  }
  const B = register(stage, (_dt, now) => { draw(now); return !tdone(lift, now); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(on) {
    const id = on ? 1 : -1;
    if (id === act) return;
    act = id;
    tset(lift, on ? 1 : 0, performance.now(), 0);
    bell.classList.toggle("hi", !on);
    upper.classList.toggle("hi", on);
    read.textContent = on ? "up " + Math.round(LIFT * amp) : "rest";
    B.wake();
  }
  setActive(false);
  const base = P(0, 0, 0), crown = P(0, 0, 190);
  bag.add(pointer(stage, {
    move: (p) => setActive(Math.abs(p[0] - base[0]) < 34 && p[1] < base[1] + 10 && p[1] > crown[1] - 10),
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 0.2, 1); last = NaN; if (act > 0) read.textContent = "up " + Math.round(LIFT * amp); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "clarinet",
  means: "A clarinet on a peg stand: the pointer draws its upper joint, barrel and mouthpiece up off the lower tenon, as when taking it apart.",
  rules: [1, 4, 5],
  range: [0.3, 0.75, 1],
  tour: [[200, 110], [200, 189], [200, 54], null],
  mount,
});
