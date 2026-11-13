/**
 * Pot rack: a hanging kitchen rail on two short chains from ceiling plates,
 * with five pans and pots hung from ring hooks, each on its own handle. The
 * pointer picks a pan by where it hangs along the rail: it swings out toward
 * the reader on its hook, and its neighbours swing a little, staggered from
 * it. At rest the pans hang unevenly, one already swung out, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the pan
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, clamp, fillet, fit, hull, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, SP = 27, X0 = 14, ZC = 24, FAV = 2;
const R = [10, 8, 12, 9, 11], DEP = [2.5, 9, 2.5, 8, 2.5], LH = [12, 6, 9, 6, 12], REST = [5, -3, 16, 2, -5];
const XL = 0, XR = X0 + (N - 1) * SP + 14;

/** A pan at swing angle th: its back and front rings, rim crease and handle, as world points. */
function pan(k, th) {
  const t = rad(th), x = X0 + k * SP, dy = Math.sin(t), dz = -Math.cos(t), ny = Math.cos(t), nz = Math.sin(t);
  const at = (L, off, dx) => [x + dx, dy * L + ny * off, dz * L + nz * off];
  const cL = 3 + LH[k] + R[k];
  const ring = (rr, off) => {
    const o = [];
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; o.push(at(cL + rr * Math.sin(a), off, rr * Math.cos(a))); }
    return o;
  };
  const ho = DEP[k] * 0.6;
  return {
    back: ring(R[k] * 0.84, 0), front: ring(R[k], DEP[k]), rim: ring(R[k] - 1.3, DEP[k]),
    handle: [at(3, ho, -1.2), at(3, ho, 1.2), at(3 + LH[k] + 2, ho, 1.7), at(3 + LH[k] + 2, ho, -1.7)],
    mid: at(cL, 0, 0),
  };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  const ext = [[XL, -5, ZC + 2], [XR, 5, ZC + 2], [XL, 5, -2], [XR, -5, -2]];
  for (let k = 0; k < N; k++) for (const th of [-6, 58]) { const p = pan(k, th); ext.push(...p.front, ...p.back); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // ceiling plates and chains of links, then the rail
  const links = [];
  for (const xc of [XL + 6, XR - 6]) {
    const [r, i] = rings(xc - 4, -4, xc + 4, 4, 4, 1.2);
    put(solid(g), prism(P, front, r, i, ZC, ZC + 2));
    for (let j = 0, z = 2.6; z < ZC - 1; j++, z += 3.6) {
      const pts = [];
      for (let s = 0; s < 14; s++) {
        const a = (s / 14) * Math.PI * 2, u = 1.1 * Math.cos(a), w = 2.2 * Math.sin(a);
        pts.push(P(xc + (j % 2 ? 0 : u), j % 2 ? u : 0, z + w));
      }
      links.push(poly(pts));
    }
  }
  mk("path", { class: "nf", d: links.join("") }, g);
  const [rr, ri] = rings(XL, -1.6, XR, 1.6, 1.6, 0.6);
  put(solid(g), prism(P, front, rr, ri, -1.6, 1.6));
  const hooks = [];
  for (let k = 0; k < N; k++) {
    const pts = [];
    for (let a = -90; a <= 125; a += 12) pts.push(P(X0 + k * SP, 3.2 * Math.cos(rad(a)), 3.2 * Math.sin(rad(a))));
    hooks.push(open(pts));
  }
  mk("path", { class: "nf", d: hooks.join("") }, g);

  const pans = R.map((_, k) => {
    const grp = mk("g", {}, g);
    return {
      k, grp, handle: mk("path", { class: "sil" }, grp), sil: mk("path", { class: "sil" }, grp),
      cr: mk("path", { class: "nf lo" }, grp), th: tween(REST[k]), last: NaN, y: 0,
    };
  });

  function draw(p, th) {
    if (th === p.last) return;
    p.last = th;
    const w = pan(p.k, th), pr = (a) => a.map((q) => P(...q));
    p.handle.setAttribute("d", poly(fillet(pr(w.handle), [0.8, 0.8, 1, 1], 3)));
    p.sil.setAttribute("d", poly(hull(pr(w.back).concat(pr(w.front)))));
    p.cr.setAttribute("d", poly(pr(w.rim)));
    p.y = w.mid[1];
  }

  let painted = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of pans) { draw(p, tval(p.th, now)); if (!tdone(p.th, now)) moving = true; }
    const order = pans.slice().sort((a, b) => a.k * SP + a.y * 1.2 - (b.k * SP + b.y * 1.2));
    const key = order.map((p) => p.k).join();
    if (key !== painted) { painted = key; for (const p of order) g.appendChild(p.grp); }
    return moving;
  });
  bag.add(B.unregister);

  /** The pan whose resting middle is nearest the pointer's x on screen, within its hanging height. */
  const cols = pans.map((p) => ({ top: P(X0 + p.k * SP, 0, 4), bot: P(X0 + p.k * SP, 0, -(3 + LH[p.k] + 2 * R[p.k]) - 2) }));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    cols.forEach((c, k) => { const m = (c.top[0] + c.bot[0]) / 2, d = Math.abs(m - sx); if (d < bd) { bd = d; best = k; } });
    const c = cols[best];
    return bd < 26 && sy > c.top[1] - 8 && sy < c.bot[1] + 8 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pans.forEach((p, k) => {
      const d = Math.abs(k - a), th = a < 0 ? REST[k] : d === 0 ? 55 : d === 1 ? 16 : d === 2 ? 6 : REST[k];
      tset(p.th, th, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      p.sil.classList.toggle("hi", on); p.handle.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "pan " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "potrack",
  means: "A hanging pot rack: the pan under the pointer swings out on its hook toward you, its neighbours swing a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[134, 168], [212, 216], [290, 252], null],
  mount,
});
