/**
 * Sewing frame: a bookbinder's frame, a crossbar on two posts with cords
 * strung down to the bed, and a text block waiting at the cords. The
 * pointer over the frame swings the open signature shut onto the block,
 * as each section is sewn on. At rest the open leaf is bright, lifted.
 */
const { Cam, fit, hull, poly, proj, fillet, seg, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const s = Math.SQRT1_2, U0 = 0, ZB = 8, ZS = 18, L = 60, OPEN = 110, TOP = 96;
const W = (u, w, z) => [u, w, z];
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [W(-60, -44, 0), W(60, 44, 0), W(-60, 44, 0), W(60, -44, 0), W(0, -44, TOP + 10), W(-50, 30, 50)], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  function part() {
    const q = mk("g", {}, g);
    return { sil: mk("path", { class: "sil" }, q), cr: mk("path", { class: "nf lo" }, q) };
  }
  function draw(pt, pts, w0, w1, th = 0, pv = [U0, ZS]) {
    const c = Math.cos(th), si = Math.sin(th);
    const r = fillet(pts, pts.map(() => 1.5), 3).map(([u, z]) => { const du = u - pv[0], dz = z - pv[1]; return [pv[0] + du * c - dz * si, pv[1] + du * si + dz * c]; });
    const a = r.map(([u, z]) => P(...W(u, w0, z))), b = r.map(([u, z]) => P(...W(u, w1, z)));
    pt.sil.setAttribute("d", poly(hull(a.concat(b))));
    pt.cr.setAttribute("d", poly(b));
  }
  const post = (w) => draw(part(), [[-5, ZB], [5, ZB], [5, TOP], [-5, TOP]], w - 4, w + 4);
  draw(part(), [[-62, 0], [62, 0], [62, ZB], [-62, ZB]], -46, 46);
  post(-40);
  draw(part(), [[U0, ZB], [U0 + L, ZB], [U0 + L, ZS], [U0, ZS]], -30, 30);
  const cords = mk("path", { class: "nf" }, g);
  cords.setAttribute("d", [-22, -7, 7, 22].map((w) => seg(P(...W(U0, w, ZB)), P(...W(U0, w, TOP - 6)))).join(""));
  const leaf = part();
  post(40);
  draw(part(), [[-6, TOP - 6], [6, TOP - 6], [6, TOP + 4], [-6, TOP + 4]], -46, 46);
  const th = spring(rad(OPEN));
  let last = NaN;
  function redraw() {
    if (th.x === last) return;
    last = th.x;
    draw(leaf, [[U0, ZS], [U0 + L, ZS], [U0 + L, ZS + 1.6], [U0, ZS + 1.6]], -34, 34, th.x);
  }
  redraw();
  const B = register(stage, (dt) => { const m = stepS(th, dt); redraw(); return m; });
  bag.add(B.unregister);
  const cen = P(...W(0, 0, 40));
  let on = null;
  function set(p) {
    const inside = !!p && Math.abs(p[0] - cen[0]) < 150 && Math.abs(p[1] - cen[1]) < 110;
    const t = inside ? clamp((p[0] - cen[0] + 150) / 300, 0, 1) : 0;
    th.t = rad(inside ? OPEN * (1 - amt * (0.9 + 0.1 * t)) : OPEN);
    if (inside !== on) { on = inside; leaf.sil.classList.toggle("hi", true); }
    read.textContent = inside ? "sig " + Math.round((th.t * 180) / Math.PI) : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; }, destroy: bag.dispose };
}

hairline({
  name: "bookbind",
  means: "A bookbinder's sewing frame: the pointer swings the open signature shut onto the text block at the cords.",
  rules: [1, 3, 5, 8],
  range: [0, 0.8, 1],
  tour: [[132, 177], [234, 214], [268, 245], null],
  mount,
});
