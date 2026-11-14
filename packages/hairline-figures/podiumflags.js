/**
 * Flag stands: four poles on weighted feet along a low dais, a flag hanging
 * from the top of each. The pointer picks a stand by where it stands: its
 * flag runs up to the top and swings round to face the room, and the flags beside it
 * turn part of the way, staggered from it. At rest the flags hang at uneven
 * heights and angles and the second one faces out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, circ, fillet, fit, facing, poly, prism, proj, rad, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 32, DZ = 4, TOP = 74, FH = 22, FW = 26, FAV = 1, FACE = -45;
const REST = [70, FACE + 10, 110, 40], DROP = [16, 0, 22, 10];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const cyl = (P, front, x, y, r, z0, z1, b) => prism(P, front, disc(x, y, r), disc(x, y, r - b), z0, z1);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.75);
  const X1 = (N - 1) * STEP;
  fit(C, [[-14, -14, 0], [X1 + 14, 14, 0], [X1 + 14, -14, 0], [-14, 14, 0], [-FW, 0, TOP + 4], [X1 + FW, 0, TOP + 4], [0, FW, TOP], [X1, -FW, TOP]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [dr, di] = rings(-14, -14, X1 + 14, 14, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));

  const items = [];
  for (let k = 0; k < N; k++) {
    const x = k * STEP, grp = mk("g", {}, g);
    put(solid(grp), cyl(P, front, x, 0, 7, DZ, DZ + 3, 1.6));
    put(solid(grp), cyl(P, front, x, 0, 1.3, DZ + 3, TOP, 0.5));
    put(solid(grp), cyl(P, front, x, 0, 2.4, TOP, TOP + 3, 0.8));
    const flag = mk("path", { class: "sil" }, grp), hem = mk("path", { class: "nf lo" }, grp);
    items.push({ k, x, grp, flag, hem, a: tween(REST[k]), h: tween(DROP[k]), last: NaN });
  }

  function draw(it, deg, h) {
    if (deg + h * 1e3 === it.last) return;
    it.last = deg + h * 1e3;
    const c = Math.cos(rad(deg)), s = Math.sin(rad(deg)), x = it.x;
    // the cloth hangs a little lower at its fly end
    const corners = [[x + 1.4 * c, 1.4 * s, TOP - 2 - h], [x + FW * c, FW * s, TOP - 4 - h], [x + FW * c, FW * s, TOP - 4 - FH - h], [x + 1.4 * c, 1.4 * s, TOP - 2 - FH - h]];
    it.flag.setAttribute("d", poly(fillet(corners.map(([a, b, z]) => P(a, b, z)), [0.6, 1.5, 1.5, 0.6])));
    it.hem.setAttribute("d", poly([P(x + 4 * c, 4 * s, TOP - 5 - h), P(x + 4 * c, 4 * s, TOP - FH + 1 - h)]));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.a, now), tval(it.h, now)); if (!tdone(it.a, now) || !tdone(it.h, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, 0, TOP / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), to = a < 0 ? REST[k] : d === 0 ? FACE : d === 1 ? (REST[k] + FACE) / 2 + 12 : REST[k];
      const dl = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(it.a, to, now, dl);
      tset(it.h, a < 0 ? DROP[k] : d === 0 ? 0 : DROP[k] + 14, now, dl);
      it.flag.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "flag " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "podiumflags",
  means: "Four flag stands on a dais: the flag under the pointer runs up and swings to face the room, its neighbours turn part way after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[141, 138], [220, 178], [259, 198], null],
  mount,
});
