/**
 * Time clock: a wall clock-in machine with a dial on its face and a card
 * slot on its top, a time card standing half out. The pointer over it
 * pushes the card down into the slot and the minute hand jumps on. At rest
 * the card is bright. The slider is how deep the card goes.
 */
const { Cam, fit, proj, hull, poly, open, rrect, rings, prism, circ, facing, rad, tween, tset, tval, tdone, mk, solid, put, register, pointer, disposer } = HL;

const W = 52, D = 26, HT = 46, CH = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let deep = value;
  const C = Cam(45, 0.5, 2.7);
  const ext = [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [8, 13, HT + CH], [44, 13, HT + CH]];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C), pp = (pts) => pts.map((p) => P(...p));
  const g = mk("g", {}, svg);
  const [r0, r1] = rings(0, 0, W, D, 7, 2);
  put(solid(g), prism(P, front, r0, r1, 0, HT));
  mk("path", { class: "nf lo", d: poly(pp(rrect(6, 11.5, 46, 14.5, 1.5, 3).map((q) => [q.u, q.v, HT]))) }, g);
  // the dial on the front face, and its two hands
  const dial = circ(11, 32).map((q) => [26 + q.u, D + 0.2, 30 + q.v]);
  mk("path", { d: poly(pp(dial)) }, g);
  mk("path", { class: "nf lo", d: poly(pp(circ(9, 28).map((q) => [26 + q.u, D + 0.3, 30 + q.v]))) }, g);
  const hr = mk("path", { class: "nf", d: open(pp([[26, D + 0.4, 30], [30, D + 0.4, 34]])) }, g);
  const mn = mk("path", { class: "nf" }, g);
  mk("path", { class: "nf lo", d: poly(pp(rrect(16, 6, 36, 12, 2, 3).map((q) => [q.u, D + 0.2, q.v]))) }, g);
  const card = mk("path", { class: "sil" }, g), rows = mk("path", { class: "nf lo" }, g);
  const REST = 0, t = tween(REST);
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const k = tval(t, now);
    if (k !== last) {
      last = k;
      const h = CH - k, top = HT + h, cr = rrect(8, HT, 44, top, 1.5, 3);
      card.setAttribute("d", poly(hull(pp(cr.map((q) => [q.u, 12.6, q.v]).concat(cr.map((q) => [q.u, 13.4, q.v]))))));
      let d = "";
      for (let z = top - 8; z > HT + 2; z -= 4) d += open(pp([[11, 13.5, z], [41, 13.5, z]]));
      d += open(pp([[11, 13.5, top - 4], [18, 13.5, top - 4]]));
      rows.setAttribute("d", d);
      const a = rad(90 - 30 - k * 4.5);
      mn.setAttribute("d", open(pp([[26, D + 0.4, 30], [26 + 8 * Math.cos(a), D + 0.4, 30 + 8 * Math.sin(a)]])));
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
    tset(t, on ? deep : REST, performance.now(), 0);
    card.classList.toggle("hi", !on);
    mn.classList.toggle("hi", on);
    read.textContent = on ? "in " + Math.round(deep) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => { hr.remove(); svg.replaceChildren(); });
  return { set: (v) => { deep = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "clocking",
  means: "A time clock: the pointer over it pushes the time card down into the slot and the minute hand jumps on.",
  rules: [1, 3, 5, 8],
  range: [30, 35, 38],
  tour: [[200, 93], [200, 200], [150, 160], null],
  mount,
});
