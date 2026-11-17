/**
 * Rain gauge: a clear graduated tube in a clip on a stake, set in a round of
 * soil, with rain standing in it. The pointer tips the tube out of its clip
 * on its foot, as you would to read and empty it. At rest it stands upright,
 * bright. The slider is how far it tips.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const TR = 8, TH = 74, SZ = 6, BR = 46, WL = 30;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, -14, SZ + TH + 10], [TH * 0.8, 0, SZ + TH * 0.65], [0, 0, SZ + TH + 6]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, BR, 40), disc(0, 0, BR - 4, 40), 0, SZ));
  // the stake behind the tube, with its clip
  const [sr, si] = rings(-3, -16, 3, -12, 0.5, 1);
  put(solid(g), prism(P, front, sr, si, SZ, SZ + TH + 8));
  const tube = mk("path", { class: "sil" }, g), mouth = mk("path", { class: "nf" }, g), water = mk("path", { class: "nf lo" }, g), ticks = mk("path", { class: "nf lo" }, g);
  const t = tween(0);
  // tip about the tube's foot, toward +x
  const rot = (x, y, z, a) => { const dz = z - SZ; return P(x * Math.cos(a) + dz * Math.sin(a), y, SZ - x * Math.sin(a) + dz * Math.cos(a)); };
  const ring = (r, z, a, n = 28) => circ(r, n).map((q) => rot(q.u, q.v, z, a));
  let last = NaN;
  function draw(f) {
    if (f === last) return;
    last = f;
    const a = f * 1.05;
    tube.setAttribute("d", poly(hull(ring(TR, SZ, a).concat(ring(TR, SZ + TH, a), ring(TR + 2, SZ + TH, a), ring(TR + 2, SZ + TH - 4, a)))));
    mouth.setAttribute("d", poly(ring(TR + 2, SZ + TH, a)) + "Z");
    water.setAttribute("d", poly(ring(TR - 0.5, SZ + WL * (1 - 0.6 * f), a)) + "Z");
    let d = "";
    for (let i = 1; i < 9; i++) { const z = SZ + i * 8, w = i % 2 ? 0.35 : 0.6; d += "M" + rot(TR * Math.cos(-0.2), TR * Math.sin(-0.2), z, a).join(",") + "L" + rot(TR * Math.cos(w), TR * Math.sin(w), z, a).join(","); }
    ticks.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const mid = P(0, 0, SZ + TH / 2);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? 0.35 + 0.65 * amt : 0, performance.now(), 0);
    read.textContent = a ? "read" : "rest";
    B.wake();
  }
  tube.classList.add("hi");
  setActive(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setActive(Math.hypot(sx - mid[0], sy - mid[1]) < 85), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, 0.35 + 0.65 * amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "watercan2",
  means: "A rain gauge tube clipped to a stake in the soil: the pointer tips the graduated tube out on its foot to read and empty it.",
  rules: [3, 4, 5, 6],
  range: [0, 1, 1],
  tour: [[200, 127], [175, 100], [225, 170], null],
  mount,
});
