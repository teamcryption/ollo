/**
 * Shower caddy: a tall plate on the wall carrying two wire shelves, each
 * hinged at the wall. At rest both shelves are folded up against the plate,
 * the top one bright. The pointer over the caddy swings them down flat, the
 * nearer one first. The slider is the stagger.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 60, D = 28, H = 104, SH = [{ z: 34, rest: 78 }, { z: 72, rest: 66 }];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.42);
  fit(C, [[0, -4, 0], [W, -4, H], [W, D, 30], [0, D, 30], [W, 0, H], [0, -4, H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, -5, W, 0, 2, 1);
  put(solid(g), prism(P, front, pr, pi, 0, H));
  for (const s of SH) for (const x of [6, W - 6]) mk("path", { d: "M" + P(x, 0, s.z - 2) + "L" + P(x, 0, s.z + 2), class: "nf" }, g);
  const ring = rrect(3, 0, W - 3, D, 3, 3), inner = rrect(5, 2, W - 5, D - 2, 2, 3);
  const items = SH.map((s, k) => {
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp), sl = mk("path", { class: "nf lo" }, grp);
    return { ...s, k, sil, cr, sl, a: tween(s.rest), last: NaN };
  });
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const th = (deg * Math.PI) / 180, c = Math.cos(th), s = Math.sin(th);
    const T = (x, y, z) => P(x, y * c - (z - it.z) * s, it.z + y * s + (z - it.z) * c);
    const at = (rg, z) => rg.map((q) => T(q.u, q.v, z));
    it.sil.setAttribute("d", poly(hull(at(ring, it.z).concat(at(ring, it.z + 8)))));
    it.cr.setAttribute("d", poly(at(inner, it.z + 8)));
    let d = "";
    for (let i = 1; i < 6; i++) { const x = (W * i) / 6; d += "M" + T(x, 2, it.z + 1) + "L" + T(x, D - 2, it.z + 1); }
    it.sl.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);
  const box = hull([P(0, 0, 0), P(W, 0, 0), P(W, 0, H), P(0, 0, H), P(0, D, SH[0].z), P(W, D, SH[0].z)]);
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const [x0, x1, y0, y1] = [Math.min(...xs) - 8, Math.max(...xs) + 8, Math.min(...ys) - 8, Math.max(...ys) + 8];
  let on = null;
  function set(a) {
    if (a === on) return;
    on = a;
    const now = performance.now();
    items.forEach((it) => {
      tset(it.a, a ? 0 : it.rest, now, it.k * stag);
      it.sil.classList.toggle("hi", a ? it.k === 0 : it.k === 1);
    });
    read.textContent = a ? "down" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => set(sx > x0 && sx < x1 && sy > y0 && sy < y1),
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "loofahhook",
  means: "A shower caddy on the wall: its two wire shelves, folded up at rest, swing down flat when the pointer comes near.",
  rules: [1, 2, 5, 6],
  range: [0, 60, 120],
  tour: [[221, 102], [169, 244], [272, 295], null],
  mount,
});
