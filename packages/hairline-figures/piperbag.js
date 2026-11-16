/**
 * Cake turntable: a footed stand with a round turning plate, a square cake
 * on it piped with four rosettes. The plate turns with the pointer's
 * screen x, as a decorator spins it; away, the cake rests at a slight turn,
 * its outline bright. The slider is how far one sweep turns it.
 *
 * The pattern: a part turning to the pointer (officechairs).
 */
const {
  Cam, circ, rrect, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS, clamp, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 40, CY = 40, PR = 38, PZ = 26, H = 26, A = 24, REST = 18;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sweep = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[CX - PR, CY - PR, 0], [CX + PR, CY + PR, 0], [CX - PR, CY + PR, 0], [CX + PR, CY - PR, 0], [CX, CY, PZ + H + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(CX, CY, 22), disc(CX, CY, 20), 0, 5));
  put(solid(g), prism(P, front, disc(CX, CY, 5), disc(CX, CY, 4), 5, PZ - 4));
  put(solid(g), prism(P, front, disc(CX, CY, PR), disc(CX, CY, PR - 2), PZ - 4, PZ));
  const cake = solid(g), top = mk("g", {}, g);
  cake.sil.classList.add("hi");
  const sq = rrect(-A, -A, A, A, 5, 12), sqi = rrect(-A + 2, -A + 2, A - 2, A - 2, 4, 12);
  const turn = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: CX + q.u * c - q.v * s, v: CY + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c })); };
  const ros = [0, 1, 2, 3].map(() => mk("path", { class: "nf" }, top));
  const ang = spring(REST, { k: 70, c: 16 });
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    const a = rad(d);
    put(cake, prism(P, front, turn(sq, a), turn(sqi, a), PZ, PZ + H));
    const c = Math.cos(a), s = Math.sin(a), spots = [];
    for (const [u, v] of [[-14, -14], [14, -14], [14, 14], [-14, 14]]) spots.push([CX + u * c - v * s, CY + u * s + v * c]);
    spots.sort((p, q) => p[0] + p[1] - q[0] - q[1]);
    spots.forEach(([x, y], i) => {
      const pts = [];
      for (const [r, z] of [[5, 0], [4.5, 2.5], [3, 5], [0.8, 7.5]]) pts.push(...ringAt(P, disc(x, y, r, 18), PZ + H + z));
      ros[i].setAttribute("d", poly(hull(pts)));
    });
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  draw(REST);
  read.textContent = "rest";
  function aim([sx]) {
    const d = Math.round(REST + clamp((sx - 200) / 130, -1, 1) * sweep);
    ang.t = d;
    read.textContent = d + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => { ang.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sweep = v; }, destroy: bag.dispose };
}

hairline({
  name: "piperbag",
  means: "A cake turntable: the plate turns the square, piped cake with the pointer's sideways position, as a decorator spins it.",
  rules: [1, 3, 5, 8],
  range: [30, 60, 90],
  tour: [[310, 82], [90, 82], [262, 150], null],
  mount,
});
