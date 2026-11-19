/**
 * Pantograph: four flat arms pinned into a parallelogram, the long pair
 * hinged to a clamp at the far corner of the board. A stylus rides at the
 * middle joint and a pencil at the far end, drawing twice as large. The
 * pointer leads the pencil; the lattice opens and folds to follow. At rest
 * the pencil is the bright mark.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 56, RX = 66, RY = 46, ZA = 6;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[-8, -8, 0], [90, 70, 0], [90, -8, 0], [-8, 70, 0], [0, 0, 16], [RX, RY, 24]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "lo", d: poly([[14, 4, 0], [92, 4, 0], [92, 72, 0], [14, 72, 0]].map((p) => P(...p))) }, g);
  const base = solid(g);
  put(base, prism(P, front, disc(0, 0, 8), disc(0, 0, 6.5), 0, 12));
  const bars = mk("path", { class: "sil" }, g), pins = mk("path", { class: "nf" }, g);
  const sty = mk("path", { class: "sil" }, g), pen = solid(g);
  pen.sil.classList.add("hi");
  const tx = tween(RX), ty = tween(RY);
  let lx = NaN, ly = NaN;
  const bar = (a, b, r) => { const pts = []; for (const [x, y] of [a, b]) for (const z of [ZA - r, ZA + r]) pts.push(...ringAt(P, disc(x, y, r, 12), z)); return poly(hull(pts)); };
  function draw(x, y) {
    if (x === lx && y === ly) return;
    lx = x; ly = y;
    const d = Math.hypot(x, y), a = Math.atan2(y, x), e = a + Math.acos(clamp(d / (2 * L), -1, 1));
    const B = [L * Math.cos(e), L * Math.sin(e)], O = [0, 0], Q = [x, y];
    const Cm = [B[0] / 2, B[1] / 2], D = [(B[0] + x) / 2, (B[1] + y) / 2], S = [x / 2, y / 2];
    bars.setAttribute("d", bar(O, B, 2) + bar(B, Q, 2) + bar(Cm, S, 1.6) + bar(D, S, 1.6));
    pins.setAttribute("d", [O, B, Cm, D].map(([u, v]) => poly(ringAt(P, disc(u, v, 1.6, 12), ZA + 2))).join(""));
    sty.setAttribute("d", poly(hull(ringAt(P, disc(S[0], S[1], 2.5, 16), ZA + 2).concat([P(S[0], S[1], 0)]))));
    put(pen, prism(P, front, disc(x, y, 2.6, 20), disc(x, y, 2, 20), 0, 22));
  }
  const Bk = register(stage, (_dt, now) => { draw(tval(tx, now), tval(ty, now)); return !(tdone(tx, now) && tdone(ty, now)); });
  bag.add(Bk.unregister);
  function aim(p) {
    let x = RX, y = RY;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      x = clamp(RX + (wx - RX) * amt, 30, 92); y = clamp(RY + (wy - RY) * amt, 0, 72);
      const d = Math.hypot(x, y), m = 2 * L - 6;
      if (d > m) { x *= m / d; y *= m / d; }
      if (d < 30) { x *= 30 / d; y *= 30 / d; }
    }
    const now = performance.now();
    tset(tx, x, now, 0); tset(ty, y, now, 0);
    read.textContent = p ? "×2" : "rest";
    Bk.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; }, destroy: bag.dispose };
}

hairline({
  name: "pantograph",
  means: "A pantograph's pinned lattice of arms: the pointer leads the pencil, and the arms open and fold to follow it.",
  rules: [1, 2, 4, 5],
  range: [0.3, 1, 1],
  tour: [[98, 210], [374, 201], [245, 171], null],
  mount,
});
