/**
 * Soldering station: a control box with a dial on its face and, beside it, a
 * stand holding the iron upright in its sleeve. The pointer over the station
 * draws the iron up out of the sleeve, eased; leaving drops it back.
 * At rest the iron sits in the sleeve, its grip bright.
 * The slider is how far it rises.
 */
const { Cam, facing, fit, poly, prism, proj, rings, rrect, seg, tdone, tset, tval, tween, unproj, disposer, mk, pointer, put, register, solid } = HL;

const S = 4.5, BX = 26, BY = 24, BH = 15, SX = 38, SY = 8, IL = 34, UP = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 90;
  const C = Cam(45, 0.5, S);
  fit(C, [[0, 0, 0], [BX, BY, 0], [SX + 12, SY + 12, 0], [SX, SY, 8 + IL + UP], [0, BY, BH], [SX + 12, SY - 4, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const base = solid(g);
  const [bo, bi] = rings(0, 0, BX, BY, 4, 1.3);
  put(base, prism(P, front, bo, bi, 0, BH));
  const dial = []; for (let n = 0; n < 24; n++) { const q = (n / 24) * Math.PI * 2; dial.push(P(BX / 2 + 4.5 * Math.cos(q), BY, 7.5 + 4.5 * Math.sin(q))); }
  mk("path", { class: "nf lo", d: poly(dial) + seg(P(BX / 2, BY, 7.5), P(BX / 2 + 2.5, BY, 10)) }, base.g);

  const foot = solid(g);
  put(foot, prism(P, front, rrect(SX - 7, SY - 7, SX + 7, SY + 7, 7, 10), rrect(SX - 6, SY - 6, SX + 6, SY + 6, 6, 10), 0, 3));
  const iron = solid(g), tip = mk("path", { class: "sil" }, iron.g);
  const sleeve = solid(g);
  put(sleeve, prism(P, front, rrect(SX - 4.5, SY - 4.5, SX + 4.5, SY + 4.5, 4.5, 10), rrect(SX - 3.6, SY - 3.6, SX + 3.6, SY + 3.6, 3.6, 10), 3, 22));
  const z = tween(0);
  let last = NaN;

  function draw(h) {
    if (h === last) return;
    last = h;
    const z0 = 6 + h;
    put(iron, prism(P, front, rrect(SX - 2.6, SY - 2.6, SX + 2.6, SY + 2.6, 2.6, 10), rrect(SX - 1.8, SY - 1.8, SX + 1.8, SY + 1.8, 1.8, 10), z0 + 10, z0 + IL));
    // the tip: a thin taper below the grip, hidden in the sleeve at rest
    tip.setAttribute("d", poly([P(SX - 1.2, SY, z0 + 10), P(SX + 1.2, SY, z0 + 10), P(SX, SY, z0)]));
  }

  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -12 && x < SX + 20 && y > -12 && y < BY + 14;
  }

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? UP * (0.4 + 0.6 * reach) : 0, performance.now(), 0);
    tip.classList.toggle("hi", a);
    iron.sil.classList.toggle("hi", true);
    read.textContent = a ? "iron" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 90; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "soldering2",
  means: "A soldering station: the pointer over it draws the iron up out of its sleeve on the stand.",
  rules: [1, 3, 5],
  range: [30, 90, 90],
  tour: [[190, 243], [108, 227], [260, 272], null],
  mount,
});
