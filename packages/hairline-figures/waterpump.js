/**
 * Hand pump: a cast-iron pump on a stone slab, its long handle on a pivot at
 * the cap, a spout over a bucket. The pointer's height is the handle: up
 * high it lifts, low it presses, and pressing the handle draws water from
 * the spout into the bucket. At rest the handle hangs half raised, bright.
 *
 * The pattern: a continuous aim (one spring on the handle's angle); the hit is
 * the pointer's screen height, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, hull, poly, fillet, clamp, lerp, rad,
  spring, stepS, disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const L = 50, AR = 9, PZ = 54, PX = -4, REST = 24, UP = 38, DN = -30;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  const ends = [];
  for (const d of [UP, DN]) ends.push([PX - L * Math.cos(rad(d)), 0, PZ + L * Math.sin(rad(d))]);
  fit(C, ends.concat([[-16, -16, 0], [16, 16, 0], [32, 8, 0], [32, -8, 0], [0, 0, 56]]), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const slab = rings(-16, -16, 16, 16, 3, 1.4);
  put(solid(g), prism(P, front, slab[0], slab[1], 0, 4));
  place(flatDot(g, C, 1.2, "dot off"), P(-11, 11, 4));
  const handle = solid(g);
  put(solid(g), prism(P, front, disc(0, 0, 6), null, 4, 46));
  put(solid(g), prism(P, front, disc(0, 0, 7.5), disc(0, 0, 6.3), 46, 50));
  const br = rings(-6, -1.6, -2, 1.6, 0.8, 0.4);
  put(solid(g), prism(P, front, br[0], null, 50, PZ + 1));
  const sp = rings(5.5, -2.6, 24, 2.6, 1.4, 0.6);
  put(solid(g), prism(P, front, sp[0], sp[1], 33, 37));
  const stream = mk("path", { class: "lo nf" }, g);
  const bk = mk("g", {}, g);
  put(solid(bk), prism(P, front, disc(25, 0, 7.5), disc(25, 0, 6.6), 0, 13));
  const water = mk("path", { class: "lo nf" }, bk);

  const a = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const d = a.x;
    if (Math.abs(d - drawn) < 1e-3) return;
    drawn = d;
    const c = Math.cos(rad(d)), s = Math.sin(rad(d)), pts = [];
    for (const t of [-L, AR]) for (const w of [-1.6, 1.6]) for (const h of [-1.8, 1.8]) {
      pts.push(P(PX + t * c, w, PZ - t * s + h));
    }
    const hp = hull(pts);
    handle.sil.setAttribute("d", poly(fillet(hp, hp.map(() => 1.2))));
    handle.cr.setAttribute("d", seg(P(PX, 0, PZ), P(PX + AR * c, 0, PZ - AR * s - 10)));
    const w = clamp((14 - d) / 44, 0, 1);
    stream.setAttribute("d", w > 0.02 ? seg(P(22.5, 0, 33), P(22.5, 0, 33 - w * 22)) + seg(P(23.6, 0, 33), P(23.6, 0, 33 - w * 18)) : "");
    water.setAttribute("d", w > 0.02 ? poly(disc(25, 0, 6.6 * Math.sqrt(w), 24).map((q) => P(q.u, q.v, 2 + w * 9))) : "");
  }
  handle.sil.classList.add("sil");

  const B = register(stage, (dt) => { const m = stepS(a, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(t, on) {
    a.t = t;
    handle.sil.classList.toggle("hi", true);
    read.textContent = on ? (t < 14 ? "pump " : "lift ") + Math.round(Math.abs(t)) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => set(clamp(lerp(UP, DN, (p[1] - 70) / 190), DN, UP), true),
    leave: () => set(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  set(REST, false);
  draw();
  return {
    set: (v) => { a.k = 100 * v; a.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "waterpump",
  means: "A hand pump on a slab: the handle follows the pointer's height, and pressing it pours water from the spout into the bucket.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[134, 48], [116, 150], [252, 262], null],
  mount,
});
