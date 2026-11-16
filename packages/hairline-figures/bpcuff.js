/**
 * Wrist monitor: a cuff lying on its side as a short open sleeve, with the
 * monitor unit on top, its screen and one button. The pointer over it inflates
 * the cuff, the sleeve swelling and lifting the unit; at rest it is slightly
 * full, the unit bright. The slider is how far it inflates.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rrect, circ, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 34, R0 = 16, R1 = 23, REST = 0.25;
// a circle standing in the y-z plane at x, centre (y0, z0)
const ring = (x, r, z0, n = 40) => { const o = []; for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; o.push([x, r * Math.cos(t), z0 + r * Math.sin(t)]); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let inf = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-L, -R1, 0], [L, R1, 0], [L, -R1, 0], [-L, R1, 0], [0, 0, 2 * R1 + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const sleeve = mk("path", { class: "sil" }, g), end = mk("path", { class: "nf lo" }, g), bore = mk("path", { class: "nf" }, g), seam = mk("path", { class: "nf lo" }, g);
  const unit = solid(g), screen = mk("path", { class: "nf lo" }, unit.g), btn = mk("path", { class: "nf" }, unit.g);
  const t = tween(REST);
  let last = NaN;
  const pp = (pts) => pts.map(([x, y, z]) => P(x, y, z));
  function draw(k) {
    if (k === last) return;
    last = k;
    const R = R0 + (R1 - R0) * k;
    sleeve.setAttribute("d", poly(hull(pp(ring(-L, R, R).concat(ring(L, R, R))))));
    end.setAttribute("d", poly(pp(ring(L, R, R))));
    bore.setAttribute("d", poly(pp(ring(L, R0 - 6, R))));
    seam.setAttribute("d", poly(pp(ring(L - 8, R, R).slice(0, 21))).replace("Z", ""));
    const z = 2 * R - 2;
    const [ur, ui] = rings(-16, -13, 16, 13, 6, 2);
    put(unit, prism(P, front, ur, ui, z, z + 9));
    screen.setAttribute("d", poly(rrect(-11, -9, 5, 9, 3, 4).map((q) => P(q.u, q.v, z + 9))));
    btn.setAttribute("d", poly(circ(2.6, 14).map((q) => P(q.u + 10, q.v, z + 9))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 0.4 + 0.6 * inf : REST, performance.now(), 0);
    unit.sil.classList.add("hi");
    read.textContent = a ? "inflate" : "rest";
    B.wake();
  }
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, R0); return Math.abs(x) < L + 10 && Math.abs(y) < R1 + 14; };
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { inf = v; act = null; }, destroy: bag.dispose };
}

hairline({
  name: "bpcuff",
  means: "A wrist blood pressure monitor: the pointer over it inflates the cuff, which swells and lifts the monitor unit.",
  rules: [1, 4, 5, 9],
  range: [0.4, 1, 1],
  tour: [[200, 129], [160, 170], [230, 220], null],
  mount,
});
