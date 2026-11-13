/**
 * Washing machines: a laundromat row of four front loaders on one plinth,
 * each with a control strip, a dial and a small display above a round door
 * set in its collar, the drum behind it. The pointer picks a machine on the
 * row's front face: its door swings wide open on its right hinge, and the
 * doors beside it come ajar, staggered from it. At rest one door stands half
 * open, bright, and another is barely ajar. The slider is the stagger.
 *
 * The pattern: one of many on a face (lockers). Tweens per door; the hit is
 * read on the machines' front plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NM = 4, MW = 30, GAP = 2, PITCH = MW + GAP, D = 30, H = 44, R = 11, ZM = 19, T = 2.2;
const X1 = NM * PITCH - GAP, OPEN = 80, FAV = 2;
const REST = [14, 0, 48, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-3, -2, -3], [X1 + 3, D + 3, -3], [X1 + 3, -2, -3], [-3, D + 3, -3], [0, 0, H], [X1, 0, H], [MW / 2 + R - 4, D + 2 * R + 3, ZM - R]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (q, cx, cz) => P(cx + q.u, D, cz + q.v);

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-3, -2, X1 + 3, D + 3, 2.5, 1);
  put(solid(g), prism(P, front, pr, pi, -3, 0));

  const ring = (rad) => circ(rad, 32);
  const machines = [];
  for (let i = 0; i < NM; i++) {
    const x0 = i * PITCH, x1 = x0 + MW, xm = x0 + MW / 2;
    const body = solid(g);
    const [br, bi] = rings(x0, 0, x1, D, 3, 1.4);
    put(body, prism(P, front, br, bi, 0, H));
    let d = seg(P(x0 + 1.5, D, H - 10), P(x1 - 1.5, D, H - 10));
    d += poly(rrect(x0 + 4, H - 7.4, x0 + 14, H - 3.6, 0.8, 2).map((q) => P(q.u, D, q.v)));
    d += poly(ring(3.2).map((q) => onFace(q, x1 - 8, H - 5.5))) + seg(P(x1 - 8, D, H - 5.5), P(x1 - 6, D, H - 3.3));
    d += poly(ring(R + 1.6).map((q) => onFace(q, xm, ZM))) + poly(ring(R - 1.4).map((q) => onFace(q, xm, ZM)));
    d += poly(ring(R - 5).map((q) => onFace(q, xm, ZM)));
    mk("path", { class: "nf lo", d }, body.g);
    machines.push({ i, x0, hx: xm + R, a: tween(REST[i]), last: NaN });
  }
  // the doors after every body: an open door reaches out over its own machine's face
  for (const m of machines) {
    m.door = solid(g);
    m.marks = mk("path", { class: "nf lo" }, m.door.g);
  }

  const disc = ring(R), glass = ring(R * 0.6);
  function draw(m, deg) {
    const th = (deg * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
    const at = (u, v, n) => P(m.hx - u * c + n * s, D + u * s + n * c, ZM + v);
    const back = disc.map((q) => at(q.u + R, q.v, 0.3)), face = disc.map((q) => at(q.u + R, q.v, T));
    m.door.sil.setAttribute("d", poly(hull(back.concat(face))));
    m.door.cr.setAttribute("d", open(face.concat([face[0]])));
    m.marks.setAttribute("d", poly(glass.map((q) => at(q.u + R, q.v, T))) + seg(at(2 * R - 2.6, -3, T), at(2 * R - 2.6, 3, T)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const m of machines) {
      const v = tval(m.a, now);
      if (v !== m.last) { draw(m, v); m.last = v; }
      if (!tdone(m.a, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The machine under the point, read on the front plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < 0 || x > X1 || z < 0 || z > H) return -1;
    return clamp(Math.floor(x / PITCH), 0, NM - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    machines.forEach((m, i) => {
      const dist = Math.abs(i - a);
      const deg = a < 0 ? REST[i] : dist === 0 ? OPEN : dist === 1 ? 30 : 9;
      tset(m.a, deg, now, from >= 0 ? Math.abs(i - from) * stag : 0);
      m.door.sil.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : `washer ${a + 1}`;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "washingmachines",
  means: "A laundromat row of four front loaders: the door of the machine under the pointer swings open, its neighbours' doors come ajar.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[96, 117], [202, 170], [255, 197], null],
  mount,
});
