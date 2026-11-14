/**
 * Meteor: a rough rock hangs high over a cratered slab, a dashed trail
 * behind it. Over the slab the rock falls into the crater, and the chips
 * round the rim kick up, staggered outward from the near side. At rest the
 * rock is high and bright. The slider is the stagger.
 *
 * The pattern: one discrete state on the long ease.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj, seg,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 46, SZ = 6, HIGH = 92, LOW = SZ + 6, MX = 34, MY = -6;
const at = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const rock = (r) => circ(r, 7).map((q, i) => ({ ...q, u: q.u * (1 + 0.22 * Math.sin(i * 2.3)), v: q.v * (1 + 0.18 * Math.cos(i * 1.7)) }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-W, -W, 0], [W, W, 0], [W, -W, 0], [-W, W, 0], [MX + 14, MY - 20, HIGH + 16], [MX + 30, MY - 30, HIGH + 40]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-W, -W, W, W, 10, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));
  const rim = solid(g);
  put(rim, prism(P, front, circ(26, 48), circ(23, 48), SZ, SZ + 3));
  mk("path", { d: poly(ringAt(P, circ(16, 40), SZ + 2)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, circ(8, 32), SZ + 1)), class: "nf lo" }, g);

  const chips = [];
  for (let i = 0; i < 6; i++) {
    const a = rad0(i), x = 34 * Math.cos(a), y = 34 * Math.sin(a), grp = mk("g", {}, g), s = solid(grp);
    chips.push({ x, y, s, a, z: tween(0), last: NaN, near: x + y });
  }
  chips.sort((p, q) => p.near - q.near).forEach((c) => g.appendChild(c.s.g.parentNode));
  function rad0(i) { return (i / 6) * Math.PI * 2 + 0.4; }

  const tr = mk("path", { class: "dash nf" }, g);
  const met = solid(mk("g", {}, g));
  const R1 = rock(9), R2 = rock(12), R3 = rock(7);
  const m = { z: tween(HIGH), last: NaN };

  function drawMet(z) {
    if (z === m.last) return;
    m.last = z;
    const t = (z - LOW) / (HIGH - LOW), x = MX * t, y = MY * t;
    const pts = ringAt(P, at(R3, x, y), z - 9).concat(ringAt(P, at(R2, x, y), z), ringAt(P, at(R1, x + 1, y), z + 9));
    met.sil.setAttribute("d", poly(hull(pts)));
    met.cr.setAttribute("d", poly(ringAt(P, at(rock(6), x + 1, y), z + 8)));
    met.cr.setAttribute("class", "nf lo");
    tr.setAttribute("d", seg(P(x + 9, y - 6, z + 6), P(x + 9 + 30 * t, y - 6 - 18 * t, z + 6 + 50 * t)) + seg(P(x - 2, y - 10, z + 2), P(x - 2 + 22 * t, y - 10 - 14 * t, z + 2 + 38 * t)));
  }
  function drawChip(c, z) {
    if (z === c.last) return;
    c.last = z;
    const x = c.x * (1 + z * 0.012), y = c.y * (1 + z * 0.012);
    put(c.s, prism(P, front, at(rock(3.2), x, y), at(rock(2), x, y), SZ + z, SZ + z + 3.4));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    drawMet(tval(m.z, now)); if (!tdone(m.z, now)) moving = true;
    for (const c of chips) { drawChip(c, tval(c.z, now)); if (!tdone(c.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(m.z, on ? LOW : HIGH, now, 0);
    chips.forEach((c) => tset(c.z, on ? 14 : 0, now, on ? 260 + (c.near + 34) / 68 * 4 * stag : 0));
    met.sil.classList.toggle("hi", !on);
    rim.sil.classList.toggle("hi", on);
    read.textContent = on ? "impact" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, 0); setActive(Math.abs(x) < W && Math.abs(y) < W); },
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "meteor",
  means: "A rock hangs over a cratered slab: over the slab it falls into the crater, and the chips round the rim kick up outward.",
  rules: [1, 2, 4, 5, 8],
  range: [0, 40, 90],
  tour: [[144, 203], [195, 228], [144, 254], null],
  mount,
});
