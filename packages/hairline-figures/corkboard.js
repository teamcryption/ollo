/**
 * Corkboard: a framed pin board on the wall with six paper notes pinned along
 * their top edges. The pointer picks a note by its rest place: it swings out
 * on its pin, and the notes beside it stir, staggered from it. At rest one
 * note hangs a little open, bright. The slider is the stagger.
 */
const {
  Cam, fillet, fit, hull, poly, proj, rrect, tdone, tset, tval, tween,
  disposer, mk, place, pointer, register,
} = HL;

const W = 120, H = 84, T = 5, NH = 26, FAV = 4;
const NOTES = [[10, 74, 28, 2], [46, 76, 26, 0], [82, 73, 28, 3], [12, 38, 26, 1], [47, 40, 30, 7], [84, 37, 26, 0]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.3);
  const sw = (x0, zt, w, a) => [[x0, T + 0.4, zt], [x0 + w, T + 0.4, zt], [x0 + w, T + 0.4 + NH * Math.sin(a), zt - NH * Math.cos(a)], [x0, T + 0.4 + NH * Math.sin(a), zt - NH * Math.cos(a)]];
  fit(C, [[0, 0, 0], [W, 0, 0], [0, T, 0], [W, T, H], [0, T, H], ...sw(84, 37, 26, 1.1)], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const face = (ring, y) => ring.map((q) => P(q.u, y, q.v));
  // the frame: a vertical slab, hull of its back and front faces
  const outer = rrect(0, 0, W, H, 4, 4), inner = rrect(1.6, 1.6, W - 1.6, H - 1.6, 2.6, 4);
  mk("path", { d: poly(hull(face(outer, 0).concat(face(outer, T)))), class: "sil" }, g);
  mk("path", { d: poly(face(inner, T)), class: "nf lo" }, g);
  mk("path", { d: poly(face(rrect(6, 6, W - 6, H - 6, 1.5, 3), T)), class: "nf lo" }, g);

  const rest = (k) => (k === FAV ? 0.45 : NOTES[k][3] * 0.02);
  const items = NOTES.map(([x0, zt, w], k) => {
    const grp = mk("g", {}, g);
    const sheet = mk("path", { class: "sil" }, grp);
    const fold = mk("path", { class: "nf lo" }, grp);
    const pin = mk("circle", { r: 2.2, class: "dot off" }, grp);
    place(pin, P(x0 + w / 2, T + 0.6, zt - 3));
    return { k, x0, zt, w, grp, sheet, fold, pin, a: tween(rest(k)), last: NaN, c: P(x0 + w / 2, T, zt - NH / 2) };
  });

  function draw(it, a) {
    if (a === it.last) return;
    it.last = a;
    const pts = sw(it.x0, it.zt, it.w, a).map((p) => P(...p));
    it.sheet.setAttribute("d", poly(fillet(pts, [1, 1, 1.5, 1.5], 3)));
    const f = 0.82, y = T + 0.4 + NH * f * Math.sin(a), z = it.zt - NH * f * Math.cos(a);
    it.fold.setAttribute("d", "M" + P(it.x0 + 3, y, z).join(" ") + "L" + P(it.x0 + it.w - 3, y, z).join(" "));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    items.forEach((it, k) => { const d = Math.hypot(it.c[0] - sx, it.c[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 34 ? best : -1;
  }
  const col = (k) => k % 3, row = (k) => Math.floor(k / 3);
  const dist = (i, j) => Math.max(Math.abs(col(i) - col(j)), Math.abs(row(i) - row(j)));

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, on = a < 0 ? FAV : a;
    act = a;
    items[on].grp.parentNode.appendChild(items[on].grp);
    items.forEach((it, k) => {
      const d = dist(k, a), to = a < 0 ? rest(k) : d === 0 ? 1.1 : d === 1 ? 0.18 : rest(k);
      tset(it.a, to, now, from < 0 ? 0 : dist(k, from) * stag);
      it.sheet.classList.toggle("hi", k === on);
      it.pin.setAttribute("class", k === on ? "dot" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "note " + (col(a) + 1) + "·" + (row(a) + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "corkboard",
  means: "A framed pin board of paper notes: the note under the pointer swings out on its pin, and its neighbours stir.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[115, 58], [200, 150], [258, 229], null],
  mount,
});
