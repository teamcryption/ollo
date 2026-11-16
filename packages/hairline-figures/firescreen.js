/**
 * Firescreen: a folding three-panel fire screen with arched tops, standing
 * on short feet. The pointer picks a panel by where it stands: a wing swings
 * open flat and the other wing folds in; the middle panel opens both wings
 * part way. At rest the wings stand at uneven folds, the left one bright.
 * The slider is how far the other wing folds in.
 *
 * The pattern: a few hinged parts, one chosen (swing).
 */
const {
  Cam, fit, facing, hull, open, poly, proj, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const W = 42, HM = 60, HS = 50, A = 9, Z0 = 5, D = Math.PI / 180;
const REST = [52, 28];

function outline(w, h, inset) {
  const pts = [[inset, Z0 + inset], [w - inset, Z0 + inset]];
  for (let i = 0; i <= 16; i++) { const s = w - inset - ((w - 2 * inset) * i) / 16; pts.push([s, Z0 + h - inset + A * Math.sin((Math.PI * s) / w)]); }
  return pts;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let fold = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-W, 0, 0], [2 * W, 0, 0], [0, W, 0], [W, W, 0], [-W, 0, HS + A + 6], [2 * W, 0, HS + A + 6], [W / 2, 0, HM + A + 8], [0, W, HS + A + 6], [W, W, HS + A + 6]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  // where a panel's local (s, z) lands: mid stands at y = 0, wings swing toward the viewer
  const map = [
    (s, z, o) => P(s, o, z),
    (s, z, o, f) => P(-s * Math.cos(f) + o * Math.sin(f), s * Math.sin(f) + o * Math.cos(f), z),
    (s, z, o, f) => P(W + s * Math.cos(f) - o * Math.sin(f), s * Math.sin(f) + o * Math.cos(f), z),
  ];
  const panels = [0, 1, 2].map((k) => {
    const grp = mk("g", {}, g), h = k === 0 ? HM : HS;
    const feet = mk("path", { class: "nf" }, grp), sil = mk("path", { class: "sil" }, grp), cr = mk("path", { class: "nf lo" }, grp);
    return { k, h, feet, sil, cr, out: outline(W, h, 0), inn: outline(W, h, 5), a: tween(k === 0 ? 0 : REST[k - 1]), last: NaN };
  });

  function draw(p, deg) {
    if (deg === p.last) return;
    p.last = deg;
    const f = deg * D, m = map[p.k], pts = [];
    for (const [s, z] of p.out) pts.push(m(s, z, 0, f), m(s, z, 2.4, f));
    p.sil.setAttribute("d", poly(hull(pts)));
    p.cr.setAttribute("d", poly(p.inn.map(([s, z]) => m(s, z, 2.4, f))));
    p.feet.setAttribute("d", open([m(4, Z0, 1.2, f), m(4, 0, 1.2, f)]) + open([m(W - 4, Z0, 1.2, f), m(W - 4, 0, 1.2, f)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of panels) { draw(p, tval(p.a, now)); if (!tdone(p.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = panels.map((p) => map[p.k](W / 2, Z0 + p.h / 2, 0, (p.k === 0 ? 0 : REST[p.k - 1]) * D));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 50 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    const now = performance.now();
    act = a;
    const t = a < 0 ? REST : a === 0 ? [14, 14] : a === 1 ? [0, fold] : [fold, 0];
    tset(panels[1].a, t[0], now, 0);
    tset(panels[2].a, t[1], now, a === 1 ? 60 : 0);
    panels.forEach((p, k) => p.sil.classList.toggle("hi", k === (a < 0 ? 1 : a)));
    read.textContent = a < 0 ? "rest" : ["mid", "left", "right"][a];
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { fold = v; if (act > 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "firescreen",
  means: "A folding three-panel fire screen: the wing under the pointer swings open flat while the other wing folds in.",
  rules: [1, 3, 5, 6],
  range: [40, 62, 84],
  tour: [[112, 158], [200, 165], [236, 197], null],
  mount,
});
