/**
 * Investmentchart: a pie chart built as a thick round cake of five slices of
 * uneven share. The pointer picks a slice by its angle on the rest top: that
 * slice slides out from the centre and rises, and the others close in. At
 * rest the largest share stands a little out, bright. The slider is how far
 * a chosen slice slides out.
 *
 * The pattern: one of many around a centre, picked by angle.
 */
const {
  Cam, fit, fillet, hull, poly, proj, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 62, TH = 12, SH = [0.31, 0.24, 0.19, 0.15, 0.11], A0 = -2.2, FAV = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let out = value;
  const C = Cam(45, 0.5, 2.1);
  const ext = R + 26;
  fit(C, [[-ext, -ext, 0], [ext, ext, 0], [ext, -ext, 0], [-ext, ext, 0], [0, -ext, TH + 10], [-ext, 0, TH + 10]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const guide = [];
  for (let i = 0; i < 48; i++) { const t = (i / 48) * Math.PI * 2; guide.push(P(R * Math.cos(t), R * Math.sin(t), 0)); }
  mk("path", { d: poly(guide), class: "dash nf" }, g);

  const slices = [];
  let a = A0;
  SH.forEach((f, n) => {
    const a0 = a, a1 = a + f * Math.PI * 2, m = (a0 + a1) / 2;
    a = a1;
    slices.push({ n, f, a0, a1, m, s: null, d: tween(0), z: tween(0), last: "" });
  });
  slices.slice().sort((p, q) => Math.cos(p.m) + Math.sin(p.m) - (Math.cos(q.m) + Math.sin(q.m))).forEach((sl) => { sl.s = solid(g); });

  function wedge(sl, r, inset) {
    const cx = inset * Math.cos(sl.m) / Math.sin((sl.a1 - sl.a0) / 2), cy = inset * Math.sin(sl.m) / Math.sin((sl.a1 - sl.a0) / 2);
    const pts = [[cx, cy]], rs = [3];
    const steps = Math.max(4, Math.round((sl.a1 - sl.a0) / 0.09));
    const da = inset / r;
    for (let i = 0; i <= steps; i++) {
      const t = sl.a0 + da + ((sl.a1 - sl.a0 - 2 * da) * i) / steps;
      pts.push([r * Math.cos(t), r * Math.sin(t)]);
      rs.push(i === 0 || i === steps ? 3 : 0);
    }
    return fillet(pts, rs, 3);
  }
  slices.forEach((sl) => { sl.outer = wedge(sl, R, 1.2); sl.inner = wedge(sl, R - 2, 3.2); });

  function draw(sl, d, z) {
    const key = d + "," + z;
    if (key === sl.last) return;
    sl.last = key;
    const ox = d * Math.cos(sl.m), oy = d * Math.sin(sl.m);
    const at = (pts, zz) => pts.map(([x, y]) => P(x + ox, y + oy, zz));
    put(sl.s, { sil: poly(hull(at(sl.outer, z).concat(at(sl.outer, z + TH)))), crease: poly(at(sl.inner, z + TH)) });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const sl of slices) { draw(sl, tval(sl.d, now), tval(sl.z, now)); if (!tdone(sl.d, now) || !tdone(sl.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, TH);
    if (Math.hypot(wx, wy) > R + 14) return -1;
    let t = Math.atan2(wy, wx);
    while (t < A0) t += Math.PI * 2;
    for (const sl of slices) if (t >= sl.a0 && t < sl.a1) return sl.n;
    return -1;
  }

  let act = -2;
  function setActive(i) {
    if (i === act) return;
    const now = performance.now();
    act = i;
    const on = i < 0 ? FAV : i;
    slices.forEach((sl) => {
      const me = sl.n === on;
      tset(sl.d, me ? (i < 0 ? out * 0.45 : out) : 0, now, 0);
      tset(sl.z, me && i >= 0 ? 8 : 0, now, 0);
      sl.s.sil.classList.toggle("hi", me);
    });
    read.textContent = i < 0 ? "rest" : Math.round(SH[i] * 100) + "%";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { out = v; }, destroy: bag.dispose };
}

hairline({
  name: "investmentchart",
  means: "A pie chart of five uneven slices: the slice under the pointer slides out from the centre and rises.",
  rules: [1, 3, 4, 5],
  range: [10, 18, 26],
  tour: [[271, 127], [222, 182], [185, 106], null],
  mount,
});
