/**
 * Tree spade: a carriage on a mast holds four curved blades closed round a
 * root ball, a young tree standing in it. The pointer over the spade lifts
 * the carriage up the mast, pulling the tree and its ball clear of the pad.
 * At rest the carriage ring is bright. The slider is how high it lifts.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PAD = 4, BALL = 26, RR = 22, MAXL = 44, MX = -46;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-54, -30, 0], [30, 30, 0], [MX, 0, 110], [0, 0, PAD + BALL + 64 + MAXL], [-30, 30, 0], [30, -30, 0]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-54, -30, 30, 30, 8, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PAD));
  mk("path", { d: poly(ringAt(P, disc(0, 0, 14, 30), PAD)), class: "nf dash" }, g);
  const [mr, mi] = rings(MX - 4, -4, MX + 4, 4, 2, 1);
  put(solid(g), prism(P, front, mr, mi, PAD, 110));
  const lift = mk("g", {}, g);
  const arm = solid(lift), ball = mk("path", { class: "sil" }, lift), seams = mk("path", { class: "nf lo" }, lift);
  const ring = mk("path", { class: "sil hi" }, lift), ringIn = mk("path", { class: "nf lo" }, lift);
  const trunk = solid(lift), crown = mk("path", { class: "sil" }, lift), crease = mk("path", { class: "nf lo" }, lift);
  const tw = tween(0);
  let last = NaN;

  function draw(h) {
    if (h === last) return;
    last = h;
    const z0 = PAD + 1 + h, zt = z0 + BALL;
    const [ar, ai] = rings(MX + 4, -3, -RR + 2, 3, 1.5, 0.8);
    put(arm, prism(P, front, ar, ai, zt - 2, zt + 2));
    ball.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 5, 20), z0).concat(ringAt(P, disc(0, 0, RR, 40), zt)))));
    let s = "";
    for (const a of [0.6, 2.2, 3.7, 5.3]) {
      const c = Math.cos(a), d = Math.sin(a);
      if (c + d < -0.3) continue;
      s += seg(P(5 * c, 5 * d, z0), P(RR * c, RR * d, zt));
    }
    seams.setAttribute("d", s);
    ring.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, RR + 3, 44), zt).concat(ringAt(P, disc(0, 0, RR + 3, 44), zt + 4)))));
    ringIn.setAttribute("d", poly(ringAt(P, disc(0, 0, RR - 1, 40), zt + 4)));
    put(trunk, prism(P, front, disc(0, 0, 3, 16), disc(0, 0, 2, 16), zt + 4, zt + 30));
    const pts = [], cz = zt + 46, R = 20;
    for (let i = -6; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(0, 0, R * Math.cos(t) + 0.01, 28), cz + R * 0.9 * Math.sin(t))); }
    crown.setAttribute("d", poly(hull(pts)));
    crease.setAttribute("d", open(ringAt(P, disc(0, 0, R * 0.7, 28), cz - 4).filter((_, i) => i > 3 && i < 12)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, PAD + BALL);
  let on = null;
  function setOn(a) {
    if (a === on) { if (a) tset(tw, MAXL * amt, performance.now(), 0); B.wake(); return; }
    on = a;
    tset(tw, a ? MAXL * amt : 0, performance.now(), 0);
    read.textContent = a ? "lift " + Math.round(amt * 100) : "rest";
    B.wake();
  }
  setOn(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], (sy - mid[1]) * 0.8) < 70;
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { read.textContent = "lift " + Math.round(amt * 100); tset(tw, MAXL * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "treespade",
  means: "A tree spade on its mast: over it, the carriage lifts the blades, root ball and young tree clear of the ground.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[200, 214], [228, 196], [176, 200], null],
  mount,
});
