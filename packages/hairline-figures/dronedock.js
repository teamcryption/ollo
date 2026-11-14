/**
 * Drone dock: a square charging dock with a round pad, and a quadcopter
 * settled just above it. The pointer over the dock sends the drone up off
 * the pad, rotors and all, and leaving lands it again. At rest the drone
 * body is the bright mark. The slider is the climb.
 *
 * The pattern: one part lifting on a tween (cloches, single).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const DZ = 10, H0 = 3, LIFT = 46, RR = 10;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const ROT = [[10, 10], [50, 10], [10, 50], [50, 50]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let climb = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-4, -4, 0], [64, 64, 0], [64, -4, 0], [-4, 64, 0], [0, 0, DZ + H0 + LIFT + 8], [60, 60, DZ + H0 + LIFT + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-4, -4, 64, 64, 8, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));
  mk("path", { d: poly(ringAt(P, disc(30, 30, 22, 48), DZ)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(30, 30, 14, 40), DZ)), class: "nf dash" }, g);

  const arms = mk("path", { class: "nf" }, g);
  const far = ROT.slice(0, 3).map(() => mk("path", { class: "nf" }, g));
  const body = solid(g);
  body.sil.classList.add("sil", "hi");
  const near = mk("path", { class: "nf" }, g);
  const rot = far.concat([near]);
  const z = tween(0);
  let last = NaN;

  function draw(lift) {
    if (lift === last) return;
    last = lift;
    const b = DZ + H0 + lift;
    arms.setAttribute("d", ROT.map(([x, y]) => seg(P(30, 30, b + 3), P(x, y, b + 5))).join(""));
    ROT.forEach(([x, y], i) => rot[i].setAttribute("d", poly(ringAt(P, disc(x, y, RR), b + 5.5))));
    const [r, ri] = rings(19, 19, 41, 41, 6, 1.6);
    put(body, prism(P, front, r, ri, b, b + 7));
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  const mid = P(30, 30, DZ + H0);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], (sy - mid[1]) * 1.6) < 95;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? LIFT * (0.4 + 0.6 * climb / 100) : 0, performance.now(), 0);
    read.textContent = a ? "alt " + Math.round(40 + 60 * climb / 100) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { climb = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "dronedock",
  means: "A quadcopter resting over its charging dock: the pointer over the dock lifts it off the pad, and leaving lands it.",
  rules: [1, 3, 5, 6],
  range: [0, 70, 100],
  tour: [[200, 161], [200, 205], [200, 262], null],
  mount,
});
