/**
 * Drum pump: a steel drum with a hand pump screwed into its bung, a tall
 * tube, a pump head with a spout and a long lever. The pointer on the floor
 * turns the pump round the bung to point its spout at it, and the lever
 * swings down as it does. At rest the spout points ahead, the lever bright.
 */
const { Cam, clamp, fit, hull, poly, open, proj, seg, unproj, spring, stepS, disposer, mk, pointer, register } = HL;
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
const R = 14, DH = 30, BX = 5;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-24, -24, 0], [24, 24, 0], [24, -24, 0], [-24, 24, 0], [BX, 0, 76], [-24, 0, 76], [24, 0, 76]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const drum = mk("g", {}, g), dsil = mk("path", { class: "sil" }, drum), dcr = mk("path", { class: "nf lo" }, drum);
  const ring = (z, a0 = 0, a1 = Math.PI * 2) => Array.from({ length: 33 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / 32; return P(R * Math.cos(a), R * Math.sin(a), z); });
  dsil.setAttribute("d", poly(hull(ring(0).concat(ring(DH)))));
  dcr.setAttribute("d", poly(ring(DH)) + open(ring(10, -Math.PI / 4, (3 * Math.PI) / 4)) + open(ring(20, -Math.PI / 4, (3 * Math.PI) / 4)) + poly(Array.from({ length: 13 }, (_, i) => P(BX + 2.5 * Math.cos(i / 2), 2.5 * Math.sin(i / 2), DH))));
  const pool = mkPool(g, 5);
  const sp = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;
  function draw(th) {
    if (th === last) return;
    last = th;
    const c = Math.cos(th), s = Math.sin(th), down = Math.min(1, Math.abs(th) / 0.8);
    const T = ([x, y, z]) => [BX + x * c - y * s, x * s + y * c, z];
    const la = 0.45 - down * 0.75, lc = Math.cos(la), ls = Math.sin(la);
    const L = ([x, y, z]) => T([-4 + x * lc, y, 64 - x * ls + z]);
    const ds = [
      { i: 0, ...boxD(P, T, [-1.5, -1.5, DH], [1.5, 1.5, 56]) },
      { i: 1, ...boxD(P, T, [-4, -4, 56], [4, 4, 64]) },
      { i: 2, ...boxD(P, T, [4, -1.2, 58], [16, 1.2, 60.4]) },
      { i: 3, ...boxD(P, T, [-5.5, -2, DH], [5.5, 2, DH + 2.5]) },
      { i: 4, ...boxD(P, L, [-24, -1, -1], [0, 1, 1]) },
    ];
    ds.forEach((d) => { d.d += 200; });
    paint(pool, ds, (i) => i === 4);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { sp.t = 0; read.textContent = "rest"; B.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 0);
    const r = Math.hypot(x - BX, y);
    if (r < 6 || r > 90) return;
    const a = clamp(Math.atan2(y, x - BX), -1.6, 1.6);
    sp.t = a;
    read.textContent = Math.round((a * 180) / Math.PI) + "\u00b0";
    B.wake();
  }
  draw(0); read.textContent = "rest";
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "drumpump",
  means: "A hand pump on a steel drum: it turns round the bung to aim its spout at the pointer, the lever swinging down.",
  rules: [1, 3, 5],
  range: [0.5, 1, 2],
  tour: [[111, 300], [315, 219], [98, 212], null],
  mount,
});
