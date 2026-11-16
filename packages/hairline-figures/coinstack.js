/**
 * Coin tray: five stacks of coins in a bank tray. The pointer picks a stack
 * by where it stands: that stack slides forward out of the tray and its
 * neighbours slide a little, staggered from it. At rest one stack stands
 * half out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fit, facing, open, prism, proj, rings, ringAt, run, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, R = 9, STEP = 21, CH = 2.6, TZ = 4, OUT = 26, FAV = 2, REST = 12;
const H = [7, 10, 5, 9, 6];
const X1 = (N - 1) * STEP + 2 * R, Y1 = 2 * R;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-5, -5, 0], [X1 + 5, Y1 + 5, 0], [X1 + 5, -5, 0], [-5, Y1 + OUT + 5, 0], [R, R, TZ + 10 * CH], [X1 - R, R + OUT, TZ + 10 * CH]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-5, -5, X1 + 5, Y1 + 5, 5, 2);
  put(solid(g), prism(P, front, tr, ti, 0, TZ));

  const items = H.map((n, k) => {
    const grp = mk("g", {}, g), s = solid(grp), lines = mk("path", { class: "nf lo" }, grp);
    return { k, n, x: R + k * STEP, s, lines, d: tween(k === FAV ? REST : 0), last: NaN };
  });

  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    const y = R + d, ring = disc(it.x, y, R);
    put(it.s, prism(P, front, ring, disc(it.x, y, R - 1.4), TZ, TZ + it.n * CH));
    const arc = run(ring, front);
    let s = "";
    for (let j = 1; j < it.n; j++) s += open(ringAt(P, arc, TZ + j * CH));
    it.lines.setAttribute("d", s);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.d, now)); if (!tdone(it.d, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, R, TZ + (it.n * CH) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), d = a < 0 ? (k === FAV ? REST : 0) : dd === 0 ? OUT : dd === 1 ? 9 : dd === 2 ? 3 : 0;
      tset(it.d, d, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "stack " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "coinstack",
  means: "Five coin stacks in a bank tray: the stack under the pointer slides forward out of the tray, its neighbours a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[186, 103], [150, 102], [295, 179], null],
  mount,
});
