/**
 * Patch panel: a rack panel with two rows of eight ports and its mounting
 * ears, most ports patched with short cable loops from the top row to the
 * bottom. The pointer picks a plug on the panel's face: it pulls out of its
 * port and its cable lifts, the plugs beside it ease out a little. At rest
 * one plug stands half pulled, bright. The slider is the stagger.
 *
 * The pattern: one of many on a face; tweens per plug, the hit read on the
 * panel's face plane (y = D), which never moves.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 8, PW = 11, M = 10, H = 26, D = 6, ZR = [17.5, 8.5], L = 4, OUT = 14, FAV = 2;
const W = 2 * M + NC * PW, LOOP = [9, 13, 0, 11, 15, 10, 0, 12];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[0, 0, 0], [W, D, 0], [W, 0, H], [0, 0, H], [M, D + L + OUT + 20, 0], [W - M, D + L + 22, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const onFace = (q) => P(q.u, D, q.v);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, W, D, 2, 1);
  put(solid(g), prism(P, front, pr, pi, 0, H));
  for (const ex of [4, W - 4]) for (const ez of [6, H - 6]) mk("path", { d: poly(rrect(ex - 1.6, ez - 0.9, ex + 1.6, ez + 0.9, 0.9, 2).map(onFace)), class: "nf lo" }, g);

  const plugs = [];
  for (let c = 0; c < NC; c++) {
    const xm = M + c * PW + PW / 2;
    for (let r = 0; r < 2; r++) {
      mk("path", { d: poly(rrect(xm - 3, ZR[r] - 2.4, xm + 3, ZR[r] + 2.4, 0.8, 2).map(onFace)), class: "nf lo" }, g);
      if (LOOP[c]) plugs.push({ c, r, xm, z: ZR[r], i: r * NC + c, rest: r === 0 && c === FAV ? 4.5 : 0.4 });
    }
  }
  // per column: the bottom plug, the top plug, then the cable joining them
  const cols = [];
  for (let c = 0; c < NC; c++) {
    if (!LOOP[c]) continue;
    const top = plugs.find((p) => p.c === c && p.r === 0), bot = plugs.find((p) => p.c === c && p.r === 1);
    for (const p of [bot, top]) { p.el = solid(g); p.s = tween(p.rest); }
    cols.push({ c, top, bot, cable: mk("path", { class: "nf sil" }, g), last: "" });
  }

  function cable(col, a, b) {
    const x = col.top.xm, y0 = D + L + a, y1 = D + L + b, ext = LOOP[col.c] + a * 0.6, lift = a * 1.4;
    const pts = [];
    for (let k = 0; k <= 20; k++) {
      const t = k / 20, u = 1 - t;
      const y = u * u * u * y0 + 3 * u * u * t * (y0 + ext) + 3 * u * t * t * (y1 + ext) + t * t * t * y1;
      const z = u * u * u * col.top.z + 3 * u * u * t * (col.top.z + lift) + 3 * u * t * t * (col.bot.z - 4) + t * t * t * col.bot.z;
      pts.push(P(x, y, z));
    }
    return open(pts);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const col of cols) {
      const a = tval(col.top.s, now), b = tval(col.bot.s, now), key = a + "," + b;
      if (key !== col.last) {
        col.last = key;
        for (const [p, s] of [[col.top, a], [col.bot, b]]) {
          const [rr, ri] = rings(p.xm - 2.4, D, p.xm + 2.4, D + L + s, 0.8, 0.5);
          put(p.el, prism(P, front, rr, ri, p.z - 1.8, p.z + 1.8));
        }
        col.cable.setAttribute("d", cable(col, a, b));
      }
      if (!tdone(col.top.s, now) || !tdone(col.bot.s, now)) moving = true;
    }
    return moving;
  });
  bag.add(B.unregister);

  /** The plug under the point, read on the face plane (y = D), which never moves. */
  function hit([sx, sy]) {
    const c = Math.cos(C.az), s = Math.sin(C.az), zf = Math.sqrt(1 - C.k * C.k);
    const x = ((sx - C.ox) / C.S + D * s) / c, Y = x * s + D * c, z = (Y * C.k - (sy - C.oy) / C.S) / zf;
    if (x < M || x > W - M || z < 3 || z > H - 3) return null;
    const col = clamp(Math.floor((x - M) / PW), 0, NC - 1), row = z > 13 ? 0 : 1;
    return plugs.find((p) => p.c === col && p.r === row) || null;
  }

  let act;
  const fav = plugs.find((p) => p.r === 0 && p.c === FAV);
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a || act;
    act = a;
    for (const p of plugs) {
      const d = a ? Math.abs(p.c - a.c) + Math.abs(p.r - a.r) : 0;
      tset(p.s, !a ? p.rest : d === 0 ? OUT : d === 1 ? 1.6 : 0.4, now, from ? (Math.abs(p.c - from.c) + Math.abs(p.r - from.r)) * stag : 0);
      p.el.sil.classList.toggle("hi", p === (a || fav));
    }
    read.textContent = a ? `port ${a.i + 1}` : "rest";
    B.wake();
  }
  setActive(null);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "patchpanel",
  means: "A rack patch panel with looped cables: the plug under the pointer pulls out of its port and its cable lifts.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[156, 129], [246, 174], [286, 214], null],
  mount,
});
