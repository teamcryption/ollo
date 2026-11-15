/**
 * Tote crates: three plastic totes stacked under a lid. The pointer picks a
 * crate by its height in the stack; that crate and every one above it slide
 * out to the side together, staggered outward from the picked one, so the
 * stack splits there. At rest the stack stands square, the lid bright.
 */
const { Cam, clamp, fit, hull, poly, proj, seg, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;
function boxD(P, T, a, b) {
  const c = [];
  for (const x of [a[0], b[0]]) for (const y of [a[1], b[1]]) for (const z of [a[2], b[2]]) c.push(T([x, y, z]));
  const s = c.map((p) => P(...p));
  let n = 0, best = -1e9;
  c.forEach((p, i) => { const v = p[0] + p[1] + p[2] * 0.8; if (v > best) { best = v; n = i; } });
  return { sil: poly(hull(s)), cr: seg(s[n], s[n ^ 4]) + seg(s[n], s[n ^ 2]) + seg(s[n], s[n ^ 1]), d: c.reduce((m, p) => m + p[0] + p[1] + p[2] * 0.3, 0) / 8 };
}
function paint(pool, ds, hiTest) {
  ds.sort((a, b) => a.d - b.d).forEach((d, k) => {
    const o = pool[k];
    o.sil.setAttribute("d", d.sil); o.cr.setAttribute("d", d.cr);
    o.sil.classList.toggle("hi", hiTest(d.i));
  });
}
const mkPool = (g, n) => Array.from({ length: n }, () => { const sg = mk("g", {}, g); return { sil: mk("path", { class: "sil" }, sg), cr: mk("path", { class: "nf lo" }, sg) }; });
const N = 3, H = 11, OUT = 22;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4.7);
  fit(C, [[-15, -11, 0], [15 + OUT, 11, 0], [-15, 11, 0], [15 + OUT, -11, 0], [-15, -11, N * H + 2], [15 + OUT, 11, N * H + 2]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const pool = mkPool(g, N * 2 + 1);
  const tw = Array.from({ length: N + 1 }, () => tween(0));
  const I = ([x, y, z]) => [x, y, z];
  let act = -2;
  function draw(now) {
    const ds = [];
    for (let k = 0; k <= N; k++) {
      const dx = tval(tw[k], now), T = ([x, y, z]) => [x + dx, y, z], z0 = k * H;
      if (k < N) {
        ds.push({ i: 2 * k, ...boxD(P, T, [-13.5, -9.5, z0], [13.5, 9.5, z0 + H - 2]) });
        ds.push({ i: 2 * k + 1, ...boxD(P, T, [-15, -11, z0 + H - 2], [15, 11, z0 + H]) });
      } else ds.push({ i: 2 * N, ...boxD(P, T, [-15.5, -11.5, z0], [15.5, 11.5, z0 + 2]) });
    }
    paint(pool, ds, (i) => (act < 0 ? i === 2 * N : Math.floor(i / 2) === act));
  }
  const B = register(stage, (_dt, now) => { draw(now); return tw.some((t) => !tdone(t, now)); });
  bag.add(B.unregister);
  const ys = Array.from({ length: N }, (_, k) => P(0, 0, k * H + H / 2));
  const top = P(0, 0, N * H + 4), bot = P(0, 0, -6);
  function hit([sx, sy]) {
    if (sy < top[1] - 20 || sy > bot[1] + 20 || Math.abs(sx - ys[0][0]) > 90) return -1;
    let b = 0;
    ys.forEach((p, k) => { if (Math.abs(p[1] - sy) < Math.abs(ys[b][1] - sy)) b = k; });
    return b;
  }
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    tw.forEach((t, k) => tset(t, a >= 0 && k >= a ? OUT : 0, now, a >= 0 ? Math.abs(k - a) * 45 * stag : 0));
    read.textContent = a < 0 ? "rest" : "crate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "toteboxes",
  means: "Three stacked tote crates under a lid: the crate under the pointer and all above it slide out sideways, splitting the stack.",
  rules: [1, 2, 3, 5],
  range: [0, 1, 2],
  tour: [[169, 188], [169, 150], [169, 84], null],
  mount,
});
