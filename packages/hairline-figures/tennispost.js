/**
 * Tennis bag: a long racket bag with three rackets standing out of its open zip. The pointer picks a racket: it slides up out of the bag, its neighbours lift a little after it. At rest one racket is bright.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the parts' resting tops, nearest along x.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 3, STEP = 14, X0 = 8, HZ = 38, YA = -14, YB = 22;
const REST = [4,0,9], FAV = 2, LIFT = 18, BUMP = 6;

function box(P, front, x0, y0, x1, y1, r, b, z0, z1) {
  const [ring, inner] = rings(x0, y0, x1, y1, r, b);
  return prism(P, front, ring, inner, z0, z1);
}
function prof(P, x, t, pts, radii) {
  const f = fillet(pts, radii, 4);
  const near = f.map(([y, z]) => [x + t / 2, y, z]), far = f.map(([y, z]) => [x - t / 2, y, z]);
  return { sil: poly(hull(near.concat(far).map((p) => P(...p)))), crease: open(near.map((p) => P(...p)).slice(1, -1)) };
}
function base(P, front) { return [box(P, front, -2, 0, 46, 18, 9, 1.5, 0, 16)]; }
function item(P, front, x, h) {
  const zc = 16 + h + 26, ell = (ry, rz) => { const o = []; for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; o.push([9 + ry * Math.cos(a), zc + rz * Math.sin(a)]); } return o; };
  const out = ell(8.5, 11).concat([[7.6, 16], [10.4, 16]]);
  const pts = [];
  [x - 1.2, x + 1.2].forEach((xx) => out.forEach(([y, z]) => pts.push(P(xx, y, z))));
  return [{ sil: poly(hull(pts)), crease: poly(ell(7, 9.5).map(([y, z]) => P(x + 1.2, y, z))) }];
}


function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.9);
  fit(C, [[-2,0,0],[46,18,0],[-2,18,0],[46,0,0],[8,9,71],[36,9,71]], 200, 166);
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
      s.sols[0].sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "racket " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tennispost",
  means: "A racket bag with three rackets: the racket under the pointer slides up out of the bag, the others lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[161, 125], [200, 144], [239, 163], null],
  mount,
});
