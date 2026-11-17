/**
 * Binnacle: a ship's compass stand, a round pedestal on a foot holding the
 * compass bowl under a domed brass hood. The pointer over the binnacle lifts
 * the hood off the bowl to show the compass card and its lubber mark. At rest
 * the hood sits a little raised, bright. The slider is how far it lifts.
 *
 * The pattern: one part answering (cloche).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 16, BR = 32, DR = 30, DH = 22, REST = 3;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, 0, BZ + 6 + 18 + DH + 4], [DR, DR, BZ + 6 + 18], [-DR, -DR, BZ + 6 + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 24), disc(0, 0, 21), 0, 4));
  put(solid(g), prism(P, front, disc(0, 0, 14), disc(0, 0, 12), 4, BZ));
  put(solid(g), prism(P, front, disc(0, 0, BR), disc(0, 0, BR - 3), BZ, BZ + 6));
  // the compass card and its lubber mark
  mk("path", { d: poly(ringAt(P, disc(0, 0, 22, 36), BZ + 6.2)), class: "nf lo" }, g);
  const [a, b] = [P(-17, 0, BZ + 6.4), P(17, 0, BZ + 6.4)];
  mk("path", { d: `M${a[0]},${a[1]}L${b[0]},${b[1]}`, class: "nf" }, g);
  const [c, d] = [P(0, -9, BZ + 6.4), P(0, 9, BZ + 6.4)];
  mk("path", { d: `M${c[0]},${c[1]}L${d[0]},${d[1]}`, class: "nf lo" }, g);

  const hood = mk("g", {}, g);
  const dome = mk("path", { class: "sil hi" }, hood), rim = mk("path", { class: "nf lo" }, hood);
  const knob = mk("path", { class: "nf" }, hood), win = mk("path", { class: "nf lo" }, hood);
  const z = tween(REST);
  let last = NaN;
  function draw(l) {
    if (l === last) return;
    last = l;
    const base = BZ + 6.2 + l, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(0, 0, DR * Math.cos(t), 32), base + DH * Math.sin(t))); }
    pts.push(...ringAt(P, disc(0, 0, DR, 40), base - 2));
    dome.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ringAt(P, disc(0, 0, DR, 40), base + 1)));
    const top = base + DH;
    knob.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 4, 16), top - 1).concat(ringAt(P, disc(0, 0, 3.5, 16), top + 5)))));
    // a sight window on the hood's front
    const w = [];
    for (let i = 0; i <= 8; i++) { const t = -0.5 + i / 8; w.push(P(DR * 0.93 * Math.cos(Math.PI / 4 + t * 0.6), DR * 0.93 * Math.sin(Math.PI / 4 + t * 0.6), base + 4)); }
    for (let i = 8; i >= 0; i--) { const t = -0.5 + i / 8; w.push(P(DR * 0.8 * Math.cos(Math.PI / 4 + t * 0.6), DR * 0.8 * Math.sin(Math.PI / 4 + t * 0.6), base + 9)); }
    win.setAttribute("d", poly(w));
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, BZ / 2 + 10);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a > 0 ? lift : REST, performance.now(), 0);
    read.textContent = a > 0 ? "open" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 120 ? 1 : 0), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act > 0) { tset(z, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "binnacle",
  means: "A ship's binnacle: the domed hood lifts off the compass bowl when the pointer comes over it, showing the card inside.",
  rules: [1, 5, 6, 8],
  range: [8, 16, 18],
  tour: [[200, 96], [150, 150], [270, 196], null],
  mount,
});
