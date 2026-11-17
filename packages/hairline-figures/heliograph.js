/**
 * Heliograph: a signalling mirror on a fork, standing on a tripod. The
 * pointer is where the flash should go: the mirror turns and tilts to face
 * it on springs. At rest it is cocked up and aside, bright. The slider is
 * how quickly the mirror follows.
 *
 * The pattern: a continuous aim on two springs; the hit is the stage itself,
 * read in screen space, which never moves.
 */
const {
  Cam, circ, clamp, fit, hull, lerp, poly, proj, rad, seg, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const HC = 62, R = 30, TH = 3, LEG = 34, FORK = R + 5;
const REST = [-20, 42];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-LEG, -LEG, 0], [LEG, LEG, 0], [-R, R, HC + R], [R, -R, HC + R], [R, -R, HC - R], [-R, R, HC - R]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // tripod: three legs to a head, a post up to the fork
  const head = P(0, 0, HC - R - 6), legs = [];
  for (let i = 0; i < 3; i++) {
    const t = rad(200 + i * 120);
    legs.push(seg(head, P(LEG * Math.cos(t), LEG * Math.sin(t), 0)));
  }
  mk("path", { class: "nf", d: legs.join("") }, g);
  mk("path", { class: "nf", d: seg(head, P(0, 0, HC - FORK + 2)) }, g);
  const fork = mk("path", { class: "nf" }, g);
  const rim = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g), sight = mk("path", { class: "nf" }, g);
  const sp = { k: 100 * value, c: 18 * Math.sqrt(value) };
  const yaw = spring(REST[0], sp), pit = spring(REST[1], sp);
  const V = [0.61, 0.61, 0.5];
  let lastKey = "";

  function draw() {
    const key = yaw.x.toFixed(2) + "," + pit.x.toFixed(2);
    if (key === lastKey) return;
    lastKey = key;
    const a = rad(yaw.x), b = rad(pit.x);
    const n = [Math.cos(b) * Math.cos(a), Math.cos(b) * Math.sin(a), Math.sin(b)];
    const u = [-Math.sin(a), Math.cos(a), 0];
    const v = [n[1] * u[2] - n[2] * u[1], n[2] * u[0] - n[0] * u[2], n[0] * u[1] - n[1] * u[0]];
    const ring = (off, r) => Array.from({ length: 40 }, (_, i) => {
      const t = (i / 40) * Math.PI * 2, q = (j) => [0, 0, HC][j] + n[j] * off + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]);
      return P(q(0), q(1), q(2));
    });
    const facesUs = n[0] * V[0] + n[1] * V[1] + n[2] * V[2] > 0;
    const fr = ring(TH / 2, R), bk = ring(-TH / 2, R);
    rim.setAttribute("d", poly(hull(fr.concat(bk))));
    face.setAttribute("d", poly(facesUs ? ring(TH / 2, R - 5) : ring(-TH / 2, R - 5)));
    // the fork: from the post up both sides to the mirror's trunnions
    const L = [FORK * u[0], FORK * u[1]], top = HC - FORK + 2;
    fork.setAttribute("d", seg(P(-L[0], -L[1], top), P(L[0], L[1], top)) +
      seg(P(-L[0], -L[1], top), P(-L[0], -L[1], HC)) + seg(P(L[0], L[1], top), P(L[0], L[1], HC)) +
      seg(P(-L[0], -L[1], HC), P(-R * u[0], -R * u[1], HC)) + seg(P(L[0], L[1], HC), P(R * u[0], R * u[1], HC)));
    sight.setAttribute("d", facesUs ? seg(P(n[0] * 2, n[1] * 2, HC + n[2] * 2), P(n[0] * 9, n[1] * 9, HC + n[2] * 9)) : "");
  }
  const B = register(stage, (dt) => { const m1 = stepS(yaw, dt), m2 = stepS(pit, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);
  rim.classList.add("hi");

  function aim(p) {
    if (!p) { yaw.t = REST[0]; pit.t = REST[1]; read.textContent = "rest"; }
    else {
      yaw.t = clamp(lerp(-5, 95, p[0] / 400), -5, 95);
      pit.t = clamp(lerp(40, -30, p[1] / 320), -30, 40);
      read.textContent = Math.round(yaw.t) + "°";
    }
    B.wake();
  }
  draw();
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { for (const s of [yaw, pit]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "heliograph",
  means: "A signalling mirror on a tripod fork: it turns and tilts on springs to face the pointer.",
  rules: [1, 3, 5],
  range: [0.4, 1, 2],
  tour: [[200, 99], [110, 220], [310, 60], null],
  mount,
});
