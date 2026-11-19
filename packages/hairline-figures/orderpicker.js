/**
 * Order picker: a narrow-aisle truck, a low wheeled base with a tall twin
 * mast at its back and an operator platform with guard rails riding up the
 * mast. The pointer over the truck sends the platform up, higher the higher
 * the pointer is. At rest the platform waits just off the base, bright. The
 * slider is how far up the mast the platform may climb.
 *
 * The pattern: a continuous value on a spring, read against the fixed mast.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, spring, stepS, open,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 12, REST = 6, LMAX = 64, MAST = BZ + LMAX + 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-4, -4, 0], [62, 36, 0], [62, -4, 0], [-4, 36, 0], [0, 0, MAST + 2], [56, 32, BZ + LMAX + 30]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 1.5, b = 0.7) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(par); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const wheelRing = (cx, y, cz, r, n = 24) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(cx + r * Math.cos(t), y, cz + r * Math.sin(t)); });
  const wheel = (cx, y) => mk("path", { d: poly(hull(wheelRing(cx, y, 4, 4).concat(wheelRing(cx, y + 3, 4, 4)))), class: "sil" }, g);
  wheel(8, -2); wheel(50, -2);
  // the base: a long low body, a battery hood at the back
  box(g, -2, 0, 60, 32, 3, BZ, 5, 1.8);
  box(g, -2, 2, 12, 30, BZ, BZ + 8, 4, 1.4);
  // the mast: two rails and a crosshead
  box(g, 10, 3, 15, 8, BZ, MAST, 1, 0.5);
  box(g, 10, 24, 15, 29, BZ, MAST, 1, 0.5);
  box(g, 10, 3, 15, 29, MAST - 4, MAST, 1, 0.5);
  // the platform: redrawn with its height
  const lift = mk("g", {}, g);
  const carr = solid(lift), floor = solid(lift);
  const body = solid(lift), head = solid(lift), rail = mk("path", { class: "nf" }, lift), posts = mk("path", { class: "nf" }, lift);
  floor.sil.classList.add("hi");
  wheel(8, 32); wheel(50, 32);

  const disc = (x, y, r) => rrect(x - r, y - r, x + r, y + r, r, 6);
  let last = NaN;
  function draw(h) {
    if (Math.abs(h - last) < 0.01) return;
    last = h;
    const z = BZ + 2 + h;
    put(carr, prism(P, front, ...rings(15, 4, 19, 28, 1, 0.5), z, z + 22));
    put(floor, prism(P, front, ...rings(15, 1, 56, 31, 3, 1.2), z, z + 3));
    put(body, prism(P, front, disc(30, 16, 5.5), disc(30, 16, 4.5), z + 3, z + 22));
    put(head, prism(P, front, disc(30, 16, 3.6), disc(30, 16, 2.8), z + 23, z + 29));
    const top = rrect(18, 3, 54, 29, 3, 4);
    rail.setAttribute("d", open(ringAt(P, top, z + 20).concat([ringAt(P, top, z + 20)[0]])));
    let d = "";
    for (const [px, py] of [[18, 3], [54, 3], [18, 29], [54, 29]]) d += seg(P(px, py, z + 3), P(px, py, z + 20));
    d += seg(P(54, 16, z + 18), P(48, 16, z + 18)) + seg(P(48, 16, z + 18), P(48, 16, z + 14));
    posts.setAttribute("d", d);
  }

  const hz = spring(REST);
  const B = register(stage, (dt) => { const m = stepS(hz, dt); draw(hz.x); return m; });
  bag.add(B.unregister);

  // the hit: the pointer's height against the fixed mast, inside the truck's static box
  const lo = P(36, 16, BZ), hi = P(36, 16, BZ + LMAX + 20), L = P(-2, 32, 0)[0] - 20, R = P(60, 0, 0)[0] + 20;
  let over = null;
  function retarget() {
    if (over && over[0] > L && over[0] < R && over[1] > hi[1] - 40 && over[1] < lo[1] + 60) {
      const t = clamp((lo[1] - over[1]) / (lo[1] - hi[1]), 0, 1);
      hz.t = LMAX * reach * (0.55 + 0.45 * t);
      read.textContent = "up " + Math.round(hz.t);
    } else { hz.t = REST; read.textContent = "rest"; }
    B.wake();
  }
  bag.add(pointer(stage, { move: (p) => { over = p; retarget(); }, leave: () => { over = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { reach = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "orderpicker",
  means: "An order picker truck: the operator platform rides up the mast, higher as the pointer rises over the truck.",
  rules: [1, 3, 5, 8],
  range: [0.3, 0.7, 1],
  tour: [[211, 196], [211, 140], [211, 84], null],
  mount,
});
