/**
 * Guitar amps: a four-speaker cabinet with an amp head on top, its front a
 * grille of four cones. The pointer picks the cone nearest it on the face:
 * that cone pushes out of the grille, and the cones beside it give a little,
 * staggered from it. At rest one cone sits pushed out, bright. The slider is
 * the stagger.
 *
 * The pattern: a grid on a face plane.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, clamp,
} = HL;

const W = 64, D = 30, H = 64, HZ = 18, CR = 12, PUSH = 7, FAV = 1;
const SP = [[17, 17], [47, 17], [17, 47], [47, 47]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, 0], [0, D, 0], [0, 0, H + HZ + 2], [W, D + PUSH, H + HZ + 2]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(0, 0, W, D, 4, 1.8);
  put(solid(g), prism(P, front, cr, ci, 0, H));
  const [hr, hi] = rings(3, 3, W - 3, D - 2, 3, 1.4);
  put(solid(g), prism(P, front, hr, hi, H + 1, H + HZ));
  // the head's control strip: a dim line and a row of knob dots along its front
  mk("path", { d: poly([P(8, D - 2, H + HZ - 6), P(W - 8, D - 2, H + HZ - 6), P(W - 8, D - 2, H + 5), P(8, D - 2, H + 5)]), class: "nf lo" }, g);
  for (let i = 0; i < 5; i++) { const d = mk("circle", { r: 1.6, class: "dot off" }, g); const p = P(16 + i * 8, D - 2, H + HZ / 2 + 0.5); d.setAttribute("cx", p[0]); d.setAttribute("cy", p[1]); }

  const circle = (cx, cz, r, y, n = 32) => {
    const out = [];
    for (let i = 0; i < n; i++) { const t = (i / n) * Math.PI * 2; out.push(P(cx + r * Math.cos(t), y, cz + r * Math.sin(t))); }
    return out;
  };
  const items = SP.map(([cx, cz], k) => {
    mk("path", { d: poly(circle(cx, cz, CR + 1.5, D)), class: "nf lo" }, g);
    const cone = mk("path", { class: "nf sil" }, g), cap = mk("path", { class: "nf" }, g);
    return { k, cx, cz, cone, cap, z: tween(k === FAV ? PUSH * 0.6 : 0), last: NaN };
  });
  items.sort((a, b) => b.cz - a.cz).forEach((it) => { g.append(it.cone); g.append(it.cap); });

  function draw(it, push) {
    if (push === it.last) return;
    it.last = push;
    it.cone.setAttribute("d", poly(circle(it.cx, it.cz, CR, D + push * 0.5)) + " " + poly(circle(it.cx, it.cz, CR * 0.55, D + push * 0.8)));
    it.cap.setAttribute("d", poly(circle(it.cx, it.cz, 3, D + push)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = SP.map(([cx, cz]) => P(cx, D, cz));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 ? best : -1;
  }

  let act = -2;
  const gd = (a, b) => Math.abs(SP[a][0] - SP[b][0]) / 30 + Math.abs(SP[a][1] - SP[b][1]) / 30;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it) => {
      const k = it.k, z = a < 0 ? (k === FAV ? PUSH * 0.6 : 0) : k === a ? PUSH : gd(k, a) === 1 ? 2 : 0;
      tset(it.z, z, now, from < 0 ? 0 : gd(k, from) * stag);
      it.cone.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "spk " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = clamp(v, 0, 90); }, destroy: bag.dispose };
}

hairline({
  name: "guitaramps",
  means: "A guitar cabinet with an amp head on top: the speaker cone nearest the pointer pushes out of the grille, its neighbours give a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[148, 219], [200, 245], [200, 181], null],
  mount,
});
