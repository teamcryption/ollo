/**
 * Pipette stand: a weighted base, a post at the end and a rail along the
 * back, with five pipettes hanging in front of it, each a grip, a thin tip
 * and a plunger button. The pointer picks a pipette by where it is along the
 * row: it lifts out of the stand, the others rise a little, staggered from
 * it. At rest they hang at uneven heights, one pulled half out, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row; the hit is each pipette's rest
 * centre on screen x.
 */
const {
  Cam, clamp, facing, fit, prism, proj, rings, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 12, X0 = 8, PY = 8, LIFT = 16, BUMP = 5;
const X1 = X0 + (N - 1) * STEP + 8;
const REST = [0, 3, 1, 8, 2], FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-8, -6, 0], [X1, 16, 0], [-8, 16, 0], [X1, -6, 0], [X0, PY, 66 + LIFT], [X1 - 8, PY, 66 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (parent, x0, y0, x1, y1, r, b, z0, z1) => {
    const s = solid(parent), [o, i] = rings(x0, y0, x1, y1, r, b);
    put(s, prism(P, front, o, i, z0, z1));
    return s;
  };

  // the stand: base, post and back rail
  box(g, -8, -6, X1, 16, 5, 1.6, 0, 5);
  box(g, -6, -3, 0, 3, 2.5, 0.8, 5, 50);
  box(g, -6, -3, X1 - 2, 3, 2, 0.8, 44, 49);
  // the rest cups on the base, one per pipette
  const cups = [];
  for (let k = 0; k < N; k++) {
    const x = X0 + k * STEP, cp = [];
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2; cp.push(P(x + 2.4 * Math.cos(a), PY + 2.4 * Math.sin(a), 5)); }
    cups.push("M" + cp.map((p) => p.map((v) => v.toFixed(2)).join(" ")).join("L") + "Z");
  }
  mk("path", { class: "nf lo", d: cups.join("") }, g);

  const pips = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    pips.push({ k, x: X0 + k * STEP, grp, tip: solid(grp), grip: solid(grp), btn: solid(grp), z: tween(REST[k]), last: NaN });
  }
  function draw(p, lift) {
    if (lift === p.last) return;
    p.last = lift;
    const x = p.x, z = 10 + lift;
    let [o, i] = rings(x - 1.3, PY - 1.3, x + 1.3, PY + 1.3, 1.3, 0.4);
    put(p.tip, prism(P, front, o, i, z, z + 24));
    [o, i] = rings(x - 3.4, PY - 3.4, x + 3.4, PY + 3.4, 3.4, 1);
    put(p.grip, prism(P, front, o, i, z + 22, z + 50));
    [o, i] = rings(x - 2.2, PY - 2.2, x + 2.2, PY + 2.2, 2.2, 0.7);
    put(p.btn, prism(P, front, o, i, z + 50, z + 55));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    pips.forEach((p) => { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest centre on screen x, inside the stand's band
  const top = P(X0, PY, 70)[1], bot = P(X1, 16, 0)[1];
  function hit([sx, sy]) {
    if (sy < top - 10 || sy > bot + 6) return -1;
    let best = -1, bd = 1e9;
    pips.forEach((p, k) => { const d = Math.abs(P(p.x, PY, 36)[0] - sx); if (d < bd) { bd = d; best = k; } });
    return bd < 22 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    pips.forEach((p, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(BUMP - Math.abs(k - a) * 2, 0, BUMP);
      tset(p.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      [p.tip, p.grip, p.btn].forEach((s) => s.sil.classList.toggle("hi", on));
    });
    read.textContent = a < 0 ? "rest" : "pip " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "pipetterack",
  means: "A pipette stand: the pipette under the pointer lifts out of the rack, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[158, 139], [202, 161], [246, 183], null],
  mount,
});
