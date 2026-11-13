/**
 * Hat stand: a tall pole on a round foot with curved hooks near its top,
 * holding a sun hat, a fedora, a cap and a beanie, and a scarf hanging over
 * a lower hook. The pointer picks a hat by its resting place on screen: it
 * lifts off its hook and tips outward, and the hats beside it lift a little,
 * staggered from it. At rest the hats sit at uneven tilts and one is raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many around a post; the pick is the hat whose resting
 * middle is nearest the pointer on screen.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, prism, proj, rad, run, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const at = (r, x, y, n = 18) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
// each hat: parts as stacks of [radius, height] rings, a band height, and its hook
const HATS = [
  { phi: 150, z: 92, parts: [[[19, 0], [19, 1.1]], [[8, 0], [8, 6], [6.5, 8.5], [3, 9.5]]], band: 1.8, top: 9.5 },
  { phi: 255, z: 116, parts: [[[13, 0.8], [13, 1.8]], [[7.5, 0], [7.5, 6.5], [6.4, 8.6], [3.2, 9.2]]], band: 2.6, top: 9.2 },
  { phi: 15, z: 84, parts: [[[8, 0], [7.6, 3], [6, 6], [3, 7.8], [0.6, 8.2]]], bill: 1, band: 1, top: 8.2 },
  { phi: 318, z: 102, parts: [[[8, 0], [8, 3.4]], [[7.6, 3.4], [7.4, 7], [5.6, 10.4], [2.6, 12], [0.6, 12.3]], [[0.4, 11.8], [2.1, 12.5], [2.7, 14], [2, 15.5], [0.4, 16.1]]], band: 3.4, top: 12.3 },
];
const R = 24, FAV = 1, TILT = [5, -3, 7, 3];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-22, -22, 0], [22, 22, 0], [22, -22, 0], [-22, 22, 0], [-36, 32, 100], [0, 0, 136], [-22, -22, 136], [30, -26, 132]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, at(20, 0, 0, 40), at(18.6, 0, 0, 40), 0, 3));
  put(solid(g), prism(P, front, at(8, 0, 0, 24), at(6.8, 0, 0, 24), 3, 7));

  const hats = HATS.map((h, k) => {
    const d = [Math.cos(rad(h.phi)), Math.sin(rad(h.phi))], ax = [-d[1], d[0]];
    const tip = [d[0] * R, d[1] * R];
    return { k, h, d, ax, tip, depth: tip[0] + tip[1], z: tween(0), t: tween(0), last: "" };
  });
  const order = hats.slice().sort((a, b) => a.depth - b.depth);
  const pole = () => {
    put(solid(g), prism(P, front, at(2.2, 0, 0), at(1.4, 0, 0), 7, 124));
    mk("path", { d: poly(hull(at(3.4, 0, 0).flatMap((q) => [P(q.u, q.v, 123), P(q.u * 0.6, q.v * 0.6, 129)]))), class: "sil" }, g);
  };
  let poled = false;
  // the scarf, over a lower hook toward the reader: two tails either side of the peg
  const sd = [Math.cos(rad(78)), Math.sin(rad(78))], sa = [-sd[1], sd[0]], sz = 70;
  const drawScarf = () => {
    mk("path", { d: open([P(0, 0, sz - 12), P(sd[0] * 12, sd[1] * 12, sz - 5), P(sd[0] * 17, sd[1] * 17, sz)]), class: "nf" }, g);
    for (const [s, len] of [[1, 30], [-1, 40]]) {
      const pts = [];
      for (const w of [-5, 5]) for (const o of [s * 1.4, s * 2.6]) for (const zz of [sz + 1, sz - len]) pts.push(P(sd[0] * (15 + w) + sa[0] * o, sd[1] * (15 + w) + sa[1] * o, zz));
      mk("path", { d: poly(hull(pts)), class: "sil" }, g);
      let fr = "";
      for (const w of [-3.5, -1.2, 1.2, 3.5]) fr += seg(P(sd[0] * (15 + w) + sa[0] * s * 2.6, sd[1] * (15 + w) + sa[1] * s * 2.6, sz - len + 1), P(sd[0] * (15 + w) + sa[0] * s * 2.6, sd[1] * (15 + w) + sa[1] * s * 2.6, sz - len - 2));
      mk("path", { d: fr, class: "nf lo" }, g);
    }
    // the fold over the peg
    const fold = [];
    for (const w of [-5, 5]) for (const o of [-2.8, 2.8]) for (const zz of [sz - 4, sz + 1.2]) fold.push(P(sd[0] * (15 + w) + sa[0] * o * (zz > sz ? 0.6 : 1), sd[1] * (15 + w) + sa[1] * o * (zz > sz ? 0.6 : 1), zz));
    mk("path", { d: poly(hull(fold)), class: "sil" }, g);
  };
  for (const it of order) {
    if (!poled && it.depth > 0) { pole(); drawScarf(); poled = true; }
    const { d, h } = it;
    mk("path", { d: open([P(0, 0, h.z - 14), P(d[0] * R * 0.62, d[1] * R * 0.62, h.z - 8), P(d[0] * R, d[1] * R, h.z)]), class: "nf" }, g);
    it.g = mk("g", {}, g);
    it.els = h.parts.map(() => solid(it.g));
    if (h.bill) it.bill = solid(it.g);
  }

  function draw(it, lift, tl) {
    const key = lift.toFixed(2) + "," + tl.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const { d, ax, h } = it, t = rad(tl), ct = Math.cos(t), st = Math.sin(t);
    const bz = h.z - h.top + 1.5 + lift, bx = it.tip[0] + d[0] * lift * 0.25, by = it.tip[1] + d[1] * lift * 0.25;
    const X = (a, b, z) => { const a2 = a * ct + z * st, z2 = -a * st + z * ct; return P(bx + a2 * d[0] + b * ax[0], by + a2 * d[1] + b * ax[1], bz + z2); };
    const ring = (r, z, n = 24) => circ(r, n).map((q) => X(q.u, q.v, z));
    const face = (q) => front({ nu: q.nu * ct * d[0] + q.nv * ax[0], nv: q.nu * ct * d[1] + q.nv * ax[1] });
    h.parts.forEach((stack, j) => {
      const pts = stack.flatMap(([r, z]) => ring(r, z));
      const r0 = stack[0][0], z1 = stack[stack.length - 1][1];
      const cr = j === 0 && stack.length === 2 && r0 > 10 ? poly(ring(r0 - 1.6, z1, 40)) : open(run(circ(stack[0][0] - 0.1, 24), face).map((q) => X(q.u, q.v, h.band)));
      put(it.els[j], { sil: poly(hull(pts)), crease: cr });
    });
    if (it.bill) {
      const b = [];
      for (let i = 0; i <= 12; i++) { const th = rad(-80 + (160 * i) / 12); for (const z of [0.4, 1.2]) b.push(X(5 + 7 * Math.cos(th), 6.5 * Math.sin(th), z - 0.6 * Math.cos(th))); }
      put(it.bill, { sil: poly(hull(b)), crease: "" });
    }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of hats) { draw(it, tval(it.z, now), TILT[it.k] + tval(it.t, now)); if (!tdone(it.z, now) || !tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The hat whose resting middle is nearest the pointer on screen; -1 off the hats. */
  const mids = hats.map((it) => P(it.tip[0], it.tip[1], it.h.z - it.h.top / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, (m[1] - sy) * 1.3); if (dd < bd) { bd = dd; best = k; } });
    return bd < 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    hats.forEach((it, k) => {
      const dd = Math.abs(k - a);
      const [z, t] = a < 0 ? (k === FAV ? [6, 6] : [0, 0]) : dd === 0 ? [16, 20] : dd === 1 ? [4, 5] : [1, 1];
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.z, z, now, delay); tset(it.t, t, now, delay);
      for (const e of it.els.concat(it.bill ? [it.bill] : [])) e.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hat " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hatstand",
  means: "A hat stand with four hats and a scarf: the hat under the pointer lifts off its hook and tips, and its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[163, 120], [255, 112], [232, 160], null],
  mount,
});
