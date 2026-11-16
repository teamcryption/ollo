/**
 * Plate tree: weight plates of falling size hung on a bar between two
 * uprights. The pointer picks a plate by where it stands: it turns on the
 * bar to face out, and its neighbours turn a little after it. At rest one
 * plate is half turned, bright. The slider is the stagger.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 28, BH = 42, FAV = 1, T = 5;
const RS = [32, 27, 22, 17], REST = [6, 28, -4, 10];
const L = (N - 1) * STEP;
const rz = (p, a) => { const c = Math.cos(a), s = Math.sin(a); return [p[0] * c - p[1] * s, p[0] * s + p[1] * c, p[2]]; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-22, -34, 0], [L + 22, 34, 0], [-22, 34, 0], [L + 22, -34, 0], [0, 0, BH + 34], [L, 0, BH + 34]], 200, 162);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r0, i0] = rings(-24, -26, L + 24, 26, 6, 2);
  put(solid(g), prism(P, front, r0, i0, 0, 5));
  const upright = (x) => { const [a, b] = rings(x - 4, -4, x + 4, 4, 2, 1); put(solid(g), prism(P, front, a, b, 5, BH + 7)); };
  upright(-16);
  const bp = [];
  for (const x of [-16, L + 16]) for (const y of [-1.6, 1.6]) for (const z of [BH - 1.6, BH + 1.6]) bp.push(P(x, y, z));
  mk("path", { d: poly(hull(bp)) }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({ k, x: k * STEP, R: RS[k], sil: mk("path", { class: "sil" }, grp), rim: mk("path", { class: "nf lo" }, grp), hole: mk("path", { class: "nf" }, grp), a: tween(REST[k]), last: NaN });
  }
  upright(L + 16);

  function ring(it, a, r, s) {
    const out = [];
    for (let i = 0; i < 36; i++) { const t = (i / 36) * Math.PI * 2; const q = rz([s, r * Math.cos(t), r * Math.sin(t)], a); out.push(P(it.x + q[0], q[1], BH + q[2])); }
    return out;
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = (deg * Math.PI) / 180;
    it.sil.setAttribute("d", poly(hull(ring(it, a, it.R, -T / 2).concat(ring(it, a, it.R, T / 2)))));
    it.rim.setAttribute("d", poly(ring(it, a, it.R * 0.72, T / 2)));
    it.hole.setAttribute("d", poly(ring(it, a, 4, T / 2)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, BH));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 34 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? 62 : dd === 1 ? 24 : 12;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : RS[a] + "kg";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "kettlerack",
  means: "Weight plates hung on a bar: the plate under the pointer turns on the bar to face out, and its neighbours turn after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[142, 53], [181, 81], [258, 136], null],
  mount,
});
