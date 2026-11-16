/**
 * NAS drive: a squat rounded box with four drive sleds side by side in its
 * front face. The pointer picks a bay by where it is along the box: that sled
 * slides out on its rails, the neighbours ease out a little after it. At rest
 * the sleds sit unevenly, one half-drawn and bright. The slider is the stagger.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 4, W = 9, GAP = 2.4, X0 = 3, Y0 = 0, Y1 = 34, H = 40, OUT = 18;
const X1 = X0 + N * W + (N - 1) * GAP + 3;
const REST = [1, 4, 0.5, 2], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[0, Y0, 0], [X1, Y0, H], [X1, Y1 + OUT, 0], [0, Y1 + OUT, H], [0, Y0, H], [X1, Y1 + OUT, H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const body = solid(g);
  const [br, bi] = rings(0, Y0, X1, Y1, 5, 1.6);
  put(body, prism(P, front, br, bi, 0, H));
  // the bays: dim openings on the front face
  let bays = "";
  for (let k = 0; k < N; k++) {
    const x = X0 + k * (W + GAP);
    bays += seg(P(x - 0.6, Y1, 3), P(x + W + 0.6, Y1, 3)) + seg(P(x - 0.6, Y1, H - 4), P(x + W + 0.6, Y1, H - 4));
  }
  mk("path", { class: "nf lo", d: bays }, body.g);

  const sleds = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g);
    const h = mk("path", { class: "nf lo" }, s.g);
    sleds.push({ k, x: X0 + k * (W + GAP), s, h, y: tween(REST[k]), last: NaN });
  }
  function draw(d, out) {
    if (out === d.last) return;
    d.last = out;
    const [r, i] = rings(d.x, Y1 - 6, d.x + W, Y1 + 1 + out, 1.6, 0.9);
    put(d.s, prism(P, front, r, i, 4, H - 5));
    const yf = Y1 + 1 + out, xc = d.x + W / 2;
    d.h.setAttribute("d", seg(P(xc - 2.5, yf, H - 10), P(xc + 2.5, yf, H - 10)) + seg(P(xc, yf, 9), P(xc, yf, 11)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    sleds.forEach((d) => { draw(d, tval(d.y, now)); if (!tdone(d.y, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  const cx = sleds.map((d) => P(d.x + W / 2, Y1, H / 2)[0]);
  const top = P(0, Y0, H)[1] - 10, bot = P(X1, Y1 + OUT, 0)[1] + 10;
  function hit([sx, sy]) {
    if (sy < top || sy > bot || sx < cx[0] - 40 || sx > cx[N - 1] + 40) return -1;
    let best = 0;
    cx.forEach((c, k) => { if (Math.abs(c - sx) < Math.abs(cx[best] - sx)) best = k; });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sleds.forEach((d, k) => {
      const o = a < 0 ? REST[k] : k === a ? OUT : clamp(6 - 2.5 * Math.abs(k - a), 1, 6);
      tset(d.y, o, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "bay " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "nasdrive",
  means: "A four-bay NAS box: the drive sled under the pointer slides out on its rails, its neighbours ease out a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[138, 108], [194, 136], [236, 157], null],
  mount,
});
