/**
 * Linen cart: a housekeeping cart, a low deck on four casters with a push
 * handle at the back, carrying three stacks of folded towels. The pointer
 * picks a stack by where it is along the cart: its towels fan up off the
 * deck, the neighbouring stacks loosen a little after it. At rest the stacks
 * lie unevenly, the middle one's top towel bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the stacks' resting middles.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 66, Y1 = 30, DZ = 12, TH = 3.4, NT = 4, XS = [17, 35, 53], FAN = 6;
const REST = [0.5, 1.4, 0.2], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [35, 4, DZ + NT * TH + (NT - 1) * FAN], [0, 4, 48]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };

  // casters, then the deck, then the handle at the back end
  [[4, 4], [4, Y1 - 4], [X1 - 4, 4], [X1 - 4, Y1 - 4]].forEach(([x, y]) => box(g, x - 2.2, y - 2.2, x + 2.2, y + 2.2, 2, 0.6, 0, DZ - 3));
  box(g, 0, 0, X1, Y1, 4, 1.4, DZ - 3, DZ);
  box(g, 1, 3, 4, 6, 1.4, 0.5, DZ, 46);
  box(g, 1, Y1 - 6, 4, Y1 - 3, 1.4, 0.5, DZ, 46);
  box(g, 1, 3, 4, Y1 - 3, 1.4, 0.5, 46, 49);

  // the stacks: four folded towels each, bottom to top
  const stacks = XS.map((xc, k) => {
    const grp = mk("g", {}, g);
    const towels = [];
    for (let j = 0; j < NT; j++) towels.push(solid(grp));
    return { k, xc, towels, f: tween(REST[k]), last: NaN };
  });
  const [ro, ri] = rings(-8, 4, 8, Y1 - 4, 3, 1.2);
  const shift = (ring, xc) => ring.map((s) => ({ ...s, u: s.u + xc }));
  function draw(s, f) {
    if (f === s.last) return;
    s.last = f;
    const o = shift(ro, s.xc), i = shift(ri, s.xc);
    s.towels.forEach((t, j) => { const z = DZ + j * (TH + f); put(t, prism(P, front, o, i, z, z + TH)); });
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    stacks.forEach((s) => { draw(s, tval(s.f, now)); if (!tdone(s.f, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, DZ + 8);
    if (x < 6 || x > X1 + 2 || y < -2 || y > Y1 + 4) return -1;
    return clamp(Math.round((x - XS[0]) / 18), 0, 2);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    stacks.forEach((s, k) => {
      const f = a < 0 ? REST[k] : k === a ? FAN : 1.6;
      tset(s.f, f, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      s.towels.forEach((t, j) => t.sil.classList.toggle("hi", a < 0 ? on && j === NT - 1 : on));
    });
    read.textContent = a < 0 ? "rest" : "stack " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "laundrycart",
  means: "A linen cart with three towel stacks: the stack under the pointer fans its towels up, the others loosen after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[165, 157], [204, 166], [244, 196], null],
  mount,
});
