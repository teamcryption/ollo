/**
 * Drop tower: a tall column on a round footing, a capped top, and a ring of
 * seats clamped round the column. The pointer's height along the tower sets
 * where the ring rides: up the column it climbs, down it drops. At rest the
 * ring waits low, bright. The slider is how much of the column it travels.
 *
 * The pattern: one part on a track, following the pointer (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, poly, prism, proj, rrect, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 118, RR = 26, RH = 10, Z0 = 6, REST = 18, NS = 6;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
function box(cx, cy, w, d, a, r) {
  const c = Math.cos(a), s = Math.sin(a);
  return rrect(-w / 2, -d / 2, w / 2, d / 2, r, 4).map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let travel = value / 100;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-RR - 8, -RR - 8, 0], [RR + 8, RR + 8, 0], [0, 0, H + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 22, 48), disc(0, 0, 19, 48), 0, Z0));
  // seats: far ones behind the column, near ones in front of the ring
  const seats = [];
  for (let k = 0; k < NS; k++) seats.push({ a: (k / NS) * Math.PI * 2 + Math.PI / NS });
  const depth = (a) => Math.cos(a) + Math.sin(a);
  const far = mk("g", {}, g), colLo = solid(g), ring = solid(g), colHi = solid(g), near = mk("g", {}, g);
  for (const st of seats) {
    st.s = solid(depth(st.a) < 0 ? far : near);
    st.ring = box(Math.cos(st.a) * (RR + 3), Math.sin(st.a) * (RR + 3), 7, 9, st.a, 2);
    st.inner = box(Math.cos(st.a) * (RR + 3), Math.sin(st.a) * (RR + 3), 4.6, 6.6, st.a, 1);
  }
  ring.sil.classList.add("hi");
  const col = disc(0, 0, 5, 24), colIn = disc(0, 0, 3.6, 24);
  const cap = solid(g);
  put(cap, prism(P, front, disc(0, 0, 9, 32), disc(0, 0, 7.4, 32), H, H + 6));

  const h = spring(REST);
  let last = NaN;
  function draw(z) {
    if (Math.abs(z - last) < 0.01) return;
    last = z;
    put(colLo, prism(P, front, col, colIn, Z0, z));
    put(ring, prism(P, front, disc(0, 0, RR, 48), disc(0, 0, RR - 2.4, 48), z, z + RH));
    put(colHi, prism(P, front, col, colIn, z + RH, H));
    for (const st of seats) put(st.s, prism(P, front, st.ring, st.inner, z - 9, z + RH - 2));
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(h.x); return m; });
  bag.add(B.unregister);

  const top = P(0, 0, H - RH), bot = P(0, 0, REST);
  function aim(p) {
    if (!p || Math.abs(p[0] - top[0]) > 80 || p[1] < top[1] - 40 || p[1] > bot[1] + 40) { h.t = REST; read.textContent = "rest"; }
    else {
      const f = clamp((bot[1] - p[1]) / (bot[1] - top[1]), 0, 1);
      h.t = REST + f * travel * (H - RH - 4 - REST);
      read.textContent = "h " + Math.round((100 * (h.t - REST)) / (H - RH - 4 - REST));
    }
    B.wake();
  }
  read.textContent = "rest";
  let lastP = null;
  bag.add(pointer(stage, { move: (p) => { lastP = p; aim(p); }, leave: () => { lastP = null; aim(null); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { travel = v / 100; if (lastP) aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "droptower",
  means: "A drop tower: the ring of seats rides the column to the pointer's height, climbing as it rises and dropping as it falls.",
  rules: [1, 3, 5, 8],
  range: [30, 85, 100],
  tour: [[200, 85], [200, 180], [200, 58], null],
  mount,
});
