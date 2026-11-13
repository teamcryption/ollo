/**
 * Coin stacks: twenty stacks of coins on a rounded tray, each a column of
 * thin discs with a line at every coin. At rest the stacks climb from front
 * left to back right, savings growing. The pointer rises the stacks around
 * it, the near ones tallest, each on its own spring. The slider is the reach.
 *
 * The pattern: a continuous field (terrain), on round stacks.
 */
const {
  Cam, circ, clamp, facing, fit, open, prism, proj, rings, ringAt, run, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NX = 5, NY = 4, CELL = 22, R = 8.4, COIN = 2.4, HMAX = 50;
const EXT_X = NX * CELL, EXT_Y = NY * CELL;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.42 ? 1 - (u / 0.42) * 0.62 : u <= 1 ? 0.38 - ((u - 0.42) / 0.58) * 0.26 : 0.12);
const disc = (cx, cy, r) => circ(r, 40).map((q) => ({ ...q, u: q.u + cx, v: q.v + cy }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * CELL, over = null;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-8, -8, -4], [EXT_X + 8, EXT_Y + 8, -4], [EXT_X + 8, -8, -4], [-8, EXT_Y + 8, -4], [0, 0, HMAX + 4]], 200, 168);
  const P = proj(C), front = facing(C);

  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-8, -8, EXT_X + 8, EXT_Y + 8, 10, 2);
  put(solid(g), prism(P, front, tr, ti, -4, 0));

  const stacks = [];
  for (let s = 0; s <= NX + NY - 2; s++) for (let i = 0; i < NX; i++) {
    const j = s - i;
    if (j < 0 || j >= NY) continue;
    const cx = (i + 0.5) * CELL, cy = (j + 0.5) * CELL;
    // savings growing: taller toward the back right, with a little unevenness
    const h0 = COIN * Math.round(2 + i * 2.2 + (NY - 1 - j) * 1.1 + ((i * 7 + j * 3) % 3) * 0.6);
    const ring = disc(cx, cy, R), inner = disc(cx, cy, R - 1.6);
    const el = solid(g), lines = mk("path", { class: "nf lo" }, el.g);
    stacks.push({ i, j, cx, cy, h0, ring, inner, el, lines, sp: spring(h0, { eps: 0.04 }), drawn: NaN });
  }

  function draw(st) {
    const h = Math.max(COIN, st.sp.x);
    if (h === st.drawn) return;
    st.drawn = h;
    put(st.el, prism(P, front, st.ring, st.inner, 0, h));
    const f = run(st.ring, front);
    let d = "";
    for (let z = COIN; z < h - 0.6; z += COIN) d += open(ringAt(P, f, z));
    st.lines.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const st of stacks) { if (stepS(st.sp, dt)) m = true; draw(st); }
    return m;
  });
  bag.add(B.unregister);

  const tallest = stacks.reduce((a, b) => (b.h0 > a.h0 ? b : a));
  function retarget() {
    let mark = tallest;
    for (const st of stacks) {
      if (!over) { st.sp.t = st.h0; continue; }
      st.sp.t = Math.max(COIN, Math.round((HMAX * falloff(Math.hypot(st.cx - over[0], st.cy - over[1]) / RAD)) / COIN) * COIN);
    }
    if (over) {
      const i = clamp(Math.floor(over[0] / CELL), 0, NX - 1), j = clamp(Math.floor(over[1] / CELL), 0, NY - 1);
      mark = stacks.find((st) => st.i === i && st.j === j);
      read.textContent = `stack ${i + 1}·${j + 1}`;
    } else read.textContent = "rest";
    for (const st of stacks) st.el.sil.classList.toggle("hi", st === mark);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => { const q = unproj(C, p[0], p[1], 0); over = [clamp(q[0], 0, EXT_X), clamp(q[1], 0, EXT_Y)]; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();

  return { set: (v) => { RAD = v * CELL; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "coinstacks",
  means: "Twenty stacks of coins on a tray: the stacks around the pointer rise, the nearest tallest.",
  rules: [1, 3, 5, 9],
  range: [1.2, 2.2, 3.5],
  tour: [[150, 200], [240, 170], [200, 240], null],
  mount,
});
