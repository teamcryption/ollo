/**
 * Heat press: a clamshell transfer press, a low base with a padded lower
 * platen and a T-shirt laid on it, the heated upper platen hinged at a post
 * behind. The pointer over the press swings the upper platen up on its
 * hinge by its front handle; leaving lowers it to a slight gap. At rest the
 * handle is bright. The slider is how far the clamshell opens.
 */
const {
  Cam, fit, fillet, hull, poly, proj, rad, rings, clamp, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = -8, HZ = 38, REST = 9, V = [0.61, 0.61, 0.5];
const rot = (a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return ([x, y, z]) => [HX + (x - HX) * c - (z - HZ) * s, y, HZ + (x - HX) * s + (z - HZ) * c]; };
function tsolid(P, [ring, inner], z0, z1, T) {
  const at = (z) => ring.map((q) => P(...T([q.u, q.v, z])));
  const a = T([0, 0, z0]), b = T([0, 0, z1]);
  const up = (b[0] - a[0]) * V[0] + (b[1] - a[1]) * V[1] + (b[2] - a[2]) * V[2] >= 0;
  return { sil: poly(hull(at(z0).concat(at(z1)))), crease: poly(inner.map((q) => P(...T([q.u, q.v, up ? z1 : z0])))), up };
}
const ID = (p) => p;
const SHIRT = [[-6, 14], [-16, 18], [-27, 27], [-21, 35], [-15, 31], [-15, 66], [15, 66], [15, 31], [21, 35], [27, 27], [16, 18], [6, 14], [0, 19]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 1.85);
  const lidPts = [];
  for (const x of [2, 96]) for (const y of [0, 60]) for (const z of [18, 36]) lidPts.push(rot(64)([x, y, z]));
  fit(C, [[-18, -6, 0], [86, 66, 0], [86, -6, 0], [-18, 66, 0], [-18, 30, 46], ...lidPts], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const st = (r, z0, z1, T = ID) => tsolid(P, r, z0, z1, T);
  put(solid(g), st(rings(-18, -6, 86, 66, 7, 2), 0, 8));
  put(solid(g), st(rings(6, 2, 80, 58, 6, 2), 8, 16));
  mk("path", { d: poly(fillet(SHIRT.map(([a, b]) => P(b, 30 + a, 16)), SHIRT.map(() => 2), 3)), class: "nf lo" }, g);
  put(solid(g), st(rings(-18, 22, -4, 38, 4, 1.5), 8, 44));

  const lid = mk("g", {}, g);
  const plate = solid(lid), arm = solid(lid), c1 = solid(lid), c2 = solid(lid), bar = solid(lid);
  bar.sil.classList.add("hi");
  const R = { plate: rings(2, 0, 80, 60, 6, 2), arm: rings(-12, 24, 30, 36, 4, 1.5), c1: rings(76, 10, 92, 15, 2, 0.8), c2: rings(76, 45, 92, 50, 2, 0.8), bar: rings(88, 4, 96, 56, 3.5, 1) };
  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    const T = rot(a), p = st(R.plate, 18, 30, T);
    put(plate, p); put(arm, st(R.arm, 30, 38, T)); put(c1, st(R.c1, 26, 32, T)); put(c2, st(R.c2, 26, 32, T)); put(bar, st(R.bar, 28, 36, T));
    if (p.up) lid.append(plate.g, arm.g, c1.g, c2.g, bar.g);
    else lid.append(arm.g, c1.g, c2.g, bar.g, plate.g);
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, on ? max : REST, performance.now(), 0);
    read.textContent = on ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setOn(clamp(x, -24, 100) === x && clamp(y, -12, 72) === y);
  }
  bag.add(pointer(stage, { move, leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { max = v; if (on) { on = null; setOn(true); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "heatpress",
  means: "A clamshell heat press over a T-shirt: the pointer swings the heated upper platen up on its hinge; leaving lowers it again.",
  rules: [1, 3, 5, 8],
  range: [30, 50, 64],
  tour: [[221, 239], [262, 262], [180, 210], null],
  mount,
});
