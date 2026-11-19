/**
 * Can opener: a butterfly can opener lying on the counter, two long handles
 * hinged at a round head with the cutting wheel, and the winged key standing
 * on top. The pointer over it spreads the handles apart on the hinge and
 * turns the key a quarter round. At rest the key is bright. The slider is
 * how far the handles spread. The hit is a fixed screen box.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const L = 104, HZ = 5, REST = 5, SPREAD = 26, KZ = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.3);
  const tip = (s) => [L * Math.cos(rad(s)), L * Math.sin(rad(s)), HZ];
  fit(C, [[-16, -16, 0], [16, 16, 0], tip(REST + SPREAD), tip(-REST - SPREAD), [0, 0, KZ + 22]], 200, 160);
  const P = proj(C), front = facing(C);
  const capsule = (a, b, r) => {
    const pts = [];
    for (const c of [a, b]) for (let i = 0; i < 12; i++) {
      const q = (i / 12) * Math.PI * 2, u = r * Math.cos(q), w = r * Math.sin(q);
      pts.push(P(c[0] + u, c[1] + w, c[2]), P(c[0] + u, c[1], c[2] + w * 0.6), P(c[0], c[1] + u, c[2] + w * 0.6));
    }
    return poly(hull(pts));
  };
  const g = mk("g", {}, svg);
  const back = mk("path", { class: "sil" }, g), backCr = mk("path", { class: "nf lo" }, g);
  const near = mk("path", { class: "sil" }, g), nearCr = mk("path", { class: "nf lo" }, g);
  // head and cutting wheel
  put(solid(g), prism(P, front, disc(-4, 9, 6, 24), disc(-4, 9, 4.6, 24), 0, 8));
  put(solid(g), prism(P, front, disc(0, 0, 14), disc(0, 0, 12), 3, 12));
  put(solid(g), prism(P, front, disc(0, 0, 3, 16), null, 12, KZ));
  const key = mk("g", {}, g);
  const wa = mk("path", { class: "sil hi" }, key), wb = mk("path", { class: "sil hi" }, key);
  const t = tween(0);
  let last = NaN;
  function wing(a, side) {
    const c = Math.cos(a), s = Math.sin(a), pts = [];
    for (let i = 0; i < 16; i++) {
      const q = (i / 16) * Math.PI * 2, d = side * (12 + 9 * Math.cos(q)), z = KZ + 10 + 9 * Math.sin(q);
      for (const w of [-1.2, 1.2]) pts.push(P(d * c - w * s, d * s + w * c, z));
    }
    for (const w of [-1.2, 1.2]) pts.push(P(-w * s, w * c, KZ - 1), P(-w * s, w * c, KZ + 14));
    return poly(hull(pts));
  }
  function draw(v) {
    if (v === last) return;
    last = v;
    const sp = REST + v * SPREAD * amt;
    back.setAttribute("d", capsule([0, 0, HZ], tip(-sp), 7));
    backCr.setAttribute("d", open([P(10 * Math.cos(rad(sp)), -10 * Math.sin(rad(sp)), HZ + 3), P(...tip(-sp).map((u, i) => (i === 2 ? u + 3 : u * 0.95)))]));
    near.setAttribute("d", capsule([0, 0, HZ], tip(sp), 7));
    nearCr.setAttribute("d", open([P(10 * Math.cos(rad(sp)), 10 * Math.sin(rad(sp)), HZ + 3), P(...tip(sp).map((u, i) => (i === 2 ? u + 3 : u * 0.95)))]));
    const a = rad(20 + v * 90);
    wa.setAttribute("d", wing(a, -1));
    wb.setAttribute("d", wing(a, 1));
    if (Math.sin(a) * Math.cos(a) > 0) wa.after(wb); else wb.after(wa);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(t, o ? 1 : 0, performance.now(), 0);
    read.textContent = o ? "turn" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 150 && Math.abs(sy - 160) < 130), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "canopener",
  means: "A butterfly can opener: the pointer spreads its two handles apart on the hinge and turns the winged key.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[84, 91], [200, 164], [247, 222], null],
  mount,
});
