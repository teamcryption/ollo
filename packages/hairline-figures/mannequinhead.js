/**
 * Wig stand: a smooth head form with a nose and ears on a slim pole over a
 * round weighted base. At rest the head sits on the pole, turned a little,
 * bright. The pointer over the stand slides the head up the pole and turns
 * it to face front; the slider is how high it rides.
 *
 * The pattern: one part sliding on a guide (slide).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 30, POLE = 48, HR = 26, REST = 0;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, 0, POLE + 2 * HR * 1.25 + 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, BR, 40), disc(0, 0, BR - 3, 40), 0, 6));
  mk("path", { d: poly(hull(ringAt(P, disc(0, 0, 2.5, 12), 6).concat(ringAt(P, disc(0, 0, 2.5, 12), POLE + 30)))), class: "sil" }, g);
  const hg = mk("g", {}, g);
  const neck = mk("path", { class: "sil" }, hg), head = mk("path", { class: "sil" }, hg);
  const ear = mk("path", { class: "nf lo" }, hg), nose = mk("path", { class: "nf" }, hg);
  const h = tween(REST), yaw = tween(-0.9);
  let last = "";
  function draw(z, t) {
    const key = z + ":" + t;
    if (key === last) return;
    last = key;
    const z0 = POLE + z, cz = z0 + 14 + HR * 1.2, pts = [];
    neck.setAttribute("d", poly(hull(ringAt(P, disc(0, 0, 9, 20), z0).concat(ringAt(P, disc(0, 0, 8, 20), z0 + 18)))));
    for (let i = 0; i <= 10; i++) {
      const b = -Math.PI / 2 + (i / 10) * Math.PI, r = HR * Math.cos(b) * (i < 5 ? 0.85 : 1);
      pts.push(...ringAt(P, disc(0, 0, Math.max(r, 0.5), 28), cz + HR * 1.25 * Math.sin(b)));
    }
    head.setAttribute("d", poly(hull(pts)));
    const fx = Math.cos(t), fy = Math.sin(t);
    const np = [];
    for (const [d, zz, w] of [[HR * 0.9, cz + 4, 3], [HR + 4, cz - 3, 2.5], [HR * 0.92, cz - 6, 3]]) np.push(...ringAt(P, disc(fx * d, fy * d, w, 10), zz));
    nose.setAttribute("d", poly(hull(np)));
    const ex = -fy * HR * 0.98, ey = fx * HR * 0.98;
    ear.setAttribute("d", poly(hull(ringAt(P, disc(ex, ey, 4, 12), cz - 6).concat(ringAt(P, disc(ex, ey, 4, 12), cz + 4)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(h, now), tval(yaw, now)); return !(tdone(h, now) && tdone(yaw, now)); });
  bag.add(B.unregister);
  const mid = P(0, 0, POLE / 2);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    tset(h, a > 0 ? lift : REST, now, 0);
    tset(yaw, a > 0 ? 0.6 : -0.9, now, a > 0 ? 60 : 0);
    head.classList.add("hi");
    read.textContent = a > 0 ? "head" : "rest";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 150 ? 1 : -1),
    leave: () => setActive(-1),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (act > 0) { tset(h, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "mannequinhead",
  means: "A wig stand head on a pole: the pointer over it slides the head up the pole and turns its face toward the front.",
  rules: [1, 4, 5, 8],
  range: [12, 22, 26],
  tour: [[200, 111], [200, 200], [200, 140], null],
  mount,
});
