/**
 * Eye test: an optician's lightbox on a low plinth, its face a chart of dot
 * rows that grow smaller and longer down the face. The pointer picks a row by
 * its height: that row lights, and the pointer tab on the box's edge slides
 * to it. At rest the third row is lit. The slider is the tab's travel time.
 *
 * The pattern: one of many in a single column (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const D = 14, W = 64, Z0 = 12, Z1 = 104, ROWS = [[1, 6], [2, 4.6], [3, 3.6], [4, 2.8], [5, 2.2], [6, 1.7]], FAV = 2;
const rowZ = (k) => Z1 - 14 - k * 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dur = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-8, -8, 0], [D + 14, W + 8, 0], [D + 14, -8, 0], [-8, W + 8, 0], [0, 0, Z1], [D, W, Z1]], 200, 166);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [pr, pi] = rings(-8, -8, D + 14, W + 8, 5, 2);
  put(solid(g), prism(P, front, pr, pi, 0, Z0 - 4));
  const [br, bi] = rings(0, 0, D, W, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, Z0 - 4, Z1));
  // the lit panel: a recessed rectangle on the face toward the viewer (x = D)
  mk("path", { d: poly([[6, Z0 + 4], [W - 6, Z0 + 4], [W - 6, Z1 - 4], [6, Z1 - 4]].map(([y, z]) => P(D, y, z))), class: "nf lo" }, g);
  const rows = ROWS.map(([n, r], k) => {
    const z = rowZ(k), dots = [];
    for (let j = 0; j < n; j++) {
      const y = W / 2 + (j - (n - 1) / 2) * Math.min(2.6 * r + 3, 46 / Math.max(n - 1, 1));
      const pts = [];
      for (let s = 0; s < 14; s++) { const t = (s / 14) * 2 * Math.PI; pts.push(P(D, y + r * Math.cos(t), z + r * Math.sin(t))); }
      dots.push(mk("path", { d: poly(pts), class: "dot off" }, g));
    }
    return { z, dots, mid: P(D, W / 2, z) };
  });
  // the tab rides the near edge of the box, outside the panel
  const tab = solid(g);
  const [tr, ti] = rings(D - 6, W, D, W + 7, 2, 0.8);
  const tz = tween(rowZ(FAV));
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    put(tab, prism(P, front, tr, ti, z - 3, z + 3));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tz, now)); return !tdone(tz, now); });
  bag.add(B.unregister);

  const xa = P(D, 0, Z0)[0], xb = P(D, W + 7, Z0)[0], left = Math.min(xa, xb) - 10, right = Math.max(xa, xb) + 10;
  function hit([sx, sy]) {
    if (sx < left || sx > right) return -1;
    let best = -1, bd = Infinity;
    rows.forEach((r, k) => { const dd = Math.abs(r.mid[1] - (sx - r.mid[0]) * 0.5 - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 14 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const on = a < 0 ? FAV : a;
    rows.forEach((r, k) => r.dots.forEach((d) => d.setAttribute("class", k === on ? "dot" : "dot off")));
    tset(tz, rowZ(on), performance.now(), 0);
    tz.dur = dur;
    read.textContent = a < 0 ? "rest" : "row " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { dur = v; }, destroy: bag.dispose };
}

hairline({
  name: "eyechartbox",
  means: "An optician's lightbox of dot rows, smaller further down: the row under the pointer lights and the edge tab slides to it.",
  rules: [1, 4, 5, 8],
  range: [400, 700, 1000],
  tour: [[206, 96], [206, 170], [206, 202], null],
  mount,
});
