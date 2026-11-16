/**
 * UPS unit: a tower cabinet with three battery trays in its front and a
 * status window above them. The pointer picks a tray by its height: it
 * slides out of the front, the trays beside it ease out a little, staggered
 * from it. At rest the trays sit unevenly, the middle one bright.
 * The slider is the stagger.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, seg, poly, ringAt, rrect, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 3, W = 36, D = 40, H = 66, TZ0 = 6, TGAP = 16, TH = 12, OUT = 26, S = 2.8;
const REST = [2, 7, 0], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[0, 0, 0], [W, D + OUT + 2, 0], [0, 0, H], [W, D + OUT + 2, TZ0 + 2 * TGAP + TH], [W, 0, H], [0, D + OUT + 2, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const cab = solid(g);
  const [co, ci] = rings(0, 0, W, D, 5, 1.4);
  put(cab, prism(P, front, co, ci, 0, H));
  // the status window and button on the front, above the trays
  const win = [[8, D, 55], [24, D, 55], [24, D, 61], [8, D, 61]].map((p) => P(...p));
  mk("path", { class: "nf lo", d: poly(win) + seg(P(29, D, 57), P(29, D, 59.5)) }, cab.g);

  const trays = [];
  for (let k = 0; k < N; k++) trays.push({ k, s: solid(g), z: TZ0 + k * TGAP, y: tween(REST[k]), last: NaN });

  function draw(t, dy) {
    if (dy === t.last) return;
    t.last = dy;
    const [o, i] = rings(4, D - 3, W - 4, D + 2 + dy, 2, 1.1);
    put(t.s, prism(P, front, o, i, t.z, t.z + TH));
    // the cells inside the tray, seen across its open top
    let d = "";
    if (dy > 4) for (let c = 0; c < 3; c++) {
      const x0 = 7 + c * 8.6;
      d += poly(ringAt(P, rrect(x0, D, x0 + 7, D + dy, 1, 2), t.z + TH));
    }
    t.s.cells = t.s.cells || mk("path", { class: "nf lo" }, t.s.g);
    t.s.cells.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    trays.forEach((t) => { draw(t, tval(t.y, now)); if (!tdone(t.y, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [cx] = P(W / 2, D + 10, 0);
    if (Math.abs(sx - cx) > 34 * S) return -1;
    let best = -1, bd = 1e9;
    trays.forEach((t, k) => { const dy = Math.abs(sy - P(W / 2, D + 6, t.z + TH / 2)[1]); if (dy < bd) { bd = dy; best = k; } });
    return bd < TGAP * S ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    trays.forEach((t, k) => {
      const y = a < 0 ? REST[k] : k === a ? OUT : clamp(9 - 4 * Math.abs(k - a), 0, 9);
      tset(t.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      t.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "tray " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "ups",
  means: "A UPS tower: the battery tray under the pointer slides out of the front, the trays beside it ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[176, 184], [176, 145], [176, 223], null],
  mount,
});
