/**
 * Patient lift: a mast on a splayed wheeled base, a boom from its top with a
 * spreader bar and a sling hanging from the end. The pointer's side swings
 * the boom round the mast, on a spring. At rest it is swung a little, the
 * sling bright. The slider is the reach of the swing.
 */
const { Cam, circ, clamp, fit, hull, poly, proj, rings, seg, spring, stepS, disposer, mk, pointer, register, solid } = HL;

const MX = 8, MY = 30, REST = -0.4;
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-2, -6, 0], [92, -6, 0], [92, 66, 0], [-2, 66, 0], [8, 30, 116], [70, -30, 116], [70, 90, 116]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const W = (tf, ring, z) => ring.map((q) => P(...tf([q.u, q.v, z])));
  const body = (s, [o, i], z0, z1, tf, o1 = o) => {
    s.sil.setAttribute("d", poly(hull(W(tf, o, z0).concat(W(tf, o1, z1)))));
    s.cr.setAttribute("d", poly(W(tf, i, z1)));
  };
  const id = (p) => p;
  for (const y of [0, 54]) {
    for (const x of [6, 84]) body(solid(g), [disc(x, y + 3, 3.5), disc(x, y + 3, 2.2)], 0, 3, id);
    body(solid(g), rings(0, y, 90, y + 6, 3, 1.2), 3, 8, id);
  }
  body(solid(g), rings(0, 6, 14, 54, 3, 1.4), 3, 12, id);
  body(solid(g), rings(MX - 5, MY - 5, MX + 5, MY + 5, 3, 1.4), 12, 112, id);

  const boom = solid(g), chain = mk("path", { class: "nf lo" }, g), bar = solid(g), sling = solid(g);
  sling.sil.classList.add("hi");
  const sp = spring(REST);
  let last = NaN;
  function draw(t) {
    const a = t * 0.8, c = Math.cos(a), s = Math.sin(a);
    const tf = ([x, y, z]) => { const dx = x - MX, dy = y - MY; return [MX + dx * c - dy * s, MY + dx * s + dy * c, z]; };
    body(boom, rings(MX - 3, MY - 3.5, MX + 70, MY + 3.5, 3, 1.2), 106, 114, tf);
    const E = tf([MX + 66, MY, 106]);
    chain.setAttribute("d", seg(P(...E), P(E[0], E[1], 86)) + seg(P(...tf([MX + 66, MY - 14, 80])), P(E[0], E[1], 86)) + seg(P(...tf([MX + 66, MY + 14, 80])), P(E[0], E[1], 86)));
    body(bar, rings(MX + 63, MY - 17, MX + 69, MY + 17, 3, 1.2), 78, 82, tf);
    const pts = [];
    for (const [r, w, z] of [[6, 15, 76], [9, 13, 62], [10, 10, 52], [7, 6, 44]]) pts.push(...W(tf, rings(MX + 66 - r, MY - w, MX + 66 + r, MY + w, Math.min(r, w) - 0.5, 1)[0], z));
    sling.sil.setAttribute("d", poly(hull(pts)));
    sling.cr.setAttribute("d", poly(W(tf, rings(MX + 61, MY - 13, MX + 71, MY + 13, 4, 1)[0], 75)));
  }
  const B = register(stage, (dt) => {
    const moving = stepS(sp, dt);
    if (sp.x !== last) { last = sp.x; draw(sp.x); }
    return moving;
  });
  bag.add(B.unregister);

  function aim(p) {
    const t = p ? clamp((p[0] - 200) / 130, -1, 1) * reach : REST;
    sp.t = t;
    read.textContent = p ? (t >= 0 ? "+" : "") + Math.round(t * 46) + "°" : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "slingstand",
  means: "A patient lift on a wheeled base: the pointer's side swings the boom round the mast, the spreader bar and sling swinging with it.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.8, 1],
  tour: [[235, 167], [320, 150], [90, 170], null],
  mount,
});
