/**
 * Shirt folder: a flat folding board of a centre panel and two side wings on
 * hinges. The pointer over the board folds both wings up and over the centre,
 * one after the other, as when folding a shirt; leaving lays them back. At
 * rest the right wing is lifted a little, bright. The slider is the stagger.
 */
const {
  Cam, fit, hull, poly, proj, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, register,
} = HL;

const HW = 20, WW = 30, D = 46, T = 2.4, FOLD = 150, RESTR = 0.14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-HW - WW, -D, 0], [HW + WW, D, 0], [HW + WW, -D, 0], [-HW - WW, D, 0], [-HW, -D, WW + 4], [HW, D, WW + 4]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const slab = (pts) => poly(hull(pts.map((p) => P(...p)).concat(pts.map((p) => P(p[0], p[1], p[2] + T)))));
  mk("path", { d: slab([[-HW, -D, 0], [HW, -D, 0], [HW, D, 0], [-HW, D, 0]]) }, g);
  mk("path", { d: poly([P(-8, -D + 10, T), P(8, -D + 10, T), P(8, D - 22, T), P(-8, D - 22, T)]), class: "nf lo" }, g);
  mk("path", { d: poly([P(-HW, D - 14, T), P(HW, D - 14, T)]), class: "nf lo" }, g);
  const wings = [-1, 1].map((d) => ({ d, el: mk("path", d > 0 ? { class: "sil hi" } : {}, g), crease: mk("path", { class: "nf lo" }, g), t: tween(d > 0 ? RESTR : 0), last: NaN }));

  function draw(w, k) {
    if (k === w.last) return;
    w.last = k;
    const A = (k * FOLD * Math.PI) / 180, h = w.d * HW, c = Math.cos(A), s = Math.sin(A);
    const at = (r, y) => [h + w.d * r * c, y, r * s];
    w.el.setAttribute("d", slab([at(0, -D), at(WW, -D), at(WW, D), at(0, D)]));
    const m = (r, y) => { const p = at(r, y); return P(p[0] - w.d * s * T, p[1], p[2] + c * T); };
    w.crease.setAttribute("d", poly([m(6, -D + 10), m(WW - 6, -D + 18), m(WW - 6, D - 22), m(6, D - 22)]));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const w of wings) { draw(w, tval(w.t, now)); if (!tdone(w.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    const now = performance.now();
    wings.forEach((w, i) => tset(w.t, a ? 1 : w.d > 0 ? RESTR : 0, now, (a ? i : 1 - i) * stag));
    read.textContent = a ? "fold" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, T); setOn(Math.abs(x) < HW + WW && Math.abs(y) < D); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shirtbox",
  means: "A shirt folding board: the pointer over it folds the two side wings up and over the centre panel, one after the other.",
  rules: [1, 2, 3, 4, 5, 6],
  range: [0, 160, 320],
  tour: [[200, 185], [119, 144], [281, 225], null],
  mount,
});
