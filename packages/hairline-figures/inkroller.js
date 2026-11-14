/**
 * Ink brayer: a glass inking slab with a rubber brayer standing on it, its
 * yoke and handle reaching back. The pointer rolls the brayer along the slab
 * to where it stands, and the ink band follows it. At rest the brayer waits
 * part way, bright, with a band laid behind it. The slider is the band's width.
 *
 * The pattern: one part tracking the pointer on a fixed plane.
 */
const {
  Cam, fit, hull, poly, open, prism, proj, rings, unproj, clamp, tdone, tset, tval, tween,
  disposer, mk, pointer, register, solid, put, facing,
} = HL;

const L = 170, W = 80, SZ = 5, R = 11, Y0 = 12, Y1 = 68, X0 = 18, X1 = 152, REST = 104;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wid = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0], [X0 - 48, 40, SZ + 2 * R + 46], [X1 + R, Y1, SZ + 2 * R]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, L, W, 6, 3);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  const band = mk("path", { class: "nf lo" }, g);
  const yoke = mk("path", { class: "nf" }, g), grip = mk("path", {}, g);
  const roll = mk("path", { class: "sil hi" }, g), cap = mk("path", { class: "nf lo" }, g), ax = mk("path", { class: "nf lo" }, g);
  const x = tween(REST);
  let last = NaN, lastW = NaN;
  const zc = SZ + R;
  const circle = (cx, y, r, zz, n = 28) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; o.push(P(cx + r * Math.cos(t), y, zz + r * Math.sin(t))); } return o; };

  function draw(px) {
    if (px === last && wid === lastW) return;
    last = px; lastW = wid;
    const m = (Y0 + Y1) / 2, h = ((Y1 - Y0) / 2) * (0.55 + 0.45 * wid);
    band.setAttribute("d", poly([P(X0 - 8, m - h, SZ), P(px, m - h, SZ), P(px, m + h, SZ), P(X0 - 8, m + h, SZ)]));
    const hub = [px - 20, m, zc + 26], end = [px - 52, m, zc + 50];
    yoke.setAttribute("d", open([P(px, Y0 - 4, zc), P(px - 6, Y0 - 4, zc + 12), P(...hub), P(px - 6, Y1 + 4, zc + 12), P(px, Y1 + 4, zc)]));
    const gp = [];
    for (const [a, b, c] of [hub, end]) { const n = 16; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; gp.push(P(a, b + 4.5 * Math.cos(t), c + 4.5 * Math.sin(t))); } }
    grip.setAttribute("d", poly(hull(gp)));
    roll.setAttribute("d", poly(hull(circle(px, Y0, R, zc).concat(circle(px, Y1, R, zc)))));
    cap.setAttribute("d", poly(circle(px, Y1, R, zc)));
    ax.setAttribute("d", poly(circle(px, Y1, 2.5, zc, 12)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(x, now)); return !tdone(x, now); });
  bag.add(B.unregister);
  function aim(p) {
    const now = performance.now();
    let to = REST, lbl = "rest";
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], SZ);
      if (wx > -10 && wx < L + 10 && wy > -20 && wy < W + 20) { to = Math.round(clamp(wx, X0, X1)); lbl = Math.round(((to - X0) / (X1 - X0)) * 100) + "%"; }
    }
    tset(x, to, now, 0);
    read.textContent = lbl;
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wid = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "inkroller",
  means: "An ink brayer on a glass slab: the roller follows the pointer along the slab and the ink band trails behind it.",
  rules: [1, 3, 5, 6],
  range: [0, 0.6, 1],
  tour: [[134, 170], [194, 200], [278, 242], null],
  mount,
});
