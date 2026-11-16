/**
 * Crepe spreader: a round crepe griddle with a wooden T spreader lying across
 * it, its handle raised. The pointer is where the batter goes: the spreader
 * swings round the griddle's centre to face it on a spring, and the batter it
 * has spread follows as a sector from where it started. At rest the spreader
 * lies askew across the plate, bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous aim (terrain's spring, on one angle); the hit is
 * on the griddle's plane, which never moves.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, unproj, spring, stepS, open,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 52, H = 14, REST = 0.55, BAR = 46, HW = 4;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-R - 4, -R - 4, 0], [R + 4, R + 4, 0], [R + 4, -R - 4, 0], [-R - 4, R + 4, 0], [0, 0, H + 36]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(R + 3, 72), circ(R, 72), 0, H));
  const batter = mk("path", { class: "nf lo" }, g);
  const bar = mk("path", { class: "sil hi" }, g);
  const stick = mk("path", { class: "sil" }, g);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, over = false;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const c = Math.cos(a), s = Math.sin(a), z = H + 0.4;
    const W = (u, v, w) => P(u * c - v * s, u * s + v * c, z + w);
    const pts = [];
    for (const u of [-BAR, BAR]) for (const v of [-HW, HW]) for (const w of [0, 3]) pts.push(W(u, v, w));
    bar.setAttribute("d", poly(hull(pts)));
    const sk = [];
    for (const [u, v, w] of [[-3, -2, 3], [3, -2, 3], [-3, 2, 3], [3, 2, 3], [-2, 24, 30], [2, 24, 30], [-2, 28, 30], [2, 28, 30]]) sk.push(W(u, v, w));
    stick.setAttribute("d", poly(hull(sk)));
    const arc = [P(0, 0, H)], from = REST, n = 40;
    for (let i = 0; i <= n; i++) { const t = from + ((a - from) * i) / n; arc.push(P((R - 6) * Math.cos(t), (R - 6) * Math.sin(t), H)); }
    batter.setAttribute("d", Math.abs(a - from) > 0.02 ? poly(arc) : open([P(0, 0, H), arc[1]]));
    const deg = Math.round(((a * 180) / Math.PI) % 360 + 360) % 360;
    read.textContent = over ? deg + "°" : "rest";
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], H), r = Math.hypot(x, y); over = r < R + 30; drawn = NaN;
      if (r > 8 && r < R + 30) sp.t = sp.t + wrap(Math.atan2(y, x) - sp.t);
      else if (r >= R + 30) sp.t = sp.t + wrap(REST - sp.t);
      B.wake();
    },
    leave: () => { over = false; drawn = NaN; sp.t = sp.t + wrap(REST - sp.t); B.wake(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "crepemaker",
  means: "A crepe griddle with a T spreader: the spreader swings round the plate to face the pointer, spreading batter.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[151, 96], [111, 209], [289, 120], null],
  mount,
});
