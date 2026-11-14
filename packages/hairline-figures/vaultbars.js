/**
 * Gold bar stack: six tapered bars in a pyramid, three, two, one, on a vault
 * shelf. The pointer picks a layer by height: that layer slides forward out of
 * the stack and carries the layers above it, staggered from the one chosen.
 * At rest the top bar sits skewed forward, bright. The slider is the stagger.
 *
 * The pattern: stepped parts picked on their own rest tops (slide).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rings, ringAt, rrect, run, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BL = 40, BW = 17, BH = 11, TP = 2.6, GAP = 1.2, OUT = 26, REST = 9, SZ = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.85);
  const YW = 3 * BW + 2 * GAP;
  fit(C, [[-6, -6, 0], [BL + 6, YW + 6, 0], [BL + OUT + 4, -6, 0], [-6, YW + 6, 0], [BL + OUT, YW / 2, SZ + 3 * BH + 4], [0, YW / 2, SZ + 3 * BH + 4]], 200, 172);
  const P = proj(C), front = facing(C), g = mk("g", {}, svg);
  const [sr, si] = rings(-6, -6, BL + 6, YW + 6, 4, 1.6);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const layers = [];
  for (let i = 0; i < 3; i++) {
    const z0 = SZ + i * BH, bars = [];
    for (let j = 0; j < 3 - i; j++) {
      const y0 = i * (BW + GAP) / 2 + j * (BW + GAP);
      const grp = mk("g", {}, g), s = solid(grp), mark = mk("path", { class: "nf lo" }, grp);
      bars.push({ y0, s, mark });
    }
    layers.push({ i, z0, bars, off: tween(i === 2 ? REST : 0), last: NaN });
  }

  function drawBar(b, x, z0) {
    const foot = rrect(x, b.y0, x + BL, b.y0 + BW, 2, 4), top = rrect(x + TP, b.y0 + TP, x + BL - TP, b.y0 + BW - TP, 1.6, 4);
    const inner = rrect(x + TP + 1, b.y0 + TP + 1, x + BL - TP - 1, b.y0 + BW - TP - 1, 1, 4), z1 = z0 + BH;
    b.s.sil.setAttribute("d", poly(hull(ringAt(P, foot, z0).concat(ringAt(P, top, z1)))));
    b.s.cr.setAttribute("d", open(ringAt(P, run(inner, front), z1)));
    const m = [[x + 12, b.y0 + 5.5], [x + BL - 12, b.y0 + 5.5], [x + BL - 12, b.y0 + BW - 5.5], [x + 12, b.y0 + BW - 5.5]];
    b.mark.setAttribute("d", poly(m.map(([u, v]) => P(u, v, z1))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    // a layer rides on the ones below it: its x is the largest offset at or below it
    let carry = 0;
    for (const L of layers) {
      const x = Math.max(carry, tval(L.off, now));
      carry = x;
      const xr = Math.round(x * 10) / 10;
      if (xr !== L.last) { L.last = xr; L.bars.forEach((b) => drawBar(b, xr, L.z0)); }
      if (!tdone(L.off, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  // pick on each layer's rest top: the highest layer whose footprint holds the pointer
  function hit([sx, sy]) {
    for (let i = 2; i >= 0; i--) {
      const L = layers[i], z = L.z0 + BH, [wx, wy] = unproj(C, sx, sy, z);
      const y0 = L.bars[0].y0, y1 = L.bars[L.bars.length - 1].y0 + BW;
      if (wx > -4 && wx < BL + 4 && wy > y0 - 3 && wy < y1 + 3) return i;
    }
    const [wx, wy] = unproj(C, sx, sy, SZ);
    return wx > -6 && wx < BL + 10 && wy > -6 && wy < YW + 8 ? 0 : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    layers.forEach((L) => {
      const to = a < 0 ? (L.i === 2 ? REST : 0) : L.i === a ? OUT : 0;
      tset(L.off, to, now, from < 0 ? 0 : Math.abs(L.i - from) * stag);
      const lit = a < 0 ? L.i === 2 : L.i === a;
      L.bars.forEach((b) => b.s.sil.classList.toggle("hi", lit));
    });
    read.textContent = a < 0 ? "rest" : "tier " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "vaultbars",
  means: "A pyramid of gold bars: the tier under the pointer slides forward out of the stack, carrying the bars above it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[175, 112], [169, 142], [133, 188], null],
  mount,
});
