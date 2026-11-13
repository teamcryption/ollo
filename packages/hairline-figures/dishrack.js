/**
 * Dish rack: a low drip tray with wire rails front and back, seven plates
 * standing in its slots, leaning back unevenly, and a cutlery cup at the end
 * with handles standing in it. The pointer picks a plate by where it stands:
 * it tilts up and out of its slot, and the plates beside it lift a little,
 * staggered from it. At rest one plate sits a little proud, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the plate
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, hull, open, poly, prism, proj, rad, rings, seg, tdone, tset, tval, tween, facing,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 7, STEP = 9, X0 = 9, YC = 16, RP = 14, T = 0.9, BASE = 3, FAV = 3;
const LEAN = [-9, -6, -10, -5, -8, -6, -9], LIFT0 = [0, 1, 0, 5, 0, 1.5, 0];
const XT = X0 + (N - 1) * STEP + 8, CX = XT + 11, CR = 6.5, CH = 15, X1 = CX + CR + 4;

/** A plate standing at x, lifted by lift and leaning by lean degrees about its foot: back, front and well rings. */
function plate(x, lift, lean) {
  const l = rad(lean), ux = Math.sin(l), uz = Math.cos(l), nx = Math.cos(l), nz = -Math.sin(l);
  const ring = (rr, off) => {
    const o = [];
    for (let i = 0; i < 30; i++) {
      const a = (i / 30) * Math.PI * 2, h = RP + rr * Math.sin(a);
      o.push([x + ux * h + nx * off, YC + rr * Math.cos(a), BASE + lift + uz * h + nz * off]);
    }
    return o;
  };
  return { back: ring(RP * 0.92, -T), front: ring(RP, T), well: ring(RP * 0.6, T) };
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  const ext = [[0, -4, 0], [X1, 36, 0], [X1, -4, 0], [0, 36, 0], [CX + 6, YC, CH + 16]];
  for (const lean of [-10, 6]) ext.push(...plate(X0, 13, lean).front, ...plate(X0 + (N - 1) * STEP, 13, lean).front);
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C), pr = (a) => a.map((q) => P(...q));
  const g = mk("g", {}, svg);

  // the drip tray, then the back rail with its tines
  const [tr, ti] = rings(0, -4, X1, 36, 6, 1.6);
  put(solid(g), prism(P, front, tr, ti, 0, BASE));
  const rail = (y) => {
    let d = seg(P(X0 - 5, y, BASE), P(X0 - 5, y, 10)) + seg(P(XT - 3, y, BASE), P(XT - 3, y, 10)) + seg(P(X0 - 5, y, 10), P(XT - 3, y, 10));
    for (let k = 0; k <= N; k++) d += seg(P(X0 - STEP / 2 + k * STEP, y, 10), P(X0 - STEP / 2 + k * STEP, y, 16));
    return d;
  };
  mk("path", { class: "nf lo", d: rail(-1) }, g);

  const plates = LEAN.map((_, k) => {
    const grp = mk("g", {}, g);
    return { k, x: X0 + k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), lift: tween(LIFT0[k]), lean: tween(LEAN[k]), last: "" };
  });
  // the front rail stands nearer than every plate
  mk("path", { class: "nf", d: rail(33) }, g);

  // the cutlery cup, then the handles rising from its open mouth
  const cup = solid(g);
  const [cr, ci] = rings(CX - CR, YC - CR, CX + CR, YC + CR, CR, 1);
  put(cup, prism(P, front, cr, ci, BASE, CH));
  cup.cr.setAttribute("d", poly(pr(ci.map((s) => [s.u, s.v, CH]))));
  let hs = "";
  for (const [dx, dy, h, spoon] of [[-2.5, -2, 15, 0], [1.5, -3, 18, 1], [-1, 1.5, 12, 0], [2.5, 1.5, 16, 0]]) {
    const top = [CX + dx * 1.7, YC + dy * 1.7, CH + h];
    hs += seg(P(CX + dx, YC + dy, CH), P(...top));
    if (spoon) { const e = []; for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; e.push(P(top[0] + 1.6 * Math.cos(a), top[1], top[2] + 1.2 + 2.6 * Math.sin(a))); } hs += poly(e); }
  }
  mk("path", { class: "nf", d: hs }, g);

  function draw(p, lift, lean) {
    const key = lift.toFixed(2) + "," + lean.toFixed(2);
    if (key === p.last) return;
    p.last = key;
    const w = plate(p.x, lift, lean);
    p.sil.setAttribute("d", poly(hull(pr(w.back).concat(pr(w.front)))));
    p.cr.setAttribute("d", poly(pr(w.well)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const p of plates) { draw(p, tval(p.lift, now), tval(p.lean, now)); if (!tdone(p.lift, now) || !tdone(p.lean, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  /** The plate whose resting middle is nearest the pointer's x on screen, within the plates' height. */
  const mids = plates.map((p) => P(p.x, YC, BASE + RP));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const d = Math.abs(m[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 14 && Math.abs(mids[best][1] - sy) < RP * 2.6 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    plates.forEach((p, k) => {
      const d = Math.abs(k - a), delay = from < 0 ? 0 : Math.abs(k - from) * stag;
      tset(p.lift, a < 0 ? LIFT0[k] : d === 0 ? 13 : d === 1 ? 4 : d === 2 ? 1.5 : 0, now, delay);
      tset(p.lean, a < 0 || d > 1 ? LEAN[k] : d === 0 ? 5 : LEAN[k] * 0.5, now, delay);
      p.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "plate " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "dishrack",
  means: "A dish rack: the plate under the pointer tilts up out of its slot, the plates beside it lift a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[132, 128], [181, 152], [231, 177], null],
  mount,
});
