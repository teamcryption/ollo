/**
 * Clothes rail: a rail on two uprights with feet, six garments hanging on
 * it. The pointer picks a garment by where it is along the rail: it swings
 * out towards the viewer on its hanger, its neighbours swing less, staggered
 * from it. At rest one garment is bright. The slider is the stagger.
 */
const { Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 6, STEP = 11, TOP = 52, TH = 1.6, FAV = 3, SWING = 48;
const XL = -9, XR = (N - 1) * STEP + 9;
const SHAPE = fillet([[-3.5, -3], [3.5, -3], [11, -8], [9.5, -15], [8, -14], [8.5, -38], [-8.5, -38], [-8, -14], [-9.5, -15], [-11, -8]], [1, 1, 2, 1, 1, 1.5, 1.5, 1, 1, 2], 3);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[XL - 3, -12, 0], [XR + 3, 12, 0], [XL - 3, 12, 0], [XR + 3, -12, 0], [XL, 0, TOP + 4], [XR, 0, TOP + 4], [XR, 30, TOP - 20]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  function upright(x) {
    const foot = solid(g), [fr, fi] = rings(x - 2, -12, x + 2, 12, 1.8, 0.6);
    put(foot, prism(P, front, fr, fi, 0, 2.5));
    const post = solid(g), [pr, pi] = rings(x - 1.4, -1.4, x + 1.4, 1.4, 1.2, 0.5);
    put(post, prism(P, front, pr, pi, 2.5, TOP + 1.5));
  }
  upright(XL);
  mk("path", { class: "nf lo", d: open([P(XL, 0, TOP), P(XR, 0, TOP)]) }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({ k, x: k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), a: tween(0), last: NaN });
  }
  upright(XR);

  function pt(x, y, z, a) { const c = Math.cos(a), s = Math.sin(a); return P(x, y * c - z * s, TOP + y * s + z * c); }
  function draw(s, deg) {
    if (deg === s.last) return;
    s.last = deg;
    const a = (deg * Math.PI) / 180, near = SHAPE.map(([y, z]) => pt(s.x + TH / 2, y, z, a)), far = SHAPE.map(([y, z]) => pt(s.x - TH / 2, y, z, a));
    s.sil.setAttribute("d", poly(hull(near.concat(far))));
    const xn = s.x + TH / 2;
    s.cr.setAttribute("d", poly(near) + open([pt(xn, 0, 2.5, a), pt(xn, 1.2, 1.2, a), pt(xn, 0, 0, a), pt(xn, -1.2, 1.2, a), pt(xn, 0, -3, a)]) + open([pt(xn, -3.5, -3, a), pt(xn, 0, -9, a), pt(xn, 3.5, -3, a)]) + open([pt(xn, 0, -9, a), pt(xn, 0, -38, a)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    items.forEach((s) => { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the garment whose rest centre is nearest the pointer's screen x
  const cx = items.map((s) => P(s.x, 0, TOP - 18)[0]);
  const yTop = P(XL, 0, TOP + 4)[1], yBot = P(XR, 12, 0)[1];
  function hit([sx, sy]) {
    if (sy < yTop - 20 || sy > yBot + 10 || sx < cx[0] - 25 || sx > cx[N - 1] + 25) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(sx - c) < Math.abs(sx - cx[best])) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((s, k) => {
      const deg = a < 0 ? 0 : SWING * clamp(1 - Math.abs(k - a) * 0.3, 0.2, 1);
      tset(s.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "no. " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "hangerrack",
  means: "A clothes rail: the garment under the pointer swings out on its hanger, its neighbours swing a little after it.",
  rules: [1, 2, 4, 5],
  range: [0, 40, 90],
  tour: [[149, 101], [210, 131], [251, 151], null],
  mount,
});
