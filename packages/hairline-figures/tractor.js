/**
 * Tractor: a compact tractor on a ploughed field patch, big rear wheels,
 * small steering front wheels, a hood with an exhaust stack and an open cab
 * frame under a roof. The pointer is where to drive: the front wheels steer
 * toward it on a spring, clamped to the lock. At rest the wheels sit turned a
 * little, the near front wheel bright. The slider is the steering lock.
 *
 * The pattern: a continuous aim (spring on one angle); the hit is on the
 * field's plane, which never moves.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const FX = 26, FY = 13, FR = 7, FW = 2, RX = -14, RY = 15, RR = 15, RW = 4, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lock = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-40, -32, -3], [52, 32, -3], [52, -32, -3], [-40, 32, -3], [-24, -11, 45], [0, 11, 45]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-40, -32, 52, 32, 6, 2);
  put(solid(g), prism(P, front, fr, fi, -3, 0));
  let fur = "";
  for (let y = -27; y <= 27; y += 9) fur += seg(P(-34, y, 0), P(46, y, 0));
  mk("path", { class: "nf lo", d: fur }, g);

  const mkWheel = () => ({ sil: mk("path", { class: "sil" }, g), face: mk("path", { class: "nf lo" }, g), hub: mk("path", { class: "nf lo" }, g) });
  function wheel(w, cx, cy, cz, R, hw, th) {
    const ax = -Math.sin(th), ay = Math.cos(th), vx = Math.cos(th), vy = Math.sin(th);
    const ring = (o, r) => Array.from({ length: 32 }, (_, i) => {
      const t = (i / 32) * Math.PI * 2;
      return P(cx + ax * o + r * Math.cos(t) * vx, cy + ay * o + r * Math.cos(t) * vy, cz + r * Math.sin(t));
    });
    const s = ax + ay > 0 ? 1 : -1;
    w.sil.setAttribute("d", poly(hull(ring(-hw, R).concat(ring(hw, R)))));
    w.face.setAttribute("d", poly(ring(s * hw, R - 1.6)));
    w.hub.setAttribute("d", poly(ring(s * hw, R * 0.38)));
  }
  // far wheels, then the body, then the near wheels
  const rearFar = mkWheel(), frontFar = mkWheel();
  const [br, bi] = rings(-24, -9, 0, 9, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, 10, 18));
  let posts = "";
  for (const [x, y] of [[-22, -8], [-2, -8], [-22, 8], [-2, 8]]) posts += seg(P(x, y, 18), P(x, y, 42));
  mk("path", { class: "nf sil", d: posts }, g);
  const [rr, ri] = rings(-25, -11, 1, 11, 3, 1.2);
  put(solid(g), prism(P, front, rr, ri, 42, 44));
  const [hr, hi] = rings(0, -7, 32, 7, 3, 1.2);
  put(solid(g), prism(P, front, hr, hi, 9, 21));
  mk("path", { class: "nf lo", d: open([P(30, -7, 15), P(30, 7, 15)]) }, g);
  const [er] = rings(18.5, -4.5, 21.5, -1.5, 1.5, 0.5);
  put(solid(g), prism(P, front, er, null, 21, 33));
  const rearNear = mkWheel(), frontNear = mkWheel();
  wheel(rearFar, RX, -RY, RR, RR, RW, 0);
  wheel(rearNear, RX, RY, RR, RR, RW, 0);

  const sp = spring(REST, { k: 100, c: 18 });
  let last = NaN, over = false;
  function draw() {
    if (Math.abs(sp.x - last) < 1e-3) return;
    last = sp.x;
    const th = (sp.x * Math.PI) / 180;
    wheel(frontFar, FX, -FY, FR, FR, FW, th);
    wheel(frontNear, FX, FY, FR, FR, FW, th);
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function set(target, on) {
    sp.t = target;
    over = on;
    frontNear.sil.classList.toggle("hi", true);
    frontFar.sil.classList.toggle("hi", on);
    read.textContent = on ? `steer ${Math.round(target)}°` : "rest";
    B.wake();
  }
  set(REST, false);
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -50 || x > 62 || y < -42 || y > 42) return set(REST, false);
      const deg = (Math.atan2(y, Math.max(8, x - FX + 30)) * 180) / Math.PI;
      set(clamp(deg, -lock, lock), true);
    },
    leave: () => set(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lock = v; }, destroy: bag.dispose };
}

hairline({
  name: "tractor",
  means: "A compact tractor on a ploughed field: its front wheels steer toward the pointer, up to the steering lock.",
  rules: [1, 3, 5, 8],
  range: [20, 35, 45],
  tour: [[318, 205], [270, 229], [221, 253], null],
  mount,
});
