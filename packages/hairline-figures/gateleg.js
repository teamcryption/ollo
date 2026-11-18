/**
 * Gateleg table: a narrow fixed top on four legs, with a drop leaf hinged
 * along its near side. The pointer over the table raises the leaf, and a
 * gate under it swings out on its pivot to carry the leaf's far edge. At
 * rest the leaf hangs part-way down, bright. The slider is how far the leaf
 * rises.
 *
 * The pattern: one part swinging up, a second swinging out to hold it.
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, seg, unproj, rad,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const CW = 34, D = 60, LW = 30, TH = 40, PX = CW - 7, PY = 12, G = 22, REST = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-6, -6, 0], [CW + LW + 6, D + 6, 0], [CW + LW + 6, -6, 0], [-6, D + 6, 0], [0, 0, TH], [CW + LW, D, TH]], 200, 164);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (par, x0, y0, x1, y1, z0, z1, r = 1) => { const [a, b] = rings(x0, y0, x1, y1, r, 0.6); put(solid(par), prism(P, front, a, b, z0, z1)); };
  const [fr, fi] = rings(-6, -6, CW + LW + 6, D + 6, 8, 2);
  put(solid(g), prism(P, front, fr, fi, -3, 0));
  box(g, 2, 2, 5, 5, 0, TH - 3);
  box(g, CW - 5, 2, CW - 2, 5, 0, TH - 3);
  box(g, 2, D - 5, 5, D - 2, 0, TH - 3);
  box(g, PX - 1.2, PY - 1.2, PX + 1.2, PY + 1.2, 3, TH - 3);
  const gate = mk("g", {}, g), rails = mk("path", { class: "nf" }, gate), legG = mk("g", {}, gate);
  box(g, CW - 5, D - 5, CW - 2, D - 2, 0, TH - 3);
  box(g, 0, 0, CW, D, TH - 3, TH, 2);
  const leaf = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);

  const lift = tween(REST), swing = tween(0);
  let last = "";
  function draw(A, S) {
    const key = A.toFixed(2) + "," + S.toFixed(2);
    if (key === last) return;
    last = key;
    const dl = rad(90 - A), c = Math.cos(dl), s = Math.sin(dl);
    const pt = (u, y, d) => P(CW + u * c + d * s, y, TH - 3 - u * s + d * c);
    const top = [pt(0, 0, 3), pt(LW, 0, 3), pt(LW, D, 3), pt(0, D, 3)];
    const bot = [pt(0, 0, 0), pt(LW, 0, 0), pt(LW, D, 0), pt(0, D, 0)];
    const h = hull(top.concat(bot));
    leaf.setAttribute("d", poly(fillet(h, h.map(() => 1.5))));
    face.setAttribute("d", open([top[0], top[1], top[2]]));
    const ps = rad(S), lx = PX + G * Math.sin(ps), ly = PY + G * Math.cos(ps);
    rails.setAttribute("d", seg(P(PX, PY, TH - 7), P(lx, ly, TH - 7)) + seg(P(PX, PY, 6), P(lx, ly, 6)));
    legG.replaceChildren();
    box(legG, lx - 1.5, ly - 1.5, lx + 1.5, ly + 1.5, 0, TH - 3);
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(lift, now), tval(swing, now));
    return !(tdone(lift, now) && tdone(swing, now));
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TH);
    return x > -8 && x < CW + LW + 8 && y > -10 && y < D + 10 ? 1 : -1;
  }

  let act = -2;
  function setActive(k) {
    if (k === act) return;
    act = k;
    const now = performance.now();
    tset(lift, k < 0 ? REST : amp, now, k < 0 ? 140 : 0);
    tset(swing, k < 0 ? 0 : 90 * amp / 90, now, k < 0 ? 0 : 160);
    leaf.classList.toggle("hi", true);
    read.textContent = k < 0 ? "rest" : Math.round(amp) + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; const k = act; act = -2; setActive(k); }, destroy: bag.dispose };
}

hairline({
  name: "gateleg",
  means: "A gateleg table: the pointer over it raises the drop leaf, and a gate leg swings out underneath to carry it.",
  rules: [1, 3, 5, 8],
  range: [55, 78, 90],
  tour: [[176, 107], [180, 93], [197, 134], null],
  mount,
});
