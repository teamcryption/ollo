/**
 * Heat pump: an outdoor unit, a rounded cabinet on two feet with louvres on
 * its long side and two fans in round openings on its top. The pointer picks
 * a fan by where it is along the top: its four blades turn an eighth of a
 * revolution, the other fan turns a little after it. At rest the blades sit
 * at odd angles and the first fan's ring is bright. The slider is the stagger.
 *
 * The pattern: one of two, picked on a fixed plane through the cabinet's top.
 */
const {
  Cam, circ, facing, fillet, fit, poly, prism, proj, rad, rings, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 72, Y1 = 34, TOP = 30, FX = [18, 54], FY = 17, R = 14;
const REST = [10, 47], FAV = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, 0, TOP], [X1, Y1, TOP]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // two feet, then the cabinet
  [6, X1 - 10].forEach((x) => { const [fr, fi] = rings(x, 2, x + 4, Y1 - 2, 1.2, 0.5); put(solid(g), prism(P, front, fr, fi, 0, 3)); });
  const [cr, ci] = rings(0, 0, X1, Y1, 6, 1.8);
  const cab = solid(g);
  put(cab, prism(P, front, cr, ci, 3, TOP));
  let lv = "";
  for (let z = 8; z <= TOP - 5; z += 3.4) lv += seg(P(8, Y1, z), P(X1 - 8, Y1, z));
  mk("path", { class: "nf lo", d: lv }, cab.g);

  const fans = FX.map((x, k) => {
    const fg = mk("g", {}, g);
    const ring = mk("path", { class: "nf sil", d: poly(circ(R, 32).map((s) => P(x + s.u, FY + s.v, TOP))) }, fg);
    mk("path", { class: "nf lo", d: poly(circ(R - 2.5, 32).map((s) => P(x + s.u, FY + s.v, TOP - 1))) }, fg);
    const blades = mk("path", { class: "" }, fg);
    mk("path", { class: "", d: poly(circ(2.4, 16).map((s) => P(x + s.u, FY + s.v, TOP - 0.5))) }, fg);
    return { x, ring, blades, a: tween(REST[k]), last: NaN };
  });

  // a blade: a swept paddle from the hub to the rim, in the plane just under the top
  const shape = fillet([[1.5, -3], [11.5, -7.5], [12.5, 2], [2, 3]], [1, 3.5, 3, 1], 3);
  function draw(f, deg) {
    if (deg === f.last) return;
    f.last = deg;
    let d = "";
    for (let b = 0; b < 4; b++) {
      const t = rad(deg + b * 90), c = Math.cos(t), s = Math.sin(t);
      d += poly(shape.map(([u, v]) => P(f.x + u * c - v * s, FY + u * s + v * c, TOP - 0.8)));
    }
    f.blades.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    fans.forEach((f) => { draw(f, tval(f.a, now)); if (!tdone(f.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP);
    if (x < -3 || x > X1 + 3 || y < -3 || y > Y1 + 3) return -1;
    return x < X1 / 2 ? 0 : 1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    fans.forEach((f, k) => {
      tset(f.a, a < 0 ? REST[k] : REST[k] + (k === a ? 45 : 30), now, from < 0 ? 0 : Math.abs(k - from) * stag);
      f.ring.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "fan " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "heatpump",
  means: "A heat pump's outdoor unit: the fan under the pointer turns its blades an eighth round, the other turns a little after.",
  rules: [1, 2, 5, 6],
  range: [0, 60, 120],
  tour: [[161, 107], [200, 126], [239, 146], null],
  mount,
});
