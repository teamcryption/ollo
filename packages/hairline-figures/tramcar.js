/**
 * Tramcar: a tram on a pair of rails, its roof with a pantograph, a row of
 * windows along the near side, and four low platforms by the track. The
 * pointer picks a platform by where it is along the line: that platform's
 * edge goes bright and the tram glides to stop at it. At rest the tram
 * waits just short of the second stop, which is bright.
 *
 * The pattern: one of many in a single row; the hit is on the ground plane.
 */
const {
  Cam, clamp, facing, fit, open, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, SP = 40, X0 = 20, L = 46, Y0 = -3, Y1 = 11, ZB = 3, ZT = 22, PY0 = 15, PY1 = 23, PW = 14;
const REST_X = X0 + SP - L / 2 - 9, FAV = 1, PH = [2, 3, 2.5, 3.5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let dur = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-12, Y0, 0], [X0 + 3 * SP + 30, Y0, 0], [-12, PY1, 0], [X0 + 3 * SP + 30, PY1, 0], [REST_X + L / 2, 4, 36]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the track: two rails and their sleepers, painted first
  const XA = -12, XB = X0 + 3 * SP + 30;
  let track = seg(P(XA, 0, 0), P(XB, 0, 0)) + seg(P(XA, 8, 0), P(XB, 8, 0));
  for (let x = XA + 4; x < XB; x += 9) track += seg(P(x, -2, 0), P(x, 10, 0));
  mk("path", { class: "nf lo", d: track }, g);

  // the tram: body, roof and pantograph, redrawn as it glides
  const tg = mk("g", {}, g);
  const body = solid(tg), roof = solid(tg);
  const marks = mk("path", { class: "nf lo" }, tg), panto = mk("path", { class: "nf" }, tg);
  const tx = tween(REST_X, dur);
  let last = NaN;
  function drawTram(x) {
    if (x === last) return;
    last = x;
    const [r, i] = rings(x, Y0, x + L, Y1, 7, 1.4);
    put(body, prism(P, front, r, i, ZB, ZT));
    const [rr, ri] = rings(x + 6, Y0 + 3, x + L - 6, Y1 - 3, 4, 1);
    put(roof, prism(P, front, rr, ri, ZT, ZT + 3));
    let d = "";
    for (let k = 0; k < 5; k++) {
      const wx = x + 7 + k * 6.8;
      d += poly(rrect(wx, 11, wx + 5, 18, 1.2, 3).map((s) => P(s.u, Y1, s.v)));
    }
    d += seg(P(x + 2, Y1, 7), P(x + L - 2, Y1, 7));
    marks.setAttribute("d", d);
    const cx = x + L / 2;
    panto.setAttribute("d", open([P(cx - 5, 4, ZT + 3), P(cx + 1, 4, ZT + 9), P(cx - 3, 4, ZT + 13)]) + seg(P(cx - 3, -1, ZT + 13), P(cx - 3, 9, ZT + 13)));
  }

  // the platforms, nearer than the track, each a low plate
  const plats = [];
  for (let k = 0; k < N; k++) {
    const s = solid(g), cx = X0 + k * SP;
    const [r, i] = rings(cx - PW, PY0, cx + PW, PY1, 2, 1);
    put(s, prism(P, front, r, i, 0, PH[k]));
    plats.push(s);
  }

  const B = register(stage, (_dt, now) => { drawTram(tval(tx, now)); return !tdone(tx, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -14 || x > XB + 2 || y < Y0 - 8 || y > PY1 + 4) return -1;
    return clamp(Math.round((x - X0) / SP), 0, N - 1);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tx.dur = dur;
    tset(tx, a < 0 ? REST_X : X0 + a * SP - L / 2, performance.now(), 0);
    plats.forEach((s, k) => s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a)));
    read.textContent = a < 0 ? "rest" : "stop " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { dur = v; }, destroy: bag.dispose };
}

hairline({
  name: "tramcar",
  means: "A tram on its rails: the platform under the pointer lights and the tram glides along the line to stop at it.",
  rules: [1, 5, 6, 8],
  range: [400, 700, 1200],
  tour: [[104, 137], [190, 180], [282, 224], null],
  mount,
});
