/**
 * Fuel pump: a pump cabinet on its island, with a screen and three nozzles
 * hung in holsters along its front. The pointer picks a nozzle by where it
 * stands; that nozzle lifts out of its holster on its hose, and the ones
 * beside it rock a little, staggered. At rest the middle nozzle is half out,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const XS = [-13, 0, 13], FAV = 1, LIFT = 24, FY = 14;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-34, -24, 0], [34, 30, 0], [34, -24, 0], [-34, 30, 0], [-20, -14, 84], [20, 14, 84]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ir, ii] = rings(-34, -24, 34, 30, 7, 2);
  put(solid(g), prism(P, front, ir, ii, 0, 4));
  const [pr, pi] = rings(-20, -14, 20, FY, 5, 1.6);
  put(solid(g), prism(P, front, pr, pi, 4, 84));
  mk("path", { d: poly([P(-14, FY, 60), P(14, FY, 60), P(14, FY, 76), P(-14, FY, 76)]), class: "nf lo" }, g);
  const [hr, hi_] = rings(-24, -16, 24, FY + 2, 4, 1.4);
  put(solid(g), prism(P, front, hr, hi_, 84, 88));

  const items = XS.map((x, k) => {
    mk("path", { d: poly([P(x - 4, FY, 30), P(x + 4, FY, 30), P(x + 4, FY, 44), P(x - 4, FY, 44)]), class: "nf lo" }, g);
    const grp = mk("g", {}, g), hose = mk("path", { class: "nf lo" }, grp), nz = solid(grp);
    return { k, x, hose, nz, z: tween(k === FAV ? LIFT * 0.5 : 0), last: NaN };
  });

  function draw(it, l) {
    if (l === it.last) return;
    it.last = l;
    const x = it.x, y0 = FY + 1 + l * 0.35, z0 = 32 + l;
    const [r, i] = rings(x - 4, y0, x + 4, y0 + 6, 2, 0.9);
    put(it.nz, prism(P, front, r, i, z0, z0 + 13));
    const pts = [];
    for (let s = 0; s <= 10; s++) { const t = s / 10; pts.push(P(x + 1.5, FY + (y0 + 2.5 - FY) * t + Math.sin(t * Math.PI) * 6, 16 + (z0 - 16) * t - Math.sin(t * Math.PI) * 6)); }
    it.hose.setAttribute("d", open([P(x + 1.5, FY, 16)].concat(pts)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x, FY, 38));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 16 && Math.abs(mids[best][1] - sy) < 50 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.5 : 0) : dd === 0 ? LIFT : dd === 1 ? 3 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.nz.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "pump " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "fuelpump",
  means: "A fuel pump with three nozzles on its front: the nozzle under the pointer lifts out of its holster on its hose.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[163, 163], [203, 183], [183, 173], null],
  mount,
});
