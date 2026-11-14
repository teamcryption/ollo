/**
 * Gym bench: an adjustable bench on a steel rail, a seat pad near the foot
 * and a backrest hinged at the seat, held up by a strut. The pointer along
 * the bench sets the incline: toward the head end the backrest rises
 * steeper, toward the hinge it lies flat. At rest it stands at 30°, bright.
 * The slider is the rest incline.
 *
 * The pattern: one part answering the pointer's position (aim).
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rad, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const HX = 60, HZ = 34, BL = 58, BW = 13, BT = 7, AMAX = 80;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let restA = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-4, -18, 0], [110, 18, 0], [110, -18, 0], [-4, 18, 0], [HX - BL * Math.cos(rad(AMAX)), 0, HZ + BL * Math.sin(rad(AMAX)) + BT], [HX - BL, -BW, HZ + BT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, z0, z1, r, b) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };

  box(0, -17, 9, 17, 0, 6, 3, 1);          // head foot
  box(4, -4, 106, 4, 6, 13, 3, 1);         // rail
  const strut = mk("path", { class: "nf" }, g);
  const back = solid(g), backTop = mk("path", { class: "nf lo" }, g);
  box(76, -3, 84, 3, 13, 30, 2, 0.8);      // seat post
  box(97, -18, 106, 18, 0, 6, 3, 1);       // foot bar
  box(62, -BW, 102, BW, 30, 37, 6, 1.6);   // seat pad

  const outer = rrect(0, -BW, BL, BW, 6, 6), inner = rrect(1.6, -BW + 1.6, BL - 1.6, BW - 1.6, 4.4, 6);
  const at = (s, y, t, a) => { const c = Math.cos(a), n = Math.sin(a); return P(HX - s * c + t * n, y, HZ + s * n + t * c); };
  const ang = spring(restA);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg);
    const pts = outer.map((q) => at(q.u, q.v, 0, a)).concat(outer.map((q) => at(q.u, q.v, BT, a)));
    back.sil.setAttribute("d", poly(hull(pts)));
    back.cr.setAttribute("d", "");
    backTop.setAttribute("d", poly(inner.map((q) => at(q.u, q.v, BT, a))));
    // the strut: from a notch on the rail up under the backrest
    const s = 30, foot = P(HX - 34 + 14 * (deg / AMAX), 0, 13);
    strut.setAttribute("d", open([foot, at(s, 0, 0, a)]) + open([P(HX - 34 + 14 * (deg / AMAX), -3, 13), at(s, -3, 0, a)]));
  }

  const B = register(stage, (dt) => {
    const moving = stepS(ang, dt);
    draw(ang.x);
    return moving;
  });
  bag.add(B.unregister);

  let mode = "rest";
  function aim(p) {
    let deg = null;
    if (p) {
      const [wx, wy] = unproj(C, p[0], p[1], 0);
      if (wx > -25 && wx < 120 && Math.abs(wy) < 45) deg = clamp((HX - wx) / HX, 0, 1) * AMAX;
    }
    ang.t = deg === null ? restA : deg;
    back.sil.classList.add("hi");
    read.textContent = deg === null ? "rest" : Math.round(deg / 5) * 5 + "°";
    mode = deg === null ? "rest" : "aim";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { restA = v; if (mode === "rest") aim(null); }, destroy: bag.dispose };
}

hairline({
  name: "gymlockers",
  means: "An adjustable gym bench: the pointer along the bench sets the backrest's incline, steeper toward the head end, flat at the hinge.",
  rules: [1, 3, 5, 8],
  range: [10, 30, 60],
  tour: [[106, 181], [138, 197], [207, 232], null],
  mount,
});
