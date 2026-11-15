/**
 * Flipper: the foot of a pinball table seen from the player's end, two
 * flippers on their pivots, three round bumpers up the field and a ball. The
 * pointer picks a side: that flipper swings up and the ball is struck across
 * the field toward the bumpers. At rest both flippers hang down and the ball,
 * bright, waits between them.
 *
 * The pattern: a discrete choice between two sides (tween); the hit is on the
 * ground plane, read in the table's own axes, which never move.
 */
const {
  Cam, circ, facing, fit, hull, poly, prism, proj, rings, unproj,
  tween, tset, tval, tdone, disposer, mk, place, pointer, put, register, solid,
} = HL;

const Z = 4, ROT = -Math.PI / 4, c = Math.cos(ROT), s = Math.sin(ROT);
const W = (u, v) => [u * c - v * s, u * s + v * c];
const turn = (ring) => ring.map((q) => { const [x, y] = W(q.u, q.v); const [nx, ny] = W(q.nu, q.nv); return { u: x, v: y, nu: nx, nv: ny }; });
const shift = (ring, du, dv) => ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }));
const FL = [{ pu: -28, pv: 34, down: 38, up: -30 }, { pu: 28, pv: 34, down: 142, up: 210 }];
const BALL = [[0, 18], [16, -12], [-16, -12]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  const ext = [];
  for (const [u, v] of [[-42, -62], [42, -62], [-42, 62], [42, 62]]) { const [x, y] = W(u, v); ext.push([x, y, 0], [x, y, 14]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-42, -62, 42, 62, 10, 1.8);
  put(solid(g), prism(P, front, turn(fr), turn(fi), 0, Z));
  for (const [u, v] of [[0, -48], [-17, -36], [17, -36]]) {
    put(solid(g), prism(P, front, turn(shift(circ(6.5, 24), u, v)), turn(shift(circ(5.3, 24), u, v)), Z, Z + 9));
  }
  const ball = mk("ellipse", { class: "sil hi", rx: 6 * C.S, ry: 6 * C.S }, g);
  const btw = [tween(BALL[0][0]), tween(BALL[0][1])];
  // flipper outline in its own frame: pivot round r 5.5, tip round r 3, 28 long
  const shape = (r0, r1) => {
    const pts = [];
    for (let k = 0; k < 24; k++) { const t = (k / 24) * Math.PI * 2; pts.push([r0 * Math.cos(t), r0 * Math.sin(t)], [32 + r1 * Math.cos(t), r1 * Math.sin(t)]); }
    return hull(pts);
  };
  const outer = shape(5.5, 3), inner = shape(4.3, 1.9);
  const fl = FL.map((f) => ({ ...f, sd: solid(g), tw: tween(f.down + (f.pu < 0 ? -4 : 4)), drawn: NaN }));
  const at = (f, pts, a, z) => pts.map(([px, py]) => { const u = f.pu + px * Math.cos(a) - py * Math.sin(a), v = f.pv + px * Math.sin(a) + py * Math.cos(a); const [x, y] = W(u, v); return P(x, y, z); });

  function draw(now) {
    for (const f of fl) {
      const a = (tval(f.tw, now) * Math.PI) / 180;
      if (a === f.drawn) continue;
      f.drawn = a;
      f.sd.sil.setAttribute("d", poly(hull(at(f, outer, a, Z).concat(at(f, outer, a, Z + 5)))));
      f.sd.cr.setAttribute("d", poly(at(f, inner, a, Z + 5)));
    }
    const [x, y] = W(tval(btw[0], now), tval(btw[1], now));
    place(ball, P(x, y, Z + 6));
  }
  const B = register(stage, (dt, now) => { draw(now); return fl.some((f) => !tdone(f.tw, now)) || !tdone(btw[0], now) || !tdone(btw[1], now); });
  bag.add(B.unregister);

  let side = -2;
  function choose(sd) {
    if (sd === side) return;
    side = sd;
    const now = performance.now();
    fl.forEach((f, i) => {
      tset(f.tw, sd === i ? f.down + (f.up - f.down) * clampV() : f.down + (sd === -1 && i === 0 ? -4 : i ? 4 : -4), now, 0);
      f.sd.sil.classList.toggle("hi", sd === i);
    });
    const b = BALL[sd + 1];
    tset(btw[0], b[0], now, 40); tset(btw[1], b[1], now, 40);
    ball.classList.toggle("hi", sd === -1);
    read.textContent = sd === 0 ? "left" : sd === 1 ? "right" : "rest";
    B.wake();
  }
  let reach = value;
  const clampV = () => Math.min(1.2, Math.max(0.4, reach));
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], Z), u = 0.7071 * (x - y), v = 0.7071 * (x + y);
      if (Math.abs(u) > 56 || v < -76 || v > 66) return choose(-1);
      choose(u < 0 ? 0 : 1);
    },
    leave: () => choose(-1),
  }));
  bag.add(() => svg.replaceChildren());
  choose(-1); draw(performance.now());
  return { set: (v) => { reach = v; const sd = side; side = -2; choose(sd); }, destroy: bag.dispose };
}

hairline({
  name: "pinballflip",
  means: "Two pinball flippers: the one on the pointer's side swings up and strikes the ball across the field.",
  rules: [1, 4, 5, 8],
  range: [0.6, 1, 1.2],
  tour: [[277, 220], [123, 220], [200, 107], null],
  mount,
});
