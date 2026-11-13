/**
 * Backpacks: a wall rack with a rail of pegs and four hiking packs of
 * different sizes hung on them by their haul loops, each with a top pocket
 * and straps down its front, one with a sleeping mat rolled under it. The
 * pointer picks a pack by where it hangs: it lifts off its peg and tilts,
 * and the packs beside it stir a little, staggered from it. At rest one pack
 * is half lifted, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the pack
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = [22, 17, 26, 15], HH = [34, 27, 40, 23], GAP = 7, D = 12, PEG = 56, LIFT = 9, FWD = 5, FAV = 2, MAT = 2;
const TILT = [-9, 8, -7, 10], REST = [0.06, 0, 0.45, 0.12];
const xs = []; { let x = 6; for (const w of W) { xs.push(x); x += w + GAP; } }
const X1 = xs[3] + W[3] + 6, ZT = PEG - 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-2, -4, 0], [X1 + 2, -4, 0], [X1 + 2, D + FWD + 4, 2], [-2, D + FWD + 4, 2], [-2, -4, PEG + 14], [X1 + 2, -4, PEG + 14], [X1 / 2, D + FWD, PEG + LIFT + 4]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [wr, wi] = rings(-2, -4, X1 + 2, 0, 1.5, 0.7);
  put(solid(g), prism(P, front, wr, wi, 0, PEG + 14));
  const [rr, ri] = rings(1, 0, X1 - 1, 2.6, 1, 0.5);
  put(solid(g), prism(P, front, rr, ri, PEG - 2, PEG + 4));

  const packs = W.map((w, k) => {
    const x0 = xs[k], xc = x0 + w / 2;
    const [pr, pi] = rings(xc - 1.4, 0, xc + 1.4, 6.5, 0.7, 0.35);
    put(solid(g), prism(P, front, pr, pi, PEG - 0.4, PEG + 2.4));
    const grp = mk("g", {}, g), loop = mk("path", { class: "nf" }, grp);
    const body = solid(grp), pocket = solid(grp), straps = mk("path", { class: "nf lo" }, grp);
    const mat = k === MAT ? { sil: mk("path", { class: "sil" }, grp), end: mk("path", { class: "nf lo" }, grp) } : null;
    return { k, w, x0, xc, zb: ZT - HH[k], grp, loop, body, pocket, straps, mat, t: tween(REST[k]), last: NaN };
  });

  function draw(p, t) {
    if (t === p.last) return;
    p.last = t;
    const a = rad(TILT[p.k] * t), c = Math.cos(a), s = Math.sin(a);
    const Q = (x, y, z) => { const dx = x - p.xc, dz = z - ZT; return P(p.xc + dx * c - dz * s, y + FWD * t, ZT + dx * s + dz * c + LIFT * t); };
    const x1 = p.x0 + p.w;
    p.loop.setAttribute("d", open([Q(p.xc - 2.6, 4, ZT), Q(p.xc - 1.8, 4, PEG + 3.2), Q(p.xc + 1.8, 4, PEG + 3.2), Q(p.xc + 2.6, 4, ZT)]));
    const [br, bi] = rings(p.x0, 1, x1, D, 5, 1.2);
    put(p.body, prism(Q, front, br, bi, p.zb, ZT));
    const [tr, ti] = rings(p.x0 + 1.5, 1.8, x1 - 1.5, D + 1.4, 4, 1);
    put(p.pocket, prism(Q, front, tr, ti, ZT - 5, ZT + 1.5));
    let d = "";
    for (const f of [0.28, 0.72]) d += seg(Q(p.x0 + p.w * f, D, ZT - 6), Q(p.x0 + p.w * f, D, p.zb + 2));
    d += seg(Q(p.x0 + 1.5, D, (ZT + p.zb) / 2 - 3), Q(x1 - 1.5, D, (ZT + p.zb) / 2 - 3));
    p.straps.setAttribute("d", d);
    if (p.mat) {
      const ring = (x) => { const o = []; for (let i = 0; i < 20; i++) { const b = (i / 20) * Math.PI * 2; o.push(Q(x, D / 2 + 1 + 4.5 * Math.cos(b), p.zb - 3.6 + 4.5 * Math.sin(b))); } return o; };
      const e0 = ring(p.x0 - 2), e1 = ring(x1 + 2);
      p.mat.sil.setAttribute("d", poly(hull(e0.concat(e1))));
      p.mat.end.setAttribute("d", poly(e1));
    }
  }

  const B = register(stage, (_dt, now) => {
    let m = false;
    for (const p of packs) { draw(p, tval(p.t, now)); if (!tdone(p.t, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  const mids = packs.map((p) => P(p.xc, D, (ZT + p.zb) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    packs.forEach((p, k) => {
      const d = Math.abs(k - a), t = a < 0 ? REST[k] : d === 0 ? 1 : d === 1 ? 0.22 : 0.06;
      tset(p.t, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.body.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pack " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "backpacks",
  means: "Four hiking packs on a wall rack: the pack under the pointer lifts off its peg and tilts, its neighbours stir a little.",
  rules: [1, 2, 5, 8],
  range: [0, 45, 90],
  tour: [[122, 135], [219, 193], [268, 198], null],
  mount,
});
