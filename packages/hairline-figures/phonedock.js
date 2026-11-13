/**
 * Phone dock: a long charging dock with four phones standing in its slots,
 * each leaning back a little. The pointer picks a phone by where it is along
 * the row: that phone lifts out of its slot and tilts back, its neighbours
 * lift a little, staggered from it. At rest the phones sit at uneven depths,
 * the third one bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (toaster); the hit is the nearest
 * rest centre along the screen's x.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, poly, prism, proj, rings, ringAt, rrect, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Q = -Math.PI / 4, cQ = Math.cos(Q), sQ = Math.sin(Q);
const W = (u, v) => [u * cQ - v * sQ, u * sQ + v * cQ];
const turn = (ring) => ring.map((q) => ({ u: q.u * cQ - q.v * sQ, v: q.u * sQ + q.v * cQ, nu: q.nu * cQ - q.nv * sQ, nv: q.nu * sQ + q.nv * cQ }));
const N = 4, STEP = 18, U0 = -27, HW = 7, TH = 0.9, TOP = 7, VIS = 24, LIFT = 21, BUMP = 7;
const REST = [2, 0.5, 5, 1], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.6);
  const ext = [];
  for (const u of [-40, 40]) ext.push([...W(u, 8), 0], [...W(u, -8), 0], [...W(u, -15), TOP + VIS + LIFT]);
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the dock: one rounded bar, a slot per phone along its top
  const [br, bi] = rings(-40, -8, 40, 8, 6, 1.4);
  const dock = solid(g);
  put(dock, prism(P, front, turn(br), turn(bi), 0, TOP));
  const slots = [];
  for (let k = 0; k < N; k++) { const u = U0 + k * STEP; slots.push(poly(ringAt(P, turn(rrect(u - HW - 1, -1.6, u + HW + 1, 1.6, 1.4, 4)), TOP))); }
  mk("path", { class: "nf lo", d: slots.join("") }, dock.g);

  const phones = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    phones.push({ k, u: U0 + k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }

  // a phone: a rounded profile in the u–h plane, leaning back by t, a thickness along v
  function face(u, h, d, t, inset) {
    const a = inset, pts = [[-HW + a, a + 1.4], [HW - a, a + 1.4], [HW - a, h - a], [-HW + a, h - a]];
    return fillet(pts, inset ? [1.2, 1.2, 2.4, 2.4] : [0.6, 0.6, 3.4, 3.4], 4)
      .map(([pu, ph]) => P(...W(u + pu, d - ph * Math.sin(t)), TOP + ph * Math.cos(t)));
  }
  function draw(p, lift) {
    if (lift === p.last) return;
    p.last = lift;
    const h = VIS + lift, t = 0.14 + lift * 0.012;
    const near = face(p.u, h, TH, t, 0), far = face(p.u, h, -TH, t, 0);
    p.sil.setAttribute("d", poly(hull(near.concat(far))));
    p.cr.setAttribute("d", poly(face(p.u, h, TH + 0.05, t, 1.3)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    phones.forEach((p) => { draw(p, tval(p.z, now)); if (!tdone(p.z, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the rest centres along the screen's x, inside the row's band
  const cx = phones.map((p) => P(...W(p.u, 0), TOP + VIS / 2)[0]);
  const yTop = P(...W(0, -15), TOP + VIS + LIFT)[1] - 6, yBot = P(...W(0, 8), 0)[1] + 6, half = (cx[1] - cx[0]) / 2 + 4;
  function hit([sx, sy]) {
    if (sy < yTop || sy > yBot) return -1;
    let best = -1, bd = Infinity;
    cx.forEach((x, k) => { const d = Math.abs(sx - x); if (d < bd) { bd = d; best = k; } });
    return bd < half ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    phones.forEach((p, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : clamp(BUMP - 2 * Math.abs(k - a), 0, BUMP);
      tset(p.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      p.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "phone " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "phonedock",
  means: "A dock of four phones: the phone under the pointer lifts out of its slot and tilts back, its neighbours lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[101, 154], [231, 154], [296, 154], null],
  mount,
});
