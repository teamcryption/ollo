/**
 * Bagatelle board: a round-topped board of pins with a plunger lane down one
 * side and a ball. The pointer is where you lean on it: the board tilts toward
 * it and the ball rolls downhill. At rest the board lies a little tipped, the
 * plunger bright.
 */
const { Cam, fit, proj, facing, rings, rrect, prism, circ, unproj, spring, stepS, clamp, disposer, mk, solid, put, register, pointer, flatDot, place } = HL;
const X = 32, Y = 52, T = 3;
const PINS = [[-16, -26], [0, -32], [16, -26], [-8, -12], [8, -12], [-18, 2], [0, 4], [18, 2], [-8, 18], [8, 18]];
const disc = (x, y, r, n = 14) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-X, -Y, -8], [X, Y, -8], [X, -Y, 10], [-X, Y, 10], [-X, -Y, 12], [X, Y, 12]], 200, 166);
  const P0 = proj(C), front = facing(C), g = mk("g", {}, svg);
  const board = solid(g), rail = mk("path", { class: "lo nf" }, g);
  const pins = PINS.map(([x, y]) => ({ x, y, s: null })).sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const p of pins) p.s = solid(g);
  const plunger = solid(g), ball = flatDot(g, C, 2.6, "dot");
  const sx = spring(0.05), sy = spring(0.07);
  let tip = 0.16 * value, drawn = "";
  function draw() {
    const key = sx.x.toFixed(4) + sy.x.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const P = (x, y, z) => P0(x, y, z - x * sx.x - y * sy.x);
    const ring = rrect(-X, -Y, X, Y, 26, 10), inner = rrect(-X + 1.6, -Y + 1.6, X - 1.6, Y - 1.6, 24.4, 10);
    put(board, prism(P, front, ring, inner, 0, T));
    rail.setAttribute("d", "M" + P(X - 8, Y - 3, T) + "L" + P(X - 8, -8, T));
    for (const p of pins) put(p.s, prism(P, front, disc(p.x, p.y, 1.3), null, T, T + 4));
    const py = Y - 24 + clamp(sy.x, -0.2, 0.2) * 40;
    put(plunger, prism(P, front, ...rings(X - 6.5, py - 4, X - 2.5, py + 14, 1.8, 0.6), T + 1, T + 4));
    const bx = clamp(-4 + sx.x * 160, -X + 6, X - 12), by = clamp(10 + sy.x * 220, -Y + 14, Y - 6);
    place(ball, P(bx, by, T + 2.6));
  }
  const B = register(stage, (dt) => { let m = stepS(sx, dt); if (stepS(sy, dt)) m = true; draw(); return m; });
  bag.add(B.unregister);
  function set(over) {
    let near = null;
    if (over) {
      const r = Math.hypot(over[0], over[1]) || 1, m = clamp(r / Y, 0.4, 1) * tip;
      sx.t = (over[0] / r) * m; sy.t = (over[1] / r) * m;
      let bd = Infinity;
      for (const p of pins) { const d = Math.hypot(p.x - over[0], p.y - over[1]); if (d < bd) { bd = d; near = p; } }
    } else { sx.t = 0.05; sy.t = 0.07; }
    plunger.sil.classList.toggle("hi", !over);
    for (const p of pins) p.s.sil.classList.toggle("hi", p === near);
    read.textContent = near ? "pin " + (pins.indexOf(near) + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], T); set(Math.abs(x) < X + 8 && Math.abs(y) < Y + 8 ? [x, y] : null); },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null); draw();
  return { set: (v) => { tip = 0.16 * v; }, destroy: bag.dispose };
}

hairline({
  name: "bagatelle",
  means: "A bagatelle board of pins and a plunger: the board tilts toward the pointer and the ball rolls downhill.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[220, 125], [175, 205], [245, 170], null],
  mount,
});
