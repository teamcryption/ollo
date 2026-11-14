/**
 * Pharmacy drawers: a cabinet of small drawers in rows. The pointer picks
 * a drawer by its resting front, and that drawer slides out, its neighbours
 * easing a little after it. At rest one drawer stands half open, bright. The
 * slider is the stagger.
 *
 * The pattern: grid on a face plane.
 */
const {
  Cam, fit, facing, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 3, DW = 28, DH = 18, D = 34, OUT = 28, FAV = 6;
const CW = NC * DW + 6, CH = NR * DH + 10, CD = 40;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [CW, CD + OUT, 0], [0, CD + OUT, CH], [CW, 0, CH + 4], [CW, CD + OUT, CH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, CW, CD, 3, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, CH));
  const [tr, ti] = rings(-3, -3, CW + 3, CD + 3, 4, 1.6);
  put(solid(g), prism(P, front, tr, ti, CH, CH + 4));
  const dg = mk("g", {}, g);
  const items = [];
  for (let r = NR - 1; r >= 0; r--) for (let c = 0; c < NC; c++) {
    const k = r * NC + c, x0 = 3 + c * DW + 1, z0 = 5 + r * DH + 1;
    const s = solid(mk("g", {}, dg)), knob = mk("path", { class: "nf" }, s.g);
    items.push({ k, r, c, x0, z0, s, knob, out: tween(k === FAV ? OUT * 0.5 : 0), last: NaN });
  }
  items.sort((a, b) => a.c - b.c || b.r - a.r).forEach((it) => dg.appendChild(it.s.g));
  const byK = []; items.forEach((it) => { byK[it.k] = it; });

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const [ring, inner] = rings(it.x0, CD - D + o, it.x0 + DW - 2, CD + o, 1.5, 1);
    put(it.s, prism(P, front, ring, inner, it.z0, it.z0 + DH - 2));
    const mx = it.x0 + DW / 2 - 1, mz = it.z0 + DH / 2 - 1;
    it.knob.setAttribute("d", seg(P(mx - 4, CD + o + 0.2, mz), P(mx + 4, CD + o + 0.2, mz)));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.out, now)); if (!tdone(it.out, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = byK.map((it) => P(it.x0 + DW / 2 - 1, CD, it.z0 + DH / 2 - 1));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 26 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    const sel = a < 0 ? FAV : a;
    byK.forEach((it, k) => {
      const dd = a < 0 ? 9 : Math.abs(it.c - byK[a].c) + Math.abs(it.r - byK[a].r);
      const o = a < 0 ? (k === FAV ? OUT * 0.5 : 0) : dd === 0 ? OUT : dd === 1 ? 6 : 0;
      const fd = from < 0 ? 0 : Math.abs(it.c - byK[from].c) + Math.abs(it.r - byK[from].r);
      tset(it.out, o, now, fd * stag);
      it.s.sil.classList.toggle("hi", k === sel);
    });
    if (a >= 0) dg.appendChild(byK[a].s.g); else items.forEach((it) => dg.appendChild(it.s.g));
    read.textContent = a < 0 ? "rest" : String.fromCharCode(65 + (NR - 1 - byK[a].r)) + (byK[a].c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pharmacycounter",
  means: "A cabinet of small pharmacy drawers: the drawer under the pointer slides out, its neighbours easing after it.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 90],
  tour: [[136, 152], [205, 160], [245, 151], null],
  mount,
});
