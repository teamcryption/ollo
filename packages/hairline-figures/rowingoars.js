/**
 * Battle ropes: a heavy rope doubled round an anchor post on a gym mat, its
 * two ends lying side by side with grips. The pointer picks an end by where
 * it stands: that rope whips up into a tall wave, the other ripples a
 * little. At rest one rope holds a low wave, bright. The slider is the
 * wave's height.
 *
 * The pattern: one of a few in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 150, YS = [6, 30], RR = 3, W = 5.4, POST = [-12, 18], FAV = 0;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amax = value;
  const C = Cam(45, 0.5, 1.85);
  fit(C, [[-26, -6, 0], [L + 14, 44, 0], [L + 14, -6, 0], [-26, 44, 0], [-12, 18, 44], [L * 0.7, 6, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-26, -6, L + 14, 44, 6, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 2));
  put(solid(g), prism(P, front, disc(POST[0], POST[1], 8), disc(POST[0], POST[1], 6.5), 2, 44));
  put(solid(g), prism(P, front, disc(POST[0], POST[1], 10), disc(POST[0], POST[1], 8.5), 2, 6));

  const ropes = YS.map((y, k) => {
    const grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), grip = mk("path", { class: "sil" }, grp);
    const crease = mk("path", { class: "nf lo" }, grp);
    return { k, y, body, grip, crease, ph: k * 1.3, a: tween(k === FAV ? 10 : 2), last: NaN };
  });

  // a tube in screen space: the centre line offset by ±w along its normal
  function ribbon(pts, w) {
    const l = [], r = [];
    pts.forEach((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      let dx = b[0] - a[0], dy = b[1] - a[1];
      const n = Math.hypot(dx, dy) || 1; dx /= n; dy /= n;
      l.push([p[0] - dy * w, p[1] + dx * w]); r.push([p[0] + dy * w, p[1] - dx * w]);
    });
    return l.concat(r.reverse());
  }
  const line = (pts) => "M" + pts.map((p) => p[0].toFixed(2) + "," + p[1].toFixed(2)).join("L");

  function draw(rp, a) {
    if (a === rp.last) return;
    rp.last = a;
    const pts = [];
    // from the post's near side out along x
    for (let i = 0; i <= 60; i++) {
      const t = i / 60, x = POST[0] + 8 + t * (L - POST[0] - 8);
      const env = Math.pow(t, 0.7) * (1 - 0.35 * t);
      const yy = POST[1] + (rp.y - POST[1]) * Math.min(1, t * 4);
      const z = RR + 2 + a * env * (0.5 + 0.5 * Math.sin(t * 2.4 * 2 * Math.PI - 1.2 + rp.ph));
      pts.push(P(x, yy, z));
    }
    rp.body.setAttribute("d", poly(ribbon(pts, W)));
    rp.crease.setAttribute("d", line(ribbon(pts, W - 1.6).slice(4, 57)));
    const e = pts[pts.length - 1], q = pts[pts.length - 4];
    const dx = e[0] - q[0], dy = e[1] - q[1], n = Math.hypot(dx, dy) || 1;
    const grip = [e, [e[0] + (dx / n) * 16, e[1] + (dy / n) * 16]];
    rp.grip.setAttribute("d", poly(ribbon([grip[0], lerp2(grip, 0.5), grip[1]], W + 1.6)));
  }
  const lerp2 = (s, t) => [s[0][0] + (s[1][0] - s[0][0]) * t, s[0][1] + (s[1][1] - s[0][1]) * t];

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const rp of ropes) { draw(rp, tval(rp.a, now)); if (!tdone(rp.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 6);
    if (wx < 10 || wx > L + 20 || wy < -16 || wy > 46) return -1;
    return wy < (YS[0] + YS[1]) / 2 ? 0 : 1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    ropes.forEach((rp, k) => {
      const h = a < 0 ? (k === FAV ? amax * 0.45 : 2) : k === a ? amax : 4;
      tset(rp.a, h, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      rp.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
      rp.grip.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "rope " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amax = v; act = -3; }, destroy: bag.dispose };
}

hairline({
  name: "rowingoars",
  means: "Battle ropes round an anchor post: the rope under the pointer whips up into a tall wave, the other ripples a little.",
  rules: [1, 2, 3, 5],
  range: [12, 22, 30],
  tour: [[258, 185], [292, 233], [140, 132], null],
  mount,
});
