/**
 * Trug: a shallow boat-shaped garden trug of bent slats, a long arched handle
 * running end to end and two pots of seedlings riding in it. The pointer
 * swings the handle down on its pivots to lie along the rim. At rest the
 * handle stands, bright. The slider is how far it swings.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const L = 52, W = 24, D = 16, HH = 40, ZB = 4;
const oval = (a, b, n = 48) => circ(1, n).map((q) => ({ ...q, u: q.u * a, v: q.v * b }));
const disc = (x, y, r, n = 20) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.5);
  const RZ = ZB + D;
  fit(C, [[-L - 4, -W - 4, 0], [L + 4, W + 4, 0], [L + 4, -W - 4, 0], [-L - 4, W + 4, 0], [0, 0, RZ + HH + 3], [0, HH + 3, RZ], [0, -HH - 3, RZ]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, oval(L * 0.7, W * 0.7), oval(L * 0.7 - 3, W * 0.7 - 3), 0, ZB));
  put(solid(g), prism(P, front, oval(L, W), oval(L - 2.5, W - 2.5), ZB, RZ));
  // slats: rings round the hull, and two pots riding inside
  for (const f of [0.35, 0.65]) mk("path", { d: poly(ringAt(P, oval(L * (0.75 + 0.25 * f), W * (0.75 + 0.25 * f)), ZB + D * f)) + "Z", class: "nf lo" }, g);
  for (const x of [-22, 18]) {
    put(solid(g), prism(P, front, disc(x, 0, 9), disc(x, 0, 7.5), RZ - 8, RZ + 4));
    mk("path", { d: "M" + P(x, 0, RZ + 3).join(",") + "L" + P(x, 0, RZ + 12).join(",") + "M" + P(x, 0, RZ + 9).join(",") + "L" + P(x + 4, 2, RZ + 13).join(",") + "M" + P(x, 0, RZ + 8).join(",") + "L" + P(x - 4, -2, RZ + 11).join(","), class: "nf" }, g);
  }
  const handle = mk("path", { class: "sil" }, g);
  const t = tween(0);
  // swing about the long axis through the pivots at the rim
  const rot = (x, h, a) => P(x, -h * Math.sin(a), RZ + h * Math.cos(a));
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const a = f * 1.45, o = [], i = [];
    for (let k = 0; k <= 24; k++) { const s = -1 + (2 * k) / 24, x = s * (L - 4), h = HH * Math.sqrt(1 - s * s); o.push(rot(x, h + 3, a)); i.unshift(rot(x * 0.96, Math.max(0, h - 1), a)); }
    handle.setAttribute("d", poly(o.concat(i)) + "Z");
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, RZ + 10);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 0.4 + 0.6 * amt : 0, performance.now(), 0);
    read.textContent = a ? "down" : "rest";
    B.wake();
  }
  handle.classList.add("hi");
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 90), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, 0.4 + 0.6 * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "trugbasket",
  means: "A shallow slatted garden trug with two seedling pots: the pointer swings its long arched handle down on its pivots to the rim.",
  rules: [3, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 109], [175, 92], [225, 145], null],
  mount,
});
