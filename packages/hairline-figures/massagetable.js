/**
 * Massage table: a padded top on four legs, the head end a hinged section
 * with a face cradle. The pointer raises the head section: the further
 * along the table it stands, the steeper the section tilts on its spring.
 * At rest the section leans up a little, bright. The slider is the steepest
 * tilt it can reach.
 *
 * The pattern: one part answering where the pointer stands (terrain).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, rrect, unproj, rad,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const L = 96, HL_ = 44, W = 40, Z = 30, T = 6, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[0, 0, 0], [L + HL_, W, 0], [L + HL_, 0, 0], [0, W, 0], [0, 0, Z + T], [L + 20, W, Z + 40]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // legs, back to front, then a stretcher between each pair
  for (const [x, y] of [[6, 6], [L - 10, 6], [6, W - 10], [L - 10, W - 10]].sort((a, b) => a[0] + a[1] - b[0] - b[1])) {
    const [lr, li] = rings(x, y, x + 4, y + 4, 2, 0.6);
    put(solid(g), prism(P, front, lr, li, 0, Z));
  }
  // the body pad
  const [br, bi] = rings(0, 0, L, W, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, Z, Z + T));
  mk("path", { d: "M" + P(L * 0.5, 1.5, Z + T).join(",") + "L" + P(L * 0.5, W - 1.5, Z + T).join(","), class: "nf lo" }, g);
  // the head section, hinged at x = L
  const sec = solid(g), hole = mk("path", { class: "nf lo" }, g);
  sec.sil.classList.add("hi");
  const ring = rrect(1, 0, HL_, W, 6, 6), inner = rrect(2.6, 1.6, HL_ - 1.6, W - 1.6, 4.5, 6), cradle = rrect(HL_ - 18, W / 2 - 6, HL_ - 7, W / 2 + 6, 5, 6);
  const at = (u, v, n, a) => P(L + u * Math.cos(a) - n * Math.sin(a), v, Z + u * Math.sin(a) + n * Math.cos(a));
  const sp = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (Math.abs(deg - last) < 0.01) return;
    last = deg;
    const a = rad(deg);
    const pts = ring.map((q) => at(q.u, q.v, 0, a)).concat(ring.map((q) => at(q.u, q.v, T, a)));
    sec.sil.setAttribute("d", poly(hull(pts)));
    sec.cr.setAttribute("d", poly(inner.map((q) => at(q.u, q.v, T, a))));
    hole.setAttribute("d", poly(cradle.map((q) => at(q.u, q.v, T, a))));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(REST);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z);
    if (x < -20 || x > L + HL_ + 20 || y < -30 || y > W + 30) return leave();
    const u = clamp(x / (L + HL_), 0, 1);
    sp.t = clamp(REST + (most - REST) * u, 0, 45);
    read.textContent = Math.round(sp.t) + "°";
    B.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = v; }, destroy: bag.dispose };
}

hairline({
  name: "massagetable",
  means: "A massage table with a hinged head section: the pointer tilts the section up, steeper the further along the table it stands.",
  rules: [1, 3, 5, 6],
  range: [20, 38, 45],
  tour: [[160, 110], [230, 150], [274, 174], null],
  mount,
});
