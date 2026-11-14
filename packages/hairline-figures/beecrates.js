/**
 * Hive frames: a rack of honeycomb frames hanging by their lugs on two
 * rails, a stand under each end. The pointer picks a frame by where it is
 * along the rack: that frame lifts out high, its neighbours rise a little,
 * staggered from it. At rest the frames hang unevenly, one already half
 * drawn and bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), picked by rest centre.
 */
const {
  Cam, clamp, facing, fillet, fit, poly, prism, proj, rings, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 6, STEP = 9, X0 = 6, ZB = 4, ZT = 32, HW = 12, LUG = 18, T = 2, LIFT = 24;
const X1 = X0 + (N - 1) * STEP + 6, REST = [1, 4, 0, 12, 2, 5], FAV = 3;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[-4, -LUG - 3, 0], [X1 + 4, LUG + 3, 0], [X0, -LUG, ZT + 2 + LIFT], [X1, LUG, ZT + 2], [-4, LUG + 3, 0], [X1 + 4, -LUG - 3, ZT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the stand: a rail on each side, on two legs, the lugs resting on it
  function rail(parent, y) {
    for (const x of [0, X1 - 4]) { const [r, i] = rings(x, y - 1.5, x + 3, y + 1.5, 1.4, 0.5); put(solid(parent), prism(P, front, r, i, 0, ZT - 1)); }
    const [r, i] = rings(-4, y - 2, X1 + 4, y + 2, 1.6, 0.6);
    put(solid(parent), prism(P, front, r, i, ZT - 1, ZT + 1));
  }
  rail(mk("g", {}, g), -LUG + 2);
  const frames = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    frames.push({ k, x: X0 + k * STEP, far: mk("path", { class: "sil" }, grp), near: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }
  rail(mk("g", {}, g), LUG - 2);

  // a frame: a top bar with lugs over a comb panel, in the y–z plane
  const OUT = fillet([[-LUG, ZT + 2], [LUG, ZT + 2], [LUG, ZT], [HW, ZT], [HW, ZB], [-HW, ZB], [-HW, ZT], [-LUG, ZT]], [1, 1, 0.6, 0.6, 2, 2, 0.6, 0.6], 3);
  const HEX = [[-5, 20], [0, 17], [5, 20], [0, 23], [-5, 14], [5, 14], [0, 11]];
  function draw(f, lift) {
    if (lift === f.last) return;
    f.last = lift;
    const at = (x) => (p) => P(x, p[0], p[1] + lift);
    f.far.setAttribute("d", poly(OUT.map(at(f.x - T / 2))));
    f.near.setAttribute("d", poly(OUT.map(at(f.x + T / 2))));
    const xn = f.x + T / 2;
    let d = poly([[-HW + 2, ZB + 2], [HW - 2, ZB + 2], [HW - 2, ZT - 2], [-HW + 2, ZT - 2]].map(at(xn)));
    for (const [cy, cz] of HEX) {
      const h = [];
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; h.push([cy + 2.6 * Math.cos(a), cz + 2.6 * Math.sin(a)]); }
      d += poly(h.map(at(xn)));
    }
    f.cr.setAttribute("d", d);
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    frames.forEach((f) => { draw(f, tval(f.z, now)); if (!tdone(f.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the frame whose rest centre is nearest the pointer's screen x, inside the rack's band
  const centres = frames.map((f) => P(f.x, 0, (ZB + ZT) / 2));
  function hit([sx, sy]) {
    let best = -1, bd = 1e9;
    centres.forEach((c, k) => { const dx = Math.abs(sx - c[0]); if (dx < bd) { bd = dx; best = k; } });
    const c = centres[best];
    return bd < STEP * 2.4 && Math.abs(sy - c[1]) < 70 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    frames.forEach((f, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(8 - 3 * Math.abs(k - a), 0, 8);
      tset(f.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      f.far.classList.toggle("hi", on);
      f.near.classList.toggle("hi", on);
    });
    read.textContent = a < 0 ? "rest" : "frame " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "beecrates",
  means: "A rack of honeycomb hive frames: the frame under the pointer lifts out high, its neighbours rise a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[151, 168], [190, 187], [249, 217], null],
  mount,
});
