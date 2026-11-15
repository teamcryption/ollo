/**
 * IBC tote: a caged square tank on its pallet, the filler cap on top and the
 * drain valve low on the front, standing on a tilt frame. The pointer over
 * it tips the tote forward on the frame's front edge, toward the valve, to
 * drain it. At rest it leans a little, the valve bright. The slider is the tip.
 */
const { Cam, fit, hull, poly, proj, seg, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const X1 = 24, Y1 = 20, H = 24, REST = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let tip = value;
  const C = Cam(45, 0.5, 4.8);
  fit(C, [[-2, -2, -4], [X1 + 14, Y1 + 2, -4], [-2, Y1, H + 4], [X1, -2, H + 4]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const base = solid(g);
  const bx = (F, x0, y0, z0, x1, y1, z1) => { const c = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) c.push(F(x, y, z)); return poly(hull(c)); };
  put(base, { sil: bx(P, -2, -2, -4, X1 + 2, Y1 + 2, 0), crease: seg(P(X1 + 2, Y1 + 2, 0), P(-2, Y1 + 2, 0)) + seg(P(X1 + 2, Y1 + 2, 0), P(X1 + 2, -2, 0)) + seg(P(X1 + 2, Y1 + 2, 0), P(X1 + 2, Y1 + 2, -4)) });
  const tank = solid(g), valve = solid(g);
  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const t = rad(deg), F = (x, y, z) => P(X1 + 2 + (x - X1 - 2) * Math.cos(t) + z * Math.sin(t), y, -(x - X1 - 2) * Math.sin(t) + z * Math.cos(t));
    let sil = bx(F, 0, 0, 0, X1, Y1, 3) + bx(F, 0.5, 0.5, 3, X1 - 0.5, Y1 - 0.5, H);
    let c = seg(F(X1, Y1, 3), F(0, Y1, 3)) + seg(F(X1, Y1, 3), F(X1, 0, 3));
    for (let i = 1; i < 4; i++) { const x = (X1 * i) / 4, y = (Y1 * i) / 4; c += seg(F(x, Y1 - 0.5, 3), F(x, Y1 - 0.5, H)) + seg(F(X1 - 0.5, y, 3), F(X1 - 0.5, y, H)); }
    for (const z of [10, 17]) c += seg(F(0.5, Y1 - 0.5, z), F(X1 - 0.5, Y1 - 0.5, z)) + seg(F(X1 - 0.5, Y1 - 0.5, z), F(X1 - 0.5, 0.5, z));
    c += seg(F(X1 - 0.5, Y1 - 0.5, H), F(0.5, Y1 - 0.5, H)) + seg(F(X1 - 0.5, Y1 - 0.5, H), F(X1 - 0.5, 0.5, H)) + seg(F(X1 - 0.5, Y1 - 0.5, H), F(X1 - 0.5, Y1 - 0.5, 3));
    const cap = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; cap.push(F(X1 / 2 + 4 * Math.cos(a), Y1 / 2 + 4 * Math.sin(a), H)); }
    c += poly(cap);
    tank.sil.setAttribute("d", sil);
    tank.cr.setAttribute("d", c);
    valve.sil.setAttribute("d", bx(F, X1 - 0.5, Y1 / 2 - 2, 4, X1 + 4, Y1 / 2 + 2, 7.5));
    valve.cr.setAttribute("d", seg(F(X1 + 4, Y1 / 2, 7.5), F(X1 + 4, Y1 / 2 + 6, 9)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? tip : REST, performance.now(), 0);
    tank.sil.classList.toggle("hi", !!a);
    valve.sil.classList.toggle("hi", !a);
    read.textContent = a ? "tip " + tip + "°" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(sx > 70 && sx < 330 && sy > 30 && sy < 290 ? 1 : 0), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { tip = v; if (act === 1) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "ibctank",
  means: "An IBC tote on a tilt frame: the pointer over it tips the caged tank forward toward its drain valve.",
  rules: [3, 4, 5, 8],
  range: [15, 26, 35],
  tour: [[200, 81], [193, 144], [248, 239], null],
  mount,
});
