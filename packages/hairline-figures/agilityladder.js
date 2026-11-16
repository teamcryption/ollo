/**
 * Hurdle set: five mini hurdles in a row, two posts on feet and a bar each. The pointer picks a hurdle: its bar slides up its posts, its neighbours rise a little after it. At rest the heights are uneven and one bar is bright.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the parts' resting tops, nearest along x.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 12, X0 = 4, HZ = 12, YA = -4, YB = 26;
const REST = [2,5,0,3,1], FAV = 1, LIFT = 14, BUMP = 6;

function box(P, front, x0, y0, x1, y1, r, b, z0, z1) {
  const [ring, inner] = rings(x0, y0, x1, y1, r, b);
  return prism(P, front, ring, inner, z0, z1);
}
function prof(P, x, t, pts, radii) {
  const f = fillet(pts, radii, 4);
  const near = f.map(([y, z]) => [x + t / 2, y, z]), far = f.map(([y, z]) => [x - t / 2, y, z]);
  return { sil: poly(hull(near.concat(far).map((p) => P(...p)))), crease: open(near.map((p) => P(...p)).slice(1, -1)) };
}
function base() { return []; }
function item(P, front, x, h) {
  const t = h + 10;
  return [
    box(P, front, x - 4, -1, x + 4, 2, 1, 0.4, 0, 1.5), box(P, front, x - 1, 0, x + 1, 2, 0.8, 0.3, 1.5, t),
    box(P, front, x - 4, 20, x + 4, 23, 1, 0.4, 0, 1.5), box(P, front, x - 1, 20, x + 1, 22, 0.8, 0.3, 1.5, t),
    box(P, front, x - 1.4, -0.6, x + 1.4, 22.6, 1.2, 0.4, t, t + 3),
  ];
}


function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4);
  fit(C, [[0,-1,0],[56,23,0],[0,23,0],[56,-1,0],[4,11,27],[52,11,27]], 200, 166);
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
      s.sols[4].sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hurdle " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "agilityladder",
  means: "A set of mini hurdles: the bar of the hurdle under the pointer slides up its posts, the neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[132, 122], [200, 156], [268, 190], null],
  mount,
});
