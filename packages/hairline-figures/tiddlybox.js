/**
 * Game timer: a sand glass between two square plates on four posts. The
 * pointer's x turns the whole timer over, and the sand runs to whichever
 * bulb is down. The sand is the bright mark.
 */
const { Cam, fit, proj, hull, poly, rrect, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;
const ZC = 42, S = 2.3, K = [Math.SQRT1_2, Math.SQRT1_2, 0];
const ring = (r, z, n = 28) => { const o = []; for (let k = 0; k < n; k++) { const t = (k / n) * 2 * Math.PI; o.push([r * Math.cos(t), r * Math.sin(t), z]); } return o; };
const sq = (z) => rrect(-22, -22, 22, 22, 5, 4).map((q) => [q.u, q.v, z]);
const dep = (p) => (p[0] + p[1]) * 0.61 + p[2] * 0.5;
const POSTS = [[-17, -17], [17, -17], [-17, 17], [17, 17]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let span = rad(value);
  const C = Cam(45, 0.5, S);
  fit(C, [[-36, -36, ZC - 52], [36, 36, ZC + 52], [36, -36, ZC], [-36, 36, ZC]], 200, 160);
  const P = proj(C), REST = 0.3;
  const th = spring(REST, { k: 60, c: 14 });
  const rot = (p, a) => {
    const [x, y, z] = [p[0], p[1], p[2] - ZC], c = Math.cos(a), s = Math.sin(a), d = K[0] * x + K[1] * y;
    const cx = [K[1] * z, -K[0] * z, K[0] * y - K[1] * x];
    return [x * c + cx[0] * s + K[0] * d * (1 - c), y * c + cx[1] * s + K[1] * d * (1 - c), z * c + cx[2] * s + ZC];
  };
  const g = mk("g", {}, svg);
  const parts = [];
  const add = (cls, fn) => { const el = mk("path", { class: cls }, g); parts.push({ el, fn }); return el; };
  add("sil", () => sq(0).concat(sq(5)));
  add("sil", () => sq(79).concat(sq(84)));
  POSTS.forEach(([x, y]) => add("sil", () => ring(2, 5, 10).concat(ring(2, 79, 10)).map((p) => [p[0] + x, p[1] + y, p[2]])));
  add("nf", () => ring(15, 5).concat(ring(2.5, ZC)));
  add("nf", () => ring(2.5, ZC).concat(ring(15, 79)));
  const sA = add("sil hi", () => null), sB = add("sil hi", () => null);
  let last = NaN;
  function draw() {
    const a = th.x; if (a === last) return; last = a;
    const f = (1 + Math.cos(a)) / 2, hA = 20 * f, hB = 20 * (1 - f);
    const L = [];
    for (const p of parts) {
      let pts = p.fn();
      if (p.el === sA) pts = hA > 0.6 ? ring(14, 5.5).concat(ring(14 - hA * 0.33, 5.5 + hA)) : null;
      if (p.el === sB) pts = hB > 0.6 ? ring(14, 78.5).concat(ring(14 - hB * 0.33, 78.5 - hB)) : null;
      if (!pts) { p.el.setAttribute("d", ""); L.push([-1e9, p.el]); continue; }
      const w = pts.map((q) => rot(q, a));
      p.el.setAttribute("d", poly(hull(w.map((q) => P(q[0], q[1], q[2])))));
      L.push([w.reduce((s, q) => s + dep(q), 0) / w.length + (p.el === sA || p.el === sB ? -2 : 0), p.el]);
    }
    L.sort((x, y) => x[0] - y[0]).forEach(([, el]) => g.appendChild(el));
    read.textContent = th.t === REST ? "rest" : Math.round(100 * (1 - f)) + "%";
  }
  const B = register(stage, (dt) => { const m = stepS(th, dt); draw(); return m; });
  bag.add(B.unregister);
  const go = (t) => { th.t = t; B.wake(); };
  go(REST);
  bag.add(pointer(stage, { move: ([sx]) => go(REST + clamp((sx - 80) / 240, 0, 1) * span), leave: () => go(REST) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { span = rad(v); }, destroy: bag.dispose };
}

hairline({
  name: "tiddlybox",
  means: "A sand game timer in a frame: the pointer's x turns it over and the sand runs into the lower bulb.",
  rules: [3, 4, 5, 8],
  range: [90, 160, 180],
  tour: [[120, 160], [300, 160], [220, 160], null],
  mount,
});
