/**
 * Toast rack: a wire rack on a low tray, its arches holding four slices of
 * toast on edge. The pointer picks a slice by where it stands: it rises out
 * of its slot and tips forward, and the slices beside it tilt away,
 * staggered from it. At rest one slice sits half out, bright. The slider
 * is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const { Cam, facing, fit, hull, poly, open, prism, proj, rings, rad, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 4, STEP = 18, T = 3, W = 30, HH = 24, BZ = 3, LIFT = 18, FAV = 1;
const X0 = 10, X1 = X0 + (N - 1) * STEP;
const REST = [[0, -5], [9, 10], [0, 4], [0, -3]];
const V = [0.61, 0.61, 0.5];
const PROF = [[1, 0], [W - 1, 0], [W - 1, HH - 6]];
for (let k = 0; k <= 10; k++) { const a = (k / 10) * Math.PI; PROF.push([W / 2 + (W / 2 - 1) * Math.cos(a) + (k === 0 || k === 10 ? 0 : 0), HH - 6 + 8 * Math.sin(a)]); }
PROF.push([1, HH - 6]);
const INSET = PROF.map(([y, z]) => [W / 2 + (y - W / 2) * 0.82, 2.5 + z * 0.84]);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[-8, -6, 0], [X1 + 14, W + 6, 0], [X0, W / 2, HH + 4 + LIFT + 4], [X1 + 10, 0, HH], [-4, W, HH]], 200, 168);
  const P = proj(C), g = mk("g", {}, svg);
  const [tr, ti] = rings(-8, -6, X1 + 14, W + 6, 5, 1.6);
  put(solid(g), prism(P, facing(C), tr, ti, 0, BZ));
  const items = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, ax = x - STEP / 2;
    const arch = [[ax, 1, BZ], [ax, 1, BZ + 15], [ax, 4, BZ + 19], [ax, W - 4, BZ + 19], [ax, W - 1, BZ + 15], [ax, W - 1, BZ]];
    mk("path", { class: "nf lo", d: open(arch.map((p) => P(...p))) }, g);
    const grp = mk("g", {}, g);
    const sil = mk("path", { class: "sil" }, grp), face = mk("path", { class: "nf lo" }, grp), crust = mk("path", { class: "nf lo" }, grp);
    items.push({ x, sil, face, crust, up: tween(REST[k][0]), tilt: tween(REST[k][1]), last: "" });
  }
  const ax = X1 + STEP / 2;
  mk("path", { class: "nf lo", d: open([[ax, 1, BZ], [ax, 1, BZ + 15], [ax, 4, BZ + 19], [ax, W - 4, BZ + 19], [ax, W - 1, BZ + 15], [ax, W - 1, BZ]].map((p) => P(...p))) }, g);

  function draw(it, up, tl) {
    const key = up.toFixed(2) + "," + tl.toFixed(2);
    if (key === it.last) return;
    it.last = key;
    const c = Math.cos(rad(tl)), s = Math.sin(rad(tl));
    const S = (dx, y, z) => P(it.x + dx * c + z * s, y, BZ + up - dx * s + z * c);
    const side = V[0] * c - V[2] * s > 0 ? T / 2 : -T / 2;
    const all = [...PROF.map(([y, z]) => S(-T / 2, y, z)), ...PROF.map(([y, z]) => S(T / 2, y, z))];
    it.sil.setAttribute("d", poly(hull(all)));
    it.face.setAttribute("d", poly(PROF.map(([y, z]) => S(side, y, z))));
    it.crust.setAttribute("d", poly(INSET.map(([y, z]) => S(side, y, z))));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.up, now), tval(it.tilt, now)); if (!tdone(it.up, now) || !tdone(it.tilt, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, W / 2, BZ + HH / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 80 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = k - a;
      const [u, t] = a < 0 ? REST[k] : d === 0 ? [LIFT, 16] : [0, Math.sign(d) * (Math.abs(d) === 1 ? 14 : 7)];
      const dl = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.up, u, now, dl); tset(it.tilt, t, now, dl);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "slice " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "toastrack",
  means: "A wire toast rack holding four slices: the slice under the pointer rises and tips out, and its neighbours tilt away.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[185, 140], [220, 149], [245, 165], null],
  mount,
});
