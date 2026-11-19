/**
 * Lifeboat davit: a gooseneck arm on its post at the deck's edge, a lifeboat
 * hanging from its falls. The pointer swings the arm outboard on a spring,
 * carrying the boat out over the side; at rest it stands stowed inboard, the
 * boat bright. The slider is how far the arm swings.
 */
const { Cam, fit, proj, facing, rings, rrect, ringAt, run, hull, poly, open, seg, clamp, spring, stepS, disposer, mk, solid, put, prism, register, pointer } = HL;

const L = 34, ZP = 48, ZB = 20, DB = 8, REST = Math.PI + 0.3, SWING = 2.3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  const ext = [[-58, -38, 0], [10, 14, 0], [0, 0, ZP + 17]];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.283; ext.push([(L + 16) * Math.cos(a) * 0.9, (L + 16) * Math.sin(a), ZB]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [d0, d1] = rings(-58, -38, 10, 14, 5, 1.8);
  put(solid(g), prism(P, front, d0, d1, -4, 0));
  mk("path", { class: "dash nf", d: seg(P(-58, 14, 7), P(10, 14, 7)) }, g);
  const foot = rrect(-11, -3, 11, 3, 3, 4), top = rrect(-16, -5.5, 16, 5.5, 5.5, 6), inner = rrect(-14.6, -4.1, 14.6, 4.1, 4.1, 6);
  const post = mk("g", {}, g);
  put(solid(post), prism(P, front, rings(-4, -4, 4, 4, 2, 1)[0], null, 0, 3));
  put(solid(post), prism(P, front, rings(-2.2, -2.2, 2.2, 2.2, 1.1, 0.5)[0], null, 3, ZP));
  const arm = mk("path", { class: "nf sil", d: "" }, post);
  const boat = mk("g", {}, g);
  const hullS = solid(boat);
  const thwart = mk("path", { class: "lo nf", d: "" }, boat);
  const falls = mk("path", { class: "nf sil", d: "" }, boat);
  hullS.sil.classList.add("hi");
  const sp = spring(REST, { k: 90, c: 14 });
  let drawn = NaN, boatFirst = null;
  const xf = (ring, a, cx, cy) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), A = (r, z) => P(r * c, r * s, z);
    let d = "";
    for (const o of [0, 1.6]) {
      const pts = [];
      for (let i = 0; i <= 10; i++) { const b = (i / 10) * (Math.PI / 2); pts.push(A(L * (1 - Math.cos(b)), ZP - 2 + o + 14 * Math.sin(b))); }
      pts.push(A(L + 1.5, ZP + 10 + o));
      d += open(pts);
    }
    arm.setAttribute("d", d);
    const bx = L * c, by = L * s, ta = a + Math.PI / 2;
    const F = xf(foot, ta, bx, by), T = xf(top, ta, bx, by), I = xf(inner, ta, bx, by);
    hullS.sil.setAttribute("d", poly(hull(ringAt(P, F, ZB).concat(ringAt(P, T, ZB + DB)))));
    hullS.cr.setAttribute("d", open(ringAt(P, run(I, front), ZB + DB)));
    const e = (u, v, z) => { const tc = Math.cos(ta), ts = Math.sin(ta); return P(bx + u * tc - v * ts, by + u * ts + v * tc, z); };
    thwart.setAttribute("d", seg(e(-4, -4, ZB + DB - 0.5), e(-4, 4, ZB + DB - 0.5)) + seg(e(5, -4, ZB + DB - 0.5), e(5, 4, ZB + DB - 0.5)));
    const tip = A(L + 1.5, ZP + 10);
    falls.setAttribute("d", seg(tip, e(-11, 0, ZB + DB)) + seg(tip, e(11, 0, ZB + DB)));
    const bf = bx + by < 0;
    if (bf !== boatFirst) { boatFirst = bf; if (bf) post.before(boat); else post.after(boat); }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const cx0 = P(0, 0, 0)[0];
  function set(on, x) {
    sp.t = on ? REST - clamp((x - cx0 + 120) / 200, 0.2, 1) * SWING * value : REST;
    read.textContent = on ? (sp.t < REST - 1.6 ? "out" : "swing") : "rest";
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => set(true, p[0]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  set(false);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "davit",
  means: "A lifeboat davit: the pointer swings the gooseneck arm outboard, carrying the hanging lifeboat out over the ship's side.",
  rules: [1, 3, 5],
  range: [0.4, 1, 1.4],
  tour: [[162, 129], [250, 170], [320, 150], null],
  mount,
});
