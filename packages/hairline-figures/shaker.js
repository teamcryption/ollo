/**
 * Egg shakers: three eggs standing on pegs along a wooden stand. The pointer
 * picks an egg by where it stands: it rocks over on its peg as if shaken, and
 * the eggs beside it rock less, staggered. At rest the eggs lean unevenly and
 * one is bright. The slider is the stagger.
 */
const { Cam, fit, facing, prism, proj, rings, hull, poly, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 3, STEP = 36, SX = N * STEP + 8, SY = 30, SZ = 8, PEG = 6, ER = 12, EH = 30, TIP = 0.75, FAV = 1;
const REST = [0.12, -0.28, 0.06];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[0, 0, 0], [SX, SY, 0], [SX, 0, 0], [0, SY, 0], [4, SY / 2, SZ + PEG + EH + 6], [SX - 4, SY / 2, SZ + PEG + EH + 6], [SX / 2, SY / 2 + 30, SZ + 30], [SX / 2, SY / 2 - 30, SZ + 30]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(0, 0, SX, SY, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, SZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = 4 + STEP / 2 + k * STEP, y = SY / 2, grp = mk("g", {}, g);
    const [pr, pi] = rings(x - 2.5, y - 2.5, x + 2.5, y + 2.5, 2.4, 1);
    put(solid(grp), prism(P, front, pr, pi, SZ, SZ + PEG));
    const sil = mk("path", { class: "sil" }, grp), seam = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, y, grp, sil, seam, a: tween(REST[k]), last: NaN });
  }

  function draw(it, ang) {
    if (ang === it.last) return;
    it.last = ang;
    const c = Math.cos(ang), s = Math.sin(ang), z0 = SZ + PEG;
    const W = (u, v, h) => P(it.x + u, it.y + v * c - h * s, z0 + v * s + h * c);
    const pts = [];
    let seam = [];
    for (let j = 0; j <= 10; j++) {
      const t = j / 10, h = t * EH, r = ER * Math.sqrt(Math.max(0, 1 - Math.pow(2 * t - 1, 2))) * (t < 0.5 ? 1 : 0.85);
      for (let i = 0; i < 20; i++) { const q = (i / 20) * Math.PI * 2; pts.push(W(Math.cos(q) * r, Math.sin(q) * r, h)); }
    }
    for (let i = 0; i <= 20; i++) { const q = (i / 20) * Math.PI * 2; seam.push(W(Math.cos(q) * ER * 0.97, Math.sin(q) * ER * 0.97, EH * 0.48)); }
    it.sil.setAttribute("d", poly(hull(pts)));
    it.seam.setAttribute("d", poly(seam));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, it.y, SZ + PEG + EH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 45 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), v = a < 0 ? REST[k] : dd === 0 ? TIP : dd === 1 ? -0.4 : 0.2;
      tset(it.a, v, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "egg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "shaker",
  means: "Three egg shakers on a stand: the egg under the pointer rocks over on its peg and its neighbours rock less.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[136, 117], [200, 149], [264, 181], null],
  mount,
});
