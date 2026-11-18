/**
 * Knitting needles: a ball of yarn on the ground, wound round with strands,
 * a loose end trailing off, and two knobbed needles stuck into its top. The
 * pointer over it swings the needles wide apart, staggered from the side it
 * is on, and the ball turns as if the yarn were pulled. At rest the needles
 * stand in a narrow, uneven V, the left one bright. The slider is the spread.
 *
 * The pattern: one object answering as a whole; the hit is a fixed screen disc.
 */
const {
  Cam, clamp, fit, hull, open, poly, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const R = 28, CZ = R, L = 92, S = 2.2, SQ = Math.SQRT1_2;
const C0 = [0, 0, CZ], RIGHT = [SQ, -SQ, 0], VIEW = [SQ * 0.866, SQ * 0.866, 0.5];
const REST = [-0.3, 0.42], FAV = 0;
const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function ring3(c, a, r, n = 16) {
  const h = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [a[1] * h[2] - a[2] * h[1], a[2] * h[0] - a[0] * h[2], a[0] * h[1] - a[1] * h[0]];
  const lu = Math.hypot(...u); u = u.map((q) => q / lu);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  return Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2, c1 = Math.cos(t) * r, s1 = Math.sin(t) * r; return [0, 1, 2].map((j) => c[j] + u[j] * c1 + v[j] * s1); });
}
const ball = (c, r, n = 6) => { let o = []; for (let i = -n; i <= n; i++) { const z = (i / n) * r; o = o.concat(ring3([c[0], c[1], c[2] + z], [0, 0, 1], Math.sqrt(Math.max(0, r * r - z * z)) + 0.01, 24)); } return o; };
const WRAPS = [[0.3, 0], [1.1, 0.4], [1.2, 1.5], [0.9, 2.6], [1.45, 3.4], [0.7, 4.6]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S);
  const reach = (th) => [0, 1, 2].map((j) => C0[j] + (Math.cos(th) * (j === 2 ? 1 : 0) + Math.sin(th) * RIGHT[j]) * (L + 8));
  fit(C, [[-R, -R, 0], [R + 26, R + 30, 0], [R, -R, 0], [-R, R, 0], reach(-1.3), reach(1.3), reach(0)], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // the loose end, trailing over the ground in front
  const tail = [];
  for (let i = 0; i <= 14; i++) { const t = i / 14; tail.push(P(R * 0.7 + t * 30, R * 0.7 + Math.sin(t * 5) * 6 + t * 18, Math.max(0, 6 - t * 30) + 0.2)); }
  mk("path", { d: open(tail), class: "nf lo" }, g);
  const body = mk("path", { class: "sil", d: poly(hull(ball(C0, R).map((q) => P(...q)))) }, g);
  const wraps = mk("path", { class: "nf lo" }, g);
  const ndl = [0, 1].map((k) => { const grp = mk("g", {}, g); return { k, rod: mk("path", { class: "sil" }, grp), knob: mk("path", { class: "sil" }, grp), th: tween(REST[k]) }; });
  const spin = tween(0);
  let last = "";

  function draw(now) {
    const th = ndl.map((n) => tval(n.th, now)), s = tval(spin, now), key = th.join() + s;
    if (key === last) return;
    last = key;
    let d = "";
    for (const [tilt, az] of WRAPS) {
      const a = az + s, nrm = [Math.sin(tilt) * Math.cos(a), Math.sin(tilt) * Math.sin(a), Math.cos(tilt)];
      const pts = ring3(C0, nrm, R * 0.97, 48);
      let run = [];
      for (let i = 0; i <= 48; i++) {
        const q = pts[i % 48];
        if (dot3([q[0] - C0[0], q[1] - C0[1], q[2] - C0[2]], VIEW) > 2) run.push(P(...q));
        else { if (run.length > 1) d += open(run); run = []; }
      }
      if (run.length > 1) d += open(run);
    }
    wraps.setAttribute("d", d);
    ndl.forEach((n, k) => {
      const dir = [0, 1, 2].map((j) => Math.cos(th[k]) * (j === 2 ? 1 : 0) + Math.sin(th[k]) * RIGHT[j] + (k ? -0.12 : 0.12) * SQ);
      const a = [0, 1, 2].map((j) => C0[j] + dir[j] * 8), b = [0, 1, 2].map((j) => C0[j] + dir[j] * L);
      n.rod.setAttribute("d", poly(hull(ring3(a, dir, 1.2, 12).concat(ring3(b, dir, 2.2, 12)).map((q) => P(...q)))));
      n.knob.setAttribute("d", poly(hull(ball(b, 4.6, 3).map((q) => P(...q)))));
    });
  }

  const B = register(stage, (_dt, now) => { draw(now); return !(ndl.every((n) => tdone(n.th, now)) && tdone(spin, now)); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(side) {
    if (side === act) return;
    act = side;
    const now = performance.now(), on = side >= 0;
    ndl.forEach((n, k) => {
      const open = (0.35 + 0.8 * amp) * (k ? 1 : -1);
      tset(n.th, on ? open : REST[k], now, on ? Math.abs(k - side) * 60 : 0);
      n.rod.classList.toggle("hi", k === (on ? side : FAV));
      n.knob.classList.toggle("hi", k === (on ? side : FAV));
    });
    tset(spin, on ? 1.6 * amp : 0, now, 0);
    read.textContent = on ? (side ? "R " : "L ") + Math.round((0.35 + 0.8 * amp) * 115) + "°" : "rest";
    B.wake();
  }
  setActive(-1);
  const mid = P(...C0), top = P(C0[0], C0[1], CZ + L * 0.6);
  bag.add(pointer(stage, {
    move: (p) => { const dx = p[0] - mid[0]; setActive(Math.abs(dx) < 110 && p[1] > top[1] - 50 && p[1] < mid[1] + 100 ? (dx < 0 ? 0 : 1) : -1); },
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 0.2, 1); const a = act; act = -2; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "knitting",
  means: "A yarn ball with two needles stuck in its top: the pointer swings the needles wide apart and turns the ball as the yarn pulls.",
  rules: [1, 2, 4, 5],
  range: [0.2, 0.6, 1],
  tour: [[170, 150], [235, 160], [200, 200], null],
  mount,
});
