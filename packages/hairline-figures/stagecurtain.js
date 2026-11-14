/**
 * School stage: a raised platform with a back wall, a lectern, a valance and
 * two pleated curtains. The pointer picks a curtain by where it stands: that
 * curtain draws aside, its pleats bunching as it goes, and the other closes
 * back toward the middle. At rest the left curtain is half drawn, bright.
 * The slider is how far a curtain draws.
 *
 * The pattern: one of two in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 120, D = 46, SZ = 10, CY = 34, CH = 64, L = 84, NP = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let pull = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-6, -6, 0], [W + 6, D, 0], [W + 6, -6, 0], [-6, D, 0], [-6, -6, SZ + CH + 10], [W + 6, -6, SZ + CH + 10], [-6, CY, SZ + CH + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-6, -6, W + 6, D, 4, 1.5);
  put(solid(g), prism(P, front, pr, pi, 0, SZ));
  const [wr, wi] = rings(-4, -4, W + 4, 0, 1.5, 0.8);
  put(solid(g), prism(P, front, wr, wi, SZ, SZ + CH + 8));
  const [lr, li] = rings(31, 12, 45, 22, 2, 1.2);
  put(solid(g), prism(P, front, lr, li, SZ, SZ + 22));

  const sides = [0, 1].map((s) => {
    const grp = mk("g", {}, g);
    return { s, sheet: mk("path", { class: "sil" }, grp), folds: mk("path", { class: "nf lo" }, grp), w: tween(s === 0 ? 30 : 58), last: NaN };
  });
  const [vr, vi] = rings(-8, CY - 4, W + 8, CY + 4, 2, 1.2);
  put(solid(g), prism(P, front, vr, vi, SZ + CH, SZ + CH + 10));

  function draw(c, w) {
    if (w === c.last) return;
    c.last = w;
    const n = 2 * NP, dx = w / n, a = Math.min(Math.sqrt(Math.max((L / n) ** 2 - dx * dx, 1)) / 2, 3.5);
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const x = c.s === 0 ? i * dx : W - i * dx;
      pts.push([x, CY + (i % 2 ? a : -a)]);
    }
    const z0 = SZ + 1.5, z1 = SZ + CH;
    const topE = pts.map(([x, y]) => P(x, y, z1)), botE = pts.map(([x, y]) => P(x, y, z0));
    c.sheet.setAttribute("d", poly(topE.concat(botE.slice().reverse())));
    let d = "";
    pts.forEach(([x, y], i) => { if (i % 2 && i < n) d += seg(P(x, y, z1 - 1), P(x, y, z0 + 1)); });
    c.folds.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const c of sides) { draw(c, tval(c.w, now)); if (!tdone(c.w, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = [P(W / 4, CY, SZ + CH / 2), P((3 * W) / 4, CY, SZ + CH / 2)];
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 80 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sides.forEach((c, k) => {
      const w = a < 0 ? (k === 0 ? 30 : 58) : k === a ? 58 - 40 * pull : 60;
      tset(c.w, w, now, from < 0 ? 0 : Math.abs(k - from) * 45);
      c.sheet.classList.toggle("hi", k === (a < 0 ? 0 : a));
    });
    read.textContent = a < 0 ? "rest" : a === 0 ? "left" : "right";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { pull = v; const a = act; act = -2; setActive(a); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "stagecurtain",
  means: "A school stage with two pleated curtains: the one under the pointer draws aside, bunching its pleats, and the other slides shut.",
  rules: [1, 2, 5, 6],
  range: [0.3, 0.75, 1],
  tour: [[146, 159], [220, 196], [176, 166], null],
  mount,
});
