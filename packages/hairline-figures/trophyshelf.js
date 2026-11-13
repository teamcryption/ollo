/**
 * Trophy shelf: a two-tier stand holding five trophies of different heights,
 * three cups with handles, a star on a column and a plain plaque. The pointer
 * picks a trophy by where it stands: it lifts off its tier and turns a little,
 * and its neighbours lift slightly, staggered from it. At rest the trophies
 * stand askew, the star raised a touch and bright. The slider is the stagger.
 *
 * The pattern: one of many at different heights (riffle, stepped): the hit
 * reads each trophy's rest centre on screen, never the pose drawn.
 */
const {
  Cam, circ, fit, facing, fillet, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XL = 88, BT = 16, FT = 7, LIFT = 9, TURN = 0.55, FAV = 2;
// x, tier (0 back, 1 front), kind, size, rest turn
const SPEC = [[11, 0, "cup", 1, -0.25], [42, 1, "plaque", 1, 0.12], [41, 0, "star", 1, 0.1], [74, 1, "cup", 1.2, 0.3], [73, 0, "cup", 0.8, -0.15]];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-4, -4, 0], [XL, 31, 0], [XL, -4, 0], [-4, 31, 0], [41, 4, BT + 29 + LIFT], [73, 4, BT + 14 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (el, x0, y0, x1, y1, r, b, z0, z1, a = 0, cx = 0, cy = 0) => {
    const [o, i] = rings(x0, y0, x1, y1, r, b);
    put(el, prism(P, front, turn(o, a, cx, cy), turn(i, a, cx, cy), z0, z1));
    return el;
  };

  // the back tier, its trophies, then the front tier and its trophies
  const items = SPEC.map(([x, tier, kind, s, rt], k) => ({ k, x, y: tier ? 21 : 4, z0: tier ? FT : BT, tier, kind, s, rt }));
  for (const tier of [0, 1]) {
    block(solid(g), -4, tier ? 12 : -4, XL, tier ? 31 : 12, 2.5, 1.2, 0, tier ? FT : BT);
    for (const it of items.filter((q) => q.tier === tier)) {
      it.grp = mk("g", {}, g);
      it.a = tween(it.k === FAV ? 0.35 : 0);
      it.last = NaN;
    }
  }

  /** One trophy at its lift and turn: replaces the group's paths. */
  function draw(it, amt) {
    if (amt === it.last) return;
    it.last = amt;
    it.grp.replaceChildren();
    const { x, y, s } = it, z = it.z0 + amt * LIFT, a = it.rt + amt * TURN, sils = [];
    const box = (hw, hd, z0, z1) => sils.push(block(solid(it.grp), -hw, -hd, hw, hd, 1.2, 0.6, z0, z1, a, x, y).sil);
    const ax = (u, v, h) => P(x + u * Math.cos(a) - v * Math.sin(a), y + u * Math.sin(a) + v * Math.cos(a), h);
    if (it.kind === "cup") {
      box(5 * s, 5 * s, z, z + 3 * s);
      const st = solid(it.grp);
      put(st, prism(P, front, disc(x, y, 1.3 * s, 16), disc(x, y, 0.7 * s, 16), z + 3 * s, z + 7 * s));
      const zb = z + 7 * s, H = 9 * s, R = 6.2 * s, handle = mk("path", { class: "sil nf" }, it.grp);
      let d = "";
      for (const side of [1, -1]) {
        const pts = [];
        for (let i = 0; i <= 10; i++) { const t = -Math.PI / 2 + (i / 10) * Math.PI; pts.push(ax(side * (R * 0.8 + 3 * s * Math.cos(t)), 0, zb + H * 0.55 + 2.8 * s * Math.sin(t))); }
        d += "M" + pts.map((p) => p.join(",")).join("L");
      }
      handle.setAttribute("d", d);
      const bowl = [];
      for (const [f, r] of [[0, 0.3], [0.25, 0.62], [0.55, 0.86], [0.8, 0.97], [1, 1]]) bowl.push(...ringAt(P, disc(x, y, R * r), zb + H * f));
      const cup = mk("g", {}, it.grp);
      sils.push(st.sil, handle, mk("path", { class: "sil", d: poly(hull(bowl)) }, cup));
      mk("path", { class: "nf lo", d: poly(ringAt(P, disc(x, y, R - 1, 32), zb + H)) }, cup);
    } else if (it.kind === "star") {
      box(5, 5, z, z + 3);
      const st = solid(it.grp);
      put(st, prism(P, front, disc(x, y, 1.6, 16), disc(x, y, 0.9, 16), z + 3, z + 13));
      sils.push(st.sil);
      const zc = z + 20.5, pts = [];
      for (let i = 0; i < 10; i++) { const t = Math.PI / 2 + (i / 10) * Math.PI * 2, r = i % 2 ? 3.4 : 8; pts.push([r * Math.cos(t), r * Math.sin(t)]); }
      const star = fillet(pts, pts.map(() => 0.7), 3), e = a - Math.PI / 4;
      const at = (dn) => star.map(([u, v]) => P(x + u * Math.cos(e) + dn * Math.sin(e), y + u * Math.sin(e) - dn * Math.cos(e), zc + v));
      mk("path", { d: poly(at(1.6)) }, it.grp);
      sils.push(mk("path", { class: "sil", d: poly(at(0)) }, it.grp));
    } else {
      box(9, 3.2, z, z + 3);
      box(7.5, 1.3, z + 3, z + 22);
      mk("path", { class: "nf lo", d: poly([ax(-4.5, 1.3, z + 9), ax(4.5, 1.3, z + 9), ax(4.5, 1.3, z + 17), ax(-4.5, 1.3, z + 17)]) }, it.grp);
    }
    it.sils = sils;
    for (const el of sils) el.classList.toggle("hi", it.k === lit);
  }

  let lit = FAV;
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: each trophy's rest box on screen, centred on its middle
  const mids = items.map((it) => { const h = it.kind === "star" ? 28 : it.kind === "plaque" ? 25 : 16 * it.s; return { m: P(it.x, it.y, it.z0 + h / 2), hh: (h * 0.87 * C.S) / 2 + 4 }; });
  function hit([sx, sy]) {
    let best = -1, bd = 1;
    mids.forEach(({ m, hh }, k) => { const d = Math.max(Math.abs(sx - m[0]) / 17, Math.abs(sy - m[1]) / hh); if (d < bd) { bd = d; best = k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    lit = a < 0 ? FAV : a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? (k === FAV ? 0.35 : 0) : dd === 0 ? 1 : dd === 1 ? 0.28 : 0;
      tset(it.a, v, now, from < 0 ? 0 : dd * stag);
      it.last = NaN;
    });
    read.textContent = a < 0 ? "rest" : "trophy " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "trophyshelf",
  means: "Five trophies on a two-tier stand: the one under the pointer lifts and turns, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[160, 111], [216, 125], [245, 200], null],
  mount,
});
