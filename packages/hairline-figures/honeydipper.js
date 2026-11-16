/**
 * Honey pot: three honey pots, each with a lid and a wooden
 * dipper standing through it.
 * The pointer picks one by where it stands; its moving part tilts open on a
 * hinge and the neighbours tilt a little, staggered from it. At rest one is
 * part open, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, rrect, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 48, FAV = 1, MAX = 1.15;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const ringW = (ring, z) => ring.map((q) => [q.u, q.v, z]);
function part(x, y) {
  const R = 17, H = 26, T = 4, top = H + T;
  const body = disc(x, y, R), lid = disc(x, y, R + 2);
  const stick = [...ringW(disc(x + 5, y, 1.6, 10), top), ...ringW(disc(x + 5, y, 1.6, 10), top + 22)];
  const head = [];
  for (const [r, z] of [[3, 22], [4.5, 25], [3, 28], [4.5, 31], [3, 34]]) head.push(...ringW(disc(x + 5, y, r, 14), top + z));
  return { cx: x, cy: y, hx: x - R - 2, hz: H, base: [[disc(x, y, R - 2), disc(x, y, R - 5), 0, 4], [body, disc(x, y, R - 3), 4, H]],
    rings: [ringW(lid, H), ringW(lid, top), ringW(disc(x, y, 6, 16), top + 3)], crease: ringW(disc(x, y, R - 1), top), extra: [stick, head] };
}

function rot(p, hx, hz, a) {
  const dx = p[0] - hx, dz = p[2] - hz, c = Math.cos(a), s = Math.sin(a);
  return [hx + dx * c - dz * s, p[1], hz + dx * s + dz * c];
}
const restA = (k) => (k === FAV ? MAX * 0.55 : MAX * (0.08 + 0.06 * k));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const specs = [];
  for (let k = 0; k < N; k++) specs.push(part(k * STEP, 0, k));
  const pts = [];
  for (const sp of specs) for (const a of [0, MAX]) for (const r of sp.rings.concat(sp.extra || [])) for (const p of r) pts.push(rot(p, sp.hx, sp.hz, a));
  for (const sp of specs) for (const b of sp.base) for (const q of b[0]) pts.push([q.u, q.v, b[2]]);
  const C1 = Cam(45, 0.5, 1);
  fit(C1, pts, 200, 160);
  const P1 = proj(C1), sc = pts.map((p) => P1(...p));
  const xs = sc.map((q) => q[0]), ys = sc.map((q) => q[1]);
  const S = Math.min(300 / (Math.max(...xs) - Math.min(...xs)), 236 / (Math.max(...ys) - Math.min(...ys)));
  const C = Cam(45, 0.5, S);
  fit(C, pts, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = specs.map((sp, k) => {
    const grp = mk("g", {}, g);
    for (const b of sp.base) put(solid(grp), prism(P, front, b[0], b[1], b[2], b[3]));
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp), ex = mk("path", { class: "nf" }, grp);
    return { k, sp, grp, sil, cr, ex, a: tween(restA(k)), last: NaN };
  });

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const sp = it.sp, R = (p) => P(...rot(p, sp.hx, sp.hz, a));
    const all = [];
    for (const r of sp.rings) for (const p of r) all.push(R(p));
    it.sil.setAttribute("d", poly(hull(all)));
    it.cr.setAttribute("d", sp.crease ? poly(sp.crease.map(R)) : "");
    it.ex.setAttribute("d", (sp.extra || []).map((h) => poly(hull(h.map(R)))).join(""));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = specs.map((sp) => P(sp.cx, sp.cy, sp.hz));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < STEP * S * 0.6 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a);
      const t = a < 0 ? restA(k) : d === 0 ? MAX : d === 1 ? MAX * 0.22 : MAX * 0.06;
      tset(it.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "honeydipper",
  means: "Three honey pots: the lid under the pointer tips back with its dipper, the pots beside it tip a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[117, 138], [215, 180], [313, 236], null],
  mount,
});
