/**
 * Smart meter: a meter unit with a screen on its face and a dial beside it,
 * the screen showing six bars of the day's use. The pointer picks a bar by
 * where it stands on the screen: that bar rises tall, the bars beside it rise
 * a little, staggered from it. At rest the bars make a low evening peak, its
 * top bar bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, BW = 7, GAP = 3, X0 = 8, Y0 = 10, TOP = 16, TALL = 26, FAV = 4;
const REST = [4, 6, 5, 9, 14, 8];
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const bx = (k) => X0 + k * (BW + GAP);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.85);
  fit(C, [[0, 0, 0], [96, 0, 0], [0, 40, 0], [96, 40, 0], [bx(0), Y0, TOP + TALL + 2], [bx(N - 1), Y0, TOP + TALL + 2]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [mr, mi] = rings(0, 0, 96, 40, 7, 2);
  put(solid(g), prism(P, front, mr, mi, 0, TOP));
  const [sr] = rings(X0 - 3, Y0 - 4, bx(N - 1) + BW + 3, Y0 + 20, 3, 1);
  mk("path", { d: poly(ringAt(P, sr, TOP)), class: "nf lo" }, g);

  const items = [];
  for (let k = 0; k < N; k++) {
    const [r, ri] = rings(bx(k), Y0, bx(k) + BW, Y0 + BW, 2, 1);
    items.push({ k, s: solid(g), r, ri, z: tween(REST[k]), last: NaN });
  }
  // the dial: a disc with a pointer notch, beside the screen
  put(solid(g), prism(P, front, disc(80, 20, 9), disc(80, 20, 7.6), TOP, TOP + 2));
  mk("circle", { r: 2, class: "dot off", cx: P(80, 14, TOP + 2)[0], cy: P(80, 14, TOP + 2)[1] }, g);
  function draw(it, h) {
    if (h === it.last) return;
    it.last = h;
    put(it.s, prism(P, front, it.r, it.ri, TOP, TOP + h));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP);
    if (y < Y0 - 14 || y > Y0 + BW + 18 || x < X0 - 8 || x > bx(N - 1) + BW + 8) return -1;
    let best = 0;
    for (let k = 1; k < N; k++) if (Math.abs(bx(k) + BW / 2 - x) < Math.abs(bx(best) + BW / 2 - x)) best = k;
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? TALL : dd === 1 ? 11 : 4;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "hr " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "smartmeter",
  means: "A smart meter whose screen shows six bars of use: the bar under the pointer rises tall and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 40, 80],
  tour: [[140, 131], [180, 152], [240, 182], null],
  mount,
});
