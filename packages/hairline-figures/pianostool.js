/**
 * Piano stool: a round cushioned seat on a threaded screw column over a
 * four-footed base. The pointer's height over the stage sets the seat's
 * height: the seat winds up or down the screw, turning as it goes, so the
 * buttons on its cushion swing round. At rest the seat sits mid-height,
 * its rim bright. The slider is how far the screw reaches.
 */
const { Cam, circ, clamp, fit, facing, prism, proj, ringAt, rings, spring, stepS, rad, disposer, mk, pointer, put, register, solid, flatDot, place, r2 } = HL;

const SR = 30, CR = 6, FOOT = 5, LO = 30, HI = 66, REST = 44, TURN = 9;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 90;
  const C = Cam(45, 0.5, 2.75);
  fit(C, [[-46, -46, 0], [46, 46, 0], [46, -46, 0], [-46, 46, 0], [-SR, -SR, HI + 14], [SR, SR, HI + 14]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // four feet, painted far to near
  const feet = [[-34, 0], [0, -34], [34, 0], [0, 34]].sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  const legs = mk("g", {}, g);
  for (const [fx, fy] of feet) {
    const [r, i] = rings(Math.min(fx, 0) - 4, Math.min(fy, 0) - 4, Math.max(fx, 0) + 4, Math.max(fy, 0) + 4, 4, 1.2);
    put(solid(legs), prism(P, front, r, i, 0, FOOT));
  }
  put(solid(g), prism(P, front, disc(11), disc(9.5), 0, FOOT + 4));
  const col = solid(g), threads = mk("path", { class: "nf lo" }, g);
  const seat = solid(g), dots = [0, 1, 2].map(() => flatDot(g, C, 1.6, "dot off"));
  seat.sil.classList.add("hi");

  const h = spring(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(col, prism(P, front, disc(CR, 24), disc(CR - 1.2, 24), FOOT + 4, z));
    let d = "";
    for (let t = FOOT + 8; t < z - 2; t += 4) d += "M" + ringAt(P, disc(CR, 24), t).filter((_, k) => k >= 3 && k <= 15).map((p) => p.map(r2).join(",")).join("L");
    threads.setAttribute("d", d);
    put(seat, prism(P, front, disc(SR, 48), disc(SR - 2.2, 48), z, z + 12));
    const a = rad(z * TURN);
    dots.forEach((el, k) => { const b = a + (k * 2 * Math.PI) / 3; place(el, P(14 * Math.cos(b), 14 * Math.sin(b), z + 12)); });
  }

  const B = register(stage, (dt) => { const m = stepS(h, dt); draw(h.x); return m; });
  bag.add(B.unregister);

  function aim(t) {
    h.t = t;
    read.textContent = t === REST ? "rest" : "h " + Math.round(t);
    B.wake();
  }
  aim(REST);
  bag.add(pointer(stage, {
    move: ([, sy]) => { const u = clamp((250 - sy) / 170, 0, 1); aim(Math.round(lerpH(u))); },
    leave: () => aim(REST),
  }));
  function lerpH(u) { const lo = REST - (REST - LO) * reach, hi = REST + (HI - REST) * reach; return lo + (hi - lo) * u; }
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 90; }, destroy: bag.dispose };
}

hairline({
  name: "pianostool",
  means: "A piano stool on a screw column: the pointer's height winds the seat up or down, and the seat turns as it climbs.",
  rules: [3, 5, 8, 9],
  range: [0, 60, 90],
  tour: [[200, 80], [200, 166], [200, 230], null],
  mount,
});
