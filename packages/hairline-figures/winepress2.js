/**
 * Wine thief: a barrel lying on two chocks, a glass wine thief standing in
 * its bung hole. The pointer over the barrel draws the thief: it slides up
 * out of the bung and tilts toward the viewer, a sample held in its bulb.
 * At rest the thief is bright, sitting in the bung. The slider is how far
 * it draws.
 *
 * The pattern: one part sliding out, then tilting.
 */
const {
  Cam, circ, fit, hull, poly, proj, ringAt, tdone, tset, tval, tween,
  disposer, mk, pointer, register,
} = HL;

const CZ = 30, BL = 34, L = 62;
const rad = (x) => 25 - 5 * (x / BL) ** 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-BL - 2, -26, 0], [BL + 2, 26, 0], [-BL, 0, CZ + 26], [BL, 0, CZ + 26], [0, 0, CZ + 25 + L + 30], [24, 0, CZ + 70], [-BL, 26, 0], [BL, -26, 0]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, z0, x1, y1, z1) => hull([x0, x1].flatMap((x) => [y0, y1].flatMap((y) => [z0, z1].map((z) => P(x, y, z)))));
  const ring = (x, r, a0 = 0, a1 = 2 * Math.PI, n = 36) => {
    const o = [];
    for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; o.push(P(x, r * Math.cos(a), CZ + r * Math.sin(a))); }
    return o;
  };
  const line = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join("L");

  for (const x of [-20, 20]) mk("path", { d: poly(box(x - 5, -22, 0, x + 5, 22, 12)) }, g);
  const body = [];
  for (let x = -BL; x <= BL; x += BL / 4) body.push(...ring(x, rad(x)));
  mk("path", { d: poly(hull(body)) }, g);
  mk("path", { d: poly(ring(BL, rad(BL))), class: "nf" }, g);
  // hoops: the near half of each band
  const th = Math.atan2(0.8, 0.7);
  for (const x of [-BL + 6, -12, 12]) mk("path", { d: line(ring(x, rad(x) + 0.4, th - 1.6, th + 1.6, 24)), class: "nf" }, g);
  mk("path", { d: poly(ringAt(P, circ(5, 20), CZ + 25)), class: "nf" }, g);
  const tube = mk("path", { class: "sil" }, g), bulb = mk("path", { class: "sil" }, g);

  const t = tween(0);
  let last = NaN;
  function draw(p) {
    if (p === last) return;
    last = p;
    const lift = 30 * Math.min(1, p * 1.6), tl = 0.75 * Math.max(0, p * 1.6 - 0.6) / 1;
    const bz = CZ + 23 + lift, ct = Math.cos(tl), st = Math.sin(tl);
    const at = (u, v, h) => P(u * ct + h * st, v, bz - u * st + h * ct);
    const shell = (prof) => {
      const o = [];
      for (const [r, h] of prof) for (const q of circ(r, 16)) o.push(at(q.u, q.v, h));
      return hull(o);
    };
    tube.setAttribute("d", poly(shell([[1.4, 0], [3, 5], [3, L - 4], [4.5, L - 4], [4.5, L]])));
    bulb.setAttribute("d", poly(shell([[3, 18], [7, 26], [7, 38], [3, 46]])));
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, CZ + 30);
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a > 0 ? reach : 0, performance.now(), 0);
    read.textContent = a > 0 ? "draw " + Math.round(reach * 100) : "rest";
    B.wake();
  }
  setActive(0);
  tube.classList.add("hi");
  bulb.classList.add("hi");
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 115 ? 1 : 0),
    leave: () => setActive(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (act > 0) { act = -2; setActive(1); } }, destroy: bag.dispose };
}

hairline({
  name: "winepress2",
  means: "A barrel on its chocks with a wine thief in the bung: the pointer draws the thief up out of the barrel and tilts it to the light.",
  rules: [1, 3, 5, 6],
  range: [40, 100, 100],
  tour: [[200, 122], [190, 220], [340, 290], null],
  mount,
});
