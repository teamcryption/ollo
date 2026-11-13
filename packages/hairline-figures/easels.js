/**
 * Easels: an art studio with three easels in a row, each an A-frame of two
 * front legs and a back leg with a ledge, holding a canvas of its own size.
 * The pointer picks an easel by where it stands: its canvas lifts off the
 * ledge and tilts forward toward the painter, and the canvases beside it
 * stir a little, staggered from it. At rest the canvases lean back at
 * different angles, the middle one raised, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the easel
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rad, rings, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const EX = [0, 46, 92], CW = [26, 36, 20], CH = [34, 28, 24], LZ = 20, YB = 7, T = 2, FAV = 1;
const PHI = [13, 5, 16], LIFT0 = [0, 6, 0];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-14, -24, 0], [106, 12, 0], [-14, 12, 0], [106, -24, 0], [0, -12, 68], [46, 9, LZ + 14 + 30], [92, -12, 68]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const easels = EX.map((ex, k) => {
    const grp = mk("g", {}, g);
    const top = [ex, -12, 68];
    const leg = (a, b) => "M" + P(...a).join(",") + "L" + P(...b).join(",");
    mk("path", { class: "nf sil", d: leg([ex, -24, 0], [ex, -10, 64]) + leg([ex - 13, 6, 0], top) + leg([ex + 13, 6, 0], top) }, grp);
    const [r, i] = rings(ex - 16, 1, ex + 16, 10, 1.6, 0.6);
    put(solid(grp), prism(P, front, r, i, LZ - 2.2, LZ));
    return { k, ex, w: CW[k], h: CH[k], sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), phi: tween(PHI[k]), z: tween(LIFT0[k]), last: "" };
  });

  // the canvas: u across, v up its face, w through its depth; leaning back by phi from its foot
  function draw(e, phi, lift) {
    const key = phi.toFixed(2) + "," + lift.toFixed(2);
    if (key === e.last) return;
    e.last = key;
    const p = rad(phi), at = (s, w) => P(s.u, YB - s.v * Math.sin(p) + w * Math.cos(p), LZ + lift + s.v * Math.cos(p) + w * Math.sin(p));
    const ring = rrect(e.ex - e.w / 2, 0, e.ex + e.w / 2, e.h, 1.4, 4);
    e.sil.setAttribute("d", poly(hull(ring.map((s) => at(s, 0)).concat(ring.map((s) => at(s, T))))));
    const inner = rrect(e.ex - e.w / 2 + 2.2, 2.2, e.ex + e.w / 2 - 2.2, e.h - 2.2, 0.8, 4);
    e.cr.setAttribute("d", poly(inner.map((s) => at(s, T))));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const e of easels) { draw(e, tval(e.phi, now), tval(e.z, now)); if (!tdone(e.phi, now) || !tdone(e.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = easels.map((e) => P(e.ex, YB, LZ + e.h / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 40 && Math.abs(mids[best][1] - sy) < 90 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    easels.forEach((e, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : d * stag;
      tset(e.phi, a < 0 ? PHI[k] : d === 0 ? -8 : d === 1 ? 7 : 11, now, delay);
      tset(e.z, a < 0 ? LIFT0[k] : d === 0 ? 12 : d === 1 ? 3 : 0, now, delay);
      e.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "canvas " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "easels",
  means: "Three easels in a studio: the canvas under the pointer lifts off its ledge and tilts forward, its neighbours stir a little.",
  rules: [1, 2, 5, 6],
  range: [0, 50, 100],
  tour: [[114, 140], [181, 166], [248, 206], null],
  mount,
});
