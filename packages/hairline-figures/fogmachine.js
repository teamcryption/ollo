/**
 * Fog machine: a rounded box on two skids with a carry handle, and on its
 * front face a short nozzle. The pointer over the machine fires it: a cloud
 * of round puffs rolls out of the nozzle, each further out bigger and higher.
 * At rest a small puff hangs at the nozzle, bright. The slider is how far
 * the cloud rolls out.
 *
 * The pattern: one part answering (a push on the discrete clock); the hit is
 * on the machine's rest box, which never moves.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 6, BT = 32, NZ = 18, NR = 5.5, N = 5, REST = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = clamp(value, 36, 64);
  const C = Cam(45, 0.5, 2.65);
  fit(C, [[-30, -20, 0], [30, 20, 0], [30, -20, 0], [-30, 20, 0], [-10, 0, 46], [146, -8, 40], [120, 0, NZ + 46]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // skids, body, handle posts and bar
  for (const y of [-14, 10]) { const [r, i] = rings(-26, y, 26, y + 4, 1.8, 0.7); put(solid(g), prism(P, front, r, i, 0, BZ)); }
  const [br, bi] = rings(-28, -18, 28, 18, 7, 1.5);
  put(solid(g), prism(P, front, br, bi, BZ, BT));
  for (const x of [-16, 12]) { const [r, i] = rings(x, -2, x + 4, 2, 1.6, 0.6); put(solid(g), prism(P, front, r, i, BT, BT + 9)); }
  const [hr, hi] = rings(-17, -2.5, 17, 2.5, 2.4, 0.8);
  put(solid(g), prism(P, front, hr, hi, BT + 9, BT + 13));
  // a vent grille on the near side
  for (let k = 0; k < 4; k++) mk("path", { class: "nf lo", d: "M" + P(-18 + k * 6, 18, BZ + 7) + "L" + P(-18 + k * 6, 18, BT - 7) }, g);

  // the nozzle: a short horizontal can out of the front face, along +x
  const ringX = (x, r, cy, cz) => Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return P(x, cy + r * Math.cos(a), cz + r * Math.sin(a)); });
  mk("path", { class: "sil", d: poly(hull(ringX(26, NR + 1.5, 0, NZ).concat(ringX(31, NR + 1.5, 0, NZ)))) }, g);
  mk("path", { class: "sil", d: poly(hull(ringX(30, NR, 0, NZ).concat(ringX(42, NR - 1, 0, NZ)))) }, g);
  mk("path", { class: "nf lo", d: poly(ringX(42, NR - 2.4, 0, NZ)) }, g);

  // the puffs, far to near
  const puffs = Array.from({ length: N }, () => mk("path", { class: "sil" }, g));
  puffs[0].classList.add("hi");
  function sphere(c, r) {
    const o = P(c[0], c[1], c[2]), e = P(c[0] + r * 0.7071, c[1] - r * 0.7071, c[2]), R = Math.hypot(e[0] - o[0], e[1] - o[1]);
    return poly(Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return [o[0] + R * Math.cos(a), o[1] + R * Math.sin(a)]; }));
  }
  const tw = tween(REST);
  let last = NaN;
  function draw(d) {
    if (d === last) return;
    last = d;
    for (let j = 0; j < N; j++) {
      const f = (j + 1) / N, r = 4.5 + f * d * 0.3;
      const c = [46 + f * d + j * 2, (j % 2 ? 1 : -1) * f * 5, NZ + f * d * 0.32];
      puffs[j].setAttribute("d", sphere(c, r));
    }
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  // the hit: the machine and its cloud, as a rest box on screen
  const a0 = P(-30, 20, 0), a1 = P(30, -20, BT + 13), a2 = P(100, 0, NZ);
  function hit([sx, sy]) {
    return sx > a0[0] - 10 && sx < a2[0] + 20 && sy > a1[1] - 20 && sy < a0[1] + 30 ? 1 : -1;
  }
  let act = -2;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(tw, a < 0 ? REST : reach, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : "fog " + Math.round(reach);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 36, 64); setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "fogmachine",
  means: "A fog machine: the pointer fires it, and a cloud of round puffs rolls out of the nozzle, growing as it goes.",
  rules: [1, 3, 5, 6],
  range: [36, 50, 64],
  tour: [[103, 127], [160, 190], [234, 220], null],
  mount,
});
