/**
 * Matcha whisk: a bamboo whisk resting tines-down on its ceramic stand,
 * a tea bowl beside it. The pointer over the set lifts the whisk off the
 * stand, swings it over the bowl and tilts it in, ready to whisk. At rest
 * the whisk is bright on its stand. The slider is how far it travels.
 *
 * The pattern: one part sliding across and tilting.
 */
const {
  Cam, circ, fit, hull, poly, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const BX = 46, BY = -6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-14, -14, 0], [BX + 22, BY + 22, 0], [BX + 22, BY - 22, 0], [-14, 14, 0], [0, 0, 76], [BX + 20, BY, 68]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shape = (x, y, prof) => { const o = []; for (const [r, z] of prof) o.push(...ringAt(P, disc(x, y, r), z)); return hull(o); };

  mk("path", { d: poly(shape(BX, BY, [[10, 0], [14, 2], [20, 10], [21, 20]])) }, g);
  mk("path", { d: poly(ringAt(P, disc(BX, BY, 18.5, 36), 20)), class: "nf" }, g);
  mk("path", { d: poly(shape(0, 0, [[7, 0], [10, 4], [10, 9], [6, 16], [3, 18]])) }, g);
  const tines = mk("path", { class: "sil" }, g), lines = mk("path", { class: "nf" }, g), handle = mk("path", { class: "sil" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const e = Math.sin(p * Math.PI / 2), tl = -0.55 * Math.max(0, p * 1.5 - 0.5);
    const ox = BX * e, oy = BY * e, oz = 12 + 20 * Math.sin(p * Math.PI) + 10 * p, ct = Math.cos(tl), st = Math.sin(tl);
    const at = (u, v, h) => P(ox + u * ct + h * st, oy + v, oz - u * st + h * ct);
    const shell = (prof) => { const o = []; for (const [r, h] of prof) for (const q of circ(r, 20)) o.push(at(q.u, q.v, h)); return hull(o); };
    tines.setAttribute("d", poly(shell([[5, 0], [11, 6], [11.5, 14], [8, 22], [5, 27]])));
    handle.setAttribute("d", poly(shell([[4.6, 27], [4.6, 54], [4, 56]])));
    let d = "";
    for (let k = -2; k <= 2; k++) {
      const a = 0.785 + k * 0.32, c = Math.cos(a), s = Math.sin(a), q = [[5, 1], [11, 7], [11.4, 14], [5, 26]];
      d += "M" + q.map(([r, h]) => at(r * c, r * s, h).map((n) => n.toFixed(1)).join(" ")).join("L");
    }
    lines.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const mid = P(BX / 2, BY / 2, 24);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a > 0 ? reach : 0, performance.now(), 0);
    read.textContent = a > 0 ? "whisk " + Math.round(reach * 100) : "rest";
    B.wake();
  }
  setActive(0);
  tines.classList.add("hi");
  handle.classList.add("hi");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 120 ? 1 : 0),
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "teawhisk",
  means: "A bamboo matcha whisk on its ceramic stand beside a tea bowl: the pointer lifts the whisk over the bowl and tilts it in.",
  rules: [1, 3, 5, 6],
  range: [40, 100, 100],
  tour: [[134, 67], [230, 230], [235, 300], null],
  mount,
});
