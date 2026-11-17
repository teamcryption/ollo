/**
 * Pan pipes: eight tubes bound side by side, longest to shortest, with a
 * band across them. The pointer over them tilts the whole set forward, as
 * if raised to the lips; at rest it leans a little, its longest pipe
 * bright. The slider is how far it tilts.
 *
 * The pattern: one object tilting on its foot.
 */
const {
  Cam, circ, fit, hull, open, poly, proj, unproj, rad, spring, stepS,
  disposer, mk, pointer, register,
} = HL;

const N = 8, R = 5, SP = 10.4, REST = 8;
const LEN = Array.from({ length: N }, (_, i) => 76 - i * 6.5);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tilt = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-R, -R, 0], [N * SP, R, 0], [0, 40, 76], [0, -10, 76], [N * SP, 30, 40]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const tubes = [];
  for (let i = 0; i < N; i++) {
    const t = { g: mk("g", {}, g) };
    t.sil = mk("path", { class: "sil" }, t.g); t.hole = mk("path", { class: "nf lo" }, t.g);
    tubes.push(t);
  }
  const band = mk("path", { class: "nf" }, g);
  tubes[0].sil.classList.add("hi");
  const ring = circ(R, 20), hole = circ(R - 1.8, 16);

  const ang = spring(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return; last = d;
    const a = rad(d), ca = Math.cos(a), sa = Math.sin(a);
    const T = (x, y, z) => P(x, y * ca + z * sa, -y * sa + z * ca);
    tubes.forEach((t, i) => {
      const x = i * SP, L = LEN[i], pts = [];
      for (const q of ring) pts.push(T(x + q.u, q.v, 0), T(x + q.u, q.v, L));
      t.sil.setAttribute("d", poly(hull(pts)));
      t.hole.setAttribute("d", poly(hole.map((q) => T(x + q.u, q.v, L))));
    });
    const bz = 22, bp = [];
    for (let i = 0; i < N; i++) bp.push(T(i * SP, R + 0.4, bz));
    const bq = []; for (let i = 0; i < N; i++) bq.push(T(i * SP, R + 0.4, bz + 6));
    band.setAttribute("d", open(bp) + " " + open(bq));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let act = null;
  function set(a) {
    if (a === act) return; act = a;
    ang.t = a ? tilt : REST;
    read.textContent = a ? "tilt" : "rest";
    B.wake();
  }
  set(false);
  draw(REST);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 30); set(x > -16 && x < N * SP + 10 && y > -50 && y < 50); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tilt = v; if (act) { ang.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "ocarina2",
  means: "Pan pipes bound longest to shortest: the pointer over them tilts the whole set forward, as if raised to the lips.",
  rules: [1, 3, 5, 8],
  range: [30, 45, 55],
  tour: [[218, 177], [286, 211], [168, 151], null],
  mount,
});
