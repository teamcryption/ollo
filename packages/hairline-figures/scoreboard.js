/**
 * Scoreboard: a board on two legs with four flip panels hinged along their
 * tops on its face. The pointer picks a panel by where it is along the
 * board: it flips up toward the viewer, the panels beside it lift a little,
 * staggered from it. At rest the panels hang a little uneven, one tipped
 * out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is each panel's rest
 * centre on screen x.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 15, X0 = 3, PW = 12, BW = X0 * 2 + (N - 1) * STEP + PW, YF = 6.6, ZT = 50, PH = 24, UP = 1.25, BUMP = 0.3;
const REST = [0.05, 0.45, 0, 0.12], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-2, -2, 0], [BW + 2, 8, 0], [0, 0, ZT + 6], [BW, YF + PH, ZT], [0, YF + PH, ZT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(6, 1, 11, 5, 2, 0.7, 0, 24);
  box(BW - 11, 1, BW - 6, 5, 2, 0.7, 0, 24);
  box(0, 0, BW, 6, 2.5, 1, 22, ZT + 4);

  const flaps = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    flaps.push({ k, x: X0 + k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), a: tween(REST[k]), last: NaN });
  }
  const shape = fillet([[0, 0], [PW, 0], [PW, PH], [0, PH]], [1.5, 1.5, 1.5, 1.5], 3);
  function draw(s, a) {
    if (a === s.last) return;
    s.last = a;
    const sn = Math.sin(a), cs = Math.cos(a);
    const at = (t) => ([u, v]) => P(s.x + u, YF + v * sn + t * cs, ZT - v * cs + t * sn);
    s.sil.setAttribute("d", poly(hull(shape.map(at(0)).concat(shape.map(at(0.9))))));
    s.cr.setAttribute("d", open([[1.5, PH / 2], [PW - 1.5, PH / 2]].map(at(0.9))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    flaps.forEach((s) => { draw(s, tval(s.a, now)); if (!tdone(s.a, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest centre on screen x, inside the board's band
  const top = P(0, 0, ZT + 8)[1], bot = P(BW, YF, 18)[1];
  function hit([sx, sy]) {
    if (sy < top || sy > bot + 10) return -1;
    let best = -1, bd = 1e9;
    flaps.forEach((s, k) => { const d = Math.abs(P(s.x + PW / 2, YF, ZT - PH / 2)[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    flaps.forEach((s, k) => {
      const t = a < 0 ? REST[k] : k === a ? UP : clamp(BUMP - (Math.abs(k - a) - 1) * 0.15, 0, BUMP);
      tset(s.a, t, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flap " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "scoreboard",
  means: "A flip scoreboard: the panel under the pointer flips up toward you, the panels beside it lift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[174, 114], [244, 149], [279, 166], null],
  mount,
});
