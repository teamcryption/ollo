/**
 * Battery bank: a rack of six tall cells on a base plate, each with two
 * terminals on its lid, strapped in series, and a charge line round its
 * walls. The pointer charges: the levels near it rise, each on its own
 * spring, the cell under it full and bright. At rest the levels are uneven,
 * the fullest cell bright. The slider is the reach, in cells.
 *
 * The pattern: a continuous field (terrain) along one row; the hit picks the
 * cell whose rest centre is nearest the pointer's screen x.
 */
const {
  Cam, circ, clamp, facing, fit, lerp, open, prism, proj, rings, ringAt, run, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, PITCH = 15, W = 12, D = 16, H = 44, TOP = 47.5, Z0 = 4, Z1 = 40;
const REST = [0.14, 0.42, 0.72, 0.3, 0.52, 0.08], FAV = 2;
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value, over = null;
  const X1 = (N - 1) * PITCH + W;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-5, -5, -5], [X1 + 5, D + 5, -5], [X1 + 5, -5, -5], [-5, D + 5, -5], [-5, -5, TOP], [X1 + 5, D + 5, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-5, -5, X1 + 5, D + 5, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, -5, 0));

  const cells = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * PITCH, cx = x0 + W / 2, el = solid(g);
    const [ring, inner] = rings(x0, 0, x0 + W, D, 2.5, 1.2);
    put(el, prism(P, front, ring, inner, 0, H));
    const bars = mk("path", { class: "nf lo" }, el.g), lvl = mk("path", { class: "nf" }, el.g);
    for (const ty of [4, 12]) put(solid(el.g), prism(P, front, disc(cx, ty, 1.9), disc(cx, ty, 1.1), H, TOP));
    if (k > 0) mk("path", { class: "nf sil", d: seg(P(cx - PITCH, 12, TOP), P(cx, 4, TOP)) }, el.g);
    const vis = run(ring, front);
    cells.push({ k, cx, el, lvl, bars, vis, sx: P(cx, D / 2, H / 2)[0], rest: REST[k], sp: spring(REST[k], { eps: 0.004 }), drawn: NaN });
  }
  const box = [P(-5, D + 5, -5), P(X1 + 5, -5, TOP), P(-5, -5, TOP), P(X1 + 5, D + 5, -5)];
  const bx = [Math.min(...box.map((p) => p[0])), Math.max(...box.map((p) => p[0]))];
  const by = [Math.min(...box.map((p) => p[1])), Math.max(...box.map((p) => p[1]))];

  function draw(c) {
    const v = clamp(c.sp.x, 0, 1);
    if (Math.abs(v - c.drawn) < 1e-3) return;
    c.drawn = v;
    const z = lerp(Z0, Z1, v);
    c.lvl.setAttribute("d", open(ringAt(P, c.vis, z)));
    let d = "";
    for (let b = Z0; b < z - 2.5; b += 4) d += open(ringAt(P, c.vis, b));
    c.bars.setAttribute("d", d);
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const c of cells) { if (stepS(c.sp, dt)) m = true; draw(c); }
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null;
    if (over != null) { let bd = Infinity; for (const c of cells) { const d = Math.abs(c.sx - over); if (d < bd) { bd = d; hit = c; } } }
    for (const c of cells) {
      c.sp.t = !hit ? c.rest : c === hit ? 1 : lerp(c.rest, 1, 0.85 * falloff(Math.abs(c.k - hit.k) / RAD));
      const on = hit ? c === hit : c.k === FAV;
      c.el.sil.classList.toggle("hi", on);
      c.lvl.setAttribute("class", on ? "nf hi" : "nf");
    }
    read.textContent = hit ? "cell " + (hit.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      over = p[0] > bx[0] - 8 && p[0] < bx[1] + 8 && p[1] > by[0] - 10 && p[1] < by[1] + 10 ? p[0] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "batterybank",
  means: "A rack of six battery cells: the charge levels near the pointer rise, the cell under it full and bright.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3.5],
  tour: [[168, 104], [212, 126], [246, 152], null],
  mount,
});
