/**
 * Pull wagon: a deep tray on four wheels on a play mat, its long handle
 * hinged at the front. The pointer's height raises the handle, and its side
 * rolls the wagon along the mat, both on springs. At rest the handle leans
 * up, bright. The slider is how far the wagon rolls.
 *
 * The pattern: one part answering the pointer's position (aim).
 */
const {
  Cam, clamp, fit, facing, poly, prism, proj, rings, seg, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 56, H = 15, HL_ = 46, REST = 0.8;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let roll = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-24, -26, 0], [122, 26, 0], [122, -26, 0], [-24, 26, 0], [W + 30 + HL_, 0, 14 + HL_], [-10, 0, 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(-24, -26, 122, 26, 12, 2);
  put(solid(g), prism(P, front, mr, mi, 0, 2));
  const wheelB = [mk("path", {}, g), mk("path", {}, g)];
  const tray = solid(g), lip = mk("path", { class: "nf lo" }, g);
  const wheelF = [mk("path", {}, g), mk("path", {}, g)];
  const handle = mk("path", { class: "nf hi" }, g);

  const wheel = (cx, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push(P(cx + 8 * Math.cos(a), y, 10 + 8 * Math.sin(a))); }
    return poly(pts);
  };
  const ang = spring(REST), dx = spring(0);
  let lastA = NaN, lastX = NaN;
  function draw(a, x) {
    if (a === lastA && x === lastX) return;
    lastA = a; lastX = x;
    [12, W - 12].forEach((wx, i) => {
      wheelB[i].setAttribute("d", wheel(x + wx, -H - 1));
      wheelF[i].setAttribute("d", wheel(x + wx, H + 1));
    });
    const [tr, ti] = rings(x, -H, x + W, H, 4, 1.6);
    put(tray, prism(P, front, tr, ti, 12, 30));
    const [lr] = rings(x + 3, -H + 3, x + W - 3, H - 3, 3, 1);
    lip.setAttribute("d", poly(lr.map((q) => P(q.u, q.v, 30))));
    const hx = x + W + 2, ex = hx + HL_ * Math.cos(a), ez = 16 + HL_ * Math.sin(a);
    handle.setAttribute("d", seg(P(hx, 0, 16), P(ex, 0, ez)) + seg(P(ex, -7, ez), P(ex, 7, ez)));
  }
  const B = register(stage, (dt) => { const m1 = stepS(ang, dt), m2 = stepS(dx, dt); draw(ang.x, dx.x); return m1 || m2; });
  bag.add(B.unregister);
  draw(REST, 0);

  function aim(p) {
    ang.t = p ? clamp((250 - p[1]) / 120, 0, 1) * 1.2 : REST;
    dx.t = p ? clamp((p[0] - 200) / 120, -1, 1) * 22 * roll : 0;
    read.textContent = p ? Math.round((ang.t * 180) / Math.PI) + "°" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { roll = v; }, destroy: bag.dispose };
}

hairline({
  name: "wagon",
  means: "A toy wagon with a hinged handle: the pointer's height raises the handle and its side rolls the wagon along the mat.",
  rules: [3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[276, 145], [172, 130], [320, 222], null],
  mount,
});
