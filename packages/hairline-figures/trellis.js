/**
 * Trellis: a fan trellis standing in a planter, seven slats pinned at the
 * foot. The pointer over it fans the slats open, wider the higher up the
 * pointer goes. At rest the fan is half closed, its middle slat bright. The
 * slider is the widest spread.
 *
 * The pattern: parts turning about one pivot (fan).
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rad, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, LEN = 120, SW = 2.6, PZ = 26, REST = 46;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-40, -14, 0], [40, 14, 0], [-LEN * 0.8, 0, PZ + LEN * 0.6], [LEN * 0.8, 0, PZ + LEN * 0.6], [0, 0, PZ + LEN + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-30, -12, 30, 12, 4, 2);
  const slats = [];
  for (let k = 0; k < N; k++) {
    const sg = mk("g", {}, g);
    slats.push({ k, sil: mk("path", { class: "sil" + (k === 3 ? " hi" : "") }, sg) });
  }
  const tie = mk("path", { class: "nf lo" }, g);
  put(solid(g), prism(P, front, pr, pi, 0, PZ + 4));
  mk("path", { d: poly(ringAt0()), class: "nf lo" }, g);
  function ringAt0() { const q = []; for (const [x, y] of [[-27, -9], [27, -9], [27, 9], [-27, 9]]) q.push(P(x, y, PZ + 4)); return q; }
  const ang = spring(REST);
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const tp = [];
    for (const s of slats) {
      const th = rad(((s.k - 3) / 3) * (a / 2)), sn = Math.sin(th), cs = Math.cos(th);
      const at = (u, v, w) => P(u * sn + v * cs, w, PZ + u * cs - v * sn);
      const L = LEN * (1 - Math.abs(s.k - 3) * 0.04), pts = [];
      for (const u of [0, L]) for (const v of [-SW, SW]) for (const w of [-1.2, 1.2]) pts.push(at(u, v, w));
      s.sil.setAttribute("d", poly(hull(pts)));
      tp.push(at(L * 0.62, 0, 1.2));
      s.top = at(L * 0.86, 0, 1.2);
    }
    let d = "";
    for (let k = 0; k < N - 1; k++) d += "M" + tp[k].join(",") + "L" + tp[k + 1].join(",") + "M" + slats[k].top.join(",") + "L" + slats[k + 1].top.join(",");
    tie.setAttribute("d", d);
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  let tgt = null, lastP = null;
  function spread(p) {
    lastP = p;
    let a = REST;
    if (p) {
      
      const top = P(0, 0, PZ + LEN)[1], base = P(0, 0, PZ)[1];
      if (Math.abs(p[0] - P(0, 0, PZ)[0]) < 150 && p[1] > top - 20 && p[1] < base + 40) a = maxA * clamp((base + 40 - p[1]) / (base + 40 - top), 0.35, 1);
    }
    a = Math.round(a);
    if (a === tgt) return;
    tgt = a;
    ang.t = a;
    read.textContent = !p || a === REST ? "rest" : "fan " + a + "°";
    B.wake();
  }
  spread(null);
  bag.add(pointer(stage, { move: spread, leave: () => spread(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; tgt = null; spread(lastP); }, destroy: bag.dispose };
}

hairline({
  name: "trellis",
  means: "A fan trellis in a planter: its seven slats, pinned at the foot, fan open as the pointer climbs it.",
  rules: [1, 3, 5, 6],
  range: [70, 100, 120],
  tour: [[200, 190], [180, 110], [200, 38], null],
  mount,
});
