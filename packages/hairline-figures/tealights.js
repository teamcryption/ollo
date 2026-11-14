/**
 * Tealights: a square tray holding nine tealights in their metal cups, three
 * by three. The pointer picks a tealight on the tray: it lifts out of the
 * tray, lit, and the ones around it lift a little, staggered by distance in
 * the grid. At rest one tealight is raised and lit, bright. The slider is
 * the stagger.
 *
 * The pattern: a grid on the ground plane, picked by unproj onto the cups'
 * resting tops; lifts are discrete, so they run on the tween clock.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 26, R = 10, H = 7, TZ = 3, LIFT = 26, FAV = 5, M = 6;
const W = (N - 1) * STEP + 2 * R + 2 * M;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const REST = [0, 2, 0, 3, 0, LIFT * 0.7, 0, 1.5, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [W, W, 0], [W, 0, 0], [0, W, 0], [M + R, M + R, TZ + H + LIFT + 9], [W - M - R, M + R, TZ + H + LIFT + 9]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(0, 0, W, W, 7, 2.2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = [];
  // back to front: ascending x + y
  const order = [];
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const byIdx = [];
  for (const [i, j] of order) {
    const k = j * N + i, x = M + R + i * STEP, y = M + R + j * STEP, grp = mk("g", {}, g);
    // the cup's seat on the tray: a dim ring that stays when the cup lifts
    mk("path", { d: poly(ringAt(P, disc(x, y, R + 0.6), TZ)), class: "nf lo" }, grp);
    const s = solid(grp);
    const wick = mk("path", { class: "nf" }, grp);
    const flame = mk("path", { class: "nf" }, grp);
    const it = { k, x, y, s, wick, flame, z: tween(REST[k]), last: NaN, lit: k === FAV };
    items.push(it);
    byIdx[k] = it;
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = TZ + lift, z1 = z0 + H;
    put(it.s, prism(P, front, disc(it.x, it.y, R), disc(it.x, it.y, R - 1.6), z0, z1));
    it.wick.setAttribute("d", seg(P(it.x, it.y, z1), P(it.x, it.y, z1 + 2.5)));
    if (it.lit) {
      const c = P(it.x, it.y, z1 + 2.5), tip = P(it.x, it.y, z1 + 9.5), w = 7;
      it.flame.setAttribute("d", poly([tip, [c[0] + w * 0.55, c[1] - w * 0.9], [c[0] + w * 0.6, c[1] - w * 0.2], [c[0], c[1] + w * 0.25], [c[0] - w * 0.6, c[1] - w * 0.2], [c[0] - w * 0.55, c[1] - w * 0.9]]));
    } else it.flame.setAttribute("d", "");
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // rule 01: pick against the cups' resting tops, a plane that never moves
  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, TZ + H);
    const i = Math.round((wx - M - R) / STEP), j = Math.round((wy - M - R) / STEP);
    if (wx < 0 || wy < 0 || wx > W || wy > W) return -1;
    return Math.max(0, Math.min(N - 1, j)) * N + Math.max(0, Math.min(N - 1, i));
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act >= 0 ? act : FAV;
    act = a;
    const fi = from % N, fj = (from / N) | 0;
    for (const it of items) {
      const i = it.k % N, j = (it.k / N) | 0;
      const ai = a % N, aj = (a / N) | 0, d = a < 0 ? 0 : Math.max(Math.abs(i - ai), Math.abs(j - aj));
      const z = a < 0 ? REST[it.k] : d === 0 ? LIFT : d === 1 ? 9 : 2;
      tset(it.z, z, now, Math.max(Math.abs(i - fi), Math.abs(j - fj)) * stag);
      const on = it.k === (a < 0 ? FAV : a);
      if (on !== it.lit) { it.lit = on; it.last = NaN; }
      it.s.sil.classList.toggle("hi", on);
      it.flame.classList.toggle("hi", on);
    }
    read.textContent = a < 0 ? "rest" : "light " + ((a % N) + 1) + "·" + (((a / N) | 0) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tealights",
  means: "Nine tealights in a square tray: the one under the pointer lifts out, lit, and those around it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 137], [200, 183], [200, 229], null],
  mount,
});
