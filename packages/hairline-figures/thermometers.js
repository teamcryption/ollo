/**
 * Thermometers: five glass thermometers standing in a rounded rack, each a
 * bulb and a tall tube with a few graduation ticks and a mercury column. The
 * pointer picks one by where it is along the row: it lifts out of the rack
 * and its column climbs to a fever, the neighbours rise a little after it.
 * At rest they stand at uneven heights, the middle one reading high, bright.
 * The slider is the stagger.
 *
 * The pattern: one of many in a single row, picked by rest centre on screen x.
 */
const {
  Cam, circ, clamp, facing, fit, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 5, STEP = 12, TOP = 8, BR = 3.8, TR = 2.5, BH = 8, TH = 46, LIFT = 16;
const REST = [0.2, 0.05, 0.45, 0.12, 0.28], FAV = 2, TEMPS = ["36.6", "37.1", "38.4", "36.9", "37.5"];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.9);
  const X1 = (N - 1) * STEP;
  fit(C, [[-7, -7, 0], [X1 + 7, 7, 0], [X1 + 7, -7, 0], [-7, 7, 0], [0, 0, TOP + LIFT + BH + TH], [X1, 0, TOP + LIFT + BH + TH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the rack: one rounded block with a cup per thermometer on its top
  const rack = solid(g), [ro, ri] = rings(-7, -7, X1 + 7, 7, 6, 1.2);
  put(rack, prism(P, front, ro, ri, 0, TOP));
  const cups = [];
  for (let k = 0; k < N; k++) {
    const pts = circ(BR + 1.2, 16).map((s) => P(k * STEP + s.u, s.v, TOP));
    cups.push("M" + pts.map((p) => p.join(",")).join("L") + "Z");
  }
  mk("path", { class: "nf lo", d: cups.join("") }, rack.g);

  const bulbRing = circ(BR, 16), bulbIn = circ(BR - 0.8, 16), tubeRing = circ(TR, 16), tubeIn = circ(TR - 0.6, 16);
  const items = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    items.push({ k, x: k * STEP, bulb: solid(grp), tube: solid(grp), col: mk("path", { class: "nf" }, grp), e: tween(REST[k]), last: NaN });
  }
  const shift = (ring, x) => ring.map((s) => ({ ...s, u: s.u + x }));
  function draw(it, e) {
    if (e === it.last) return;
    it.last = e;
    const z0 = TOP + e * LIFT, zb = z0 + BH, zt = zb + TH;
    put(it.bulb, prism(P, front, shift(bulbRing, it.x), shift(bulbIn, it.x), z0, zb));
    put(it.tube, prism(P, front, shift(tubeRing, it.x), shift(tubeIn, it.x), zb, zt));
    const fx = it.x + TR * 0.5, fy = TR * 0.5, lvl = zb + 4 + (TH - 10) * (0.25 + 0.7 * e);
    let d = seg(P(fx, fy, zb + 1), P(fx, fy, lvl));
    for (let t = 1; t <= 5; t++) { const z = zb + t * (TH / 6); d += seg(P(fx + 0.9, fy + 0.9, z), P(fx + 0.9, fy + 0.9, z + 0.01)) + seg(P(fx - 1.4, fy + 1.4, z), P(fx + 1.4, fy + 1.4, z)); }
    it.col.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    items.forEach((it) => { draw(it, tval(it.e, now)); if (!tdone(it.e, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: nearest rest centre along screen x, inside the row's band
  const cx = items.map((it) => P(it.x, 0, TOP)[0]);
  const yTop = P(0, 0, TOP + LIFT + BH + TH)[1] - 4, yBot = P(X1 + 7, 7, 0)[1] + 4;
  function hit([sx, sy]) {
    if (sy < yTop || sy > yBot) return -1;
    let best = -1, bd = 1e9;
    cx.forEach((x, k) => { const d = Math.abs(sx - x); if (d < bd) { bd = d; best = k; } });
    return bd < STEP * C.S * 0.75 + 6 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const e = a < 0 ? REST[k] : k === a ? 1 : clamp(0.3 - Math.abs(k - a) * 0.08, 0.05, 0.3);
      tset(it.e, e, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.bulb.sil.classList.toggle("hi", on);
      it.tube.sil.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : TEMPS[a] + "°";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "thermometers",
  means: "A rack of thermometers: the one under the pointer lifts out and its column climbs, the others rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 132], [225, 169], [249, 181], null],
  mount,
});
