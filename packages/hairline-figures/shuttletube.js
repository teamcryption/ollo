/**
 * Shuttle tube: a rack of four shuttlecock tubes, each with a cap. The pointer picks a tube along the rack: it slides up high, its neighbours rise a little after it, staggered. At rest one cap is bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the parts' resting tops, nearest along x.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 12, X0 = 6, HZ = 34, YA = -4, YB = 18;
const REST = [3,0,8,1], FAV = 2, LIFT = 22, BUMP = 6;

function box(P, front, x0, y0, x1, y1, r, b, z0, z1) {
  const [ring, inner] = rings(x0, y0, x1, y1, r, b);
  return prism(P, front, ring, inner, z0, z1);
}
function prof(P, x, t, pts, radii) {
  const f = fillet(pts, radii, 4);
  const near = f.map(([y, z]) => [x + t / 2, y, z]), far = f.map(([y, z]) => [x - t / 2, y, z]);
  return { sil: poly(hull(near.concat(far).map((p) => P(...p)))), crease: open(near.map((p) => P(...p)).slice(1, -1)) };
}
function base(P, front) { return [box(P, front, 0, 0, 48, 14, 4, 1, 0, 12)]; }
function item(P, front, x, h) {
  const top = 12 + 22 + h;
  return [box(P, front, x - 5, 2, x + 5, 12, 5, 0.8, 12, top), box(P, front, x - 5.6, 1.4, x + 5.6, 12.6, 5.6, 0.9, top, top + 4)];
}


function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4);
  fit(C, [[0,0,0],[48,14,0],[0,14,0],[48,0,0],[6,7,60],[42,7,60]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  base(P, front).forEach((p) => put(solid(g), p));
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), x = X0 + k * STEP;
    const sols = item(P, front, x, REST[k], k).map(() => solid(grp));
    items.push({ k, x, sols, z: tween(REST[k]), last: NaN });
  }
  function draw(s, h) {
    if (h === s.last) return;
    s.last = h;
    item(P, front, s.x, h, s.k).forEach((p, i) => put(s.sols[i], p));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    items.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, HZ);
    if (x < X0 - STEP || x > X0 + N * STEP || y < YA || y > YB) return -1;
    return clamp(Math.round((x - X0) / STEP), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : Math.max(0, BUMP - 2 * Math.abs(k - a));
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sols[1].sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tube " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shuttletube",
  means: "A rack of shuttlecock tubes: the tube under the pointer slides up out of the rack, its neighbours follow a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[149, 104], [183, 121], [251, 155], null],
  mount,
});
