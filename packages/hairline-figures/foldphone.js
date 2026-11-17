/**
 * Folding phone: a foldable lying on its back half, the front half hinged
 * along the far edge. At rest it stands half-open, its edge bright. The
 * pointer over the phone swings the front half open about the hinge, flat
 * at the far end. The slider is how far it opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, fit, hull, poly, proj, rrect, clamp, lerp, rad, tween, tset, tval, tdone,
  disposer, mk, pointer, put, register, solid, unproj,
} = HL;

const W = 46, L = 58, T = 3.2, R = 7, REST = 64;
const VIEW = [0.612, 0.612, 0.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, -L, 0], [W, L, 0], [0, L, 0], [W, -L, 0], [0, 0, L + T], [W, 0, L + T]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const outer = rrect(0, 0, W, L, R, 6), inner = rrect(2, 2, W - 2, L - 2, R - 2, 6), scr = rrect(4.5, 4.5, W - 4.5, L - 4.5, R - 4, 6);

  function slab(sol, scrEl, map, nrm) {
    const a = outer.map((q) => P(...map(q.u, q.v, 0))), b = outer.map((q) => P(...map(q.u, q.v, T)));
    const up = nrm[0] * VIEW[0] + nrm[1] * VIEW[1] + nrm[2] * VIEW[2] > 0;
    const wf = up ? T : 0;
    put(sol, { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...map(q.u, q.v, wf)))) });
    if (scrEl) scrEl.setAttribute("d", poly(scr.map((q) => P(...map(q.u, q.v, wf)))));
  }

  // back half: lies flat, hinge on its far edge (y = 0)
  const baseG = mk("g", {}, g), base = solid(baseG), baseScr = mk("path", { class: "nf lo" }, baseG);
  slab(base, baseScr, (u, v, w) => [u, v, w], [0, 0, 1]);
  mk("path", { d: poly(rrect(W / 2 - 4, L - 6, W / 2 + 4, L - 4.5, 0.7, 2).map((q) => P(q.u, q.v, T))), class: "nf lo" }, baseG);
  // front half: swings about the hinge line y = 0, z = T
  const topG = mk("g", {}, g), top = solid(topG), topScr = mk("path", { class: "nf lo" }, topG);
  top.sil.classList.add("hi");

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a));
    // local v runs from the hinge; w = 0 is the screen side, facing the base when shut
    const map = (u, v, w) => [u, v * c - w * s, T + v * s + w * c];
    slab(top, null, map, [0, s, -c]);
    // screen sits on the inner face (w = 0); show it when that face turns to us
    const face = 0 * VIEW[0] + s * VIEW[1] - c * VIEW[2] > 0;
    topScr.setAttribute("d", face ? poly(scr.map((q) => P(...map(q.u, q.v, 0)))) : "");
    if (a > 90) { if (topG.nextSibling !== baseG) g.insertBefore(topG, baseG); } else if (baseG.nextSibling !== topG) baseG.after(topG);
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? lerp(REST, 180, reach) : REST, performance.now(), 0);
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      setOn(x > -44 && x < W + 8 && y > -L - 8 && y < L + 8);
    },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 0, 1); if (on) { tset(ang, lerp(REST, 180, reach), performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "foldphone",
  means: "A folding phone on its back half: the pointer swings the front half open on its hinge, out to flat.",
  rules: [1, 3, 5, 6],
  range: [0.3, 0.8, 1],
  tour: [[176, 152], [160, 215], [136, 275], null],
  mount,
});
