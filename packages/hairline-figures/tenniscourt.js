/**
 * Tennis court: a court slab with its lines, a net across the middle on two
 * posts, and four balls lying about. The pointer picks the ball nearest
 * where it stands on the court: that ball bounces up, and the others hop a
 * little, staggered by distance. At rest one ball is caught mid-bounce,
 * bright. The slider is the stagger.
 *
 * The pattern: one of a scattered few on a ground plane (terrain pick).
 */
const {
  Cam, circ, fit, facing, poly, open, seg, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, flatDot, place,
} = HL;

const L = 150, W = 76, PZ = 4, NX = L / 2, NH = 13, BR = 7, LIFT = 36, FAV = 1;
const BALLS = [[28, 22], [44, 54], [102, 30], [124, 58]];
const REST = [0, 16, 0, 0];
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, 0], [L + 6, W + 6, 0], [L + 6, -6, 0], [-6, W + 6, 0], [NX, -6, PZ + NH + 2], [28, 22, PZ + LIFT + 10]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-6, -6, L + 6, W + 6, 6, 2);
  put(solid(g), prism(P, front, cr, ci, 0, PZ));
  const at = (x, y) => P(x, y, PZ);
  const lines = [
    poly([at(4, 6), at(L - 4, 6), at(L - 4, W - 6), at(4, W - 6)]),
    seg(at(4, 14), at(L - 4, 14)), seg(at(4, W - 14), at(L - 4, W - 14)),
    seg(at(36, 14), at(36, W - 14)), seg(at(L - 36, 14), at(L - 36, W - 14)),
    seg(at(36, W / 2), at(L - 36, W / 2)),
  ].join("");
  mk("path", { d: lines, class: "nf lo" }, g);

  const sr = Math.hypot(...[0, 1].map((i) => P(0, 0, 0)[i] - P(BR / Math.SQRT2, -BR / Math.SQRT2, 0)[i]));
  const v = [0.612, 0.612, 0.5];
  function makeBall(k, parent) {
    const [x, y] = BALLS[k];
    const shadow = flatDot(parent, C, 3, "dot off");
    place(shadow, P(x, y, PZ));
    const body = mk("ellipse", { rx: sr, ry: sr, class: "sil" }, parent);
    const seam = mk("path", { class: "nf lo" }, parent);
    return { k, x, y, body, seam, z: tween(REST[k]), last: NaN };
  }
  const items = [];
  const sorted = BALLS.map((_, k) => k).sort((a, b) => BALLS[a][0] + BALLS[a][1] - BALLS[b][0] - BALLS[b][1]);
  const backG = mk("g", {}, g);
  // the net: two posts, a plate with its mesh, a band on top
  const ng = mk("g", {}, g);
  for (const py of [-3, W + 3]) put(solid(ng), prism(P, front, disc(NX, py, 1.6, 12), disc(NX, py, 1, 12), PZ, PZ + NH + 1));
  mk("path", { d: poly([P(NX, -3, PZ + NH), P(NX, W + 3, PZ + NH), P(NX, W + 3, PZ + 1), P(NX, -3, PZ + 1)]) }, ng);
  let mesh = "";
  for (let yy = 3; yy < W; yy += 6) mesh += seg(P(NX, yy, PZ + 1), P(NX, yy, PZ + NH - 1.6));
  for (let zz = PZ + 4; zz < PZ + NH - 1; zz += 3) mesh += seg(P(NX, -3, zz), P(NX, W + 3, zz));
  mk("path", { d: mesh, class: "nf lo" }, ng);
  mk("path", { d: seg(P(NX, -3, PZ + NH - 1.6), P(NX, W + 3, PZ + NH - 1.6)), class: "nf" }, ng);
  const frontG = mk("g", {}, g);
  for (const k of sorted) items[k] = makeBall(k, BALLS[k][0] < NX ? backG : frontG);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const cz = PZ + BR + lift, c = P(it.x, it.y, cz);
    it.body.setAttribute("cx", c[0]); it.body.setAttribute("cy", c[1]);
    let d = "";
    for (const s of [1, -1]) {
      const n = [s * 0.55, -s * 0.55, s * 0.62], u = [0.707, 0.707, 0], w = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
      const pts = [];
      for (let i = 0; i <= 32; i++) {
        const t = (i / 32) * 2 * Math.PI, rr = BR * 0.72, off = BR * 0.69;
        const q = [0, 1, 2].map((j) => n[j] * off + rr * (Math.cos(t) * u[j] + Math.sin(t) * w[j]));
        if (q[0] * v[0] + q[1] * v[1] + q[2] * v[2] > 0.4) pts.push(P(it.x + q[0], it.y + q[1], cz + q[2]));
        else if (pts.length > 1) { d += open(pts); pts.length = 0; } else pts.length = 0;
      }
      if (pts.length > 1) d += open(pts);
    }
    it.seam.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, PZ + BR);
    let best = -1, bd = Infinity;
    BALLS.forEach(([x, y], k) => { const dd = Math.hypot(wx - x, wy - y); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dist = from < 0 ? 0 : Math.hypot(it.x - BALLS[from][0], it.y - BALLS[from][1]) / 30;
      const z = a < 0 ? REST[k] : k === a ? LIFT : clampHop(dist);
      tset(it.z, z, now, dist * stag);
      it.body.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "ball " + (a + 1);
    B.wake();
  }
  const clampHop = (dist) => Math.max(3, 14 - dist * 4);
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v2) => { stag = v2; }, destroy: bag.dispose };
}

hairline({
  name: "tenniscourt",
  means: "A tennis court with a net and four balls: the ball nearest the pointer bounces up, and the others hop a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[162, 131], [243, 182], [236, 213], null],
  mount,
});
