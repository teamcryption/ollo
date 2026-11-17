/**
 * Pattern wheel: a tailor's tracing wheel, a spiked steel wheel on a fork at
 * the end of a long handle, standing on the pattern paper. The pointer is the
 * hand: the wheel rolls along the line to follow it, spinning as it goes and
 * leaving a dotted trace behind. At rest it waits at the start of a short
 * trace, its wheel bright. The slider is how fast it follows.
 */
const {
  Cam, fit, proj, hull, poly, open, seg, spring, stepS, clamp,
  disposer, mk, pointer, register, unproj,
} = HL;

const RW = 13, X0 = -52, REST = -24, XMAX = 30, HX = -46, HZ = 44;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[X0, 0, 0], [XMAX + RW + 3, 0, 0], [X0 + 8 + HX, 0, RW + HZ], [XMAX + HX, 0, RW + HZ], [XMAX + RW, 0, 2 * RW + 3]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const trail = mk("path", { class: "nf dash" }, g);
  const handle = mk("path", { class: "sil" }, g), ferrule = mk("path", { class: "sil" }, g);
  const spikes = mk("path", { class: "nf sil" }, g), wheel = mk("path", { class: "sil hi" }, g), hub = mk("path", { class: "nf lo" }, g);
  const pos = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  const ringPts = (c, d, r, n = 24) => {
    let u = Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [d[1], -d[0], 0];
    const ul = Math.hypot(...u); u = u.map((x) => x / ul);
    const v = [u[1] * d[2] - u[2] * d[1], u[2] * d[0] - u[0] * d[2], u[0] * d[1] - u[1] * d[0]];
    return Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, q = (j) => c[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
  };
  const tube = (a, b, r0, r1) => {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d), e = d.map((x) => x / n);
    return poly(hull(ringPts(a, e, r0).concat(ringPts(b, e, r1))));
  };
  function draw() {
    if (Math.abs(pos.x - drawn) < 1e-3) return;
    drawn = pos.x;
    const X = pos.x, hc = [X, 0, RW], roll = -X / RW;
    trail.setAttribute("d", open([P(X0, 0, 0), P(X, 0, 0)]));
    const mid = [X + HX * 0.38, 0, RW + HZ * 0.38], top = [X + HX, 0, RW + HZ];
    handle.setAttribute("d", tube(mid, top, 4.2, 5));
    ferrule.setAttribute("d", tube(hc, mid, 2, 3));
    let d = "";
    for (let i = 0; i < 28; i++) {
      const t = roll + (i / 28) * Math.PI * 2, c = Math.cos(t), s = Math.sin(t);
      d += seg(P(X + RW * c, 0, RW + RW * s), P(X + (RW + 3) * c, 0, RW + (RW + 3) * s));
    }
    spikes.setAttribute("d", d);
    wheel.setAttribute("d", tube([X, -1.2, RW], [X, 1.2, RW], RW, RW));
    hub.setAttribute("d", poly(ringPts([X, 1.3, RW], [0, 1, 0], 3, 16)));
  }
  const Bk = register(stage, (dt) => { const m = stepS(pos, dt); draw(); return m; });
  bag.add(Bk.unregister);

  function set(x) {
    pos.t = x == null ? REST : clamp(x, X0 + 8, XMAX);
    read.textContent = x == null ? "rest" : Math.round(pos.t - X0) + " mm";
    Bk.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.abs(y) > 60 || x < X0 - 50 || x > XMAX + 40) return set(null);
      set(x);
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { pos.k = 100 * v; pos.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "pinwheelmeasure",
  means: "A tailor's tracing wheel on pattern paper: it rolls along the line after the pointer, leaving a dotted trace.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[160, 223], [292, 289], [230, 254], null],
  mount,
});
