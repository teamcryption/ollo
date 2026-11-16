const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;
const V = [0.612, 0.612, 0.5], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const crs = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nrm = (a) => { const l = Math.hypot(...a) || 1; return a.map((x) => x / l); };
const at = (c, d, s) => [0, 1, 2].map((j) => c[j] + d[j] * s);
function ring3(c, d, r) {
  const u = nrm(crs(d, Math.abs(d[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1])), v = crs(u, d);
  return Array.from({ length: 28 }, (_, i) => {
    const t = (i / 28) * Math.PI * 2, n = [0, 1, 2].map((j) => Math.cos(t) * u[j] + Math.sin(t) * v[j]);
    return { p: at(c, n, r), n };
  });
}
const tube = (P, c, d, len, r0, r1) => poly(hull(ring3(c, d, r0).concat(ring3(at(c, d, len), d, r1)).map((q) => P(...q.p))));
const cap = (P, c, d, r) => (dot(d, V) > 0 ? poly(ring3(c, d, r).map((q) => P(...q.p))) : "");
const arc = (P, c, d, r) => open(run(ring3(c, d, r), (q) => dot(q.n, V) > 0).map((q) => P(...q.p)));

/** Xylophone mallets: four mallets in a pot stand; the one facing the pointer leans out to offer itself. */
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-60, -60, 0], [60, 60, 0], [-60, 60, 0], [60, -60, 0], [0, 0, 104]], 200, 160);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(15, 48), circ(13, 48), 0, 30));
  const PH = [30, 120, 210, 300], REST = [14, 26, 10, 18];
  const ms = PH.map((ph, i) => {
    const el = mk("g", {}, g);
    return { ph, i, el, st: mk("path", { class: "sil" }, el), hd: mk("path", { class: "sil" }, el), th: spring(REST[i], { k: 100 * value, c: 18 * Math.sqrt(value) }), last: "" };
  });
  function draw() {
    const order = [];
    for (const m of ms) {
      const a = (m.th.x * Math.PI) / 180, f = (m.ph * Math.PI) / 180;
      const d = [Math.sin(a) * Math.cos(f), Math.sin(a) * Math.sin(f), Math.cos(a)];
      const b = [4 * Math.cos(f), 4 * Math.sin(f), 4], s0 = (30 - 4) / d[2], hc = at(b, d, 80);
      order.push([hc[0] + hc[1], m]);
      const key = m.th.x.toFixed(2); if (key === m.last) continue; m.last = key;
      m.st.setAttribute("d", tube(P, at(b, d, s0), d, 80 - s0, 1.5, 1.5));
      m.hd.setAttribute("d", tube(P, at(hc, d, -2), d, 13, 6.5, 6.5) + cap(P, at(hc, d, 11), d, 6.5));
    }
    order.sort((p, q) => p[0] - q[0]).forEach(([, m]) => g.append(m.el));
  }
  const B = register(stage, (dt) => { let mv = false; for (const m of ms) mv = stepS(m.th, dt) || mv; draw(); return mv; });
  bag.add(B.unregister);
  function pick(k) {
    ms.forEach((m) => { m.th.t = k < 0 ? REST[m.i] : m.i === k ? 38 : 8; m.hd.classList.toggle("hi", m.i === (k < 0 ? 1 : k)); });
    read.textContent = k < 0 ? "rest" : "no " + (k + 1);
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (Math.hypot(x, y) > 130) return pick(-1);
      const f = (Math.atan2(y, x) * 180) / Math.PI;
      let k = 0, bd = 999;
      PH.forEach((ph, i) => { const dd = Math.abs(((f - ph + 540) % 360) - 180); if (dd < bd) { bd = dd; k = i; } });
      pick(k);
    },
    leave: () => pick(-1),
  }));
  bag.add(() => svg.replaceChildren());
  pick(-1);
  return { set: (v) => ms.forEach((m) => { m.th.k = 100 * v; m.th.c = 18 * Math.sqrt(v); }), destroy: bag.dispose };
}

hairline({
  name: "kazoo",
  means: "Four xylophone mallets in a pot stand: the one facing the pointer leans out, the others settle back.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 264], [120, 200], [280, 200], null],
  mount,
});
