/**
 * Popcorn: a cinema popcorn machine, a glass cabinet on a cart base with a
 * kettle hanging from its top, a heap of popped kernels on its floor and a
 * scoop on the ledge in front. The kernels near the pointer pop up, each on
 * its own spring, falling off with distance, and the kettle tips toward the
 * pointer. At rest a few kernels are mid-pop, one bright, and the kettle
 * leans toward it. The slider is how high they pop.
 *
 * The pattern: a field answering a point (terrain); each kernel is tested on
 * the plane of its own resting height.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, proj, prism, put, rings, ringAt, rrect, run, seg, spring, stepS, unproj,
  disposer, mk, pointer, register, solid,
} = HL;

const W = 44, D = 36, BZ = 16, TZ = 64, KR = 2.4, FAV = 13, PZ = TZ - 12;
const ring3 = (r, z, n = 28) => circ(r, n).map((q) => [q.u, q.v, z]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pop = value;
  const S = 2.55, C = Cam(45, 0.5, S);
  fit(C, [[-4, -4, 0], [W + 4, D + 12, 0], [W + 4, -4, 0], [-4, D + 12, 0], [0, 0, TZ + 2], [W, 0, TZ + 2], [0, D, TZ + 2]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [br, bi] = rings(-4, -4, W + 4, D + 12, 4, 1.4);
  put(solid(g), prism(P, front, br, bi, 0, BZ));

  // the glass: its back edges before what is inside, its front edges after
  const gl = rrect(0, 0, W, D, 2, 4), back = (s) => !front(s);
  const post = (x, y, cls, par) => mk("path", { class: cls, d: seg(P(x, y, BZ), P(x, y, TZ)) }, par);
  post(0.6, 0.6, "nf lo", g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, run(gl, back), BZ)).replace(/Z$/, "") }, g);
  mk("path", { class: "nf sil", d: poly(ringAt(P, run(gl, back), TZ)).replace(/Z$/, "") }, g);

  // the kernels: a heap, higher toward the back-left, a few mid-pop at rest
  const ks = [], kgB = mk("g", {}, g);
  for (let j = 0; j < 5; j++) for (let i = 0; i < 6; i++) {
    const x = 6 + i * 6.4 + (j % 2) * 2, y = 5 + j * 6.4 + (i % 3) * 0.8;
    const z = BZ + 2.4 + 9 * Math.exp(-((x - W * 0.45) ** 2 + (y - D * 0.42) ** 2) / (2 * 12 * 12));
    ks.push({ x, y, z, rest: [3, 7, 22, 16].includes(ks.length) ? 2.5 : ks.length === FAV ? 5 : 0, s: null, last: NaN, el: null });
  }
  ks.forEach((k) => { k.s = spring(k.rest); });

  // the kettle, hung from the top on its rod, tipping about an axle at its middle
  const KC = [W / 2, D / 2];
  mk("path", { class: "nf", d: seg(P(KC[0], KC[1], TZ), P(KC[0], KC[1], PZ)) }, g);
  const body = [[8, 5], [8.4, 1], [7, -4], [4.5, -6.5]].flatMap(([r, z]) => ring3(r, z)), mouth = ring3(7.2, 5);
  const kS = mk("path", { class: "sil" }, g), kR = mk("path", { class: "nf lo" }, g);
  const tx = spring(0.2), ty = spring(0.12);
  let kLast = "";
  function drawKettle(ax, ay) {
    const key = ax.toFixed(4) + "," + ay.toFixed(4);
    if (key === kLast) return;
    kLast = key;
    const th = Math.hypot(ax, ay), dx = th ? ax / th : 1, dy = th ? ay / th : 0, c = Math.cos(th), s = Math.sin(th);
    const f = ([x, y, z]) => {
      const u = x * dx + y * dy, w = -x * dy + y * dx, u2 = u * c + z * s, z2 = -u * s + z * c;
      return P(KC[0] + u2 * dx - w * dy, KC[1] + u2 * dy + w * dx, PZ + z2);
    };
    kS.setAttribute("d", poly(hull(body.map(f))));
    kR.setAttribute("d", poly(mouth.map(f)));
  }

  const kgF = mk("g", {}, g);
  ks.slice().sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((k) => { k.el = mk("ellipse", { rx: KR * S, ry: KR * S }, k.x + k.y < KC[0] + KC[1] ? kgB : kgF); });

  // the front of the glass, then the scoop on the ledge
  const fr = mk("g", {}, g);
  post(W - 0.6, D - 0.6, "nf lo", fr);
  mk("path", { class: "nf", d: poly(ringAt(P, run(gl, front), BZ)).replace(/Z$/, "") + poly(ringAt(P, run(gl, front), TZ)).replace(/Z$/, "") }, fr);
  post(0.6, D - 0.6, "nf sil", fr); post(W - 0.6, 0.6, "nf sil", fr);
  const [sr, si] = rings(10, D + 3, 19, D + 9, 2, 0.7);
  mk("path", { class: "nf", d: seg(P(19, D + 6, BZ + 2.5), P(28, D + 6, BZ + 1)) }, fr);
  put(solid(fr), prism(P, front, sr, si, BZ, BZ + 3));

  function drawK(k, z) {
    if (z === k.last) return;
    k.last = z;
    const [sx, sy] = P(k.x, k.y, k.z + KR + z);
    k.el.setAttribute("cx", sx.toFixed(2)); k.el.setAttribute("cy", sy.toFixed(2));
  }

  const B = register(stage, (dt) => {
    let moving = false;
    for (const k of ks) { if (stepS(k.s, dt)) moving = true; drawK(k, k.s.x); }
    if (stepS(tx, dt)) moving = true;
    if (stepS(ty, dt)) moving = true;
    drawKettle(tx.x, ty.x);
    return moving;
  });
  bag.add(B.unregister);

  // the hit: each kernel on the plane of its own resting height; the nearest names the pop
  let act = -2;
  function move([sx, sy]) {
    let best = -1, bd = Infinity;
    ks.forEach((k, i) => {
      const [x, y] = unproj(C, sx, sy, k.z + KR), d = Math.hypot(x - k.x, y - k.y);
      k.s.t = pop * Math.max(0, 1 - d / 18) ** 1.4;
      if (d < bd) { bd = d; best = i; }
    });
    const [x, y] = unproj(C, sx, sy, BZ + 6), vx = x - KC[0], vy = y - KC[1], m = Math.hypot(vx, vy) || 1;
    const amt = 0.5 * clamp(m / 24, 0, 1);
    tx.t = (vx / m) * amt; ty.t = (vy / m) * amt;
    setActive(bd < 4.5 ? best : -1);
    B.wake();
  }
  function leave() {
    ks.forEach((k) => { k.s.t = k.rest; });
    tx.t = 0.2; ty.t = 0.12;
    setActive(-1);
    B.wake();
  }
  function setActive(a) {
    if (a === act) return;
    act = a;
    ks.forEach((k, i) => k.el.classList.toggle("hi", i === (a < 0 ? FAV : a)));
    read.textContent = a < 0 ? "rest" : "pop " + (a + 1);
  }
  setActive(-1);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { pop = v; }, destroy: bag.dispose };
}

hairline({
  name: "popcorn",
  means: "A popcorn machine: kernels near the pointer pop up on springs, and the kettle at the top tips toward it.",
  rules: [1, 3, 5, 8],
  range: [8, 16, 24],
  tour: [[160, 179], [198, 192], [250, 184], null],
  mount,
});
