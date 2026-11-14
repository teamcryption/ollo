/**
 * Floppy disks: five disks standing on edge in a low rack, each with its
 * clipped corner and a metal shutter along the top. The pointer picks a disk
 * by where it stands: it slides up out of the rack, and the disks beside it
 * rise a little, staggered from it. At rest one disk stands half drawn,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const {
  Cam, fit, facing, fillet, hull, open, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 13, T = 3, W = 38, H = 38, LIFT = 26, FAV = 2, BZ = 4;
const REST = [0, 3, 15, 1, 0];
const X1 = (N - 1) * STEP + T;
// the disk's outline in its own (y, z) plane: a square with one clipped corner
const FACE = fillet([[0, 0], [W, 0], [W, H], [6, H], [0, H - 6]], [1.5, 1.5, 1.5, 1, 1], 3);
const rect = (y0, z0, y1, z1) => fillet([[y0, z0], [y1, z0], [y1, z1], [y0, z1]], [1, 1, 1, 1], 2);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-6, -5, 0], [X1 + 6, W + 5, 0], [X1 + 6, -5, 0], [-6, W + 5, 0], [0, 0, BZ + H + LIFT], [X1, W, BZ + H + LIFT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-6, -5, X1 + 6, W + 5, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the rack's slots: one dim groove per disk
  const slots = mk("path", { class: "nf lo" }, g);
  let sd = "";
  for (let k = 0; k < N; k++) {
    const x = k * STEP;
    sd += open([P(x - 0.8, 0, BZ), P(x - 0.8, W, BZ), P(x + T + 0.8, W, BZ)]);
  }
  slots.setAttribute("d", sd);

  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({
      k, x: k * STEP, grp,
      sil: mk("path", { class: "sil" }, grp),
      face: mk("path", { class: "nf lo" }, grp),
      shut: mk("path", { class: "nf lo" }, grp),
      z: tween(REST[k]), last: NaN,
    });
  }

  function draw(it, lift) {
    if (lift === it.last) return;
    it.last = lift;
    const z0 = BZ + lift, at = (x, pts) => pts.map(([y, z]) => P(x, y, z0 + z));
    const back = at(it.x, FACE), fr = at(it.x + T, FACE);
    it.sil.setAttribute("d", poly(hull(back.concat(fr))));
    it.face.setAttribute("d", poly(fr));
    // the metal shutter along the top edge, with its window
    it.shut.setAttribute("d", poly(at(it.x + T, rect(11, H - 15, 29, H))) + poly(at(it.x + T, rect(20, H - 12, 25, H - 3))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => P(it.x + T / 2, W / 2, BZ + H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 && Math.abs(mids[best][1] - sy) < 100 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? REST[k] : dd === 0 ? LIFT : dd === 1 ? 6 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "disk " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "floppydisks",
  means: "Five floppy disks standing in a rack: the disk under the pointer slides up out of its slot, and its neighbours rise a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[173, 130], [221, 154], [245, 166], null],
  mount,
});
