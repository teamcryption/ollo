/**
 * Arcade buttons: an arcade control panel, a slab with a joystick on its left
 * and a 3 × 4 grid of round buttons, each a cap sunk in its own bezel. The
 * pointer plays: the buttons near it press down, each on its own spring, the
 * one under it deepest and bright, and the stick leans toward the hand. At
 * rest a combo is held, its middle button bright. The slider is the reach, in
 * button spacings.
 *
 * The pattern: a continuous field (terrain) over a grid; the hit is on the
 * plane of the caps' resting tops, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const COLS = 4, ROWS = 3, SX = 17, SY = 15, X0 = 42, Y0 = 9, R = 5, H = 7.5, DMAX = 5.6, TOP = 9;
const JX = 17, JY = 24, STICK = 16, BALL = 4.8, LEAN = 7, LEAN0 = [3.2, -2.4];
const PX1 = X0 + (COLS - 1) * SX + 11, PY1 = Y0 + (ROWS - 1) * SY + 11;
const COMBO = { "1·2": 0.5, "1·3": 0.85, "2·3": 0.3 }, FAV = "1·3";
const falloff = (u) => (u <= 0 ? 1 : u <= 0.45 ? 1 - (u / 0.45) * 0.62 : u <= 1 ? 0.38 - ((u - 0.45) / 0.55) * 0.38 : 0);
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let RAD = value * SX, over = null;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-2, -4, 0], [PX1, PY1, 0], [PX1, -4, 0], [-2, PY1, 0], [JX - LEAN, JY - LEAN, TOP + STICK + 2 * BALL], [JX, JY, TOP + STICK + 2 * BALL]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the panel, then the joystick at its far-left end: a washer, a dust boot, the stick and its ball
  const [pr, pi] = rings(-2, -4, PX1, PY1, 4, 1.6);
  put(solid(g), prism(P, front, pr, pi, 0, TOP));
  put(solid(g), prism(P, front, disc(JX, JY, 7.5), disc(JX, JY, 6.3), TOP, TOP + 1));
  mk("path", { class: "sil", d: poly(hull(ringAt(P, disc(JX, JY, 3.6, 20), TOP + 1).concat(ringAt(P, disc(JX, JY, 1.9, 20), TOP + 4)))) }, g);
  const shaft = mk("path", { class: "sil" }, g), ball = mk("path", { class: "sil" }, g);
  const lx = spring(LEAN0[0]), ly = spring(LEAN0[1]);
  let leanDrawn = "";

  // the buttons, far to near: a bezel on the panel, then the cap that presses into it
  const btns = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) btns.push({ r, c, id: r + 1 + "·" + (c + 1), x: X0 + c * SX, y: Y0 + r * SY });
  btns.sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const b of btns) {
    put(solid(g), prism(P, front, disc(b.x, b.y, R + 1.7), disc(b.x, b.y, R + 1), TOP, TOP + 1));
    b.cap = solid(g);
    b.ring = disc(b.x, b.y, R);
    b.inner = disc(b.x, b.y, R - 0.9);
    b.rest = (COMBO[b.id] || 0) * DMAX;
    b.sp = spring(b.rest, { eps: 0.02 });
    b.drawn = NaN;
  }

  function drawStick() {
    const key = lx.x.toFixed(2) + "," + ly.x.toFixed(2);
    if (key === leanDrawn) return;
    leanDrawn = key;
    const tx = JX + lx.x, ty = JY + ly.x, tz = TOP + STICK;
    shaft.setAttribute("d", poly(hull(ringAt(P, disc(JX, JY, 1.2, 16), TOP + 3).concat(ringAt(P, disc(tx, ty, 1.2, 16), tz)))));
    const k = 1 + BALL / STICK, bx = JX + lx.x * k, by = JY + ly.x * k, pts = [];
    for (let i = -3; i <= 3; i++) { const a = (i / 3) * 1.45; pts.push(...ringAt(P, disc(bx, by, BALL * Math.cos(a), 24), tz + BALL + BALL * Math.sin(a))); }
    ball.setAttribute("d", poly(hull(pts)));
  }
  function draw(b) {
    const d = clamp(b.sp.x, 0, DMAX);
    if (d === b.drawn) return;
    b.drawn = d;
    put(b.cap, prism(P, front, b.ring, b.inner, TOP + 1, TOP + 1 + H - d));
  }
  const B = register(stage, (dt) => {
    let m = false;
    for (const b of btns) { if (stepS(b.sp, dt)) m = true; draw(b); }
    if (stepS(lx, dt)) m = true;
    if (stepS(ly, dt)) m = true;
    drawStick();
    return m;
  });
  bag.add(B.unregister);

  function retarget() {
    let hit = null, bd = Infinity;
    const dist = (b) => Math.hypot(b.x - over[0], b.y - over[1]);
    if (over) for (const b of btns) if (dist(b) < bd) { bd = dist(b); hit = b; }
    for (const b of btns) {
      b.sp.t = !over ? b.rest : b === hit ? DMAX : DMAX * 0.85 * falloff(dist(b) / RAD);
      b.cap.sil.classList.toggle("hi", over ? b === hit : b.id === FAV);
    }
    if (over) {
      const dx = over[0] - JX, dy = over[1] - JY, n = Math.hypot(dx, dy) || 1;
      lx.t = (dx / n) * LEAN; ly.t = (dy / n) * LEAN;
    } else { lx.t = LEAN0[0]; ly.t = LEAN0[1]; }
    read.textContent = hit ? "button " + hit.id : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TOP + 1 + H);
      const XL = X0 + (COLS - 1) * SX, YL = Y0 + (ROWS - 1) * SY;
      over = x > X0 - 9 && x < XL + 10 && y > Y0 - 9 && y < YL + 9 ? [clamp(x, X0, XL), clamp(y, Y0, YL)] : null;
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { RAD = v * SX; if (over) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "arcadebuttons",
  means: "An arcade control panel: the buttons near the pointer press down, the one under it deepest, and the stick leans toward it.",
  rules: [1, 3, 5, 9],
  range: [1, 2, 3],
  tour: [[182, 144], [242, 174], [299, 176], null],
  mount,
});
