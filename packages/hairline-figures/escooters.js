/**
 * E-scooters: four electric scooters parked side by side at a charging strip,
 * each a deck on two wheels with a stem and a handlebar. The pointer picks a
 * scooter by where it stands: it rolls out toward the reader and its stem
 * lifts upright, and the scooters beside it ease out a little, staggered from
 * it. At rest the stems lean back at different angles, one scooter bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row (bookshelf); the pick is the
 * scooter whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, poly, prism, proj, rings, seg, facing, tdone, tset, tval, tween,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const N = 4, GAPX = 17, L = 26, WR = 3.4, DZ = 4.6, STEM = 30, BAR = 7, OUT = 14, FAV = 2;
const LEAN = [24, 38, 30, 46];
const X = (k) => k * GAPX;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.3);
  const X1 = X(N - 1);
  fit(C, [[-10, -12, 0], [X1 + 10, -12, 0], [-10, L + OUT + 4, 0], [X1 + 10, L + OUT + 4, 0], [0, L + OUT, DZ + STEM + 2], [X1, -8, 14]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the charging strip behind the row, a port per bay
  const [sr, si] = rings(-10, -12, X1 + 10, -5, 2, 0.8);
  put(solid(g), prism(P, front, sr, si, 0, 12));
  const ports = [];
  for (let k = 0; k < N; k++) { const d = flatDot(g, C, 1.3, "dot off"); place(d, P(X(k), -5, 8)); ports.push(d); }

  const wheel = (x, y) => {
    const pts = [];
    for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; pts.push(P(x, y + WR * Math.cos(a), WR + WR * Math.sin(a))); }
    return poly(pts);
  };
  const sc = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    const s = { k, grp, back: mk("path", { class: "sil" }, grp), deck: solid(grp), front: mk("path", { class: "sil" }, grp),
      stem: mk("path", { class: "nf sil" }, grp), bar: mk("path", { class: "nf sil" }, grp),
      y: tween(k === FAV ? 5 : 0), t: tween(LEAN[k]), last: "" };
    sc.push(s);
  }
  function draw(s, y, t) {
    const key = y.toFixed(2) + "," + t.toFixed(2);
    if (key === s.last) return;
    s.last = key;
    const x = X(s.k);
    s.back.setAttribute("d", wheel(x, y + WR));
    const [r, i] = rings(x - 3.2, y + 1, x + 3.2, y + L - 1, 2, 0.8);
    put(s.deck, prism(P, front, r, i, WR + 0.6, DZ + 0.8));
    s.front.setAttribute("d", wheel(x, y + L - WR));
    // the stem rises from the deck's front end, leaning back by t degrees
    const a = t * Math.PI / 180, fy = y + L - 2, top = [x, fy - STEM * Math.sin(a), DZ + STEM * Math.cos(a)];
    s.stem.setAttribute("d", seg(P(x - 0.7, fy, DZ), P(top[0] - 0.7, top[1], top[2])) + seg(P(x + 0.7, fy, DZ), P(top[0] + 0.7, top[1], top[2])));
    s.bar.setAttribute("d", seg(P(x - BAR, top[1], top[2]), P(x + BAR, top[1], top[2])) + seg(P(x - BAR, top[1] + 1.2, top[2]), P(x + BAR, top[1] + 1.2, top[2])));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const s of sc) { draw(s, tval(s.y, now), tval(s.t, now)); if (!tdone(s.y, now) || !tdone(s.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = sc.map((s) => P(X(s.k), L / 2, DZ));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 20 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    sc.forEach((s, k) => {
      const d = Math.abs(k - a);
      const y = a < 0 ? (k === FAV ? 5 : 0) : d === 0 ? OUT : d === 1 ? 4 : 0;
      const t = a < 0 ? LEAN[k] : d === 0 ? 0 : d === 1 ? LEAN[k] * 0.6 : LEAN[k];
      const delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(s.y, y, now, delay); tset(s.t, t, now, delay);
      const on = k === (a < 0 ? FAV : a);
      s.deck.sil.classList.toggle("hi", on);
      s.stem.classList.toggle("hi", on);
      s.bar.classList.toggle("hi", on);
      ports[k].setAttribute("class", on ? "dot m" : "dot off");
    });
    read.textContent = a < 0 ? "rest" : "scooter " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "escooters",
  means: "Four e-scooters at a charging strip: the one under the pointer rolls out and lifts its stem, its neighbours a little.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[150, 160], [200, 180], [250, 200], null],
  mount,
});
