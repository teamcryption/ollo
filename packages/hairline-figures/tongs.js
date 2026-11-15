/**
 * Bunsen tripod: a three-legged ring stand with a square of wire gauze on
 * top and a burner standing under it. The pointer's bearing round the stand
 * turns the tripod and its gauze to face it; leaving turns them back to a
 * slight angle. The gauze is the bright mark. The slider is the rest angle.
 *
 * The pattern: a part turning to face the pointer (turn).
 */
const {
  Cam, fit, facing, circ, fillet, hull, open, poly, prism, proj, rad, ringAt, rings, unproj, spring, stepS, r2,
  disposer, mk, pointer, put, register, solid,
} = HL;

const RT = 24, RF = 34, ZT = 62, G = 30;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-42, -42, 0], [42, 42, 0], [42, -42, 0], [-42, 42, 0], [0, 0, ZT + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const back = mk("g", {}, g);
  // the burner: a foot, a barrel, an air collar and a cone of flame
  const bg = mk("g", {}, g);
  put(solid(bg), prism(P, front, disc(0, 0, 11), disc(0, 0, 9), 0, 4));
  put(solid(bg), prism(P, front, disc(0, 0, 3.6, 16), disc(0, 0, 2.6, 16), 4, 40));
  put(solid(bg), prism(P, front, disc(0, 0, 4.8, 16), disc(0, 0, 4, 16), 12, 19));
  mk("path", { d: poly(hull(ringAt(P, disc(0, 0, 3, 12), 41).concat([P(0, 0, 55)]))), class: "nf lo" }, bg);
  const fr = mk("g", {}, g);
  const legs = [0, 1, 2].map(() => { const lg = mk("g", {}, back); return { lg, path: mk("path", { class: "sil" }, lg) }; });
  const ring = solid(fr), gauze = solid(fr), disk = mk("path", { class: "nf lo" }, fr), mesh = mk("path", { class: "nf lo" }, fr);
  const sp = spring(rad(restA));
  let last = NaN;
  function draw(a) {
    const v = r2(a * 100);
    if (v === last) return;
    last = v;
    legs.forEach((L, k) => {
      const t = a + rad(30 + k * 120), c = Math.cos(t), s = Math.sin(t);
      const top = ringAt(P, disc(RT * c, RT * s, 1.6, 10), ZT), foot = ringAt(P, disc(RF * c, RF * s, 1.6, 10), 0);
      L.path.setAttribute("d", poly(hull(top.concat(foot))));
      (RF * (c + s) > 0 ? fr : back).prepend(L.lg);
    });
    const [ra, ri] = [disc(0, 0, RT + 2, 40), disc(0, 0, RT - 1.5, 40)];
    put(ring, prism(P, front, ra, ri, ZT - 2, ZT));
    const sq = (h) => fillet([0, 1, 2, 3].map((k) => { const t = a + rad(45 + k * 90); return [h * Math.SQRT2 * Math.cos(t), h * Math.SQRT2 * Math.sin(t)]; }), [3, 3, 3, 3], 3);
    const ring2 = (h) => sq(h).map(([u, v]) => ({ u, v, nu: u, nv: v }));
    const o = ring2(G), inn = ring2(G - 2);
    put(gauze, { sil: poly(hull(ringAt(P, o, ZT).concat(ringAt(P, o, ZT + 1.6)))), crease: open(ringAt(P, inn, ZT + 1.6).concat([P(inn[0].u, inn[0].v, ZT + 1.6)])) });
    disk.setAttribute("d", poly(ringAt(P, disc(0, 0, 13, 32), ZT + 1.7)));
    const ca = Math.cos(a), sa = Math.sin(a);
    let d = "";
    for (const off of [-22, -17, 17, 22]) for (const [ux, uy, vx, vy] of [[ca, sa, -sa, ca], [-sa, ca, ca, sa]]) {
      const p0 = [off * ux - 26 * vx, off * uy - 26 * vy], p1 = [off * ux + 26 * vx, off * uy + 26 * vy];
      d += "M" + P(p0[0], p0[1], ZT + 1.7).join(",") + "L" + P(p1[0], p1[1], ZT + 1.7).join(",");
    }
    mesh.setAttribute("d", d);
  }
  gauze.sil.classList.add("hi");
  draw(sp.x);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const toward = (t) => { let d = t - sp.t; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI; return sp.t + d; };
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZT / 2), r = Math.hypot(x, y);
    if (r > 95) return leave();
    sp.t = toward(Math.atan2(y, x) - rad(45));
    read.textContent = "turn " + (((Math.round(sp.t * 180 / Math.PI) % 360) + 360) % 360) + "°";
    B.wake();
  }
  function leave() { sp.t = toward(rad(restA)); read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (read.textContent === "rest") leave(); }, destroy: bag.dispose };
}

hairline({
  name: "tongs",
  means: "A Bunsen tripod with wire gauze over a burner: the tripod and its gauze turn to face the pointer, then settle back at an angle.",
  rules: [3, 5, 6, 8],
  range: [0, 15, 45],
  tour: [[57, 117], [295, 188], [295, 93], null],
  mount,
});
