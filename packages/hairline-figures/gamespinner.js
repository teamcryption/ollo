/**
 * Game spinner: a square board-game card split in four, with a kite-shaped
 * arrow on a hub. The pointer is the quadrant you call: the arrow turns to
 * point at it and the card tips toward it on its own spring. At rest the
 * arrow points between two quadrants, bright, the card a little tipped.
 */
const { Cam, fit, proj, facing, rings, prism, circ, fillet, poly, seg, unproj, spring, stepS, clamp, disposer, mk, solid, put, register, pointer, flatDot, place } = HL;
const H = 40, T = 3, REST = 0.5;
const KITE = fillet([[-11, 0], [0, -5.5], [36, 0], [0, 5.5]], [2, 2, 1.2, 2], 3);
const ringOf = (pts) => pts.map((p, i) => {
  const a = pts[(i + pts.length - 1) % pts.length], b = pts[(i + 1) % pts.length];
  const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1;
  return { u: p[0], v: p[1], nu: ty / l, nv: -tx / l };
});
const turn = (pts, a) => { const c = Math.cos(a), s = Math.sin(a); return pts.map(([x, y]) => [x * c - y * s, x * s + y * c]); };
const DOTS = [[20, 20], [-20, 20], [-20, -20], [20, -20]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-H, -H, -8], [H, H, -8], [-H, H, 12], [H, -H, 12], [-H, -H, 14], [H, H, 14]], 200, 166);
  const P0 = proj(C), front = facing(C), g = mk("g", {}, svg);
  const card = solid(g), lines = mk("path", { class: "lo nf" }, g);
  const dots = DOTS.map(() => flatDot(g, C, 1.6, "dot off"));
  const arrow = solid(g), hub = solid(g);
  const a = spring(REST * Math.PI), sx = spring(0.06), sy = spring(-0.04);
  let tip = 0.14 * value, drawn = "";
  function draw() {
    const key = [a.x, sx.x, sy.x].map((v) => v.toFixed(4)).join();
    if (key === drawn) return;
    drawn = key;
    const P = (x, y, z) => P0(x, y, z - x * sx.x - y * sy.x);
    put(card, prism(P, front, ...rings(-H, -H, H, H, 5, 1.6), 0, T));
    lines.setAttribute("d", seg(P(-H + 2, 0, T), P(H - 2, 0, T)) + seg(P(0, -H + 2, T), P(0, H - 2, T)));
    DOTS.forEach(([x, y], i) => place(dots[i], P(x, y, T)));
    const k = turn(KITE, a.x);
    put(arrow, prism(P, front, ringOf(k), ringOf(turn(fillet([[-9.5, 0], [0, -4.2], [33, 0], [0, 4.2]], [2, 2, 1, 2], 3), a.x)), T + 2, T + 4.5));
    put(hub, prism(P, front, circ(3.2, 20), circ(2.2, 20), T, T + 6));
  }
  const B = register(stage, (dt) => { let m = stepS(a, dt); if (stepS(sx, dt)) m = true; if (stepS(sy, dt)) m = true; draw(); return m; });
  bag.add(B.unregister);
  const wrap = (v) => v - Math.PI * 2 * Math.round(v / (Math.PI * 2));
  function set(over) {
    let q = -1;
    if (over) {
      const ang = Math.atan2(over[1], over[0]), r = Math.hypot(over[0], over[1]) || 1;
      a.t = a.t + wrap(ang - a.t);
      const m = clamp(r / H, 0.4, 1) * tip;
      sx.t = (over[0] / r) * m; sy.t = (over[1] / r) * m;
      q = ((Math.floor((ang + Math.PI * 2) / (Math.PI / 2)) % 4) + 4) % 4;
    } else { a.t = a.t + wrap(REST * Math.PI - a.t); sx.t = 0.06; sy.t = -0.04; }
    arrow.sil.classList.toggle("hi", !over);
    dots.forEach((d, i) => d.setAttribute("class", i === q ? "dot" : "dot off"));
    read.textContent = over ? "q " + (q + 1) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], T); set(Math.abs(x) < H + 10 && Math.abs(y) < H + 10 && Math.hypot(x, y) > 4 ? [x, y] : null); },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null); draw();
  return { set: (v) => { tip = 0.14 * v; }, destroy: bag.dispose };
}

hairline({
  name: "gamespinner",
  means: "A board game spinner: the arrow turns to point at the quadrant under the pointer and the card tips toward it.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.5],
  tour: [[200, 205], [140, 165], [262, 162], null],
  mount,
});
