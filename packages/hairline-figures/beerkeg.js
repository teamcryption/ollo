/**
 * Beer kegs: five kegs lying on their sides in a cellar, three on a pair of
 * timber rails and two nested on top. The pointer picks a keg by the rest
 * place of its front end: the keg slides out along its own length toward
 * the reader, and the kegs beside it ease out a little, staggered from it.
 * At rest one top keg sits half drawn, bright. The slider is the stagger.
 *
 * The pattern: stepped parts, picked on their rest pose, dynamic paint order.
 */
const {
  Cam, fit, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 14, LEN = 46, OUT = 34, FAV = 3;
const KEGS = [[15, 0], [45, 0], [75, 0], [30, 1], [60, 1]].map(([x, t]) => ({ x, t, z: 3 + R + t * (R * 1.72) }));
const REST = [4, 0, 9, 16, 2];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-2, 0, 0], [92, LEN + OUT, 0], [92, 0, 0], [-2, LEN + OUT, 0], [45, 0, 3 + 2 * R + R * 1.72 + R], [45, LEN + OUT, 3 + 2 * R + R * 1.72 + R]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  for (const y of [5, LEN - 11]) { const [r, i] = rings(-2, y, 92, y + 6, 1.5, 1); put(solid(g), prism(P, front, r, i, 0, 3)); }
  const hoop = (x, y, z, r, a0, a1, n = 24) => {
    const pts = [];
    for (let j = 0; j <= n; j++) { const a = a0 + ((a1 - a0) * j) / n; pts.push(P(x + r * Math.cos(a), y, z + r * Math.sin(a))); }
    return pts;
  };
  const kegs = KEGS.map((k, i) => {
    const grp = mk("g", {}, g);
    const body = mk("path", { class: "sil" }, grp), ribs = mk("path", { class: "nf lo" }, grp);
    const end = mk("path", { class: "nf" }, grp), chime = mk("path", { class: "nf lo" }, grp);
    return { i, ...k, grp, body, ribs, end, chime, dy: tween(REST[i]), last: NaN, key: 0 };
  });

  function draw(k, dy) {
    if (dy === k.last) return;
    k.last = dy;
    const y0 = dy, y1 = dy + LEN, mid = (y0 + y1) / 2;
    const b = hoop(k.x, y0, k.z, R - 1.5, 0, 2 * Math.PI, 32).concat(hoop(k.x, y0 + 4, k.z, R, 0, 2 * Math.PI, 32), hoop(k.x, mid, k.z, R + 0.8, 0, 2 * Math.PI, 32), hoop(k.x, y1 - 4, k.z, R, 0, 2 * Math.PI, 32), hoop(k.x, y1, k.z, R - 1.5, 0, 2 * Math.PI, 32));
    k.body.setAttribute("d", poly(hull(b)));
    k.ribs.setAttribute("d", [y0 + 4, mid, y1 - 4].map((y, j) => open(hoop(k.x, y, k.z, j === 1 ? R + 0.8 : R, -0.6, Math.PI + 0.6))).join(" "));
    k.end.setAttribute("d", poly(hoop(k.x, y1, k.z, R - 1.5, 0, 2 * Math.PI, 32)));
    k.chime.setAttribute("d", poly(hoop(k.x, y1 + 0.1, k.z, 3, 0, 2 * Math.PI, 16)));
  }

  let order = "";
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const k of kegs) { const v = tval(k.dy, now); draw(k, v); k.key = v + (k.t ? 10 : 0) + k.x * 0.01; if (!tdone(k.dy, now)) moving = true; }
    const sorted = kegs.slice().sort((a, b) => a.key - b.key), o = sorted.map((k) => k.i).join();
    if (o !== order) { order = o; sorted.forEach((k) => g.appendChild(k.grp)); }
    return moving;
  });
  bag.add(B.unregister);

  const ends = kegs.map((k) => P(k.x, LEN, k.z));
  function hit([sx, sy]) {
    let best = -1, bd = R * 1.9 * 1.3;
    ends.forEach((m, i) => { const d = Math.hypot(m[0] - sx, m[1] - sy); if (d < bd) { bd = d; best = i; } });
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    kegs.forEach((k, i) => {
      const near = a >= 0 && Math.abs(k.x - kegs[a].x) <= 15 && i !== a;
      const v = a < 0 ? REST[i] : i === a ? OUT : near ? 6 : 0;
      tset(k.dy, v, now, from < 0 ? 0 : Math.abs(k.x - kegs[from].x) / 15 * stag);
      k.body.classList.toggle("hi", i === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "keg " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beerkeg",
  means: "Five kegs lying stacked in a cellar: the keg under the pointer slides out along its length, its neighbours easing out after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[144, 162], [191, 186], [214, 152], null],
  mount,
});
