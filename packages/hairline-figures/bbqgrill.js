/**
 * BBQ grill: a kettle barbecue on three legs, its lid hinged open at the
 * back, a grate across the bowl and four skewers lying on it, each with four
 * chunks on its rod and a loop at its end. As the pointer nears, the lid
 * swings wider open (a spring); the skewer under the pointer rises and turns
 * over, the ones beside it a little, staggered from it. At rest one skewer is
 * turned half over, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row, picked on a fixed plane through
 * the grate; the lid follows the pointer's distance on the same plane.
 */
const {
  Cam, circ, clamp, fit, hull, lerp, open, poly, proj, seg, spring, stepS, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, register,
} = HL;

const R = 28, TOPZ = 44, H = 15, N = 4, YS = [-15, -5, 5, 15], FAV = 1, RISE = 9, TH0 = 0.95, TH1 = 1.45;
const REST = [[0, 0.2], [3, 1.1], [0, 0.6], [0, 0.1]];
const SQ = Math.SQRT1_2, HG = [-R * SQ, -R * SQ, TOPZ];
const ring3 = (r, z, n = 40) => circ(r, n).map((q) => [q.u, q.v, z]);

/** a point of the closed lid, swung open by th about the hinge at the back of the rim */
function hinge(p, th) {
  const q = [p[0] - HG[0], p[1] - HG[1], p[2] - HG[2]];
  const u = -(q[0] + q[1]) * SQ, w = (q[0] - q[1]) * SQ, c = Math.cos(th), s = Math.sin(th);
  const u2 = u * c + q[2] * s, z2 = -u * s + q[2] * c;
  return [HG[0] - u2 * SQ + w * SQ, HG[1] - u2 * SQ - w * SQ, HG[2] + z2];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  const dome = [], rim = ring3(R, TOPZ), handle = [];
  for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); dome.push(...ring3(R * Math.cos(t) + 0.01, TOPZ + H * Math.sin(t), 32)); }
  for (const x of [-6, 6]) for (const y of [-1.5, 1.5]) for (const z of [0, 3.5]) handle.push([x, y, TOPZ + H + z]);
  const far = dome.concat(handle).map((p) => hinge(p, TH1));
  fit(C, far.concat([[29, 0, 0], [0, 29, 0], [-29, 0, 0], [0, -29, 0], [R + 9, 15, TOPZ + RISE + 6]]), 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);

  // the lid, swung open behind the bowl: its handle, its dome, its rim
  const lidH = mk("path", { class: "nf" }, g), lidS = mk("path", { class: "sil" }, g), lidR = mk("path", { class: "nf lo" }, g);
  // the legs, the ash pan between them, then the bowl over their tops
  const legs = [45, 165, 285].map((a) => [Math.cos((a * Math.PI) / 180), Math.sin((a * Math.PI) / 180)]);
  const leg = (c) => seg(P(16 * c[0], 16 * c[1], TOPZ - 16), P(27 * c[0], 27 * c[1], 0));
  mk("path", { class: "nf", d: leg(legs[1]) + leg(legs[2]) }, g);
  mk("path", { d: poly(hull(ring3(9, 13).concat(ring3(10, 17)).map((p) => P(...p)))) }, g);
  mk("path", { class: "nf", d: leg(legs[0]) }, g);
  const bowl = [];
  for (const [r, z] of [[R, TOPZ], [R * 0.94, TOPZ - 6], [R * 0.8, TOPZ - 12], [R * 0.55, TOPZ - 17], [R * 0.25, TOPZ - 19]]) bowl.push(...ring3(r, z).map((p) => P(...p)));
  mk("path", { class: "sil", d: poly(hull(bowl)) }, g);
  let grate = poly(ring3(R - 1.5, TOPZ).map((p) => P(...p)));
  for (let x = -20; x <= 20; x += 5) { const h = Math.sqrt((R - 3) ** 2 - x * x); grate += seg(P(x, -h, TOPZ), P(x, h, TOPZ)); }
  mk("path", { class: "nf lo", d: grate }, g);

  const sk = YS.map((y, k) => {
    const grp = mk("g", {}, g), rod = mk("path", { class: "nf" }, grp);
    const chunks = [-15, -5, 5, 15].map(() => mk("path", { class: "sil" }, grp));
    const loop = mk("path", { class: "nf" }, grp);
    return { k, y, rod, chunks, loop, z: tween(REST[k][0]), a: tween(REST[k][1]), last: "" };
  });

  function drawSk(s, z, a) {
    const key = z.toFixed(2) + "," + a.toFixed(3);
    if (key === s.last) return;
    s.last = key;
    const z0 = TOPZ + 2.8 + z, c = Math.cos(a), sn = Math.sin(a);
    const at = (x, yy, zz) => P(x, s.y + yy * c - zz * sn, z0 + yy * sn + zz * c);
    s.rod.setAttribute("d", seg(at(-22, 0, 0), at(R + 4, 0, 0)));
    [-15, -5, 5, 15].forEach((x, i) => {
      const pts = [];
      for (const dx of [-3, 3]) for (const yy of [-2.6, 2.6]) for (const zz of [-2.6, 2.6]) pts.push(at(x + dx, yy, zz));
      s.chunks[i].setAttribute("d", poly(hull(pts)));
    });
    const lp = [];
    for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI * 2; lp.push(at(R + 6.5 + 2.5 * Math.cos(t), 0, 2.5 * Math.sin(t))); }
    s.loop.setAttribute("d", open(lp));
  }

  const th = spring(TH0);
  let thLast = NaN;
  function drawLid(t) {
    if (t === thLast) return;
    thLast = t;
    const f = (p) => P(...hinge(p, t));
    lidH.setAttribute("d", poly(hull(handle.map(f))));
    lidS.setAttribute("d", poly(hull(dome.map(f))));
    lidR.setAttribute("d", poly(rim.map(f)));
  }

  const B = register(stage, (dt, now) => {
    const m = stepS(th, dt);
    drawLid(th.x);
    let moving = m;
    for (const s of sk) { drawSk(s, tval(s.z, now), tval(s.a, now)); if (!tdone(s.z, now) || !tdone(s.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on a fixed plane through the grate; nearest skewer by y, lid by distance
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOPZ + 3), d = Math.hypot(x, y);
    th.t = lerp(TH0, TH1, clamp(1 - (d - R * 0.3) / (R * 1.6), 0, 1));
    return d > R + 6 ? -1 : clamp(Math.round((y - YS[0]) / 10), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    B.wake();
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sk.forEach((s, k) => {
      const dd = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(s.z, a < 0 ? REST[k][0] : dd === 0 ? RISE : dd === 1 ? 2.5 : 0, now, delay);
      tset(s.a, a < 0 ? REST[k][1] : dd === 0 ? 1.8 : dd === 1 ? 0.7 : REST[k][1], now, delay);
      const on = k === (a < 0 ? FAV : a);
      for (const el of [s.rod, s.loop, ...s.chunks]) el.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "skewer " + (a + 1);
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => { th.t = TH0; setActive(-1); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "bbqgrill",
  means: "A kettle grill with four skewers: the lid swings open as the pointer nears, and the skewer under it rises and turns.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[227, 161], [192, 179], [174, 187], null],
  mount,
});
