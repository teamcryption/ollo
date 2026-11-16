/**
 * Surf rack: five boards standing on edge in a floor rack between two end posts. The pointer picks a board by where it stands: it slides forward out of its slot, its neighbours ease out after it. At rest one board is out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle).
 */
const { Cam, fit, facing, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

// static parts [x0, y0, x1, y1, z0, z1, r]
const BASE = [[-10,-4,72,26,0,4,4],[-14,6,-8,18,4,40,2],[70,6,76,18,4,40,2]];
// item parts, relative to the item's origin [x0, y0, x1, y1, z0, z1, r, moves]
const PART = [[-2.5,0,2.5,22,5,62,2.2,1],[-0.8,18,0.8,23,10,20,0.6,1]];
const ORG = [[2,0],[17,0],[32,0],[47,0],[62,0]];
const MOVE = [0,26,4], REST = [0.1,0.85,0.25,0,0.15], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  const pts = [];
  const corners = (b, ox, oy, oz) => { for (const x of [b[0], b[2]]) for (const y of [b[1], b[3]]) for (const z of [b[4], b[5]]) pts.push([x + ox, y + oy, z + oz]); };
  BASE.forEach((b) => corners(b, 0, 0, 0));
  ORG.forEach(([ox, oy]) => PART.forEach((b) => { corners(b, ox, oy, 0); if (b[7]) corners(b, ox + MOVE[0], oy + MOVE[1], MOVE[2]); }));
  fit(C, pts, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (s, b, dx, dy, dz) => {
    const [ring, inner] = rings(b[0] + dx, b[1] + dy, b[2] + dx, b[3] + dy, b[6], Math.min(1.5, b[6] * 0.6 + 0.4));
    put(s, prism(P, front, ring, inner, b[4] + dz, b[5] + dz));
  };
  BASE.forEach((b) => box(solid(g), b, 0, 0, 0));
  const items = ORG.map(([ox, oy], k) => {
    const grp = mk("g", {}, g);
    const parts = PART.map((b) => ({ b, s: solid(grp) }));
    return { k, ox, oy, parts, t: tween(REST[k]), last: NaN };
  });
  function draw(it, s) {
    if (s === it.last) return;
    it.last = s;
    for (const p of it.parts) box(p.s, p.b, it.ox + (p.b[7] ? MOVE[0] * s : 0), it.oy + (p.b[7] ? MOVE[1] * s : 0), p.b[7] ? MOVE[2] * s : 0);
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.t, now)); if (!tdone(it.t, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = items.map((it) => { const b = PART[0]; return P(it.ox + (b[0] + b[2]) / 2, it.oy + (b[1] + b[3]) / 2, (b[4] + b[5]) / 2); });
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 30 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const d = Math.abs(k - a), s = a < 0 ? REST[k] : d === 0 ? 1 : d === 1 ? 0.35 : 0.08;
      tset(it.t, s, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.parts.forEach((p) => p.s.sil.classList.toggle("hi", !!p.b[7] && k === (a < 0 ? FAV : a)));
    });
    read.textContent = a < 0 ? "rest" : "board " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "surfrack",
  means: "Five surfboards stand on edge in a rack: the board under the pointer slides out of its slot, and its neighbours ease out after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[186, 134], [158, 120], [268, 176], null],
  mount,
});
