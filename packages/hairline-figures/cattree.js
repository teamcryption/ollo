/**
 * Cat tree: a base plate, one sisal-wrapped post with rope bands, and three
 * platforms stepping up round it, a ball toy hanging on a cord from the top
 * one. The pointer picks a platform on its own resting top: it rises a
 * little, bright, and the ball swings toward the pointer on springs. At
 * rest the middle platform stands a touch high, bright. The slider is the
 * reach of the swing.
 *
 * The pattern: stepped parts (each tested on its own rest top) and a
 * pendulum on springs.
 */
const {
  Cam, circ, clamp, facing, fit, open, poly, prism, proj, rings, ringAt, run, spring, stepS, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PR = 5, TH = 4, RISE = 6, FAV = 1, CORD = 16, BR = 3.6;
// level: [x0, y0, x1, y1, z]; level 2 stands behind the post, level 1 in front, level 3 on top
const LV = [[-20, 4, 8, 28, 18], [-6, -30, 22, -5, 38], [-16, -14, 16, 14, 58]];
const REST = [0, 2, 0], ANCH = [12, 12];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-26, -32, 0], [26, 30, 0], [26, -32, 0], [-26, 30, 0], [-16, -14, 58 + TH + RISE], [16, 14, 58 + TH + RISE], [24, 24, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  { const [r, i] = rings(-26, -32, 26, 30, 6, 1.6); put(solid(g), prism(P, front, r, i, 0, 4)); }

  const mkLevel = (k) => ({ k, el: solid(g), z: tween(REST[k]), last: NaN });
  const lv = [];
  lv[1] = mkLevel(1);
  const post = solid(g), bands = mk("path", { class: "nf lo" }, post.g);
  lv[0] = mkLevel(0);
  lv[2] = mkLevel(2);
  const cord = mk("path", { class: "nf lo" }, g), ball = mk("path", { class: "nf" }, g), seam = mk("path", { class: "nf lo" }, g);
  const sx = spring(4), sy = spring(-2);
  let postLast = NaN, ballLast = "";

  function drawLevel(L, lift) {
    if (lift === L.last) return;
    L.last = lift;
    const [x0, y0, x1, y1, z] = LV[L.k], [r, i] = rings(x0, y0, x1, y1, 5, 1.6);
    put(L.el, prism(P, front, r, i, z + lift, z + lift + TH));
  }
  function drawPost(top) {
    if (top === postLast) return;
    postLast = top;
    put(post, prism(P, front, disc(0, 0, PR), disc(0, 0, PR - 0.8), 4, top));
    let d = "";
    for (let z = 8; z < top - 2; z += 4.5) d += open(ringAt(P, run(disc(0, 0, PR), front), z));
    bands.setAttribute("d", d);
  }
  function drawBall(top) {
    const dx = sx.x, dy = sy.x, key = dx.toFixed(2) + dy.toFixed(2) + top.toFixed(2);
    if (key === ballLast) return;
    ballLast = key;
    const ax = ANCH[0], ay = ANCH[1], bz = top - Math.sqrt(Math.max(1, CORD * CORD - dx * dx - dy * dy));
    const c = P(ax + dx, ay + dy, bz), e = P(ax + dx + BR * 0.7071, ay + dy - BR * 0.7071, bz), rr = Math.hypot(e[0] - c[0], e[1] - c[1]);
    cord.setAttribute("d", open([P(ax, ay, top), P(ax + dx, ay + dy, bz + BR)]));
    const pts = [];
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; pts.push([c[0] + rr * Math.cos(a), c[1] + rr * Math.sin(a)]); }
    ball.setAttribute("d", poly(pts));
    seam.setAttribute("d", open(pts.slice(0, 15).map(([px, py]) => [px, c[1] + (py - c[1]) * 0.35])));
  }

  const B = register(stage, (dt, now) => {
    let moving = false;
    for (const L of lv) { drawLevel(L, tval(L.z, now)); if (!tdone(L.z, now)) moving = true; }
    const top = LV[2][4] + tval(lv[2].z, now);
    drawPost(top);
    if (stepS(sx, dt)) moving = true;
    if (stepS(sy, dt)) moving = true;
    drawBall(top);
    return moving;
  });
  bag.add(B.unregister);

  // each level tested on its own resting top; the nearest middle among those the pointer falls inside
  function hit([px, py]) {
    let best = -1, bd = Infinity;
    LV.forEach(([x0, y0, x1, y1, z], k) => {
      const [x, y] = unproj(C, px, py, z + TH + REST[k]);
      if (x < x0 - 2 || x > x1 + 2 || y < y0 - 2 || y > y1 + 2) return;
      const d = Math.hypot(x - (x0 + x1) / 2, y - (y0 + y1) / 2);
      if (d < bd) { bd = d; best = k; }
    });
    return best;
  }
  function swing([px, py]) {
    const [x, y] = unproj(C, px, py, LV[2][4] - CORD);
    sx.t = clamp((x - ANCH[0]) * 0.25 * reach, -9, 9);
    sy.t = clamp((y - ANCH[1]) * 0.25 * reach, -9, 9);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    lv.forEach((L, k) => {
      tset(L.z, a < 0 ? REST[k] : k === a ? RISE : 0, now, 0);
      L.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "level " + (a + 1);
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: (p) => { setActive(hit(p)); swing(p); B.wake(); },
    leave: () => { setActive(-1); sx.t = 4; sy.t = -2; B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "cattree",
  means: "A cat tree: the platform under the pointer rises a little, and the hanging ball toy swings toward the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.6],
  tour: [[130, 180], [246, 127], [198, 91], null],
  mount,
});
