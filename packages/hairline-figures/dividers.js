/**
 * Chart dividers: a pair of brass dividers standing on a chart, two tapered
 * legs on a round hinge head with a knob. The pointer over them spreads the
 * legs to step off a distance: the tips slide apart across the chart, the head
 * sinks, and a dashed arc marks the span. At rest they stand nearly closed, the
 * right leg bright; the leg nearer the pointer takes the bright. The slider is
 * how wide they spread.
 *
 * The pattern: one part answering (a hinge opening on a tween); the hit is the
 * rest pose's screen box, which never moves.
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rings, open, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 92, TH0 = 9, HR = 7.5, KH = 12;
const thMax = (v) => clamp(14 + 32 * v, 20, 60);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let val = value;
  const C = Cam(45, 0.5, 2.05);
  const sMax = L * Math.sin(rad(60));
  fit(C, [[-sMax - 8, -26, 0], [sMax + 8, 26, 0], [-sMax - 8, 26, 0], [sMax + 8, -26, 0], [0, 0, L * Math.cos(rad(TH0)) + HR + KH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-sMax - 8, -26, sMax + 8, 26, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, -2, 0));
  const arc = mk("path", { class: "nf dash" }, g);
  const tipA = mk("ellipse", { class: "dot m" }, g), tipB = mk("ellipse", { class: "dot m" }, g);
  const legL = mk("path", { class: "sil" }, g), legR = mk("path", { class: "sil" }, g);
  const head = solid(g), knob = solid(g);
  const tw = tween(0);
  let last = "", side = 1, over = false;

  function ring(c, d, r, n = 20) {
    const a = Math.abs(d[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
    let u = [d[1] * a[2] - d[2] * a[1], d[2] * a[0] - d[0] * a[2], d[0] * a[1] - d[1] * a[0]];
    const un = Math.hypot(...u); u = u.map((x) => x / un);
    const w = [d[1] * u[2] - d[2] * u[1], d[2] * u[0] - d[0] * u[2], d[0] * u[1] - d[1] * u[0]];
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, q = (j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * w[j]);
      return P(q(0), q(1), q(2));
    });
  }
  function rod(a, b, ra, rb) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d);
    const u = d.map((x) => x / n);
    return poly(hull(ring(a, u, ra).concat(ring(b, u, rb))));
  }
  const dot = (el, p) => { el.setAttribute("cx", p[0]); el.setAttribute("cy", p[1]); el.setAttribute("rx", 2.6); el.setAttribute("ry", 1.5); };

  function draw(t) {
    const th = rad(TH0 + t * (thMax(val) - TH0)), key = th.toFixed(4) + side;
    if (key === last) return;
    last = key;
    const s = L * Math.sin(th), h = L * Math.cos(th);
    legL.setAttribute("d", rod([0, -1.8, h], [-s, -1.8, 0], 3.4, 0.5));
    legR.setAttribute("d", rod([0, 1.8, h], [s, 1.8, 0], 3.4, 0.5));
    legL.classList.toggle("hi", side < 0); legR.classList.toggle("hi", side > 0);
    dot(tipA, P(-s, -1.8, 0)); dot(tipB, P(s, 1.8, 0));
    const pts = [];
    for (let i = 0; i <= 24; i++) { const a = Math.PI * (i / 24); pts.push(P(-s * Math.cos(a), -s * 0.32 * Math.sin(a), 0)); }
    arc.setAttribute("d", open(pts));
    const hd = circ(HR, 28).map((q) => P(q.u, -3.6, h + q.v)), hn = circ(HR, 28).map((q) => P(q.u, 3.6, h + q.v));
    const nearRing = hn[0][1] > hd[0][1] ? hn : hd, inner = circ(HR - 2, 28).map((q) => P(q.u, nearRing === hn ? 3.6 : -3.6, h + q.v));
    put(head, { sil: poly(hull(hd.concat(hn))), crease: poly(inner) });
    const kr = circ(2.6, 16), kc = circ(1.6, 16);
    put(knob, prism(P, front, kr, kc, h + HR - 1, h + HR + KH));
    read.textContent = over ? `${(2 * s / 10).toFixed(1)} nm` : "rest";
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  // the hit: the box of the rest pose and the chart, in screen units; it never moves
  const box = [P(-sMax - 8, 26, 0), P(sMax + 8, -26, 0), P(-sMax - 8, -26, 0), P(sMax + 8, 26, 0), P(0, 0, L + KH + HR)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const mid = P(0, 0, 0)[0];
  function move([sx, sy]) {
    const inside = sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) - 6 && sy < Math.max(...ys) + 6;
    set(inside, sx < mid ? -1 : 1);
  }
  function set(o, sd) {
    over = o; side = o ? sd : 1;
    tset(tw, o ? 1 : 0, performance.now(), 0);
    last = ""; B.wake();
  }
  bag.add(pointer(stage, { move, leave: () => set(false, 1) }));
  bag.add(() => svg.replaceChildren());
  set(false, 1);
  return { set: (v) => { val = v; last = ""; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "dividers",
  means: "Brass chart dividers on a chart: the pointer spreads the two legs apart to step off a span, and the head sinks.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.4],
  tour: [[212, 143], [180, 170], [240, 210], null],
  mount,
});
