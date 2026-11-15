/**
 * Incubator shaker: a low cabinet with an orbital platform on top holding
 * four flasks. The platform swings round its orbit toward the pointer,
 * carrying the flasks with it. At rest it sits centred, one flask bright.
 * The slider is the orbit radius.
 *
 * The pattern: a platform circling under the pointer (turn).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const W = 80, D = 70, CZ = 26, PZ = 30;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const SPOTS = [[24, 22], [56, 22], [24, 48], [56, 48]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let R = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-14, -14, 0], [W + 14, D + 14, 0], [W + 14, -14, 0], [-14, D + 14, 0], [40, 35, PZ + 34]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ca, cb] = rings(0, 0, W, D, 5, 1.5);
  put(solid(g), prism(P, front, ca, cb, 0, CZ));
  const plat = solid(g), flasks = SPOTS.map(() => ({ cone: mk("path", { class: "sil" }, g), neck: solid(g) }));
  const ox = tween(0), oy = tween(0); let lx = NaN, ly = NaN;
  function draw(x, y) {
    if (x === lx && y === ly) return; lx = x; ly = y;
    const [pa, pb] = rings(4 + x, 4 + y, W - 4 + x, D - 4 + y, 4, 1.2);
    put(plat, prism(P, front, pa, pb, CZ + 1, PZ));
    SPOTS.forEach(([u, v], k) => {
      const f = flasks[k];
      f.cone.setAttribute("d", poly(hull(ringAt(P, disc(u + x, v + y, 9), PZ).concat(ringAt(P, disc(u + x, v + y, 3, 16), PZ + 18)))));
      put(f.neck, prism(P, front, disc(u + x, v + y, 3, 16), disc(u + x, v + y, 2.2, 16), PZ + 18, PZ + 26));
    });
  }
  const B = register(stage, (_dt, now) => { draw(tval(ox, now), tval(oy, now)); return !(tdone(ox, now) && tdone(oy, now)); });
  bag.add(B.unregister);
  const ctr = P(40, 35, PZ);
  let act = null;
  function mark(on) { flasks.forEach((f, k) => f.cone.classList.toggle("hi", !on && k === 3)); plat.sil.classList.toggle("hi", on); }
  function aim(p) {
    const now = performance.now();
    if (!p) { tset(ox, 0, now, 0); tset(oy, 0, now, 0); if (act !== "rest") { act = "rest"; read.textContent = "rest"; mark(false); } B.wake(); return; }
    const dx = p[0] - ctr[0], dy = p[1] - ctr[1];
    // screen direction to world: +x runs down-right, +y down-left
    const wx = dx / 2 + dy, wy = -dx / 2 + dy;
    const deg = (Math.round((((Math.atan2(wy, wx) * 180) / Math.PI + 360) % 360) / 15) * 15) % 360;
    const a = (deg * Math.PI) / 180;
    tset(ox, R * Math.cos(a), now, 0); tset(oy, R * Math.sin(a), now, 0);
    if (act !== deg) { act = deg; read.textContent = deg + "°"; mark(true); }
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { R = v; }, destroy: bag.dispose };
}

hairline({
  name: "ovenlab",
  means: "An incubator shaker: its orbital platform swings round toward the pointer, carrying four flasks along its orbit.",
  rules: [1, 2, 5, 6],
  range: [6, 12, 14],
  tour: [[207, 185], [193, 132], [303, 143], null],
  mount,
});
