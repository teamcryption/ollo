/**
 * Safety deposit: a wall of lock boxes, four across and three high, each
 * with a pull and a pair of keyholes. The pointer picks a box by its face:
 * it slides out of the wall, and the boxes beside it ease forward a little,
 * staggered from it. At rest one box stands part out, bright. The slider is
 * the stagger.
 *
 * The pattern: a grid on a face plane.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const NC = 4, NR = 3, BW = 24, BH = 20, X0 = 4, Z0 = 6, W = X0 * 2 + NC * BW, D = 40, H = Z0 + NR * BH + 6, OUT = 34, FAV = 6;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-4, -4, 0], [W + 4, D + 4, 0], [W + 4, -4, 0], [-4, D + OUT + 4, 0], [-4, -4, H], [0, D + OUT, H - 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, W + 4, D + 4, 4, 2);
  put(solid(g), prism(P, front, pr, pi, 0, 3));
  const [cr, ci] = rings(0, 0, W, D, 3, 1.5);
  const cab = solid(g);
  put(cab, prism(P, front, cr, ci, 3, H));
  cab.sil.classList.add("sil");

  const items = [];
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) {
    const k = r * NC + c, x0 = X0 + c * BW + 1, x1 = x0 + BW - 2, z0 = Z0 + r * BH + 1, z1 = z0 + BH - 2;
    const s = solid(g), pull = mk("path", { class: "nf" }, s.g), keys = mk("path", { class: "lo nf" }, s.g);
    s.sil.classList.add("sil");
    items.push({ k, r, c, x0, x1, z0, z1, s, pull, keys, out: tween(k === FAV ? OUT * 0.55 : 0), last: NaN });
  }

  function draw(it, o) {
    if (o === it.last) return;
    it.last = o;
    const [rr, ri] = rings(it.x0, D, it.x1, D + 1.5 + o, 1.2, 0.6);
    put(it.s, prism(P, front, rr, ri, it.z0, it.z1));
    const y = D + 1.5 + o, xm = (it.x0 + it.x1) / 2, zm = (it.z0 + it.z1) / 2;
    it.pull.setAttribute("d", poly([P(xm - 5, y, zm - 4), P(xm + 5, y, zm - 4), P(xm + 5, y, zm - 2), P(xm - 5, y, zm - 2)]));
    it.keys.setAttribute("d", seg(P(xm - 4, y, zm + 2), P(xm - 4, y, zm + 5)) + seg(P(xm + 4, y, zm + 2), P(xm + 4, y, zm + 5)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.out, now)); if (!tdone(it.out, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P((it.x0 + it.x1) / 2, D, (it.z0 + it.z1) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = k; } });
    return bd < 26 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act, sel = a < 0 ? FAV : a;
    act = a;
    const fr = items[Math.max(from, 0)];
    items.forEach((it) => {
      const dd = a < 0 ? 9 : Math.abs(it.r - items[a].r) + Math.abs(it.c - items[a].c);
      const o = a < 0 ? (it.k === FAV ? OUT * 0.55 : 0) : dd === 0 ? OUT : dd === 1 ? 7 : 0;
      tset(it.out, o, now, from < 0 ? 0 : (Math.abs(it.r - fr.r) + Math.abs(it.c - fr.c)) * stag);
      it.s.sil.classList.toggle("hi", it.k === sel);
    });
    items.forEach((it) => g.appendChild(it.s.g));
    g.appendChild(items[sel].s.g);
    read.textContent = a < 0 ? "rest" : "box " + (items[a].r + 1) + "·" + (items[a].c + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lockers2",
  means: "A wall of lock boxes: the box under the pointer slides out of the wall, and the boxes beside it ease forward a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[242, 233], [181, 171], [150, 125], null],
  mount,
});
