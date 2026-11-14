/**
 * Instrument cases: a cello, a viola and a violin case lying on the floor,
 * each a pear-shaped shell with a lid hinged along its back edge. The pointer
 * picks a case by where it stands over the tops; that lid swings open to show
 * the lining, and the cases beside it crack a little, staggered from it. At
 * rest the viola stands half open, bright. The slider is the stagger.
 */
const { Cam, fit, fillet, hull, poly, proj, tdone, tset, tval, tween, unproj, rad, disposer, mk, pointer, register, solid } = HL;

const H = 9, T = 4, OPEN = 72, CRACK = 12, FAV = 1;
const CASES = [
  { name: "cello", x0: 0, yc: 20, L: 112, W: 40, rest: 5 },
  { name: "viola", x0: 16, yc: 62, L: 80, W: 28, rest: 58 },
  { name: "violin", x0: 34, yc: 95, L: 64, W: 24, rest: 0 },
];

function outline(L, W, d) {
  const n = 8, pts = [];
  const hw = (t) => (W / 2) * (1 - 0.55 * Math.pow(t, 1.4)) - d;
  for (let i = 0; i <= n; i++) { const t = i / n; pts.push([d + t * (L - 2 * d), -hw(t)]); }
  for (let i = n; i >= 0; i--) { const t = i / n; pts.push([d + t * (L - 2 * d), hw(t)]); }
  const R = Math.max(1, W / 4 - d);
  return fillet(pts, pts.map((_, i) => (i === 0 || i === n || i === n + 1 || i === 2 * n + 1 ? R : 0.6)), 3);
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-4, -4, 0], [116, -4, 0], [116, 112, 0], [-4, 112, 0], [0, 0, H + 44], [112, 0, H + 44]], 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const items = CASES.map((c, k) => {
    const out = outline(c.L, c.W, 0), inn = outline(c.L, c.W, 2.2);
    const at = (pts, z) => pts.map(([u, v]) => P(c.x0 + u, c.yc + v, z));
    const base = solid(g);
    base.sil.setAttribute("d", poly(hull(at(out, 0).concat(at(out, H)))));
    base.cr.setAttribute("d", poly(at(inn, H)));
    // the lining's floor seam, seen only once the lid is up
    mk("path", { d: poly(at(outline(c.L, c.W, 5), H - 3)), class: "nf lo" }, base.g);
    const lid = solid(g);
    return { ...c, k, out, inn, lid, a: tween(c.rest), last: NaN };
  });

  function lidPts(it, pts, th, o) {
    const s = Math.sin(rad(th)), co = Math.cos(rad(th)), yh = it.yc - it.W / 2;
    return pts.map(([u, v]) => { const vv = v + it.W / 2; return P(it.x0 + u, yh + vv * co - o * s, H + vv * s + o * co); });
  }
  function draw(it, th) {
    if (th === it.last) return;
    it.last = th;
    it.lid.sil.setAttribute("d", poly(hull(lidPts(it, it.out, th, 0).concat(lidPts(it, it.out, th, T)))));
    it.lid.cr.setAttribute("d", poly(lidPts(it, it.inn, th, th < 38 ? T : 0)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now)); if (!tdone(it.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, H);
    for (const it of items) if (wx > it.x0 - 6 && wx < it.x0 + it.L + 6 && Math.abs(wy - it.yc) < it.W / 2 + 3) return it.k;
    return -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), th = a < 0 ? it.rest : dd === 0 ? OPEN : dd === 1 ? CRACK : 0;
      tset(it.a, th, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : items[a].name;
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "cellocase",
  means: "Three instrument cases on the floor: the case under the pointer swings its lid open, and its neighbours crack open a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[246, 173], [181, 197], [158, 230], null],
  mount,
});
