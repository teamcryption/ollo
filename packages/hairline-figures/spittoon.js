/**
 * Dental spittoon: a round foot and slim column carrying, on a short arm, a
 * deep bowl with its drain and a curved water spout. The bowl swings round
 * the column to follow the pointer. At rest it sits turned off to one side,
 * bright. The slider is how far it may swing either way.
 *
 * The pattern: one part turning to face the pointer (swing).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZB = 50, AR = 32, REST = -50;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lim = value;
  const C = Cam(45, 0.5, 2.7);
  fit(C, [[-AR - 22, -AR - 22, 0], [AR + 22, AR + 22, 0], [AR + 22, -AR - 22, 0], [-AR - 22, AR + 22, 0], [0, 0, ZB + 28]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 20), disc(0, 0, 18), 0, 4));
  const col = solid(g);
  put(col, prism(P, front, disc(0, 0, 6), disc(0, 0, 4.6), 4, ZB + 4));
  const bowl = mk("g", {}, g);
  const arm = mk("path", { class: "nf" }, bowl);
  const bs = solid(bowl);
  bs.sil.classList.add("hi");
  const drain = mk("path", { class: "nf lo" }, bowl);
  const spout = mk("path", { class: "nf" }, bowl);
  const ang = spring(REST);
  let last = NaN, behind = null;

  function draw(a) {
    if (a === last) return;
    last = a;
    const t = rad(a + 45), cx = AR * Math.cos(t), cy = AR * Math.sin(t);
    const pts = [];
    for (const [r, z] of [[8, ZB - 4], [14, ZB + 2], [19, ZB + 8], [21, ZB + 13]]) pts.push(...disc(cx, cy, r).map((q) => P(q.u, q.v, z)));
    bs.sil.setAttribute("d", poly(hull(pts)));
    bs.cr.setAttribute("d", poly(disc(cx, cy, 18.5).map((q) => P(q.u, q.v, ZB + 13))));
    drain.setAttribute("d", poly(disc(cx, cy, 3.5, 16).map((q) => P(q.u, q.v, ZB + 3))));
    const ax = 5 * Math.cos(t + Math.PI / 2), ay = 5 * Math.sin(t + Math.PI / 2);
    const a0 = (k) => [k * Math.cos(t), k * Math.sin(t)];
    arm.setAttribute("d", poly(hull([P(ax, ay, ZB), P(-ax, -ay, ZB), P(ax, ay, ZB + 4), P(-ax, -ay, ZB + 4), P(a0(AR)[0] + ax, a0(AR)[1] + ay, ZB - 2), P(a0(AR)[0] - ax, a0(AR)[1] - ay, ZB - 2)])));
    const sp = [[0, ZB + 4], [0, ZB + 22], [6, ZB + 27], [14, ZB + 26], [AR - 4, ZB + 16]].map(([k, z]) => P(a0(k)[0] + ax * 0.6, a0(k)[1] + ay * 0.6, z));
    spout.setAttribute("d", open(sp));
    const back = cx + cy < 0;
    if (back !== behind) { behind = back; if (back) col.g.before(bowl); else col.g.after(bowl); }
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function aim(p) {
    lastP = p;
    let a = REST;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], ZB);
      if (Math.hypot(wx, wy) < 90) {
        let d = Math.atan2(wy, wx) * 180 / Math.PI - 45;
        d = ((d + 540) % 360) - 180;
        a = clamp(d, -lim, lim);
      }
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "turn " + a + "°";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lim = v; tgt = null; aim(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "spittoon",
  means: "A dental spittoon whose deep bowl, with its drain and water spout, swings round the column to follow the pointer.",
  rules: [1, 3, 5, 6],
  range: [45, 90, 120],
  tour: [[200, 123], [140, 80], [260, 80], null],
  mount,
});
