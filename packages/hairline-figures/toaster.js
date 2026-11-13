/**
 * Toaster: a four-slot toaster, a rounded body with a slot per slice along
 * its top, a lever in its groove and a browning dial on the end, and a slice
 * of bread standing in each slot. The pointer picks a slot by where it is
 * along the toaster: that slice pops up high, the others pop a little,
 * staggered from it, and the lever rises with them. At rest the bread is
 * toasting low, one slice peeking out, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the hit is on a fixed
 * plane through the slices' resting tops.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, STEP = 13, XS0 = 11, TOP = 32, Y0 = -4, Y1 = 38, SW = 3, VIS = 11, LIFT = 24, BUMP = 6;
const X1 = XS0 + (N - 1) * STEP + 11;
const REST = [2, 0, 7, 1], FAV = 2, LX = (X1 - 2) / 2, LZ = [9, 24];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[-2, Y0, 0], [X1, Y1 + 5, 0], [X1, Y0, 0], [-2, Y1 + 5, 0], [XS0, 4, TOP + VIS + LIFT], [XS0, 32, TOP + VIS + LIFT]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the body: one rounded solid, with the slot openings on its top
  const outer = rrect(-2, Y0, X1, Y1, 10, 12), inner = rrect(-0.8, Y0 + 1.2, X1 - 1.2, Y1 - 1.2, 8.8, 12);
  const body = solid(g);
  put(body, prism(P, front, outer, inner, 0, TOP));
  const slots = [];
  for (let k = 0; k < N; k++) slots.push(poly(ringAt(P, rrect(XS0 + k * STEP - 3, 4, XS0 + k * STEP + 3, 32, 2.5, 4), TOP)));
  mk("path", { class: "nf lo", d: slots.join("") }, body.g);
  // the end facing us: the lever's groove and the browning dial
  const dial = [];
  for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2; dial.push(P(X1 - 16 + 4 * Math.cos(a), Y1, 13 + 4 * Math.sin(a))); }
  mk("path", { class: "nf lo", d: seg(P(LX, Y1, LZ[0] - 2), P(LX, Y1, LZ[1] + 4)) + poly(dial) + seg(P(X1 - 16, Y1, 13), P(X1 - 16, Y1, 16)) }, body.g);

  // a slice: a bread profile in the y–z plane, rounded crown, given a thickness along x
  const slices = [];
  for (let k = 0; k < N; k++) {
    const grp = mk("g", {}, g);
    slices.push({ k, x: XS0 + k * STEP, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp), z: tween(REST[k]), last: NaN });
  }
  const lever = solid(g), lz = tween(LZ[0]);
  let leverLast = NaN;

  function profile(x, h) {
    const zt = TOP + h, zs = Math.max(TOP + 3, zt - 8);
    const pts = [[6, TOP], [30, TOP], [30, zs - 2], [31.5, zs], [29, zt], [7, zt], [4.5, zs], [6, zs - 2]];
    return fillet(pts, [0, 0, 2, 3, 4.5, 4.5, 3, 2], 4).map(([y, z]) => [x, y, z]);
  }
  function draw(s, lift) {
    if (lift === s.last) return;
    s.last = lift;
    const h = VIS + lift, near = profile(s.x + SW / 2, h), far = profile(s.x - SW / 2, h);
    s.sil.setAttribute("d", poly(hull(near.concat(far).map((p) => P(...p)))));
    s.cr.setAttribute("d", open(near.filter((p) => p[2] > TOP + 0.5).map((p) => P(...p))));
  }
  function drawLever(z) {
    if (z === leverLast) return;
    leverLast = z;
    const [r, i] = rings(LX - 6, Y1, LX + 6, Y1 + 5, 1.6, 0.6);
    put(lever, prism(P, front, r, i, z, z + 2.6));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    slices.forEach((s) => { draw(s, tval(s.z, now)); if (!tdone(s.z, now)) moving = true; });
    drawLever(tval(lz, now));
    return moving || !tdone(lz, now);
  });
  bag.add(B.unregister);

  // the hit: the pointer on a fixed plane through the resting slices, nearest slot along x
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, TOP + VIS * 0.6);
    if (x < -4 || x > X1 + 2 || y < Y0 - 4 || y > Y1 + 2) return -1;
    return clamp(Math.round((x - XS0) / STEP), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    slices.forEach((s, k) => {
      const z = a < 0 ? REST[k] : k === a ? LIFT : BUMP - Math.abs(k - a);
      tset(s.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    tset(lz, a < 0 ? LZ[0] : LZ[1], now, 0);
    read.textContent = a < 0 ? "rest" : "slot " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "toaster",
  means: "A four-slot toaster: the slice in the slot under the pointer pops up high, the others pop a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[164, 111], [192, 125], [247, 152], null],
  mount,
});
