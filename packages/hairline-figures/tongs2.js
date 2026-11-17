/**
 * Salad tongs: two long arms with wide paddle heads, joined by a spring
 * hinge. The pointer over the figure opens the upper arm away from the
 * lower one. At rest the upper arm is bright and just ajar. The slider is
 * how wide it opens.
 */
const { Cam, fit, hull, poly, proj, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const rbox = (x0, y0, z0, x1, y1, z1, r) => { const a = []; for (const [cx, cy, s] of [[x1 - r, y1 - r, 0], [x0 + r, y1 - r, 1], [x0 + r, y0 + r, 2], [x1 - r, y0 + r, 3]]) for (let i = 0; i <= 4; i++) { const t = (s + i / 4) * Math.PI / 2; for (const z of [z0, z1]) a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z]); } return a; };
const cyl = (cx, cy, r, z0, z1, n = 20) => { const a = []; for (let i = 0; i < n; i++) { const t = (i / n) * 2 * Math.PI; a.push([cx + r * Math.cos(t), cy + r * Math.sin(t), z0], [cx + r * Math.cos(t), cy + r * Math.sin(t), z1]); } return a; };
const TH = (165 * Math.PI) / 180, U = [Math.cos(TH), Math.sin(TH)], V = [-Math.sin(TH), Math.cos(TH)];
const shaft = rbox(0, -4, 0, 70, 4, 3, 2), head = rbox(64, -13, 0, 112, 13, 3, 10);
function arm(local, e, h0) {
  const c = Math.cos(e), s = Math.sin(e);
  return local.map(([a, w, h]) => { const hh = h + h0, ss = a * c - hh * s, z = a * s + hh * c + 6; return [U[0] * ss + V[0] * w, U[1] * ss + V[1] * w, z]; });
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const E0 = (18 * Math.PI) / 180;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [...arm(head, 0, -6), ...arm(head, (58 * Math.PI) / 180, 0), ...cyl(0, 0, 8, 0, 12)], 200, 160);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p)), sol = (pts, cls = "sil") => mk("path", { class: cls, d: poly(hull(pp(pts))) }, g);
  const g = mk("g", {}, svg);
  sol([...arm(shaft, 0, -6), ...arm(head, 0, -6)]);
  mk("path", { class: "nf lo", d: poly(pp(arm(rbox(67, -10, 3, 109, 10, 3, 8), 0, -6).filter((_, i) => i % 2))) }, g);
  const up = mk("path", { class: "sil hi" }, g), cr = mk("path", { class: "nf lo" }, g);
  sol(cyl(0, 0, 7, 0, 12));
  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const e = E0 + (t * amt * Math.PI) / 180;
    up.setAttribute("d", poly(hull(pp([...arm(shaft, e, 0), ...arm(head, e, 0)]))));
    cr.setAttribute("d", poly(pp(arm(rbox(67, -10, 3, 109, 10, 3, 8), e, 0).filter((_, i) => i % 2))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = pp([...arm(head, 0, -6), ...arm(head, E0, 0), ...cyl(0, 0, 8, 0, 12)]), xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys) - 10, Math.max(...ys)];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([x, y]) => set(x > bx[0] && x < bx[1] && y > bx[2] && y < bx[3]), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "tongs2",
  means: "Salad tongs: the pointer opens the upper paddle arm away from the lower one round the spring hinge.",
  rules: [1, 3, 5, 6],
  range: [15, 30, 40],
  tour: [[137, 171], [110, 200], [250, 240], null],
  mount,
});
