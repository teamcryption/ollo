/**
 * Stevenson screen: the louvred white box that shelters thermometers, on four
 * legs under a flat roof. The pointer opens it: over the screen the louvred
 * door swings wide on its hinge to show the thermometer inside; off it the
 * door falls back ajar. The door is bright. The slider is how far it opens.
 */
const {
  Cam, fit, poly, prism, proj, rings, seg, unproj, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid, facing,
} = HL;

const X = 20, Y = 16, Z0 = 34, Z1 = 74, HY = -14, L = 28, DZ0 = 37, DZ1 = 71, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.55);
  let open = 105 * value;
  fit(C, [[-X - 2, -Y - 2, Z1 + 5], [X + 2, Y + 2, 0], [X + L, HY, DZ0], [-X, Y, 0], [X, -Y, Z1 + 5]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const legs = [];
  for (const [x, y] of [[-X + 3, -Y + 3], [X - 3, -Y + 3], [-X + 3, Y - 3], [X - 3, Y - 3]]) legs.push(seg(P(x, y, 0), P(x, y, Z0)));
  mk("path", { class: "nf sil", d: legs.join("") }, g);
  const [br, bi] = rings(-X, -Y, X, Y, 1.5, 1);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  const [rr, ri] = rings(-X - 3, -Y - 3, X + 3, Y + 3, 1.5, 1.2);
  put(solid(g), prism(P, front, rr, ri, Z1, Z1 + 4));
  // the opening and the thermometer inside it, on the face the door covers
  const fx = X + 0.05, inner = [];
  inner.push(poly([P(fx, HY, DZ0), P(fx, HY + L, DZ0), P(fx, HY + L, DZ1), P(fx, HY, DZ1)]));
  inner.push(seg(P(fx, -1, DZ0 + 8), P(fx, -1, DZ1 - 6)), seg(P(fx, 1, DZ0 + 8), P(fx, 1, DZ1 - 6)));
  mk("path", { class: "nf sil", d: inner.join("") }, g);
  const door = solid(g);
  const sp = spring(REST, { k: 120, c: 20 });
  let drawn = NaN;

  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-3) return;
    drawn = sp.x;
    const a = rad(sp.x), fy = HY + L * Math.cos(a), fxx = X + L * Math.sin(a);
    const at = (t, z) => P(lerp(X, fxx, t), lerp(HY, fy, t), z);
    door.sil.setAttribute("d", poly([at(0, DZ0), at(1, DZ0), at(1, DZ1), at(0, DZ1)]));
    const sl = [];
    for (let k = 1; k < 9; k++) { const z = DZ0 + (k / 9) * (DZ1 - DZ0); sl.push(seg(at(0.1, z), at(0.9, z - 2))); }
    door.cr.setAttribute("d", sl.join(""));
  }
  const lerp = (a, b, t) => a + (b - a) * t;

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = false;
  function retarget() {
    sp.t = over ? open : REST;
    door.sil.classList.toggle("hi", true);
    read.textContent = over ? Math.round(open) + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      let hit = false;
      for (let z = 0; z <= Z1 + 4; z += 6) { const [x, y] = unproj(C, p[0], p[1], z); if (Math.abs(x) < X + 10 && Math.abs(y) < Y + 10) hit = true; }
      over = hit; retarget();
    },
    leave: () => { over = false; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { open = clamp(105 * v, 40, 120); retarget(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "stevenson",
  means: "A Stevenson screen on its legs: over it the louvred door swings wide to show the thermometer inside, off it the door falls back ajar.",
  rules: [1, 3, 5],
  range: [0.5, 1, 1.15],
  tour: [[213, 133], [169, 50], [250, 150], null],
  mount,
});
