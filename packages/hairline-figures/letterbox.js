/**
 * Letterbox: a mailbox on a post, its front flap hinged at the bottom. The
 * pointer's depth on the ground opens the flap, and past three quarters of
 * the way a letter slides out over it. At rest the flap stands ajar, bright.
 * The slider is the widest the flap opens.
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, clamp, rad, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 50, W = 24, Z0 = 38, Z1 = 62, HZ = 41, H = 18, REST = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[0, 0, 0], [L, W, 0], [0, 0, Z1], [L + H + 2, W, HZ], [L + 20, 12, HZ + 4], [L, 0, Z1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(20, 8, 28, 16, 1.5, 0.6);
  put(solid(g), prism(P, front, pr, pi, 0, Z0));
  const [br, bi] = rings(0, 0, L, W, 5, 1.5);
  put(solid(g), prism(P, front, br, bi, Z0, Z1));
  // the mouth on the front face
  mk("path", { d: poly(fillet([P(L, 4, HZ + 1), P(L, 20, HZ + 1), P(L, 20, HZ + H - 1), P(L, 4, HZ + H - 1)], [2, 2, 2, 2])), class: "nf lo" }, g);
  const door = mk("path", { class: "sil hi" }, g);
  const letter = mk("path", {}, g);
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a)), x0 = L + 0.6;
    const pt = (y, h) => P(x0 + h * s, y, HZ + h * c);
    door.setAttribute("d", poly(fillet([pt(3, 0), pt(21, 0), pt(21, H), pt(3, H)], [1.5, 1.5, 3, 3])));
    const out = clamp((a - 75) / 15, 0, 1) * 20;
    if (out < 1) { letter.setAttribute("d", ""); return; }
    letter.setAttribute("d", poly(fillet([P(L - 4, 6, HZ + 3), P(L - 4, 18, HZ + 3), P(L + out, 18, HZ + 3), P(L + out, 6, HZ + 3)], [1, 1, 1, 1])));
    if (a >= 75) door.after(letter); else letter.after(door);
  }
  draw(REST);

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx] = unproj(C, sx, sy, HZ);
    const a = Math.round(clamp((wx - 5) / 55, 0, 1) * max);
    ang.t = Math.max(a, 4);
    read.textContent = "open " + ang.t + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; }, destroy: bag.dispose };
}

hairline({
  name: "letterbox",
  means: "A mailbox on a post: the pointer swings its front flap open, and wide open a letter slides out.",
  rules: [3, 5, 6, 8],
  range: [50, 90, 100],
  tour: [[170, 150], [230, 170], [270, 188], null],
  mount,
});
