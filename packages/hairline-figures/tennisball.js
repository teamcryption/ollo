/**
 * Ball hopper: a wire basket of tennis balls on four short legs, with a tall
 * U handle over it. The pointer's side tips the hopper about its foot, so the
 * whole basket leans as if being poured; at rest it leans a little and one
 * ball on the heap is bright. The slider is how far it tips.
 */
const { Cam, circ, rrect, fit, hull, poly, proj, unproj, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register } = HL;
const box = (x0, y0, z0, x1, y1, z1, r = 3, b = 1.5) => {
  const o = rrect(x0, y0, x1, y1, r, 4), i = rrect(x0 + b, y0 + b, x1 - b, y1 - b, Math.max(r - b, 0.5), 4);
  return { pts: [o.map((q) => [q.u, q.v, z0]), o.map((q) => [q.u, q.v, z1])], cr: i.map((q) => [q.u, q.v, z1]) };
};
const cylZ = (x, y, z0, z1, R, n = 18) => ({ pts: [z0, z1].map((z) => circ(R, n).map((q) => [x + q.u, y + q.v, z])) });
const cylX = (x0, x1, y, z, R, n = 18) => ({ pts: [x0, x1].map((x) => circ(R, n).map((q) => [x, y + q.u, z + q.v])) });
const cylY = (x, y0, y1, z, R, n = 18) => ({ pts: [y0, y1].map((y) => circ(R, n).map((q) => [x + q.u, y, z + q.v])) });
const ball = (x, y, z, R) => ({ pts: [-0.8, -0.4, 0, 0.4, 0.8].map((s) => circ(R * Math.sqrt(1 - s * s), 20).map((q) => [x + q.u, y + q.v, z + R * s])).concat([[[x, y, z + R], [x, y, z - R]]]) });
const rotX = (p, a, py, pz) => { const c = Math.cos(a), s = Math.sin(a), y = p[1] - py, z = p[2] - pz; return [p[0], py + y * c - z * s, pz + y * s + z * c]; };
const rotY = (p, a, px, pz) => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - px, z = p[2] - pz; return [px + x * c - z * s, p[1], pz + x * s + z * c]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let mult = value;
  const C = Cam(45, 0.5, S);
  const PT = PARTS();
  const pose = (pt, st, r) => r.map((p) => (pt.f ? pt.f(p, st) : p));
  fit(C, EXT.flatMap((st) => PT.flatMap((pt) => pt.s.pts.flatMap((r) => pose(pt, st, r)))), 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const els = PT.map((pt) => {
    const grp = mk("g", {}, g);
    return { grp, sil: mk("path", { class: pt.line ? (pt.lo ? "lo nf" : "sil nf") : "sil" }, grp), cr: pt.s.cr ? mk("path", { class: "lo nf" }, grp) : null };
  });
  const sp = {};
  for (const k in REST) sp[k] = spring(REST[k]);
  let last = "", hiNow = -1;
  function draw(force) {
    const st = {};
    for (const k in sp) st[k] = sp[k].x;
    const key = JSON.stringify(st);
    if (key === last && !force) return;
    last = key;
    PT.forEach((pt, i) => {
      if (!pt.f && !force) return;
      const pts = pt.s.pts.flatMap((r) => pose(pt, st, r).map((p) => P(...p)));
      els[i].sil.setAttribute("d", pt.line ? pt.s.pts.map((r) => "M" + pose(pt, st, r).map((p) => P(...p).map((v) => v.toFixed(1)).join(",")).join("L")).join("") : poly(hull(pts)));
      if (els[i].cr) els[i].cr.setAttribute("d", poly(pose(pt, st, pt.s.cr).map((p) => P(...p))));
    });
  }
  function bright(h) {
    if (h === hiNow) return;
    hiNow = h;
    PT.forEach((pt, i) => els[i].sil.classList.toggle("hi", pt.grp === h));
  }
  draw(true);
  bright(HIREST);
  const B = register(stage, (dt) => {
    let m = false;
    for (const k in sp) if (stepS(sp[k], dt)) m = true;
    draw(false);
    return m;
  });
  bag.add(B.unregister);
  function aimAt(p) {
    const t = p ? AIM(p, C, unproj, mult) : null;
    const tg = t || REST;
    for (const k in sp) sp[k].t = tg[k];
    bright(t ? HIOF(tg) : HIREST);
    read.textContent = t ? LABEL(tg) : "rest";
    B.wake();
  }
  aimAt(null);
  bag.add(pointer(stage, { move: (p) => aimAt(p), leave: () => aimAt(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { mult = v; }, destroy: bag.dispose };
}
const S = 2.15, BALLS = [[12, 12, 63], [26, 10, 64], [39, 13, 63], [10, 26, 64], [26, 26, 69], [40, 26, 63], [13, 39, 63], [27, 40, 64], [39, 38, 63]];
const REST = { a: rad(-8) }, HIREST = "ball", EXT = [{ a: rad(-26) }, { a: rad(26) }];
const AIM = (p, C, U, m) => ({ a: clamp((p[0] - 200) / 110, -1, 1) * rad(26) * lerp(0.6, 1, m) });
const HIOF = () => "ball", LABEL = (t) => "tip " + Math.round(Math.abs(t.a) * 57.3);
function PARTS() {
  const f = (p, st) => rotY(p, st.a, 25, 0), out = [];
  out.push({ s: cylZ(25, -3, 40, 100, 1.6), f });
  for (const [x, y] of [[3, 3], [47, 3], [3, 47]]) out.push({ s: cylZ(x, y, 0, 20, 1.6), f });
  out.push({ s: box(0, 0, 18, 50, 50, 60, 6, 2), f });
  out.push({ s: { pts: [10, 20, 30, 40].map((x) => [[x, 50, 20], [x, 50, 58]]).concat([[[50, 10, 20], [50, 10, 58]], [[50, 25, 20], [50, 25, 58]], [[50, 40, 20], [50, 40, 58]], [[0, 50, 40], [50, 50, 40], [50, 0, 40]]]) }, f, line: true, lo: true });
  out.push({ s: cylZ(47, 47, 0, 20, 1.6), f });
  BALLS.forEach(([x, y, z], k) => out.push({ s: ball(x, y, z, 7.5), f, grp: k === 4 ? "ball" : null }));
  out.push({ s: cylZ(25, 53, 40, 100, 1.6), f });
  out.push({ s: cylY(25, -3, 53, 100, 2), f });
  return out;
}

hairline({
  name: "tennisball",
  means: "A wire hopper of tennis balls on short legs: the pointer's side tips the whole basket over its foot, as if pouring.",
  rules: [1, 3, 5, 8],
  range: [0, 0.7, 1],
  tour: [[276, 141], [200, 190], [124, 253], null],
  mount,
});
