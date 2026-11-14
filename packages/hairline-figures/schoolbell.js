/**
 * School bell: a cast bell hung from a yoke between two posts on a plinth.
 * The pointer's place across the frame swings the bell about its yoke, on a
 * spring, the clapper lagging behind. At rest the bell hangs a little
 * tipped, its mouth bright. The slider is the swing's reach.
 *
 * The pattern: one object answering a continuous input (swing).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 96, BH = 34, BR = 20, REST = 8;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-34, -34, 0], [34, 34, 0], [-34, 34, H + 8], [34, -34, H + 8], [-46, 0, H - 30], [46, 0, H - 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-30, -30, 30, 30, 6, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 8));
  const post = (y) => { const [a, b] = rings(-4, y - 4, 4, y + 4, 2, 1); put(solid(g), prism(P, front, a, b, 8, H)); };
  post(-26);
  // the swing point: the bell turns about the y axis at height H - 4
  const Z0 = H - 6;
  const rot = (x, y, z, a) => { const dz = z - Z0; return P(x * Math.cos(a) + dz * Math.sin(a), y, Z0 - x * Math.sin(a) + dz * Math.cos(a)); };
  const ring = (r, z, a, n = 28) => circ(r, n).map((q) => rot(q.u, q.v, z, a));
  const clap = mk("path", { class: "nf" }, g);
  const bell = mk("path", { class: "sil" }, g), lip = mk("path", { class: "nf hi" }, g), crown = mk("path", { class: "nf" }, g);
  post(26);
  const [br, bi] = rings(-5, -30, 5, 30, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, H, H + 6));

  const sw = spring(rad(REST)), cl = spring(rad(REST), { k: 60, c: 9 });
  let last = NaN;
  function draw(a, c) {
    const key = a * 1000 + c;
    if (key === last) return;
    last = key;
    const z1 = Z0 - 4, z0 = z1 - BH, pts = [];
    for (const [r, z] of [[7, z1], [9, z1 - 6], [11, z1 - 16], [15, z0 + 8], [BR, z0 + 1], [BR, z0]]) pts.push(...ring(r, z, a));
    bell.setAttribute("d", poly(hull(pts)));
    lip.setAttribute("d", poly(ring(BR - 1.5, z0 + 3, a)));
    crown.setAttribute("d", poly(hull(ring(3, z1, a, 12).concat(ring(3, Z0 + 2, a, 12)))));
    const cz = Z0 - BH - 3, cx = (cz - Z0) * Math.sin(c), czz = Z0 + (cz - Z0) * Math.cos(c);
    clap.setAttribute("d", poly(hull(circ(3.2, 14).map((q) => P(cx + q.u, q.v, czz)).concat(circ(3.2, 14).map((q) => P(cx + q.u, q.v, czz + 4))))));
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt) | stepS(cl, dt); draw(sw.x, cl.x); return !!m; });
  bag.add(B.unregister);
  draw(sw.x, cl.x);
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx]) => {
      const f = clamp((sx - 200) / 140, -1, 1), deg = Math.round(-18 + f * (18 + 14 * reach / 100));
      sw.t = rad(clamp(deg, -32, 32)); cl.t = sw.t * 0.55;
      read.textContent = Math.abs(clamp(deg, -32, 32)) + "°";
      B.wake();
    },
    leave: () => { sw.t = rad(REST); cl.t = rad(REST); read.textContent = "rest"; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "schoolbell",
  means: "A school bell hung on a yoke between two posts: the pointer across the frame swings it, the clapper lagging behind.",
  rules: [3, 4, 5, 8],
  range: [0, 50, 100],
  tour: [[110, 150], [300, 160], [200, 130], null],
  mount,
});
