/**
 * Sun dial: a round dial on a square plinth, a slanted gnomon standing on its
 * north line and hour dots round the northern rim. The pointer is the sun:
 * where it stands round the dial sets the hour, and the gnomon's shadow swings
 * to the far side, between the morning and evening dots. At rest the shadow
 * lies at ten o'clock, bright. The slider is the shadow's length.
 *
 * The pattern: one part turning to answer the pointer's angle.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, unproj, clamp, rad, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const R = 40, Z = 13, REST = 10, GH = 30;
const disc = (r, n = 48) => circ(r, n);
const ang = (h) => rad(135 + (h - 6) * 15);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let len = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-48, -48, 0], [48, 48, 0], [48, -48, 0], [-48, 48, 0], [-20, -20, Z + GH + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-48, -48, 48, 48, 10, 2);
  put(solid(g), prism(P, front, pr, pi, 0, Z - 3));
  put(solid(g), prism(P, front, disc(R), disc(R - 2.5), Z - 3, Z));

  const dots = [];
  for (let h = 6; h <= 18; h++) {
    const a = ang(h), d = flatDot(g, C, h % 3 ? 0.9 : 1.3, "dot off");
    place(d, P((R - 5) * Math.cos(a), (R - 5) * Math.sin(a), Z));
    dots.push(d);
  }
  const shadow = mk("path", { class: "sil hi" }, g);

  // the gnomon: a thin slanted plate on the north line, tall end at the centre
  const n = [-Math.SQRT1_2, -Math.SQRT1_2], e = [Math.SQRT1_2, -Math.SQRT1_2];
  const gp = (s, z, w) => P(n[0] * s + e[0] * w, n[1] * s + e[1] * w, z);
  const gw = mk("g", {}, g);
  mk("path", { class: "sil", d: poly([gp(-3, Z, -1), gp(-3, Z + GH, -1), gp(-3, Z + GH, 1), gp(30, Z, 1), gp(30, Z, -1)]) }, gw);
  mk("path", { class: "nf lo", d: poly([gp(-3, Z, 0), gp(-3, Z + GH, 0), gp(30, Z, 0)]) }, gw);

  const sp = spring(REST);
  let last = NaN, lastLen = NaN, near = -1;
  function draw(h) {
    if (h === last && len === lastLen) return;
    last = h; lastLen = len;
    const a = ang(h), L = clamp(len, 14, R - 9), c = Math.cos(a), s = Math.sin(a);
    const pt = (u, w) => P(c * u - s * w, s * u + c * w, Z);
    shadow.setAttribute("d", poly([pt(-1, -3.6), pt(L * 0.55, -3), pt(L, -0.8), pt(L, 0.8), pt(L * 0.55, 3), pt(-1, 3.6)]));
    const k = Math.round(h) - 6;
    if (k !== near) {
      if (near >= 0) dots[near].setAttribute("class", "dot off");
      dots[k].setAttribute("class", "dot m");
      near = k;
    }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    let h = REST, on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], Z);
      if (Math.hypot(x, y) < 78) {
        on = true;
        let d = Math.atan2(y, x) * 180 / Math.PI;
        if (d < -135) d += 360;
        h = 6 + clamp(d + 45, 0, 180) / 15;
      }
    }
    sp.t = h;
    const hh = Math.floor(h), mm = Math.round((h - hh) * 4) * 15;
    read.textContent = on ? clock(hh, mm) : "rest";
    B.wake();
  }
  const clock = (hh, mm) => (mm === 60 ? hh + 1 : hh) + ":" + String(mm % 60).padStart(2, "0");
  aim(null);
  draw(REST);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "solarpanel",
  means: "A sun dial: the pointer is the sun, and the gnomon's shadow swings round the hour dots to the far side.",
  rules: [1, 3, 5, 8],
  range: [16, 26, 31],
  tour: [[309, 181], [200, 223], [102, 195], null],
  mount,
});
