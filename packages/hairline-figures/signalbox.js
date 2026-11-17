/**
 * Signal lever: one lever of a signal box frame, a tall shaft rising from a
 * slot in its cast-iron base, with the catch handle up by the grip. The
 * pointer pulls the lever: the nearer the pointer to the signalman, the
 * further the shaft swings back through its slot. At rest it stands forward
 * in the frame, bright. The slider is the reach.
 *
 * The pattern: one part tilting on a spring that follows the pointer.
 */
const {
  Cam, clamp, fit, hull, poly, prism, proj, facing, rad, rings, rrect, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 8, H = 66, REST = -24, MAX = 30;
function rot([x, y, z], a) {
  const dz = z - PZ, c = Math.cos(a), s = Math.sin(a);
  return [x, y * c + dz * s, PZ - y * s + dz * c];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 3.25);
  fit(C, [[-12, -26, 0], [12, 26, 0], [12, -26, 0], [-12, 26, 0], rot([0, 0, H + 4], rad(REST)), rot([0, 0, H + 4], rad(MAX))], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const T = (p, a) => P(...rot(p, a));
  // the base: a low iron block with the lever's slot and its quadrant
  const base = solid(g);
  const [bR, bI] = rings(-10, -24, 10, 24, 4, 1.4);
  put(base, prism(P, front, bR, bI, 0, PZ));
  let q = "";
  for (let i = 0; i <= 12; i++) { const a = rad(REST + (MAX - REST) * i / 12); q += i ? "L" : "M"; const p = P(0, 20 * Math.sin(a), PZ); q += p[0].toFixed(2) + " " + p[1].toFixed(2); }
  mk("path", { class: "nf lo", d: q + seg(P(-1.5, -20, PZ), P(-1.5, 20, PZ)) + seg(P(1.5, -20, PZ), P(1.5, 20, PZ)) }, base.g);

  const shaft = solid(g), grip = solid(g), latch = solid(g);
  const sp = spring(REST);
  let last = NaN;
  function box(ring, inner, z0, z1, a) {
    const pts = ring.map((r) => T([r.u, r.v, z0], a)).concat(ring.map((r) => T([r.u, r.v, z1], a)));
    return { sil: poly(hull(pts)), cr: poly(inner.map((r) => T([r.u, r.v, z1], a))) };
  }
  const sR = rrect(-2.4, -1.8, 2.4, 1.8, 1.2, 4), sI = rrect(-1.6, -1, 1.6, 1, 0.6, 4);
  const gR = rrect(-3, -2.6, 3, 2.6, 2.4, 6), gI = rrect(-2.2, -1.8, 2.2, 1.8, 1.6, 6);
  const lR = rrect(-2, 1.8, 2, 5.4, 1, 4), lI = rrect(-1.3, 2.5, 1.3, 4.7, 0.5, 4);

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    const s = box(sR, sI, PZ - 2, H - 12, a), k = box(gR, gI, H - 13, H, a), l = box(lR, lI, H - 30, H - 16, a);
    shaft.sil.setAttribute("d", s.sil); shaft.cr.setAttribute("d", seg(T([0, 1.8, PZ + 4], a), T([0, 1.8, H - 14], a)));
    grip.sil.setAttribute("d", k.sil); grip.cr.setAttribute("d", k.cr);
    latch.sil.setAttribute("d", l.sil); latch.cr.setAttribute("d", l.cr);
  }
  grip.sil.classList.add("hi");

  const R = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(Math.round(sp.x * 100) / 100);
    return m;
  });
  bag.add(R.unregister);

  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.abs(x) > 40 || Math.abs(y) > 60) return leave();
    const t = clamp((y + 40) / 80, 0, 1);
    sp.t = REST + (MAX - REST) * t * reach;
    read.textContent = sp.t > 10 ? "off" : "on";
    R.wake();
  }
  function leave() { sp.t = REST; read.textContent = "rest"; R.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "signalbox",
  means: "A signal box lever in its iron base: the shaft swings back through its slot as the pointer pulls toward the signalman.",
  rules: [3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[131, 278], [200, 240], [269, 209], null],
  mount,
});
