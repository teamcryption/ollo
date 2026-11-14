/**
 * Jump starter: a battery pack with a carry handle and two cable clamps lying
 * in front of it. The pointer picks a clamp by where it stands on the floor:
 * the clamp lifts on its cable and its jaws open, ready to bite a terminal.
 * At rest one clamp is half raised, bright. The slider is how far the jaws open.
 *
 * The pattern: pick by ground position (terrain), two parts.
 */
const {
  Cam, fit, facing, open, prism, proj, rings, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 60, BY = 38, BH = 32, CY = 62, LIFT = 22, FAV = 1;
const CX = [10, 50];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let gape = value;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-4, -2, 0], [BX + 4, -2, 0], [BX + 4, CY + 14, 0], [-4, CY + 14, 0], [0, 0, BH + 10], [BX, CY, LIFT + 18]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const block = (parent, x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(parent); put(s, prism(P, front, o, i, z0, z1)); return s; };
  // the pack, its terminals' collar and its carry handle
  block(g, 0, 0, BX, BY, 7, 1.8, 0, BH);
  block(g, 14, 15, 20, 23, 2, 0.8, BH, BH + 8);
  block(g, 40, 15, 46, 23, 2, 0.8, BH, BH + 8);
  block(g, 14, 15, 46, 23, 3, 1, BH + 8, BH + 11);
  for (let i = 0; i < 4; i++) { const [sx, sy] = P(8 + i * 5, BY, 8); mk("circle", { cx: sx, cy: sy, r: 1.1, class: i === 0 ? "dot m" : "dot off" }, g); }

  const items = CX.map((x, k) => {
    const grp = mk("g", {}, g);
    const cable = mk("path", { class: "nf lo" }, grp), lower = solid(grp), upper = solid(grp);
    return { k, x, cable, lower, upper, t: tween(k === FAV ? 0.5 : 0), last: NaN };
  });

  function draw(it, t) {
    const key = t + gape * 7;
    if (key === it.last) return;
    it.last = key;
    const z = LIFT * t, gap = 1 + 9 * gape * t, x = it.x, y = CY;
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const s = i / 12, sag = Math.sin(s * Math.PI) * (6 + 4 * (1 - t));
      pts.push(P(x + (x < 30 ? -8 : 8) * Math.sin(s * Math.PI), lerp(BY, y - 10, s), lerp(10, z + 1.5, s) - sag * (1 - s * 0.3) * 0.5));
    }
    it.cable.setAttribute("d", open(pts));
    put(it.lower, prism(P, front, ...rings(x - 4.5, y - 10, x + 4.5, y + 10, 3, 1), z, z + 3));
    put(it.upper, prism(P, front, ...rings(x - 4, y - 8, x + 4, y + 11, 3, 1), z + 3 + gap, z + 6 + gap));
  }
  const lerp = (a, b, s) => a + (b - a) * s;

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (wy < BY + 4 || wy > CY + 22) return -1;
    if (wx < -10 || wx > BX + 10) return -1;
    return wx < BX / 2 ? 0 : 1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    items.forEach((it, k) => {
      tset(it.t, a < 0 ? (k === FAV ? 0.5 : 0) : k === a ? 1 : 0, now, 0);
      const on = k === (a < 0 ? FAV : a);
      it.upper.sil.classList.toggle("hi", on);
      it.lower.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "neg −" : "pos +";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { gape = v; items.forEach((it) => { it.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "batterycharger",
  means: "A jump starter pack with two cable clamps: the clamp under the pointer lifts on its cable and opens its jaws.",
  rules: [1, 3, 5, 8],
  range: [0.2, 0.6, 1],
  tour: [[112, 218], [190, 257], [175, 265], null],
  mount,
});
