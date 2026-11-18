/**
 * Telepresence robot: a round rolling base, a telescoping mast, and a tablet
 * screen with a camera on its bezel. The pointer is someone stepping up: the
 * mast extends to bring the screen to eye height and the screen tips forward
 * to face them. At rest the mast is low and the screen leans back, the power
 * light on the base the bright mark. The slider is how far the mast extends.
 *
 * The pattern: one answer on a spring; the hit is the rest pose's screen box.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, proj, prism, rrect, run, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const disc = (r, n = 28) => circ(r, n);
const SQ = Math.SQRT1_2, MAST = 30, REACH = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.85);
  fit(C, [[-18, -18, 0], [18, 18, 0], [18, -18, 0], [-18, 18, 0], [16, -16, MAST + 8 + REACH + 13], [-16, 16, MAST + 8 + REACH + 13]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(17), disc(15.4), 0, 7));
  put(solid(g), prism(P, front, disc(9), disc(7.8), 7, 10));
  const power = flatDot(g, C, 1.7, "dot");
  place(power, P(17 * SQ, 17 * SQ, 4));
  put(solid(g), prism(P, front, disc(3.2, 16), null, 10, MAST));
  const upper = solid(g);
  const screen = mk("path", { class: "sil" }, g), glass = mk("path", { class: "nf lo" }, g);
  const cam = flatDot(g, C, 1.3, "dot off");
  const PLATE = rrect(-20, -1.6, 20, 1.6, 1.5, 4), GLASS = rrect(-17.5, -10, 17.5, 10, 1.6, 4);

  const sp = spring(0);
  let drawn = NaN;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    const lift = 3 + t * REACH, zs = MAST + 8 + lift, th = 0.32 - t * 0.42;
    const c = Math.cos(th), s = Math.sin(th);
    // u across the screen, w through it toward the viewer, h up it; th tips the top back
    const W = (u, w, h) => {
      const w2 = w * c - h * s, h2 = h * c + w * s;
      return P((u + w2) * SQ, (-u + w2) * SQ, zs + h2);
    };
    put(upper, prism(P, front, disc(2.3, 16), null, MAST - 6, zs));
    const pts = [];
    for (const h of [-13, 13]) for (const q of PLATE) pts.push(W(q.u, q.v, h));
    screen.setAttribute("d", poly(hull(pts)));
    glass.setAttribute("d", poly(GLASS.map((q) => W(q.u, 1.7, q.v))));
    place(cam, W(0, 1.7, 11.6));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const xs = [P(-18, 18, 0)[0], P(18, -18, 0)[0]], ys = [P(0, 0, MAST + 30)[1] - 20, P(18, 18, 0)[1] + 10];
  let on = false;
  function setOn(v) {
    on = v;
    sp.t = on ? clamp(amp, 0, 1) : 0;
    screen.classList.toggle("hi", on);
    power.setAttribute("class", on ? "dot off" : "dot");
    cam.setAttribute("class", on ? "dot m" : "dot off");
    read.textContent = on ? "call" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > xs[0] - 10 && sx < xs[1] + 10 && sy > ys[0] && sy < ys[1]),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  setOn(false);
  return {
    set: (v) => { amp = v; if (on) { sp.t = clamp(amp, 0, 1); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "telepresence",
  means: "A telepresence robot on a rolling base: at the pointer its mast extends and the screen tips forward to face you.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 110], [200, 240], [150, 170], null],
  mount,
});
