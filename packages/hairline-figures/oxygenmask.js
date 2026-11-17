/**
 * Oxygen mask: an overhead cabin panel whose door swings down and lets a
 * cup mask drop on its coiled tube. The pointer over it opens the door and
 * drops the mask. At rest the door is ajar and the cup's rim is bright. The
 * slider is how far the mask falls.
 */
const { Cam, fit, proj, hull, poly, open, rrect, circ, rad, tween, tset, tval, tdone, mk, register, pointer, disposer } = HL;

const CX = 30, CY = 20, PZ = 80, TOP = 70;
const rot = (p, o, a) => { const c = Math.cos(a), s = Math.sin(a), dx = p[0] - o[0], dz = p[2] - o[2]; return [o[0] + dx * c - dz * s, p[1], o[2] + dx * s + dz * c]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let fall = value;
  const C = Cam(45, 0.5, 2.85);
  const door = rrect(6, 6, 54, 34, 3, 3);
  const doorPts = (a) => door.map((q) => rot([q.u, q.v, PZ - 1], [6, 0, PZ], -a)).concat(door.map((q) => rot([q.u, q.v, PZ + 1], [6, 0, PZ], -a)));
  const cupPts = (zt) => circ(5, 20).map((q) => [CX + q.u, CY + q.v, zt]).concat(circ(11, 28).map((q) => [CX + q.u, CY + q.v, zt - 13]));
  const ext = doorPts(rad(100)).concat(cupPts(TOP - 50), [[0, 0, PZ + 8], [60, 40, PZ + 8], [60, 0, PZ], [0, 40, PZ]]);
  fit(C, ext, 200, 166);
  const P = proj(C), pp = (pts) => pts.map((p) => P(...p));
  const g = mk("g", {}, svg);
  const dr = mk("path", { class: "sil" }, g), tube = mk("path", { class: "nf" }, g);
  const cup = mk("path", { class: "sil" }, g), rim = mk("path", { class: "nf" }, g), bag2 = mk("path", { class: "nf lo" }, g);
  // the panel overhead, painted last: it covers what is still inside
  const pr = rrect(0, 0, 60, 40, 5, 6), pi = rrect(2, 2, 58, 38, 4, 6);
  mk("path", { class: "sil", d: poly(hull(pp(pr.map((q) => [q.u, q.v, PZ]).concat(pr.map((q) => [q.u, q.v, PZ + 8]))))) }, g);
  mk("path", { class: "nf lo", d: poly(pp(pi.map((q) => [q.u, q.v, PZ + 8]))) }, g);
  const vents = [16, 44].map((x) => mk("path", { class: "nf lo", d: poly(pp(circ(3, 12).map((q) => [x + q.u, 20 + q.v, PZ + 8]))) }, g));
  const REST = 0.15, t = tween(REST);
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const k = tval(t, now);
    if (k !== last) {
      last = k;
      const zt = TOP - k * 50, a = rad(25 + Math.min(1, k * 2) * 70);
      dr.setAttribute("d", poly(hull(pp(doorPts(a)))));
      cup.setAttribute("d", poly(hull(pp(cupPts(zt)))));
      rim.setAttribute("d", poly(pp(circ(11, 28).map((q) => [CX + q.u, CY + q.v, zt - 13]))));
      bag2.setAttribute("d", poly(pp(circ(7.5, 24).map((q) => [CX + q.u, CY + q.v, zt - 13]))));
      const coil = [];
      for (let i = 0; i <= 24; i++) { const z = PZ - (PZ - zt) * i / 24; coil.push(P(CX + (i % 2 ? 1.6 : -1.6), CY, z)); }
      tube.setAttribute("d", open(coil));
    }
    return !tdone(t, now);
  });
  bag.add(B.unregister);
  const box = pp(ext), xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const inside = ([x, y]) => x > Math.min(...xs) && x < Math.max(...xs) && y > Math.min(...ys) && y < Math.max(...ys);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? fall / 50 : REST, performance.now(), 0);
    rim.classList.toggle("hi", !on);
    cup.classList.toggle("hi", on);
    read.textContent = on ? "drop " + Math.round(fall) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => { vents.length = 0; svg.replaceChildren(); });
  return { set: (v) => { fall = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "oxygenmask",
  means: "An overhead panel: the pointer over it swings the door down and drops the cup mask on its coiled tube.",
  rules: [1, 3, 5, 8],
  range: [25, 38, 50],
  tour: [[200, 154], [150, 110], [215, 210], null],
  mount,
});
