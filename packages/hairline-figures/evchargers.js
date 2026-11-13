/**
 * EV chargers: four charging posts on a curb island at the head of four
 * parking bays, each post under a cap with a screen and a holster, its plug
 * seated in the holster on a cable that loops down from the post. The pointer
 * picks a post: its plug lifts out toward the reader on its cable and its
 * screen dot lights; the plugs beside it lift a little, staggered from it. At
 * rest the third post's plug is out, bright. The slider is how far it comes.
 *
 * The pattern: one of many in a single row (riffle); the hit is read against
 * the posts' rest centres, which never move.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, PITCH = 24, PW = 11, PD = 8, CURB = 3, PH = 38, FAV = 2, NEAR = 0.25;
const W = (N - 1) * PITCH + PW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-9, -6, -4], [W + 9, 34, -4], [W + 9, -6, -4], [-9, 34, -4], [-2, -2, PH + 2], [W + 2, -2, PH + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-9, -6, W + 9, 34, 4, 1.6); put(solid(g), prism(P, front, r, i, -4, 0)); }
  // the bays' lines, painted on the ground in front of the island
  let lines = "";
  for (let k = 0; k <= N; k++) { const x = k * PITCH - (PITCH - PW) / 2; lines += seg(P(x, 14, 0), P(x, 32, 0)); }
  mk("path", { d: lines, class: "nf lo" }, g);
  { const [r, i] = rings(-5, -3, W + 5, 12, 2.5, 1); put(solid(g), prism(P, front, r, i, 0, CURB)); }

  const posts = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * PITCH, x1 = x0 + PW;
    { const [r, i] = rings(x0, 0, x1, PD, 2.5, 1); put(solid(g), prism(P, front, r, i, CURB, PH - 2)); }
    { const [r, i] = rings(x0 - 1.2, -1.2, x1 + 1.2, PD + 1.2, 3, 1); put(solid(g), prism(P, front, r, i, PH - 2, PH)); }
    const onFace = (q) => P(x0 + q.u, PD, q.v);
    mk("path", { d: poly(rrect(2, 25, PW - 2, 32.5, 1.6, 4).map(onFace)), class: "nf" }, g);
    const dot = mk("circle", { r: 1.2, class: "dot off" }, g);
    place(dot, P(x0 + PW / 2, PD, 28.75));
    { const [r, i] = rings(x0 + 5, PD, x0 + 9.5, PD + 2.6, 1, 0.5); put(solid(g), prism(P, front, r, i, 14, 17.5)); }
    const cable = mk("path", { class: "nf" }, g), plug = solid(g);
    posts.push({ k, x0, dot, cable, plug, t: tween(k === FAV ? 0.75 : 0), last: NaN, mid: P(x0 + PW / 2, PD, 18) });
  }

  /** Post p with its plug a share t of the way out: the plug's block and the cable that loops down to it. */
  function draw(p, t) {
    const px = p.x0 + 7.25, py = PD + 2.4 + t * reach, pz = 17.5 + t * 8;
    const [r, i] = rings(px - 2, py - 1.6, px + 2, py + 1.6, 1.2, 0.6);
    put(p.plug, prism(P, front, r, i, pz, pz + 8));
    // a quadratic sag from the post's foot to the plug's tail, kept above the curb
    const a = [p.x0 + 2.5, PD, 9], b = [px, py, pz], c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + 3, -4 + t * 6];
    const pts = [];
    for (let s = 0; s <= 16; s++) {
      const u = s / 16, q = (j) => (1 - u) ** 2 * a[j] + 2 * u * (1 - u) * c[j] + u * u * b[j];
      pts.push(P(q(0), q(1), Math.max(CURB + 0.8, q(2))));
    }
    p.cable.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of posts) {
      const t = tval(p.t, now);
      if (t !== p.last) { draw(p, t); p.last = t; }
      if (!tdone(p.t, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    posts.forEach((p, k) => { const d = Math.abs(p.mid[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 22 && Math.abs(posts[best].mid[1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    posts.forEach((p, k) => {
      const dd = Math.abs(k - a), t = a < 0 ? (k === FAV ? 0.75 : 0) : dd === 0 ? 1 : dd === 1 ? NEAR : 0;
      tset(p.t, t, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      const on = k === (a < 0 ? FAV : a);
      p.plug.sil.classList.toggle("hi", on);
      p.dot.setAttribute("class", on ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; for (const p of posts) p.last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "evchargers",
  means: "Four EV chargers at their bays: the one under the pointer lifts its plug out on the cable, and its screen lights.",
  rules: [1, 2, 4, 5],
  range: [12, 17, 22],
  tour: [[151, 120], [266, 176], [190, 138], null],
  mount,
});
