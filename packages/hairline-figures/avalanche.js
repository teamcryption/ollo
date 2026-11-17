/**
 * Avalanche probe: a jointed probe pushed into a slab of snow, a grip on top
 * and a ferrule at each joint. The pointer over it leans the probe toward
 * itself, probing the slab, and the shaft turns bright. At rest it stands
 * tipped back, the grip bright. The slider is how far it leans.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, clamp, spring, stepS, rad,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZT = 12, L = 104, REST = -12, SEG = [0, 36, 70];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-40, -40, 0], [40, 40, 0], [40, -40, 0], [-40, 40, 0], [0, 0, ZT + L + 6], [-40, 0, ZT + L - 10], [40, 0, ZT + L - 10]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-40, -40, 40, 40, 10, 2);
  put(solid(g), prism(P, front, sr, si, 0, ZT));
  const hole = mk("path", { class: "nf lo" }, g);
  hole.setAttribute("d", poly(circ(4.5, 24).map((q) => P(q.u, q.v, ZT))));
  const shaft = mk("path", { class: "sil" }, g), rings2 = mk("path", { class: "nf lo" }, g), grip = mk("path", { class: "sil" }, g);
  const ang = spring(REST, { k: 60, c: 9 });

  // a local point (x, y, height above the snow) leaned by a degrees about the hole
  const R = (x, y, z, a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return P(x * c + z * s, y, ZT - x * s + z * c); };
  const disc = (r, z, a, n = 16) => circ(r, n).map((q) => R(q.u, q.v, z, a));
  let last = NaN;
  function draw() {
    const a = ang.x;
    if (a === last) return;
    last = a;
    shaft.setAttribute("d", poly(hull([...disc(2, 0, a), ...disc(2, L - 18, a)])));
    rings2.setAttribute("d", SEG.slice(1).map((z) => poly(hull([...disc(2.8, z - 3, a), ...disc(2.8, z + 3, a)]))).join(""));
    grip.setAttribute("d", poly(hull([...disc(4.2, L - 20, a), ...disc(4.2, L, a), ...disc(3, L + 3, a)])));
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(); return m; });
  bag.add(B.unregister);
  draw();

  const mid = P(0, 0, ZT + L * 0.5);
  let on = null;
  function set(p) {
    const hov = !!p && Math.abs(p[0] - mid[0]) < 80 && Math.abs(p[1] - mid[1]) < 110;
    const t = hov ? clamp(amp + (p[0] - mid[0]) * 0.2, -40, 40) : REST;
    ang.t = t;
    if (hov !== on) {
      on = hov;
      shaft.classList.toggle("hi", hov);
      grip.classList.toggle("hi", !hov);
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
  name: "avalanche",
  means: "An avalanche probe in a slab of snow: the pointer leans the jointed probe toward itself, probing.",
  rules: [1, 3, 4, 5],
  range: [10, 24, 34],
  tour: [[200, 113], [226, 130], [176, 140], null],
  mount,
});
