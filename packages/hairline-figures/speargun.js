/**
 * Speargun: a long barrel with a pistol grip, a muzzle head, a spear on top
 * and two rubber bands stretched back to the spear's notch. The pointer,
 * moving forward along the barrel, fires: the bands snap forward and the
 * spear slides out of the muzzle. At rest it is loaded, the bands bright.
 * The slider is how far the spear flies.
 *
 * The pattern: one part pushed along its rail.
 */
const {
  Cam, clamp, fit, facing, hull, open, poly, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XM = 106, ZS = 9, LEN = 132, FLY = 56;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-8, 0, 0], [6, 0, -28], [LEN + FLY, 0, ZS], [XM, -9, 0], [XM, 9, 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // grip and trigger hang under the barrel
  mk("path", { d: poly(hull([P(18, -3, 0), P(30, -3, 0), P(18, 3, 0), P(30, 3, 0), P(6, -3, -26), P(17, -3, -27), P(6, 3, -26), P(17, 3, -27)])) }, g);
  mk("path", { d: poly(hull([P(33, -1, 0), P(37, -1, 0), P(35, -1, -9), P(33, 1, -9), P(33, 1, 0), P(37, 1, 0)])) }, g);
  mk("path", { d: open([P(31, 0, -1), P(31, 0, -12), P(42, 0, -12), P(42, 0, -1)]), class: "nf lo" }, g);
  // butt, barrel, muzzle head
  const [br, bi] = rings(-8, -4.5, 6, 4.5, 3, 1.2);
  put(solid(g), prism(P, front, br, bi, -2, 7));
  const [tr, ti] = rings(0, -3, XM, 3, 3, 0.9);
  put(solid(g), prism(P, front, tr, ti, 0, 6));
  const [mr, mi] = rings(XM - 6, -9, XM + 4, 9, 3.5, 1.3);
  put(solid(g), prism(P, front, mr, mi, -1, 8));
  const spear = mk("path", {}, g);
  const bands = mk("path", { class: "nf sil hi" }, g);
  const wish = mk("path", { class: "nf sil hi" }, g);
  const sp = spring(0, { eps: 0.002 });
  let drawn = NaN;
  function draw() {
    const t = sp.x * reach;
    if (t === drawn) return;
    drawn = t;
    const o = FLY * t, w = 40 + (XM + 6 - 40) * Math.min(1, t * 1.4), sag = 5 * Math.min(1, t * 1.4);
    const x0 = -4 + o, x1 = LEN + o;
    spear.setAttribute("d", poly(hull([P(x0, -1.2, ZS), P(x0, 1.2, ZS), P(x0, 0, ZS + 1.4), P(x1 - 7, -1.2, ZS), P(x1 - 7, 1.2, ZS), P(x1, 0, ZS + 0.4)])) + poly([P(x1 - 9, 0, ZS + 1), P(x1 - 15, -4, ZS + 1), P(x1 - 12, 0, ZS + 1)]));
    const L = [], R = [];
    for (let k = 0; k <= 8; k++) {
      const u = k / 8, x = XM + 2 + (w - XM - 2) * u, y = 8 * (1 - u) + 1.5 * u, z = 5 + (ZS + 1 - 5) * u - sag * Math.sin(Math.PI * u);
      L.push(P(x, -y, z)); R.push(P(x, y, z));
    }
    bands.setAttribute("d", open(L) + open(R));
    wish.setAttribute("d", open([P(w, -2, ZS + 1), P(w - 2, 0, ZS + 2.5), P(w, 2, ZS + 1)]));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const a = P(24, 0, 0)[0], b = P(XM, 0, 0)[0];
  function set(t) {
    sp.t = t;
    read.textContent = t === 0 ? "rest" : Math.round(t * 100) + "%";
    B.wake();
  }
  set(0);
  bag.add(pointer(stage, {
    move: ([sx]) => set(Math.round(clamp((sx - a) / (b - a), 0.15, 1) * 20) / 20),
    leave: () => set(0),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; drawn = NaN; draw(); }, destroy: bag.dispose };
}

hairline({
  name: "speargun",
  means: "A loaded speargun: moving forward along the barrel fires it, the rubber bands snapping forward as the spear slides out of the muzzle.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[160, 142], [190, 157], [218, 172], null],
  mount,
});
