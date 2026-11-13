/**
 * Wrenches: a fitted tray of six spanners lying in size order, each a flat
 * handle with an open jaw at one end and a ring at the other. The pointer
 * picks a spanner by where it lies: it lifts out of the tray, and the ones
 * beside it rise a little, staggered from it. At rest one spanner is lifted,
 * bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), lying flat.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const SIZES = [0.72, 0.8, 0.88, 0.96, 1.04, 1.12], GAP = 15, LEN = 74, TK = 1.6, LIFT = 14, FAV = 3;
const X1 = SIZES.length * GAP + 10;

/** A spanner's outline in its own plane (u along it, v across), scale s: an open jaw, a waisted handle, a ring. */
function outline(s) {
  const pts = [], jaw = 7 * s, ring = 6 * s, hw = 2.6 * s, L = LEN * (0.8 + 0.2 * s);
  // open jaw at u = 0: an arc with a notch
  for (let i = 0; i <= 10; i++) { const a = Math.PI * 0.55 + (Math.PI * 1.45 * i) / 10; pts.push([jaw * Math.cos(a), jaw * Math.sin(a)]); }
  pts.push([jaw * 0.2, -jaw * 0.35], [jaw * 0.2, jaw * 0.35]);
  const jawPts = pts.splice(0);
  const out = [];
  out.push([jaw * 0.6, hw], [L - ring * 1.1, hw]);
  for (let i = 0; i <= 14; i++) { const a = Math.PI * 0.75 - (Math.PI * 1.5 * i) / 14; out.push([L + ring * Math.cos(a), ring * Math.sin(a)]); }
  out.push([L - ring * 1.1, -hw], [jaw * 0.6, -hw]);
  // join: handle top edge, ring, handle bottom edge, then the jaw back round to the start
  return out.concat(jawPts.slice(0, 6).reverse().map(([u, v]) => [u, -Math.abs(v)]), [[jaw * 0.2, -jaw * 0.35], [jaw * 0.2, jaw * 0.35]], jawPts.slice(6).map(([u, v]) => [u, Math.abs(v)]));
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-6, -14, -4], [LEN + 20, X1, -4], [LEN + 20, -14, -4], [-6, X1, -4], [LEN / 2, 0, LIFT + 4]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-12, -14, LEN + 22, X1, 6, 2);
  put(solid(g), prism(P, front, tr, ti, -4, 0));

  const tools = SIZES.map((s, k) => {
    const y = k * GAP, grp = mk("g", {}, g);
    const edge = mk("path", { class: "lo" }, grp), face = mk("path", { class: "sil" }, grp);
    // its fitted recess in the tray
    return { k, s, y, shape: outline(s), grp, edge, face, z: tween(k === FAV ? LIFT * 0.7 : 0), last: NaN };
  });

  function draw(t, z) {
    if (z === t.last) return;
    t.last = z;
    const w = (u, v, zz) => P(u + 4, t.y + v, zz);
    t.edge.setAttribute("d", poly(t.shape.map(([u, v]) => w(u, v, 0.4 + z))));
    t.face.setAttribute("d", poly(t.shape.map(([u, v]) => w(u, v, 0.4 + z + TK))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const t of tools) { draw(t, tval(t.z, now)); if (!tdone(t.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = tools.map((t) => P(LEN / 2, t.y, 1));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    // across the row the spanners lie along +y: the screen direction of y picks them
    mids.forEach((m, k) => { const dd = Math.hypot(m[0] - sx, m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 60 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    tools.forEach((t, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? LIFT * 0.7 : 0) : dd === 0 ? LIFT : dd === 1 ? 4 : 0;
      tset(t.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      t.face.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "spanner " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "wrenches",
  means: "A tray of six spanners in size order: the one under the pointer lifts out, and its neighbours rise a little.",
  rules: [1, 2, 5, 9],
  range: [0, 45, 90],
  tour: [[251, 122], [187, 154], [145, 175], null],
  mount,
});
