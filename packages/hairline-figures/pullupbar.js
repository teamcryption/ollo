/**
 * Pull-up bar: a free-standing frame of two posts on splayed feet, each
 * post drilled with a column of height holes, and a bar with two foam grips
 * pinned between them. The pointer picks a height by where it stands along
 * the posts: the bar slides to that pair of holes. At rest the bar sits at
 * the fourth hole, bright. The slider spreads the grips apart.
 *
 * The pattern: one value chosen from a column (a tween between stops).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 84, PH = 116, HZ = [56, 66, 76, 86, 96, 106], REST = 3, BR = 2.4, GR = 3.6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let grip = value;
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-4, -22, 0], [L + 4, 22, 0], [L + 4, -22, 0], [-4, 22, 0], [0, 0, PH], [L, 0, PH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tube = (parent, x0, x1, r, z, cls) => {
    const pts = [];
    for (const x of [x0, x1]) for (let i = 0; i < 24; i++) { const t = (i / 24) * 2 * Math.PI; pts.push(P(x, r * Math.cos(t), z + r * Math.sin(t))); }
    return mk("path", { d: poly(hull(pts)), class: cls }, parent);
  };
  const holes = [];
  function post(x) {
    const [fr, fi] = rings(x - 3, -22, x + 3, 22, 3, 1);
    put(solid(g), prism(P, front, fr, fi, 0, 4));
    const [pr, pi] = rings(x - 3, -3, x + 3, 3, 1.6, 0.8);
    put(solid(g), prism(P, front, pr, pi, 4, PH));
    holes.push(HZ.map((z) => { const d = mk("circle", { r: 1.5, class: "dot off" }, g), p = P(x, 3, z); d.setAttribute("cx", p[0]); d.setAttribute("cy", p[1]); return d; }));
  }
  post(0);
  const barG = mk("g", {}, g);
  post(L);
  const bar = { z: tween(HZ[REST]), last: NaN, lastG: NaN };

  function draw(z) {
    if (z === bar.last && grip === bar.lastG) return;
    bar.last = z; bar.lastG = grip;
    barG.replaceChildren();
    const sil = tube(barG, 3, L - 3, BR, z, "sil hi");
    const m = L / 2, half = 6 + grip * 0.28;
    tube(barG, m - half - 12, m - half, GR, z, "");
    tube(barG, m + half, m + half + 12, GR, z, "");
    return sil;
  }

  const B = register(stage, (_dt, now) => { draw(tval(bar.z, now)); return !tdone(bar.z, now); });
  bag.add(B.unregister);

  const mids = HZ.map((z) => { const a = P(0, 0, z), b = P(L, 0, z); return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; });
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 48 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const h = a < 0 ? REST : a;
    tset(bar.z, HZ[h], performance.now(), 0);
    holes.forEach((col) => col.forEach((d, k) => d.setAttribute("class", k === h ? "dot m" : "dot off")));
    read.textContent = a < 0 ? "rest" : "hole " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { grip = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "pullupbar",
  means: "A pull-up bar pinned between two drilled posts: the bar slides to the pair of holes nearest the pointer.",
  rules: [1, 4, 5, 8],
  range: [0, 30, 60],
  tour: [[200, 120], [200, 150], [200, 100], null],
  mount,
});
