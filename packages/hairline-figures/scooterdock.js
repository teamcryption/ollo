/**
 * Mopeds: four scooters parked side by side in a bay, noses out. The
 * pointer picks one by where it stands along the row: it rolls forward out
 * of the line, bright, and the ones beside it ease forward a little,
 * staggered from it. At rest the second one sits half out. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 24, OUT = 26, FAV = 1, R = 6.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  const X1 = (N - 1) * STEP;
  fit(C, [[-12, -4, 0], [X1 + 12, 36 + OUT, 0], [X1 + 12, -4, 0], [-12, 36 + OUT, 0], [0, 30, 30], [X1, 30 + OUT, 30]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g), parts = {};
    for (const n of ["rw", "body", "seat", "fw", "col", "bar"]) parts[n] = n === "rw" || n === "fw" ? mk("path", { class: "sil" }, grp) : solid(grp);
    items.push({ k, cx: k * STEP, grp, parts, y: tween(k === FAV ? OUT * 0.5 : 0), last: NaN });
  }

  const wheel = (cx, cy) => { const pts = []; for (let i = 0; i < 30; i++) { const t = (i / 30) * 2 * Math.PI; pts.push(P(cx, cy + R * Math.cos(t), R + R * Math.sin(t))); } return poly(pts); };
  const box = (s, x0, y0, x1, y1, r, b, z0, z1) => { const [a, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, a, i, z0, z1)); };

  function draw(it, dy) {
    if (dy === it.last) return;
    it.last = dy;
    const c = it.cx, y = dy, p = it.parts;
    p.rw.setAttribute("d", wheel(c, y + 6));
    box(p.body, c - 4.5, y + 4, c + 4.5, y + 24, 3.5, 1.2, R, 17);
    box(p.seat, c - 5, y + 6, c + 5, y + 19, 3.5, 1.2, 17, 20.5);
    p.fw.setAttribute("d", wheel(c, y + 32));
    box(p.col, c - 3, y + 26, c + 3, y + 31, 2, 0.8, R + 3, 30);
    box(p.bar, c - 10, y + 27.5, c + 10, y + 30, 1.2, 0.4, 30, 32);
  }

  let order = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.y, now)); if (!tdone(it.y, now)) moving = true; }
    // paint by nearness: x + y of each scooter's middle
    const sorted = items.slice().sort((a, b) => a.cx + a.last - (b.cx + b.last)), key = sorted.map((i) => i.k).join();
    if (key !== order) { order = key; sorted.forEach((i) => g.appendChild(i.grp)); }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.cx, 16, 12));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), y = a < 0 ? (k === FAV ? OUT * 0.5 : 0) : dd === 0 ? OUT : dd === 1 ? 5 : 0;
      tset(it.y, y, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.parts.seat.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
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
  name: "scooterdock",
  means: "Four mopeds parked in a bay: the one under the pointer rolls forward out of the line, and its neighbours ease out a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[150, 150], [250, 200], [200, 175], null],
  mount,
});
