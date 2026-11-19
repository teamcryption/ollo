/**
 * Junk ship: a broad hull with a high stern, one mast and its battened lug
 * sail. The pointer over the ship hoists the sail: the yard climbs the mast
 * and the battens fan open one above another. At rest the sail is folded in
 * a low stack on the boom, the yard bright. The slider is how high it hoists.
 *
 * The pattern: one part rising and opening.
 */
const {
  Cam, clamp, fit, fillet, hull, open, poly, proj, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const L = 130, W = 17, D = 14, NB = 7, H = 112, MX = 10, GAP = 3, REST = 0.08, N = 18;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 1.6);
  const ZB = D + 9;
  fit(C, [[-L / 2, -W, 0], [L / 2, W, 0], [-L / 2, 0, D + 14], [MX, 0, ZB + H + 8], [-50, 0, ZB + H + 10]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const half = (t, w) => w * Math.pow(Math.sin(Math.PI * clamp(t, 0.04, 1)), 0.55);
  const deck = (t) => D + 13 * Math.pow(1 - t, 5) + 5 * Math.pow(t, 6);
  function outline(len, w, zf) {
    const pts = [];
    for (let s = -1; s <= 1; s += 2) for (let i = 0; i <= N; i++) {
      const t = s > 0 ? i / N : 1 - i / N;
      pts.push(P((t - 0.5) * len, s * half(t, w), zf(t)));
    }
    return pts;
  }
  mk("path", { d: poly(hull(outline(L * 0.8, W * 0.6, () => 0).concat(outline(L, W, deck)))), class: "sil" }, g);
  mk("path", { d: poly(outline(L - 6, W - 2.4, (t) => deck(t) - 0.6)), class: "nf lo" }, g);
  // the mast, a thin pole from the deck past the hoisted yard
  mk("path", { d: poly(hull([P(MX - 1.2, 0, D), P(MX + 1.2, 0, D), P(MX - 1.2, 0, ZB + H + 8), P(MX + 1.2, 0, ZB + H + 8)])), class: "sil" }, g);

  const sail = mk("path", { class: "sil" }, g), bat = mk("path", { class: "nf lo" }, g), yard = mk("path", { class: "nf hi" }, g);
  // each batten keeps its own reach: the sail fans out wide low, narrow high
  const xa = (i) => -54 + 22 * Math.pow(i / NB, 1.4), xb = (i) => MX + 16 - 6 * (i / NB);
  const hz = tween(REST);
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const lo = [], hi = [];
    let d = "";
    for (let i = 0; i <= NB; i++) {
      const z = ZB + i * (GAP + (H / NB - GAP) * f), tz = z + 2.2 * i * f;
      const a = P(xa(i), 0, tz), b = P(xb(i), 0, z);
      lo.push(a); hi.push(b);
      if (i > 0 && i < NB) d += seg(a, b);
    }
    const ring = lo.concat(hi.reverse());
    sail.setAttribute("d", poly(fillet(ring, ring.map(() => 1.5))));
    bat.setAttribute("d", d);
    yard.setAttribute("d", open([lo[NB], ring[NB + 1]]));
  }

  const B = register(stage, (_dt, now) => { draw(tval(hz, now)); return !tdone(hz, now); });
  bag.add(B.unregister);

  const box = [P(-L / 2, W, 0), P(L / 2, -W, 0), P(L / 2, W, 0), P(-L / 2, -W, 0), P(-54, 0, ZB + H + 12), P(MX + 16, 0, ZB + H + 12)];
  const bx0 = Math.min(...box.map((q) => q[0])), bx1 = Math.max(...box.map((q) => q[0]));
  const by0 = Math.min(...box.map((q) => q[1])), by1 = Math.max(...box.map((q) => q[1]));
  let act = null;
  function setAim(p) {
    const on = !!p && p[0] > bx0 && p[0] < bx1 && p[1] > by0 && p[1] < by1;
    act = on;
    tset(hz, on ? top : REST, performance.now(), 0);
    read.textContent = on ? "up " + Math.round(top * 100) : "rest";
    B.wake();
  }
  setAim(null);
  draw(REST);
  bag.add(pointer(stage, { move: setAim, leave: () => setAim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; if (act) { tset(hz, top, performance.now(), 0); read.textContent = "up " + Math.round(top * 100); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "junkship",
  means: "A junk ship with one battened sail: the pointer over the ship hoists the yard and the folded sail fans open, as high as the slider sets.",
  rules: [1, 5, 6, 8],
  range: [0.4, 1, 1],
  tour: [[187, 191], [266, 266], [176, 130], null],
  mount,
});
