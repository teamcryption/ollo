/**
 * Cue rack: five cues standing in a wall rack, butts in a rest, tips
 * against a clip rail. The pointer picks a cue by where it stands: it swings
 * out of the rack on its butt, and every other cue leans after it, less the
 * farther it stands. At rest one cue leans out, bright. The slider is the
 * stagger.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 22, H = 128, FAV = 3, LEN = 132;
const W = (N - 1) * STEP;
const REST = [3, 5, 2, 16, 4];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-14, -8, 0], [W + 14, 16, 0], [-14, 16, 0], [W + 14, -8, H + 6], [-14, -8, H + 6], [W, 70, 100]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [r1, i1] = rings(-14, -8, W + 14, -3, 2, 1);
  put(solid(g), prism(P, front, r1, i1, H - 8, H));
  const [r0, i0] = rings(-14, -8, W + 14, 14, 4, 2);
  put(solid(g), prism(P, front, r0, i0, 0, 8));

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({ k, x: k * STEP, sil: mk("path", { class: "sil" }, grp), wrap: mk("path", { class: "nf lo" }, grp), a: tween(REST[k]), last: NaN });
  }
  // butt at (x, 6, 8), resting lean back to the clip rail at y = -2
  const base = Math.atan2(8, H - 8);
  function circ3(c, u, w, r) {
    const out = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; out.push(P(c[0] + r * Math.cos(t), c[1] + r * Math.sin(t) * u, c[2] + r * Math.sin(t) * w)); }
    return out;
  }
  function draw(it, deg) {
    if (deg === it.last) return;
    it.last = deg;
    const a = -base + (deg * Math.PI) / 180;
    const dir = [0, Math.sin(a), Math.cos(a)], b = [it.x, 6, 8];
    const at = (s) => [b[0] + dir[0] * s, b[1] + dir[1] * s, b[2] + dir[2] * s];
    const u = Math.cos(a), w = -Math.sin(a);
    it.sil.setAttribute("d", poly(hull(circ3(b, u, w, 3.4).concat(circ3(at(LEN), u, w, 1.3)))));
    it.wrap.setAttribute("d", poly(hull(circ3(at(LEN * 0.32), u, w, 2.9).concat(circ3(at(LEN * 0.32 + 1), u, w, 2.9)))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 2, 70));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 && Math.abs(mids[best][1] - sy) < 110 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), to = a < 0 ? REST[k] : dd === 0 ? 34 : dd === 1 ? 14 : 7;
      tset(it.a, to, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "cue " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "snookercue",
  means: "Five cues in a wall rack: the cue under the pointer swings out on its butt, and the others lean after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[155, 48], [229, 86], [254, 98], null],
  mount,
});
