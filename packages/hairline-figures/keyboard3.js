/**
 * Macro pad: a small slab with a cable stub and a three-by-three grid of
 * keys. The pointer picks a key on the plane of the resting key tops: it
 * pops up high, the keys round it rise less with distance, staggered out
 * from it. At rest the keys sit at uneven heights, the centre one bright.
 * The slider is the stagger.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween, unproj, disposer, mk, pointer, put, register, solid } = HL;

const G = 3, PITCH = 13, KS = 11, BZ = 5, KH = 5, LIFT = 16, M = 3;
const SIZE = M * 2 + (G - 1) * PITCH + KS;
const REST = [1, 0, 2, 0, 4, 1, 2, 1, 0], FAV = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 4.15);
  fit(C, [[0, 0, 0], [SIZE, SIZE, 0], [0, SIZE, 0], [SIZE, 0, 0], [M, M, BZ + KH + LIFT], [SIZE - M, M, BZ + KH + LIFT]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g);
  const [bo, bi] = rings(0, 0, SIZE, SIZE, 5, 1.4);
  put(base, prism(P, front, bo, bi, 0, BZ));
  mk("path", { class: "nf lo", d: seg(P(SIZE / 2, -0.2, 2.5), P(SIZE / 2, -6, 2.5)) }, g);

  const keys = [];
  for (let j = 0; j < G; j++) for (let i = 0; i < G; i++) keys.push({ i, j, x: M + i * PITCH, y: M + j * PITCH });
  // paint far to near
  keys.slice().sort((a, b) => a.x + a.y - (b.x + b.y)).forEach((k) => { k.s = solid(g); });
  keys.forEach((k, n) => { k.n = n; k.z = tween(REST[n]); k.last = NaN; });

  function draw(k, lift) {
    if (lift === k.last) return;
    k.last = lift;
    const [o, i] = rings(k.x, k.y, k.x + KS, k.y + KS, 2.4, 1.2);
    put(k.s, prism(P, front, o, i, BZ, BZ + KH + lift));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    keys.forEach((k) => { draw(k, tval(k.z, now)); if (!tdone(k.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ + KH + 1);
    if (x < 0 || y < 0 || x > SIZE || y > SIZE) return -1;
    const i = clamp(Math.floor((x - M + 1) / PITCH), 0, G - 1), j = clamp(Math.floor((y - M + 1) / PITCH), 0, G - 1);
    return j * G + i;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const fi = from % G, fj = Math.floor(from / G);
    keys.forEach((k) => {
      const d = a < 0 ? 0 : Math.hypot(k.i - (a % G), k.j - Math.floor(a / G));
      const z = a < 0 ? REST[k.n] : k.n === a ? LIFT : clamp(8 - 4 * d, 1, 8);
      tset(k.z, z, now, from < 0 ? 0 : Math.hypot(k.i - fi, k.j - fj) * stag);
      k.s.sil.classList.toggle("hi", k.n === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "key " + (a % G + 1) + "·" + (Math.floor(a / G) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "keyboard3",
  means: "A macro pad: the key under the pointer pops up high, the keys round it rise less with distance.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[200, 164], [200, 123], [200, 202], null],
  mount,
});
