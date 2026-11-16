/**
 * Tie press: a flat board with a padded press lid hinged along its back
 * edge. A bow tie lies pressed on the board. The pointer over the board
 * swings the lid open to show the tie; leaving lets it settle back ajar.
 * At rest the lid stands a little open, bright. The slider is how far it opens.
 */
const { Cam, fit, proj, rrect, hull, poly, rad, fillet, unproj, tween, tset, tval, tdone, mk, register, pointer, disposer } = HL;

const W = 120, D = 64, BZ = 6, LT = 5, REST = 14;
const ring = (x0, y0, x1, y1, r) => rrect(x0, y0, x1, y1, r).map((q) => [q.u, q.v]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, -16, BZ + D + 4], [W, -16, BZ + D + 4]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const flat = (r, z) => poly(r.map(([u, v]) => P(u, v, z)));
  const slab = (r, z0, z1, T) => { const pts = []; for (const [u, v] of r) pts.push(P(...T([u, v, z0])), P(...T([u, v, z1]))); return poly(hull(pts)); };
  const id = (p) => p;
  mk("path", { class: "sil", d: slab(ring(0, 0, W, D, 6), 0, BZ, id) }, g);
  mk("path", { class: "nf lo", d: flat(ring(2, 2, W - 2, D - 2, 4.5), BZ) }, g);
  // the bow tie: two wings and a knot, pressed flat
  const cx = W / 2, cy = D / 2 + 2;
  const wing = (s) => fillet([[cx + s * 6, cy - 5], [cx + s * 40, cy - 17], [cx + s * 44, cy], [cx + s * 40, cy + 17], [cx + s * 6, cy + 5]], [2, 5, 6, 5, 2]).map(([u, v]) => P(u, v, BZ));
  mk("path", { class: "nf", d: poly(wing(-1)) }, g);
  mk("path", { class: "nf", d: poly(wing(1)) }, g);
  mk("path", { class: "nf", d: flat(ring(cx - 6, cy - 7, cx + 6, cy + 7, 2.5), BZ) }, g);
  const lid = mk("path", { class: "sil" }, g), lidCr = mk("path", { class: "nf lo" }, g);
  const LR = ring(0, 0, W, D, 6), LI = ring(2, 2, W - 2, D - 2, 4.5);
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    const T = ([x, y, z]) => { const dz = z - BZ; return [x, y * c - dz * s, BZ + y * s + dz * c]; };
    lid.setAttribute("d", slab(LR, BZ, BZ + LT, T));
    const zc = a < 60 ? BZ + LT : BZ;
    lidCr.setAttribute("d", poly(LI.map(([u, v]) => P(...T([u, v, zc])))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(ang, o ? maxA : REST, performance.now(), 0);
    lid.classList.add("hi");
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) { const [x, y] = unproj(C, sx, sy, BZ); return x > -8 && x < W + 8 && y > -8 && y < D + 8; }
  set(false);
  bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; if (on) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "bowtie",
  means: "A tie press: the pointer over the board swings the padded lid open on its hinge to show the bow tie pressed flat beneath.",
  rules: [1, 3, 5, 6],
  range: [50, 80, 105],
  tour: [[200, 170], [200, 170], [200, 170], null],
  mount,
});
