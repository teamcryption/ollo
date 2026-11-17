/**
 * Oarlock: a forked rowlock on its pin in a gunwale socket, an oar resting
 * in the fork. The rowlock swivels on its pin toward the pointer, carrying
 * the oar round with it; leaving lets it settle at a slight angle. The slider
 * is the widest swivel.
 *
 * The pattern: one part turning to face the pointer (swivel).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, circ, clamp, rad, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const GL = 90, PX = 45, PY = 0, B0 = 62, REST = 10, HW = 6, ZB = 14, ZO = 22;
const disc = (x, y, r) => circ(r, 24).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.9);
  const end = (a, t) => [PX + Math.cos(rad(a)) * t, PY + Math.sin(rad(a)) * t, ZO];
  fit(C, [[0, -7, 0], [GL, 7, 0], [GL, -7, 0], [0, 7, 0], end(B0 - 50, 74), end(B0 + 50, 74), end(B0 - 50, -36), end(B0 + 50, -36), [PX, PY, ZO + 12]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [gr, gi] = rings(0, -7, GL, 7, 4, 1.8);
  put(solid(g), prism(P, front, gr, gi, 0, 10));
  put(solid(g), prism(P, front, disc(PX, PY, 4.5), disc(PX, PY, 3), 10, 12.5));
  const lock = mk("g", {}, g), hornA = mk("path", { class: "sil hi" }, lock), base = mk("path", { class: "sil hi" }, lock);
  const oar = mk("path", { class: "sil" }, lock), blade = mk("path", { class: "sil" }, lock), hornB = mk("path", { class: "sil hi" }, lock);

  function tube(a, b, r) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d), u = d.map((v) => v / n);
    const p = Math.abs(u[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
    let e1 = [u[1] * p[2] - u[2] * p[1], u[2] * p[0] - u[0] * p[2], u[0] * p[1] - u[1] * p[0]];
    const m = Math.hypot(...e1); e1 = e1.map((v) => v / m);
    const e2 = [u[1] * e1[2] - u[2] * e1[1], u[2] * e1[0] - u[0] * e1[2], u[0] * e1[1] - u[1] * e1[0]];
    const pts = [];
    for (const c of [a, b]) for (let k = 0; k < 16; k++) { const t = (k / 16) * Math.PI * 2, cs = Math.cos(t) * r, sn = Math.sin(t) * r; pts.push(P(c[0] + e1[0] * cs + e2[0] * sn, c[1] + e1[1] * cs + e2[1] * sn, c[2] + e1[2] * cs + e2[2] * sn)); }
    return poly(hull(pts));
  }
  const sw = spring(REST);
  let last = NaN;
  function draw(da) {
    if (da === last) return;
    last = da;
    const a = rad(B0 + da), c = Math.cos(a), s = Math.sin(a), nx = -s * HW, ny = c * HW;
    const hA = [PX + nx, PY + ny], hB = [PX - nx, PY - ny];
    hornA.setAttribute("d", tube([...hA, ZB], [...hA, ZO + 6], 1.7));
    hornB.setAttribute("d", tube([...hB, ZB], [...hB, ZO + 6], 1.7));
    base.setAttribute("d", tube([...hA, ZB], [...hB, ZB], 2.2) + tube([PX, PY, 11], [PX, PY, ZB], 2));
    oar.setAttribute("d", tube(end(B0 + da, -36), end(B0 + da, 46), 2.3));
    const bw = 7, b0 = end(B0 + da, 44), b1 = end(B0 + da, 74), bl = [];
    for (const q of [b0, b1]) for (const sgn of [-1, 1]) for (const z of [-1, 1]) bl.push(P(q[0] + sgn * -s * bw, q[1] + sgn * c * bw, q[2] + z * 0.8));
    blade.setAttribute("d", poly(hull(bl)));
    const fA = hA[0] + hA[1] > hB[0] + hB[1];
    (fA ? hornA : hornB).parentNode.appendChild(fA ? hornA : hornB);
    lock.insertBefore(fA ? hornB : hornA, base);
  }

  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(sw.x); return m; });
  bag.add(B.unregister);

  const piv = P(PX, PY, ZO);
  function move([sx, sy]) {
    const inside = Math.abs(sx - piv[0]) < 180 && Math.abs(sy - piv[1]) < 130;
    sw.t = inside ? clamp(((piv[0] - sx) / 110) * maxA, -maxA, maxA) : REST;
    read.textContent = inside ? Math.round(sw.t) + "°" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave: () => { sw.t = REST; read.textContent = "rest"; B.wake(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = clamp(v, 20, 50); }, destroy: bag.dispose };
}

hairline({
  name: "oarlock",
  means: "A forked rowlock on its gunwale pin with an oar in it: the lock swivels toward the pointer, carrying the oar round.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 50],
  tour: [[66, 163], [148, 112], [333, 204], null],
  mount,
});
