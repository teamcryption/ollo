/**
 * Twine dispenser: a round garden twine tin with a hinged cap, the ball of
 * twine inside and its end fed out through the hole in the cap. The pointer
 * swings the cap open on its back hinge to show the ball. At rest the cap is
 * shut, bright. The slider is how far it swings.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 26, H = 30, LH = 12, BR = 36;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, 0, H + LH + 6], [-R - LH - 4, 0, H + 2 * R + 4], [R, 0, H + LH]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, BR), disc(0, 0, BR - 4), 0, 3));
  put(solid(g), prism(P, front, disc(0, 0, R), disc(0, 0, R - 2.5), 3, H));
  // the twine ball sitting in the tin
  const ball = [];
  for (let i = 0; i <= 6; i++) { const th = (i / 6) * Math.PI / 2; ball.push(...ringAt(P, disc(0, 0, (R - 4) * Math.cos(th) + 0.01, 24), H - 6 + (R - 8) * Math.sin(th))); }
  mk("path", { d: poly(hull(ball)), class: "nf" }, g);
  for (const z of [H + 1, H + 5, H + 9]) mk("path", { d: poly(ringAt(P, disc(0, 0, Math.sqrt(Math.max(1, (R - 8) ** 2 - (z - H + 6) ** 2)) * 1.1, 24), z)) + "Z", class: "nf lo" }, g);
  const lid = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g), hole = mk("path", { class: "nf" }, g), strand = mk("path", { class: "nf" }, g);
  const t = tween(0);
  const rot = (x, y, z, a) => { const dx = x + R + 1, dz = z - H; return P(-R - 1 + dx * Math.cos(a) - dz * Math.sin(a), y, H + dx * Math.sin(a) + dz * Math.cos(a)); };
  const ring = (r, z, a, n = 36) => circ(r, n).map((q) => rot(q.u, q.v, z, a));
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const a = f * 1.9;
    lid.setAttribute("d", poly(hull(ring(R + 1, H, a).concat(ring(R + 1, H + LH, a)))));
    top.setAttribute("d", poly(ring(R + 1, H + LH, a)) + "Z");
    hole.setAttribute("d", poly(ring(3.5, H + LH, a, 16)) + "Z");
    const h = rot(0, 0, H + LH, a), e = P(14, 22, 3), m = [(h[0] + e[0]) / 2 + 30, (h[1] + e[1]) / 2 - 10];
    strand.setAttribute("d", "M" + h.join(",") + "Q" + m.join(",") + " " + e.join(","));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, H / 2);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 0.3 + 0.7 * amt : 0, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  lid.classList.add("hi");
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 75), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, 0.3 + 0.7 * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "twinedispenser",
  means: "A garden twine tin with its end fed through the cap: the pointer swings the cap open on its hinge to show the ball inside.",
  rules: [3, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 167], [175, 130], [225, 190], null],
  mount,
});
