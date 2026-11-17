/**
 * Chain latch: a door on its hinge beside a jamb, a door chain hung from the
 * slide track on the jamb to the door's edge. The pointer over the door
 * swings it open until the chain pulls taut. At rest the door stands just
 * ajar, the chain slack, the door bright. The slider is how far it swings.
 *
 * The pattern: one hinged part on a tween; the hit is the rest outline.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const DW = 56, DT = 4, DH = 84, JX = DW + 1, CZ = 58, REST = 8, OPEN = 34, NL = 7;
const rad = (d) => (d * Math.PI) / 180;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-8, -8, 0], [JX + 10, 8, 0], [0, 0, DH], [JX + 10, 0, DH], [DW * Math.cos(rad(OPEN)), DW * Math.sin(rad(OPEN)), 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [fr, fi] = rings(-10, -10, JX + 12, 34, 4, 1.5);
  put(solid(g), prism(P, front, fr, fi, 0, 2));
  const [jr, ji] = rings(JX, -5, JX + 8, 5, 1.5, 0.8);
  put(solid(g), prism(P, front, jr, ji, 2, DH + 2));
  const [tr, ti] = rings(JX - 1.5, -4, JX, 6, 0.6, 0.3);
  put(solid(g), prism(P, front, tr, ti, CZ - 2, CZ + 2));
  const [dr, di] = rings(0, -DT, DW, 0, 1.4, 0.6);
  const door = solid(g), knob = mk("path", { class: "nf" }, g), chain = mk("path", { class: "nf sil" }, g);
  const links = [];
  for (let i = 0; i < NL; i++) links.push(flatDot(g, C, 1.3, "dot off"));
  const tw = tween(REST);
  let last = NaN;

  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const a = rad(deg), c = Math.cos(a), s = Math.sin(a);
    put(door, prism(P, front, turn(dr, a), turn(di, a), 2, DH));
    const D = (x, y, z) => P(x * c - y * s, x * s + y * c, z);
    knob.setAttribute("d", poly([D(DW - 8, 0.5, 40), D(DW - 4, 0.5, 40), D(DW - 4, 3, 44), D(DW - 8, 3, 44)]));
    // the chain runs from the track on the jamb to a button near the door's edge, sagging less as it pulls taut
    const A = [JX - 1, 1, CZ], E = [(DW - 6) * c - 1 * s, (DW - 6) * s + 1 * c, CZ];
    const span = Math.hypot(A[0] - E[0], A[1] - E[1]), sag = Math.max(1, 26 - span * 0.9);
    const pts = [];
    for (let i = 0; i <= NL + 1; i++) {
      const t = i / (NL + 1), p = [A[0] + (E[0] - A[0]) * t, A[1] + (E[1] - A[1]) * t, CZ - sag * 4 * t * (1 - t)];
      pts.push(P(...p));
      if (i > 0 && i <= NL) place(links[i - 1], P(...p));
    }
    chain.setAttribute("d", open(pts));
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const box = [P(0, 0, DH), P(JX + 8, 0, DH + 2), P(0, 0, 0), P(DW, 30, 0), P(JX + 8, 5, 0)];
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([x, y]) => x > Math.min(...xs) && x < Math.max(...xs) && y > Math.min(...ys) && y < Math.max(...ys);
  let on = null;
  function set(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? REST + (OPEN - REST) * amt : REST, performance.now(), 0);
    door.sil.classList.add("hi");
    read.textContent = o ? "taut" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: (p) => set(inside(p)), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { on = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "chainlatch",
  means: "A door on a chain latch: the pointer swings the door open until the chain from the jamb pulls taut.",
  rules: [1, 5, 6, 8],
  range: [0.4, 1, 1],
  tour: [[200, 160], [180, 190], [220, 150], null],
  mount,
});
