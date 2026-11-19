/**
 * Tyre swing: an A-frame of poles holding a beam, three ropes gathered at one
 * hook and an old tyre hanging flat under them. The pointer pushes the tyre:
 * from either side it swings away across the frame, ropes and all. At rest it
 * hangs a little off plumb, the tyre bright. The slider is how far it swings.
 *
 * The pattern: a continuous aim (spring on one angle); the hit is the pointer's
 * screen x against the hook, which never moves.
 */
const {
  Cam, circ, clamp, fit, hull, open, poly, proj, rad, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const H = 104, L = 70, R = 17, RH = 7.5, T = 6, XL = 42, YS = 34, MAX = 48, REST = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.72);
  const sw = L * Math.sin(rad(MAX)) + R;
  fit(C, [[-XL, -YS - 4, 0], [XL, YS + 4, 0], [XL, -sw, 0], [-XL, sw, 0], [0, 0, H + 6], [XL, 0, H + 6], [-XL, 0, H + 6]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const tube = (a, b, r) => {
    const ca = circ(r, 12).map((q) => P(a[0] + q.u, a[1] + q.v, a[2])), cb = circ(r, 12).map((q) => P(b[0] + q.u, b[1] + q.v, b[2]));
    return poly(hull(ca.concat(cb)));
  };
  const aframe = (x) => {
    const fg = mk("g", {}, g);
    mk("path", { class: "sil", d: tube([x, -YS, 0], [x, 0, H], 2) }, fg);
    mk("path", { class: "sil", d: tube([x, YS, 0], [x, 0, H], 2) }, fg);
    mk("path", { class: "lo nf", d: open([P(x, -YS * 0.45, H * 0.55), P(x, YS * 0.45, H * 0.55)]) }, fg);
    return fg;
  };
  aframe(-XL);
  mk("path", { class: "sil", d: tube([-XL - 4, 0, H + 1], [XL + 4, 0, H + 1], 2.6) }, g);
  const hook = mk("path", { class: "sil", d: tube([0, 0, H - 6], [0, 0, H - 1], 1.6) }, g);
  const ropesBack = mk("path", { class: "nf" }, g);
  const tyre = mk("path", { class: "sil" }, g), hole = mk("path", { class: "nf lo" }, g), hole2 = mk("path", { class: "nf" }, g);
  const ropesFront = mk("path", { class: "nf" }, g);
  aframe(XL);


  const sp = spring(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return; last = deg;
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a), piv = [0, 0, H - 6];
    const ctr = [0, L * s, piv[2] - L * c];
    // tyre plane: x and (0, c, s); normal (0, -s, c)
    const at = (rr, th, h) => [ctr[0] + rr * Math.cos(th), ctr[1] + rr * Math.sin(th) * c - h * s, ctr[2] + rr * Math.sin(th) * s + h * c];
    const ring = (rr, h) => Array.from({ length: 40 }, (_, i) => P(...at(rr, (i / 40) * Math.PI * 2, h)));
    tyre.setAttribute("d", poly(hull(ring(R, -T / 2).concat(ring(R, T / 2)))));
    hole.setAttribute("d", poly(ring(RH + 1.5, T / 2)));
    hole2.setAttribute("d", poly(ring(RH, -T / 2 + 1)));
    const pv = P(...piv), back = [], front = [];
    [Math.PI * 0.5 + 0.0, Math.PI * 1.17, Math.PI * 1.83].forEach((th) => {
      const p = at(R - 3, th, T / 2), d = seg(pv, P(...p));
      (p[0] + p[1] < ctr[0] + ctr[1] ? back : front).push(d);
    });
    ropesBack.setAttribute("d", back.join(""));
    ropesFront.setAttribute("d", front.join(""));
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  const px = P(0, 0, H)[0];
  let over = null;
  function retarget() {
    sp.t = over == null ? REST : clamp(over / 18, -1, 1) * MAX * (0.25 + 0.75 * amt);
    tyre.classList.add("hi");
    read.textContent = over == null ? "rest" : "swing " + Math.round(Math.abs(sp.t)) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = p[1] > 20 && p[1] < 310 && Math.abs(p[0] - px) < 170 ? p[0] - px : null; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "tyreswing",
  means: "A tyre hanging flat on three ropes from an A-frame: the pointer pushes it and it swings away across the frame.",
  rules: [1, 3, 5, 8],
  range: [0, 1, 1],
  tour: [[182, 201], [250, 200], [210, 283], null],
  mount,
});
