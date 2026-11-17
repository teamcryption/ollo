/**
 * Bear bell: a brass bell hanging from a strap clip on a pack strap, its
 * clapper hanging inside. The pointer over the bell swings it on its pin, the
 * clapper trailing behind on its own spring. At rest the bell hangs tipped,
 * its clapper bright. The slider is how far it swings.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const H = 66, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 4.0);
  fit(C, [[-26, -3, H + 14], [26, 3, H + 14], [-26, 3, H + 14], [26, -3, H + 14], [0, 0, H - 42], [-24, 0, H - 32], [24, 0, H - 32]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the strap: a flat band standing behind, and its clip
  const [sr, si] = rings(-26, -3, 26, 3, 2, 0.8);
  put(solid(g), prism(P, front, sr, si, H + 4, H + 14));
  const [kr, ki] = rings(-4, -4, 4, 4, 2, 0.8);
  put(solid(g), prism(P, front, kr, ki, H - 2, H + 6));
  const clap = mk("path", { class: "sil" }, g), body = mk("path", { class: "sil" }, g), mouth = mk("path", { class: "nf lo" }, g), slot = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST, { k: 70, c: 9 }), lag = spring(REST, { k: 40, c: 6 });

  // a ring of the bell at depth d below the pin, radius r, swung by a degrees
  const ring = (d, r, a, n = 36) => {
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    return circ(r, n).map((q) => { const z = -d; return P(q.u * c - z * s, q.v, H + q.u * s + z * c); });
  };
  const PROF = [[2, 5], [5, 8], [10, 10.5], [18, 12.5], [26, 15], [30, 17]];
  let last = "";
  function draw() {
    const a = ang.x, b = lag.x, key = a.toFixed(2) + b.toFixed(2);
    if (key === last) return;
    last = key;
    const pts = [];
    for (const [d, r] of PROF) pts.push(...ring(d, r, a));
    body.setAttribute("d", poly(hull(pts)));
    mouth.setAttribute("d", poly(ring(30, 17, a)));
    slot.setAttribute("d", poly(ring(18, 12.5, a).filter((_, i) => i % 36 > 14 && i % 36 < 22).concat(ring(26, 15, a).filter((_, i) => i % 36 > 14 && i % 36 < 22).reverse())));
    clap.setAttribute("d", poly(hull([...ring(34, 5, b, 20), ...ring(40, 4, b, 20), ...ring(29, 1.5, b, 12)])));
  }

  const B = register(stage, (dt) => { const m1 = stepS(ang, dt), m2 = stepS(lag, dt); draw(); return m1 || m2; });
  bag.add(B.unregister);
  draw();

  const mid = P(0, 0, H - 18);
  let on = null;
  function set(p) {
    const hov = p && Math.abs(p[0] - mid[0]) < 70 && Math.abs(p[1] - mid[1]) < 70;
    const t = hov ? clamp(-amp + (p[0] - mid[0]) * 0.25, -48, 48) : REST;
    ang.t = t; lag.t = t * 1.25;
    if (hov !== on) {
      on = hov;
      body.classList.toggle("hi", hov);
      clap.classList.toggle("hi", !hov);
    }
    read.textContent = hov ? Math.round(Math.abs(t)) + "°" : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "bearbell",
  means: "A bear bell on a pack strap: the pointer swings it on its pin, the clapper trailing behind.",
  rules: [1, 3, 4, 5],
  range: [10, 28, 40],
  tour: [[200, 190], [223, 233], [172, 176], null],
  mount,
});
