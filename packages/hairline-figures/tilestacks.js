/**
 * Tile stacks: four stacks of square floor tiles standing in a row on the
 * ground, each a different height, every tile's seam drawn round the stack's
 * near faces. The pointer picks a stack by where it is along the row: that
 * stack's top tile lifts clear, the neighbours' top tiles lift a little after
 * it. At rest one tile sits just off the tallest stack, bright. The slider is
 * the stagger.
 *
 * The pattern: one of many in a single row, picked by each stack's rest
 * centre on screen; stacks of different heights, so no one plane.
 */
const {
  Cam, clamp, facing, fit, open, prism, proj, rings, ringAt, run, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, W = 20, GAP = 7, T = 2.6, COUNT = [5, 9, 3, 7], LIFT = 15, FAV = 1;
const REST = [0, 3, 0, 0.6];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  const X1 = N * (W + GAP) - GAP, top = Math.max(...COUNT) * T + LIFT;
  fit(C, [[0, 0, 0], [X1, W, 0], [X1, 0, 0], [0, W, 0], [0, 0, top], [X1, 0, top], [W + GAP, 0, top]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const stacks = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * (W + GAP), [ring, inner] = rings(x0, 0, x0 + W, W, 2.2, 1);
    const n = COUNT[k], zb = (n - 1) * T;
    const body = solid(g);
    put(body, prism(P, front, ring, inner, 0, zb));
    const near = run(ring, front), seams = [];
    for (let j = 1; j < n - 1; j++) seams.push(open(ringAt(P, near, j * T)));
    mk("path", { class: "nf lo", d: seams.join("") }, body.g);
    const tile = solid(g);
    const mid = P(x0 + W / 2, W / 2, 0)[0];
    stacks.push({ k, ring, inner, zb, tile, mid, z: tween(REST[k]), last: NaN });
  }

  function draw(s, lift) {
    if (lift === s.last) return;
    s.last = lift;
    put(s.tile, prism(P, front, s.ring, s.inner, s.zb + lift, s.zb + lift + T));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    stacks.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the stack whose rest centre is nearest the pointer's screen x, inside the yard
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 10);
    if (x < -14 || x > X1 + 10 || y < -24 || y > W + 14) return -1;
    let best = -1, bd = Infinity;
    stacks.forEach((s) => { const d = Math.abs(s.mid - sx); if (d < bd) { bd = d; best = s.k; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    stacks.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(5 - 2.5 * Math.abs(k - a), 0, 5);
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.tile.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stack " + (a + 1) + "·" + COUNT[a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "tilestacks",
  means: "Four stacks of floor tiles: the top tile of the stack under the pointer lifts clear, its neighbours' lift a little after.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[117, 122], [234, 181], [291, 197], null],
  mount,
});
