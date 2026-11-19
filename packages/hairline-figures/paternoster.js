/**
 * Paternoster: a chain of open cabins in a shaft, rising in one column and
 * sinking in the other, the loop closing out of sight in the head housing
 * and under the floor. The pointer sets the chain running; the slider is how
 * far it goes. At rest one cabin, low in the up column, is bright.
 *
 * The pattern: one part answering the pointer (the cabin chain).
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CW = 24, GAP = 4, D = 22, CH = 26, PITCH = 36, ZT = 108, LC = ZT + CH + 10, N = 8;
const mod = (a, n) => ((a % n) + n) % n;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 1.9);
  const X1 = 2 * CW + GAP;
  const ext = [[-5, -9, ZT + 16], [X1 + 5, D + 5, -10], [X1 + 5, -9, ZT + 16], [-5, D + 5, -10]];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [ri, ii] = rings(x0, y0, x1, y1, r, b); put(solid(g), prism(P, front, ri, ii, z0, z1)); };
  box(-5, -9, X1 + 5, -5, 1.5, 1, 0, ZT);
  box(-5, -5, X1 + 5, D + 5, 3, 1.4, -10, 0);
  const cabs = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    cabs.push({ s, door: mk("path", { class: "lo nf" }, s.g) });
  }
  box(-5, -5, X1 + 5, D + 5, 3, 1.4, ZT, ZT + 16);
  const tw = tween(0.22);
  function draw(o) {
    const pos = [];
    for (let k = 0; k < N; k++) {
      const s = mod(k * PITCH + o, 2 * LC);
      const up = s < LC;
      pos.push({ k, col: up ? 0 : 1, z: up ? -CH - 5 + s : ZT + 5 - (s - LC) });
    }
    pos.sort((p, q) => p.col - q.col || p.z - q.z);
    pos.forEach((p, i) => {
      const c = cabs[i];
      c.s.sil.classList.toggle("hi", p.k === 1);
      const z0 = Math.max(p.z, 0), z1 = Math.min(p.z + CH, ZT);
      if (z1 - z0 < 2) { c.s.sil.setAttribute("d", ""); c.s.cr.setAttribute("d", ""); c.door.setAttribute("d", ""); return; }
      const x0 = p.col * (CW + GAP), x1 = x0 + CW;
      const [r, i2] = rings(x0, 0, x1, D, 2, 1);
      put(c.s, prism(P, front, r, i2, z0, z1));
      const d0 = Math.max(p.z + 2, z0 + 0.5), d1 = Math.min(p.z + CH - 3, z1 - 0.5);
      if (d1 - d0 < 3) { c.door.setAttribute("d", ""); return; }
      const pts = [P(x0 + 3, D, d0), P(x1 - 3, D, d0), P(x1 - 3, D, d1), P(x0 + 3, D, d1)];
      c.door.setAttribute("d", poly(fillet(pts, [1.5, 1.5, 1.5, 1.5])));
    });
  }
  let last = NaN;
  const B = register(stage, (_dt, now) => {
    const v = tval(tw, now);
    if (v !== last) { last = v; draw(v * PITCH); }
    return !tdone(tw, now);
  });
  bag.add(B.unregister);

  const pts = ext.map((w) => P(...w));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const hit = ([sx, sy]) => (sx < bx[0] - 6 || sx > bx[1] + 6 || sy < bx[2] - 6 || sy > bx[3] + 6 ? -1 : 0);
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? 0.22 : 0.22 + 1.5 * amp, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "run " + Math.round(15 * amp) / 10;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; if (act >= 0) setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "paternoster",
  means: "A paternoster lift: open cabins rise in one column and sink in the other; the pointer sets the chain running round its loop.",
  rules: [1, 3, 4, 5],
  range: [30, 100, 100],
  tour: [[179, 186], [214, 150], [190, 112], null],
  mount,
});
