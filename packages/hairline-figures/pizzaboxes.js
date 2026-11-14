/**
 * Pizza boxes: a loose stack of five flat square boxes, each with its lid
 * seam a little below the top. The pointer picks a box by its height in the
 * stack: that box slides out toward the reader, bright, and the boxes next
 * to it shift a little, staggered from it. At rest the second box sits half
 * pulled out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a stack (stepped parts, picked at rest).
 */
const {
  Cam, fit, facing, open, prism, proj, rings, run, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, W = 50, H = 7, OUT = 28, FAV = 1, REST = 11;
const JIT = [[0, 0], [2, -2], [-2, 1], [1, 3], [-1, -1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-3, -3, 0], [W + 3, W + OUT + 3, 0], [W + 3, -3, 0], [-3, W + OUT + 3, 0], [-3, -3, N * H], [W + 3, W + OUT, N * H]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const items = [];
  for (let k = 0; k < N; k++) {
    const [jx, jy] = JIT[k], s = solid(g), seam = mk("path", { class: "nf lo" }, s.g);
    items.push({ k, jx, jy, z0: k * H, s, seam, y: tween(k === FAV ? REST : 0), last: NaN });
  }

  function draw(it, dy) {
    if (dy === it.last) return;
    it.last = dy;
    const x0 = it.jx, y0 = it.jy + dy;
    const [r, i] = rings(x0, y0, x0 + W, y0 + W, 3, 1.4);
    put(it.s, prism(P, front, r, i, it.z0, it.z0 + H - 0.4));
    it.seam.setAttribute("d", open(ringAt(P, run(r, front), it.z0 + H * 0.55)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  // pick by the rest pose: the box whose rest middle is nearest the pointer's height
  const mids = items.map((it) => P(it.jx + W / 2, it.jy + W, it.z0 + H / 2));
  const centre = P(W / 2, W / 2, 0);
  function hit([sx, sy]) {
    if (Math.abs(sx - centre[0]) > 95) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? (k === FAV ? REST : 0) : dd === 0 ? OUT : dd === 1 ? 5 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (N - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pizzaboxes",
  means: "A loose stack of five pizza boxes: the box at the pointer's height slides out of the stack and its neighbours shift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[177, 214], [177, 163], [177, 146], null],
  mount,
});
