/**
 * Ice cream cones: a stand with two rows of round holes in its top, a cone
 * standing in each hole with a scoop on it, a waffle line round each cone's
 * rim. The pointer picks a hole on the stand's top: that cone lifts out of
 * its hole, and the cones round it rise a little, staggered by distance. At
 * rest one cone is half out, bright. The slider is the stagger.
 *
 * The pattern: a grid on a top plane (terrain); the hit is on a fixed plane
 * through the scoops' resting middles.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 4, NY = 2, PITCH = 16, TOP = 26, L = 20, CR = 5, SR = 5.6, OUT = 6, LIFT = 15, FAV = 5;
const W = NX * PITCH + 4, D = NY * PITCH + 4, REST = [0, 1.5, 0, 0.8, 0, 7, 0, 2];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, TOP + OUT + LIFT + 2 * SR], [W, 0, TOP + OUT + LIFT + 2 * SR]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const stand = solid(g);
  { const [r, i] = rings(0, 0, W, D, 5, 1.4); put(stand, prism(P, front, r, i, 0, TOP)); }
  const cones = [];
  let holes = "";
  for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
    const x = 2 + PITCH / 2 + i * PITCH, y = 2 + PITCH / 2 + j * PITCH;
    holes += poly(ringAt(P, disc(x, y, CR + 0.8), TOP));
    cones.push({ k: j * NX + i, i, j, x, y });
  }
  mk("path", { class: "nf lo", d: holes }, stand.g);
  // paint far to near: by ascending x + y
  cones.sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((c) => {
    const grp = mk("g", {}, g);
    c.cone = mk("path", {}, grp); c.rim = mk("path", { class: "nf lo" }, grp);
    c.scoop = mk("path", { class: "sil" }, grp); c.z = tween(REST[c.k]); c.last = NaN;
  });
  cones.sort((a, b) => a.k - b.k);

  function draw(c, lift) {
    if (lift === c.last) return;
    c.last = lift;
    const top = TOP + OUT + lift, tip = top - L, z0 = Math.max(TOP, tip), r0 = (CR * (z0 - tip)) / L;
    c.cone.setAttribute("d", poly(hull(ringAt(P, disc(c.x, c.y, Math.max(r0, 0.3)), z0).concat(ringAt(P, disc(c.x, c.y, CR), top)))));
    c.rim.setAttribute("d", open(ringAt(P, disc(c.x, c.y, CR * 0.86).filter(front), top - 2.2)));
    const pts = [];
    for (let s = -2; s <= 6; s++) { const t = (s / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(c.x, c.y, SR * Math.cos(t)), top + 1 + SR * Math.sin(t))); }
    c.scoop.setAttribute("d", poly(hull(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of cones) { draw(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the pointer on a fixed plane through the resting scoops, nearest hole
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP + OUT + SR);
    if (x < -4 || x > W + 4 || y < -4 || y > D + 4) return -1;
    const i = clamp(Math.round((x - 2 - PITCH / 2) / PITCH), 0, NX - 1), j = clamp(Math.round((y - 2 - PITCH / 2) / PITCH), 0, NY - 1);
    return j * NX + i;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const f = cones[from >= 0 ? from : 0];
    cones.forEach((c) => {
      const t = a >= 0 ? cones[a] : null, dd = t ? Math.hypot(c.i - t.i, c.j - t.j) : 0;
      const z = !t ? REST[c.k] : dd === 0 ? LIFT : dd < 1.5 ? 4 : dd < 2.5 ? 1.5 : 0;
      tset(c.z, z, now, from < 0 ? 0 : Math.hypot(c.i - f.i, c.j - f.j) * stag);
      c.scoop.classList.toggle("hi", c.k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cone " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "conestand",
  means: "Ice cream cones in a stand's holes: the cone under the pointer lifts out of its hole, the ones round it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[168, 114], [264, 163], [232, 179], null],
  mount,
});
