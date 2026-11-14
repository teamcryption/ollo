/**
 * Smart bulbs: four bulbs standing in sockets along a low base, each a
 * screw cap under a round glass. The pointer picks a bulb by where it is
 * along the base: that bulb lifts out of its socket, its neighbours rise a
 * little after it. At rest the bulbs sit at uneven heights, one raised,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is on a fixed plane
 * through the bulbs' resting middles.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 18, X0 = 10, YC = 10, XB = X0 + (N - 1) * STEP + 10, LIFT = 16;
const REST = [0.5, 0, 6, 1], FAV = 2, PROF = [[3, 3.2], [7, 3.4], [10, 5], [14, 8], [19, 9], [24, 8], [28, 5], [30, 1.5]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[0, 0, -3], [XB, 0, -3], [XB, 20, -3], [0, 20, -3], [X0, YC, 30 + LIFT], [XB, YC, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [bo, bi] = rings(0, 0, XB, 20, 6, 1.4);
  const base = solid(g);
  put(base, prism(P, front, bo, bi, -3, 0));
  let sockets = "";
  for (let k = 0; k < N; k++) sockets += poly(ringAt(P, circ(4.2, 16).map((s) => ({ ...s, u: s.u + X0 + k * STEP, v: s.v + YC })), 0));
  mk("path", { class: "nf lo", d: sockets }, base.g);

  const bulbs = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    bulbs.push({ k, x: X0 + k * STEP, s, z: tween(REST[k]), last: NaN });
  }
  const ring = (x, r, z) => ringAt(P, circ(r, 20).map((s) => ({ ...s, u: s.u + x, v: s.v + YC })), z);
  function draw(b, z) {
    if (z === b.last) return;
    b.last = z;
    let pts = ring(b.x, 3.2, z);
    PROF.forEach(([h, r]) => { pts = pts.concat(ring(b.x, r, z + h)); });
    b.s.sil.setAttribute("d", poly(hull(pts)));
    const half = (zz, r) => open(ring(b.x, r, zz).filter((_, i) => i <= 10));
    b.s.cr.setAttribute("d", half(z + 4, 3.3) + half(z + 7, 3.4) + half(z + 10, 5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    bulbs.forEach((b) => { draw(b, tval(b.z, now)); if (!tdone(b.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 15);
    if (x < -6 || x > XB + 6 || y < -6 || y > 26) return -1;
    return clamp(Math.round((x - X0) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    bulbs.forEach((b, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, 4 - Math.abs(k - a) * 1.5);
      tset(b.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bulb " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "smartbulbs",
  means: "Smart bulbs in a row of sockets: the bulb under the pointer lifts out, its neighbours rising a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[135, 141], [178, 162], [265, 206], null],
  mount,
});
