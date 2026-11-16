/**
 * Mic boom: a stand with a round base, a pole and a long boom arm with a
 * microphone at its tip and a counterweight behind. The boom swings round to
 * point the mic at the pointer. At rest it points off to the left with the
 * mic bright. The slider is how stiffly the boom follows.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const H = 96, ARM = 70, BACK = 26, REST = 2.4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.53);
  fit(C, [[-60, -60, 0], [60, 60, 0], [-86, -86, H + 18], [86, 86, H + 18], [-86, 86, H + 18], [86, -86, H + 18]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(26, 48), circ(24, 48), 0, 4));
  const back = mk("g", {}, g), pole = mk("path", { class: "sil" }, g), fore = mk("g", {}, g);
  const rod = (a, b, r) => {
    const pts = [];
    for (const q of [a, b]) for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; pts.push(P(q[0] + r * Math.cos(t), q[1] + r * Math.sin(t), q[2]), P(q[0], q[1], q[2] + r * Math.sin(t))); }
    return poly(hull(pts));
  };
  pole.setAttribute("d", rod([0, 0, 4], [0, 0, H], 2.2));
  const arm = mk("path", { class: "sil" }, g), weight = mk("path", { class: "sil" }, g), mic = mk("path", { class: "sil hi" }, g), grille = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST, { k: 90 * value, c: 16 * Math.sqrt(value) });
  let last = "";
  function draw() {
    const key = ang.x.toFixed(3);
    if (key === last) return;
    last = key;
    const c = Math.cos(ang.x), s = Math.sin(ang.x), at = (d, z) => [c * d, s * d, z];
    const tip = at(ARM, H + 10), tail = at(-BACK, H - 4);
    const near = c + s > 0;
    (near ? fore : back).append(arm, mic, grille); (near ? back : fore).append(weight);
    if (!near) { fore.prepend(weight); }
    arm.setAttribute("d", rod(tail, tip, 1.8));
    weight.setAttribute("d", rod(at(-BACK - 4, H - 5), at(-BACK + 6, H - 3.5), 6));
    mic.setAttribute("d", rod(at(ARM - 4, H + 9.5), at(ARM + 14, H + 12), 6.5));
    grille.setAttribute("d", poly(circ(6.5, 24).map((q) => { const d = ARM + 14, p = at(d, H + 12); return P(p[0] - s * q.u, p[1] + c * q.u, p[2] + q.v); })));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    let d = t - ang.t; d = Math.atan2(Math.sin(d), Math.cos(d));
    ang.t += d;
    read.textContent = t === REST ? "rest" : `${(((Math.round((t * 180) / Math.PI)) % 360) + 360) % 360}°`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); aim(Math.hypot(x, y) < 8 ? REST : Math.atan2(y, x)); },
    leave: () => aim(REST),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); aim(REST);
  return { set: (v) => { ang.k = 90 * v; ang.c = 16 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "micstand",
  means: "A microphone stand with a boom arm: the boom swings round to point the mic wherever the pointer is.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[222, 304], [70, 250], [200, 163], null],
  mount,
});
