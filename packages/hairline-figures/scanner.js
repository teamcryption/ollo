/**
 * Scanner: a flatbed scanner, a low rounded body with a glass bed and a
 * thin lid hinged along its back edge. The pointer over the bed swings the
 * lid open, wider the nearer it comes to the front, and the scan bar under
 * the glass slides to follow it. At rest the lid sits ajar, bright.
 *
 * The pattern: one part turning on a hinge, one sliding (spring).
 */
const {
  Cam, clamp, fit, facing, hull, lerp, poly, prism, proj, rad, rings, ringAt, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 104, D = 70, H = 16, LT = 2.4, REST = 14, BED = [8, 10, W - 8, D - 8];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + 72], [W, 0, H + 72]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { d: poly(ringAt(P, rrect(BED[0], BED[1], BED[2], BED[3], 3, 4), H)), class: "nf lo" }, g);
  const btn = mk("path", { d: poly(ringAt(P, rrect(W - 16, D - 6, W - 8, D - 3, 1.2, 3), H)), class: "nf lo" }, g);
  const bar = solid(g);
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lidG), lidCr = mk("path", { class: "nf lo" }, lidG), pad = mk("path", { class: "nf lo" }, lidG);

  const ang = spring(REST), bx = spring(W * 0.3);
  const lidRing = rrect(0, 0, W, D, 7, 4), lidIn = rrect(2.5, 2.5, W - 2.5, D - 2.5, 5, 4), padRing = rrect(BED[0], BED[1], BED[2], BED[3], 3, 4);
  const L = (a, u, v, t) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return P(u, v * c - s * t, H + 0.6 + v * s + c * t);
  };
  let lastA = NaN, lastX = NaN;
  function draw() {
    const a = ang.x, x = bx.x;
    if (a !== lastA) {
      lastA = a;
      const pts = [];
      for (const q of lidRing) pts.push(L(a, q.u, q.v, 0), L(a, q.u, q.v, LT));
      lid.setAttribute("d", poly(hull(pts)));
      const top = a > 90 ? 0 : LT;
      lidCr.setAttribute("d", poly(lidIn.map((q) => L(a, q.u, q.v, top))));
      pad.setAttribute("d", a > 25 ? poly(padRing.map((q) => L(a, q.u, q.v, 0))) : "");
    }
    if (x !== lastX) {
      lastX = x;
      const [r, i] = rings(x - 2.5, BED[1] + 2, x + 2.5, BED[3] - 2, 1.5, 0.8);
      put(bar, prism(P, front, r, i, H - 1, H + 0.4));
    }
  }
  const B = register(stage, (dt) => {
    const m1 = stepS(ang, dt), m2 = stepS(bx, dt);
    draw();
    return m1 || m2;
  });
  bag.add(B.unregister);

  let on = null;
  function aim(p) {
    let hitP = null;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], H);
      if (x > -4 && x < W + 4 && y > -4 && y < D + 6) hitP = [clamp(x, BED[0] + 4, BED[2] - 4), clamp(y, 0, D)];
    }
    if (hitP) {
      ang.t = lerp(maxA * 0.5, maxA, hitP[1] / D);
      bx.t = hitP[0];
      read.textContent = "lid " + Math.round(ang.t) + "°";
    } else {
      ang.t = REST; bx.t = W * 0.3;
      read.textContent = "rest";
    }
    if (!!hitP !== on) {
      on = !!hitP;
      lid.classList.toggle("hi", !on);
      bar.sil.classList.toggle("hi", on);
    }
    B.wake();
  }
  aim(null);
  draw();
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; }, destroy: bag.dispose };
}

hairline({
  name: "scanner",
  means: "A flatbed scanner: the pointer over the bed swings the lid open on its hinge, and the scan bar slides to follow it.",
  rules: [1, 3, 5, 8],
  range: [50, 80, 100],
  tour: [[163, 180], [166, 237], [218, 270], null],
  mount,
});
