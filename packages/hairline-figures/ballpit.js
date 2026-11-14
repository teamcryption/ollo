/**
 * Ball pit: a soft-walled pit heaped with balls. The pointer picks the ball
 * it stands over, on the plane through the balls' rest centres: that ball
 * bounces up out of the heap and the balls round it rise a little, staggered
 * by distance. At rest one ball is half raised, bright. The slider is the stagger.
 *
 * The pattern: a field picked on a plane (terrain).
 */
const {
  Cam, fit, facing, prism, proj, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const G = 4, R = 8, SP = 17, WH = 10, LIFT = 22, FAV = 6;
const W = G * SP + 8;
const REST = [2, 0, 3, 1, 0, 4, 0, 2, 3, 1, 0, 2, 1, 3, 2, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -4, 0], [W + 4, W + 4, 0], [W + 4, -4, 0], [-4, W + 4, 0], [W / 2, W / 2, WH + R * 2 + LIFT + 4]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, W + 4, W + 4, 10, 4);
  put(solid(g), prism(P, front, pr, pi, 0, WH));

  const items = [], order = [];
  for (let i = 0; i < G; i++) for (let j = 0; j < G; j++) order.push([i, j]);
  order.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
  const byK = [];
  for (const [i, j] of order) {
    const k = i * G + j, x = 4 + R + i * SP + (j % 2) * 3, y = 4 + R + j * SP;
    const ball = mk("ellipse", { class: "sil", rx: R * 2.3, ry: R * 2.3 }, g);
    const seam = mk("path", { class: "nf lo" }, g);
    byK[k] = { k, i, j, x, y, ball, seam, z: tween(k === FAV ? LIFT * 0.5 : REST[k]), last: NaN };
  }
  items.push(...byK);

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const c = P(it.x, it.y, WH + R * 0.4 + lift);
    it.ball.setAttribute("cx", c[0]); it.ball.setAttribute("cy", c[1]);
    // a seam: one short arc across the ball's face
    const rr = R * 2.3 * 0.62;
    it.seam.setAttribute("d", "M" + (c[0] - rr) + "," + (c[1] - 2) + "Q" + c[0] + "," + (c[1] + rr * 0.55) + " " + (c[0] + rr) + "," + (c[1] - 2));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, WH + R * 0.4);
    let best = -1, bd = Infinity;
    for (const it of items) { const d = Math.hypot(it.x - wx, it.y - wy); if (d < bd) { bd = d; best = it.k; } }
    return bd < R * 1.4 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, f = items[from];
    act = a;
    for (const it of items) {
      const dd = a < 0 ? 9 : Math.hypot(it.i - items[a].i, it.j - items[a].j);
      const z = a < 0 ? (it.k === FAV ? LIFT * 0.5 : REST[it.k]) : dd === 0 ? LIFT : dd < 1.5 ? 6 : 0;
      tset(it.z, z, now, f ? Math.hypot(it.i - f.i, it.j - f.j) * stag : 0);
      it.ball.classList.toggle("hi", it.k === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "ball " + (items[a].i + 1) + "·" + (items[a].j + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ballpit",
  means: "A pit heaped with balls: the ball under the pointer bounces up out of the heap, and the balls round it rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[150, 150], [200, 170], [250, 190], null],
  mount,
});
