/**
 * Xylophone pull toy: a low cart on four wheels, five bars of falling length
 * across its deck, a mallet on a stick, and a pull string ending in a bead
 * handle on the floor. The pointer pulls: the further ahead of the cart it is
 * on the floor, the further the toy rolls toward it, the wheels turning with
 * it and the mallet bobbing on the bars. At rest the string lies slack, its
 * handle bright. The slider is how far the string can pull.
 *
 * The pattern: a continuous input (where) on the floor plane, which never
 * moves; one spring carries the whole toy.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 46, W = 22, ZB = 7, ZT = 12, R = 6.5, TH = 2.4, WX = [9, 37];
const BARS = [[6, 20], [14, 18], [22, 16], [30, 14], [38, 12]];
const HX = L + 22, HY = W / 2 + 6, MAXD = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-R, -2, 0], [L + MAXD, W + 3, 0], [HX + MAXD + 3, HY + 3, 0], [0, 0, ZT + 14], [L + MAXD, W, ZT + 14], [-R, W + 3, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // a wheel: a disc standing in the x–z plane, from y0 to y1, with a hub and two spokes on its outer face
  function wheel(parent, y0, y1, face) {
    const s = solid(parent);
    const sp = mk("path", { class: "nf lo" }, s.g);
    return { s, sp, y0, y1, face };
  }
  function drawWheel(w, cx, ang) {
    const a = [], b = [];
    for (let i = 0; i < 28; i++) {
      const t = (i / 28) * Math.PI * 2;
      a.push(P(cx + R * Math.cos(t), w.y0, R + R * Math.sin(t)));
      b.push(P(cx + R * Math.cos(t), w.y1, R + R * Math.sin(t)));
    }
    w.s.sil.setAttribute("d", poly(hull(a.concat(b))));
    const f = w.face, rim = [], hub = [];
    for (let i = 0; i < 28; i++) {
      const t = (i / 28) * Math.PI * 2;
      rim.push(P(cx + (R - 1.2) * Math.cos(t), f, R + (R - 1.2) * Math.sin(t)));
      hub.push(P(cx + 1.3 * Math.cos(t), f, R + 1.3 * Math.sin(t)));
    }
    let d = poly(rim) + poly(hub);
    for (let k = 0; k < 2; k++) {
      const t = ang + (k * Math.PI) / 2, c = Math.cos(t), s = Math.sin(t);
      d += seg(P(cx + 1.3 * c, f, R + 1.3 * s), P(cx + (R - 1.2) * c, f, R + (R - 1.2) * s));
      d += seg(P(cx - 1.3 * c, f, R - 1.3 * s), P(cx - (R - 1.2) * c, f, R - (R - 1.2) * s));
    }
    w.sp.setAttribute("d", d);
  }

  // back to front: far wheels, the cart, its bars, the mallet, the near wheels, then the string and handle on the floor
  const far = WX.map(() => wheel(g, -TH, 0, -TH));
  const cart = solid(g);
  const bars = BARS.map(() => solid(g));
  const post = solid(g);
  const stick = mk("path", { class: "nf" }, g);
  const head = solid(g);
  const near = WX.map(() => wheel(g, W, W + TH, W + TH));
  const string = mk("path", { class: "nf" }, g);
  const handle = solid(g);

  function rect(x0, y0, x1, y1, r, b) { return rings(x0, y0, x1, y1, r, b); }
  function draw(d, ang) {
    far.forEach((w, i) => drawWheel(w, WX[i] + d, ang));
    let [o, n] = rect(d - 2, 0, d + L, W, 4, 1.2);
    put(cart, prism(P, front, o, n, ZB, ZT));
    BARS.forEach(([x, len], i) => {
      [o, n] = rect(d + x - 2.6, W / 2 - len / 2, d + x + 2.6, W / 2 + len / 2, 1.4, 0.7);
      put(bars[i], prism(P, front, o, n, ZT + 1, ZT + 2.6));
    });
    // the mallet: a post at the cart's back corner, a stick to a ball that bobs as the wheels turn
    [o, n] = rect(d + 0.5, 1, d + 4.5, 5, 1.6, 0.6);
    put(post, prism(P, front, o, n, ZT, ZT + 9));
    const bob = 3.2 * Math.abs(Math.sin(ang * 1.5)), hx = d + 22, hz = ZT + 4 + bob;
    stick.setAttribute("d", open([P(d + 2.5, 3, ZT + 8), P(hx, W / 2 - 1, hz + 1)]));
    [o, n] = rings(hx - 2.4, W / 2 - 3.4, hx + 2.4, W / 2 + 1.4, 2.4, 0.8);
    put(head, prism(P, front, o, n, hz, hz + 4));
    near.forEach((w, i) => drawWheel(w, WX[i] + d, ang));
    // the string: from the front hitch, sagging to the bead handle on the floor
    const hx0 = HX + d, pts = [];
    for (let i = 0; i <= 12; i++) {
      const t = i / 12, slack = (1 - d / (MAXD + 1)) * 4;
      pts.push(P(lerp(d + L, hx0, t), lerp(W / 2, HY, t) + slack * Math.sin(t * Math.PI), Math.max(0.3, (1 - t) * 9 - 3 * Math.sin(t * Math.PI))));
    }
    string.setAttribute("d", open(pts));
    const hr = circ(2.8, 14), hi = circ(1.8, 14);
    const mv = (ring) => ring.map((p) => ({ ...p, u: p.u + hx0 + 2, v: p.v + HY }));
    put(handle, prism(P, front, mv(hr), mv(hi), 0, 3.2));
  }
  function lerp(a, b, t) { return a + (b - a) * t; }

  const sp = spring(0);
  let last = NaN;
  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    if (sp.x !== last) { last = sp.x; draw(sp.x, -sp.x / R); }
    return moving;
  });
  bag.add(B.unregister);
  handle.sil.classList.add("hi");

  // the hit: the pointer on the floor plane, which never moves; how far ahead of the cart's nose it is
  function target([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (y < -16 || y > W + 22 || x < -12) return 0;
    return clamp((x - L) * 0.8, 0, reach);
  }
  function setPull(d) {
    sp.t = d;
    read.textContent = d < 0.5 ? "rest" : "+" + Math.round(d) + "cm";
    B.wake();
  }
  setPull(0);
  draw(0, 0);
  last = 0;
  bag.add(pointer(stage, { move: (p) => setPull(target(p)), leave: () => setPull(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "xylophonetoy",
  means: "A xylophone pull toy: the pointer ahead of it on the floor pulls it along, wheels turning and the mallet bobbing on the bars.",
  rules: [1, 3, 5, 8],
  range: [10, 18, 26],
  tour: [[285, 247], [308, 258], [353, 281], null],
  mount,
});
