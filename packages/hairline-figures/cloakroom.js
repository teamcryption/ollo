/**
 * Cloakroom: a coat rail on two posts over a plinth, six coats hung side by
 * side on hangers, each with a ticket on its hook. The pointer picks a coat by
 * where it hangs: it lifts off the rail on its hanger, and the coats beside it
 * rise a little, staggered from it. At rest one coat is half lifted, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 17, ZT = 66, LIFT = 20, FAV = 4, LEN = [42, 38, 46, 40, 44, 39];
const X1 = (N - 1) * STEP;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -22, 0], [X1 + 14, 22, 0], [X1 + 14, -22, 0], [-14, 22, 0], [0, 0, ZT + LIFT + 12], [X1, 0, ZT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, o, i, z0, z1)); };
  box(-14, -22, X1 + 14, 22, 7, 2, 0, 5);
  box(-12, -3, -6, 3, 3, 1, 5, ZT + 3);
  box(X1 + 6, -3, X1 + 12, 3, 3, 1, 5, ZT + 3);
  box(-12, -2, X1 + 12, 2, 2, 0.8, ZT - 1, ZT + 3);

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, L = LEN[k], grp = mk("g", {}, g);
    // a coat in its own plane: u across the rail, w down from the hook
    const shape = fillet([[-4, 5], [4, 5], [15, 10], [16, L], [-16, L], [-15, 10]], [2, 2, 4, 2, 2, 4], 4);
    const hook = mk("path", { class: "nf" }, grp), coat = mk("path", { class: "sil" }, grp);
    const seam = mk("path", { class: "nf lo" }, grp), tag = mk("path", { class: "" }, grp);
    items.push({ k, x, L, shape, grp, hook, coat, seam, tag, z: tween(k === FAV ? LIFT * 0.6 : 0), last: NaN });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const W = (u, w) => P(it.x, u, ZT + 2 + lift - w);
    const H = [];
    for (let i = 0; i <= 8; i++) { const q = (i / 8) * Math.PI * 1.3; H.push(W(-3 * Math.cos(q) + 0, -3 - 3 * Math.sin(q))); }
    H.push(W(0, 5));
    it.hook.setAttribute("d", open(H));
    it.coat.setAttribute("d", poly(it.shape.map(([u, w]) => W(u, w))));
    it.seam.setAttribute("d", open([W(0, 6), W(0, it.L)]) + open([W(-4, 5), W(-1, 16), W(0, 13)]).replace("M", " M"));
    it.tag.setAttribute("d", poly([W(2, 0), W(8, 0), W(8, 7), W(2, 7)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, ZT - 18));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.6 : 0) : dd === 0 ? LIFT : dd === 1 ? 5 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.coat.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tkt " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cloakroom",
  means: "Six coats on a cloakroom rail: the coat under the pointer lifts off the rail on its hanger, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[138, 129], [188, 154], [262, 191], null],
  mount,
});
