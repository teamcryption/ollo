/**
 * Parallel bars: two long rails on four posts over a pair of floor feet, as
 * a dip station stands. The pointer picks a rail by where it falls on the
 * rails' rest tops, and that rail rises on its posts while the other settles.
 * At rest the near rail stands a touch higher, bright.
 */
const {
  Cam, clamp, fit, prism, proj, facing, rings, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 96, W = 4, Y = [0, 26], H = 40, UP = 12, FAV = 1, PX = [12, L - 12];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let up = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[0, -6, 0], [L, Y[1] + W + 6, 0], [0, 0, H + UP + 6], [L, Y[1] + W, H + UP + 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  for (const x of PX) { const [r, i] = rings(x - 4, -6, x + 4, Y[1] + W + 6, 2, 1); put(solid(g), prism(P, front, r, i, 0, 3)); }

  const rails = Y.map((y, k) => ({ k, y, posts: PX.map(() => solid(g)), el: solid(g), h: tween(k === FAV ? H + 4 : H), last: "" }));

  function draw(b, h) {
    const key = h.toFixed(2);
    if (key === b.last) return;
    b.last = key;
    PX.forEach((x, j) => { const [r, i] = rings(x - 1.6, b.y + 0.4, x + 1.6, b.y + W - 0.4, 1.4, 0.6); put(b.posts[j], prism(P, front, r, i, 3, h)); });
    const [r, i] = rings(0, b.y, L, b.y + W, 2, 0.8);
    put(b.el, prism(P, front, r, i, h, h + W));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of rails) { draw(b, tval(b.h, now)); if (!tdone(b.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The rail whose rest top, unprojected at its own height, puts the pointer nearest its middle. */
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    rails.forEach((b, k) => {
      const z = (k === FAV ? H + 4 : H) + W, [wx, wy] = unproj(C, sx, sy, z);
      const d = Math.abs(wy - (b.y + W / 2));
      if (wx > -4 && wx < L + 4 && d < bd) { bd = d; best = k; }
    });
    return bd < 13 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    rails.forEach((b, k) => {
      tset(b.h, a < 0 ? (k === FAV ? H + 4 : H) : k === a ? H + clamp(up, 0, UP) : H - 2, now, 0);
      b.el.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "rail L" : "rail R";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { up = v; if (act >= 0) { const a = act; act = -2; setActive(a); } }, destroy: bag.dispose };
}

hairline({
  name: "skipperbars",
  means: "Two parallel dip bars on posts: the rail under the pointer rises on its posts while the other settles.",
  rules: [1, 3, 5, 8],
  range: [4, 10, 12],
  tour: [[146, 82], [179, 144], [254, 273], null],
  mount,
});
