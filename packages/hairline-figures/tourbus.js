/**
 * Tour bus: an open-top double-decker on a stretch of road, its upper deck a
 * railed tub of seat rows, its lower deck a band of windows over two wheel
 * arches. The pointer on the road calls it: the bus drives along to stand
 * level with the pointer, then settles. At rest it waits off-centre, its top
 * rail bright.
 *
 * The pattern: one thing sliding along a track, picked on the road plane.
 */
const {
  Cam, clamp, fit, facing, open, poly, prism, proj, rings, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BL = 96, BW = 28, Z0 = 8, Z1 = 36, Z2 = 46, RX0 = -110, RX1 = 110, RY0 = -26, RY1 = 40, REST = -34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.45);
  fit(C, [[RX0, RY0, 0], [RX1, RY1, 0], [RX1, RY0, 0], [RX0, RY1, 0], [RX1 - 50, 0, Z2 + 4], [RX0 + 50, 0, Z2 + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(RX0, RY0, RX1, RY1, 8, 2);
  put(solid(g), prism(P, front, rr, ri, 0, 3));
  mk("path", { d: "M" + P(RX0 + 8, 34, 3).join(",") + "L" + P(RX1 - 8, 34, 3).join(","), class: "dash nf" }, g);
  const busG = mk("g", {}, g);
  const lower = solid(busG), upper = solid(busG);
  const detail = mk("path", { class: "lo nf" }, busG);
  const pos = spring(REST);
  let last = NaN;

  function draw(cx) {
    if (cx === last) return;
    last = cx;
    const x0 = cx - BL / 2, x1 = cx + BL / 2, y0 = -BW / 2, y1 = BW / 2;
    const [lr, li] = rings(x0, y0, x1, y1, 7, 1.6);
    put(lower, prism(P, front, lr, li, Z0, Z1));
    const [ur, ui] = rings(x0 + 2, y0 + 1, x1 - 1, y1 - 1, 6, 2.2);
    put(upper, prism(P, front, ur, ui, Z1, Z2));
    let d = "";
    const L = (a, b) => { d += "M" + a.join(",") + "L" + b.join(","); };
    // seat rows inside the open top
    for (let x = x0 + 14; x < x1 - 8; x += 12) L(P(x, y0 + 4, Z2), P(x, y1 - 4, Z2));
    // window band and door on the near side
    L(P(x0 + 6, y1, Z1 - 6), P(x1 - 4, y1, Z1 - 6));
    L(P(x0 + 6, y1, Z1 - 16), P(x1 - 4, y1, Z1 - 16));
    for (let x = x0 + 18; x < x1 - 6; x += 14) L(P(x, y1, Z1 - 6), P(x, y1, Z1 - 16));
    L(P(x1 - 2, y1 - 6, Z1 - 6), P(x1 - 2, y1 - 6, Z0 + 2));
    // wheel arches on the near side
    for (const wx of [x0 + 20, x1 - 20]) {
      const arc = [];
      for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI; arc.push(P(wx - 8 * Math.cos(t), y1, Z0 - 6 + 9 * Math.sin(t))); }
      d += open(arc);
      const tyre = [];
      for (let i = 0; i <= 10; i++) { const t = (i / 10) * Math.PI; tyre.push(P(wx - 6 * Math.cos(t), y1 + 0.5, Z0 - 8 + 8 * Math.sin(t))); }
      d += open(tyre);
    }
    detail.setAttribute("d", d);
  }

  const R = register(stage, (dt) => { const m = stepS(pos, dt); draw(pos.x); return m; });
  bag.add(R.unregister);

  const lim = RX1 - BL / 2 - 6;
  function call(p) {
    let on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      on = x > RX0 && x < RX1 && y > RY0 - 30 && y < RY1 + 30;
      if (on) pos.t = clamp(x * (0.4 + reach / 150), -lim, lim);
    }
    if (!on) pos.t = REST;
    upper.sil.classList.toggle("hi", !on);
    lower.sil.classList.toggle("hi", on);
    read.textContent = on ? (pos.t >= 0 ? "+" : "") + Math.round(pos.t) + " m" : "rest";
    R.wake();
  }
  call(null);
  bag.add(pointer(stage, { move: call, leave: () => call(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "tourbus",
  means: "An open-top tour bus on a road: it drives along to stand level with the pointer, and waits off-centre when left.",
  rules: [1, 3, 5, 8],
  range: [0, 45, 90],
  tour: [[279, 222], [100, 122], [200, 170], null],
  mount,
});
