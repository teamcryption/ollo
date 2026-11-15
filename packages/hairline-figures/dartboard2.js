/**
 * Air hockey table: a long rimmed table on a plinth, a centre line and circle,
 * a goal slot at each end, a puck and a striker. The pointer is where the puck
 * slides to across the table, on a spring, and the striker follows it from
 * the near end, a little behind. At rest the puck waits off the centre spot,
 * bright, the striker parked by its goal. The slider is how loose the slide
 * is (a softer or stiffer spring).
 *
 * The pattern: a continuous position on two springs per part; the hit is the
 * table's top plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, spring, stepS, poly, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X = 74, Y = 42, ZT = 12, PR = 8.5, MR = 10;
const REST = { px: -16, py: 9, mx: 50, my: -12 };
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-X, -Y, 0], [X, Y, 0], [X, -Y, ZT + 14], [-X, Y, ZT + 14], [-X, -Y, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-X + 10, -Y + 10, X - 10, Y - 10, 8, 1.4), 0, 5));
  put(solid(g), prism(P, front, ...rings(-X, -Y, X, Y, 12, 2.2), 5, ZT));
  const at = (x, y) => P(x, y, ZT);
  const ring = (cx, r, a0, a1) => { const p = []; for (let k = 0; k <= 32; k++) { const a = a0 + (k / 32) * (a1 - a0); p.push(at(cx + r * Math.cos(a), r * Math.sin(a))); } return p; };
  mk("path", { class: "nf lo", d: seg(at(0, -Y + 3), at(0, Y - 3)) + poly(ring(0, 14, 0, Math.PI * 2)) }, g);
  mk("path", { class: "nf lo", d: poly(ring(-X + 2, 18, -Math.PI / 2, Math.PI / 2)).replace(/Z$/, "") + poly(ring(X - 2, 18, Math.PI / 2, Math.PI * 1.5)).replace(/Z$/, "") }, g);
  for (const s of [-1, 1]) mk("path", { class: "nf sil", d: poly([at(s * (X - 1), -11), at(s * (X - 1), 11), at(s * (X - 4), 11), at(s * (X - 4), -11)]) }, g);

  const puck = { x: spring(REST.px), y: spring(REST.py), g: mk("g", {}, g) };
  puck.s = solid(puck.g);
  const mal = { x: spring(REST.mx), y: spring(REST.my), g: mk("g", {}, g) };
  mal.base = solid(mal.g); mal.stem = solid(mal.g); mal.cap = solid(mal.g);
  puck.s.sil.classList.add("hi");
  let dp = "", dm = "", order = null;

  function draw() {
    const px = puck.x.x, py = puck.y.x, mx = mal.x.x, my = mal.y.x;
    const kp = px.toFixed(2) + py.toFixed(2), km = mx.toFixed(2) + my.toFixed(2);
    if (kp !== dp) { dp = kp; put(puck.s, prism(P, front, disc(px, py, PR, 40), disc(px, py, PR - 1.2, 40), ZT, ZT + 3)); }
    if (km !== dm) {
      dm = km;
      put(mal.base, prism(P, front, disc(mx, my, MR, 40), disc(mx, my, MR - 1.4, 40), ZT, ZT + 4));
      put(mal.stem, prism(P, front, disc(mx, my, 3.6, 24), null, ZT + 4, ZT + 10));
      put(mal.cap, prism(P, front, disc(mx, my, 5.4, 28), disc(mx, my, 4.4, 28), ZT + 10, ZT + 14));
    }
    const pf = px + py < mx + my;
    if (pf !== order) { order = pf; if (pf) puck.g.after(mal.g); else mal.g.after(puck.g); }
  }

  const sps = [puck.x, puck.y, mal.x, mal.y];
  const B = register(stage, (dt) => { let m = false; for (const s of sps) if (stepS(s, dt)) m = true; draw(); return m; });
  bag.add(B.unregister);
  const soft = (v) => { for (const s of sps) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } };
  soft(value);

  function go(on, x, y) {
    if (!on) { puck.x.t = REST.px; puck.y.t = REST.py; mal.x.t = REST.mx; mal.y.t = REST.my; read.textContent = "rest"; }
    else {
      const px = clamp(x, -X + 14, X - 38), py = clamp(y, -Y + 12, Y - 12);
      puck.x.t = px; puck.y.t = py;
      mal.x.t = px + 24; mal.y.t = clamp(py - 6, -Y + 13, Y - 13);
      read.textContent = (py < 0 ? "far " : "near ") + Math.round((px + X) / (2 * X) * 9 + 0.5);
    }
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZT);
      go(Math.abs(x) < X + 18 && Math.abs(y) < Y + 18, x, y);
    },
    leave: () => go(false),
  }));
  bag.add(() => svg.replaceChildren());
  go(false); draw();
  return { set: (v) => soft(v), destroy: bag.dispose };
}

hairline({
  name: "dartboard2",
  means: "An air hockey table: the puck slides across the table to the pointer, and the striker follows it from the near end.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[166, 104], [76, 135], [200, 197], null],
  mount,
});
