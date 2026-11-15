/**
 * Spectroscope: a round stand with a prism on its centre table, a fixed
 * collimator tube with its slit at the back, and a telescope arm with an
 * eyepiece that swings round the table. The pointer's bearing swings the
 * telescope to face it; leaving swings it back. The telescope is the bright
 * mark. The slider is its rest bearing.
 *
 * The pattern: a part turning to face the pointer (swing).
 */
const {
  Cam, fit, facing, circ, clamp, fillet, hull, poly, prism, proj, rad, ringAt, unproj, spring, stepS, r2,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZT = 40, AC = rad(215), LO = rad(60), HI = rad(300);
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restB = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-62, -62, 0], [62, 62, 0], [62, -62, 0], [-62, 62, 0], [0, 0, ZT + 12]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 30, 48), disc(0, 0, 28, 48), 0, 5));
  const layer = mk("g", {}, g);
  // a tube lying level at height z, along bearing a, from radius r0 to r1
  function tube(a, r0, r1, R, z) {
    const c = Math.cos(a), s = Math.sin(a), end = (d) => {
      const out = [];
      for (let k = 0; k < 16; k++) { const f = (k / 16) * 2 * Math.PI; out.push(P(d * c - R * Math.cos(f) * s, d * s + R * Math.cos(f) * c, z + R * Math.sin(f))); }
      return out;
    };
    return { sil: poly(hull(end(r0).concat(end(r1)))), rim: poly(end(r1)) };
  }
  function arm(a, len, R) {
    const grp = mk("g", {}, layer), post = solid(grp), t = solid(grp), eye = solid(grp);
    return { grp, post, t, eye, a, len, R };
  }
  function drawArm(m, a) {
    const c = Math.cos(a), s = Math.sin(a);
    put(m.post, prism(P, front, disc(25 * c, 25 * s, 2.4, 12), disc(25 * c, 25 * s, 1.6, 12), 5, ZT));
    const T = tube(a, 15, m.len, m.R, ZT), E = tube(a, m.len, m.len + 9, m.R * 0.6, ZT);
    m.t.sil.setAttribute("d", T.sil); m.t.cr.setAttribute("d", T.rim);
    m.eye.sil.setAttribute("d", E.sil); m.eye.cr.setAttribute("d", E.rim);
    m.depth = (m.len / 2) * (c + s);
  }
  const col = arm(AC, 48, 4.5), tel = arm(0, 54, 5);
  const tg = mk("g", {}, layer);
  put(solid(tg), prism(P, front, disc(0, 0, 4, 16), disc(0, 0, 3, 16), 5, ZT - 8));
  put(solid(tg), prism(P, front, disc(0, 0, 14, 32), disc(0, 0, 12.5, 32), ZT - 8, ZT - 5));
  const tri = fillet([0, 1, 2].map((k) => { const t = rad(20 + k * 120); return [9 * Math.cos(t), 9 * Math.sin(t)]; }), [1.5, 1.5, 1.5], 3).map(([u, v]) => ({ u, v, nu: u, nv: v }));
  const triIn = tri.map((q) => ({ ...q, u: q.u * 0.8, v: q.v * 0.8 }));
  put(solid(tg), prism(P, front, tri, triIn, ZT - 5, ZT + 8));
  drawArm(col, AC);
  tel.t.sil.classList.add("hi");
  const sp = spring(rad(restB));
  let last = NaN;
  function draw(a) {
    const v = r2(a * 100);
    if (v === last) return;
    last = v;
    drawArm(tel, a);
    [col, { grp: tg, depth: 0 }, tel].sort((p, q) => p.depth - q.depth).forEach((m) => layer.appendChild(m.grp));
  }
  draw(sp.x);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZT);
    if (Math.hypot(x, y) > 110) return leave();
    let rel = Math.atan2(y, x) - AC;
    rel = ((rel % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    sp.t = AC + clamp(rel, LO, HI);
    read.textContent = "arm " + Math.round(((sp.t - AC) * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() {
    let rel = rad(restB) - AC;
    rel = ((rel % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    sp.t = AC + clamp(rel, LO, HI); read.textContent = "rest"; B.wake();
  }
  read.textContent = "rest";
  leave(); sp.x = sp.t; draw(sp.x);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restB = v; if (read.textContent === "rest") leave(); }, destroy: bag.dispose };
}

hairline({
  name: "microtome",
  means: "A spectroscope: a prism on a round table, a fixed collimator, and a telescope arm that swings round the table to face the pointer.",
  rules: [3, 5, 6, 8],
  range: [-30, 20, 80],
  tour: [[35, 129], [365, 129], [16, 65], null],
  mount,
});
