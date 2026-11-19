/**
 * Autosampler: a round carousel of capped vials on a low base, with a needle
 * arm on a tower at the back. The pointer picks a vial by the slot it rests
 * in: the carousel turns that vial round under the arm and the needle dips
 * into it. At rest the needle hangs raised, bright. The slider is how far the
 * carousel may turn.
 *
 * The pattern: one part turning (officechairs), picked from the rest pose.
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 10, RR = 25, VR = 4.2, TZ = 10, TT = 15, VT = 29, NA = 180, EMPTY = [4, 7];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const D = Math.PI / 180;
const slotA = (k) => NA + k * 36;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-58, -46, 0], [42, 42, 0], [42, -46, 0], [-58, 42, 0], [-47, 15, 66]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const NX = Math.cos(NA * D) * RR, NY = Math.sin(NA * D) * RR;

  // the tower stands behind the tray; base, tray, vials, then the arm on top
  const [br, bi] = rings(-58, -46, 42, 42, 12, 2);
  put(solid(g), prism(P, front, br, bi, 0, TZ));
  const [tr, ti] = rings(-54, 8, -40, 22, 5, 1.4);
  put(solid(g), prism(P, front, tr, ti, TZ, 64));
  put(solid(g), prism(P, front, disc(0, 0, 35, 48), disc(0, 0, 33, 48), TZ, TT));
  mk("path", { d: poly(ringAt(P, disc(0, 0, 8, 24), TT)), class: "nf lo" }, g);

  const vg = mk("g", {}, g);
  const vials = [];
  for (let k = 0; k < N; k++) {
    if (EMPTY.includes(k)) continue;
    const grp = mk("g", {}, vg), body = solid(grp), cap = solid(grp);
    vials.push({ k, grp, body, cap, h: VT - (k % 3) * 1.5 });
  }
  const arm = solid(g), carr = solid(g), needle = mk("path", { class: "nf" }, g);
  const ax = -47, ay = 15;
  put(arm, { sil: poly(hull([...ringAt(P, disc(ax, ay, 4), 58), ...ringAt(P, disc(ax, ay, 4), 63), ...ringAt(P, disc(NX, NY, 4), 58), ...ringAt(P, disc(NX, NY, 4), 63)])), crease: "" });

  const rot = tween(0), dip = tween(0);
  let last = "";
  function draw(r, d) {
    const key = r + "|" + d;
    if (key === last) return;
    last = key;
    const order = [];
    for (const v of vials) {
      const a = (slotA(v.k) + r) * D, x = Math.cos(a) * RR, y = Math.sin(a) * RR;
      put(v.body, prism(P, front, disc(x, y, VR), disc(x, y, VR - 1), TT, v.h));
      put(v.cap, prism(P, front, disc(x, y, VR + 0.6), disc(x, y, VR - 0.6), v.h, v.h + 3));
      order.push([x + y, v.grp]);
    }
    order.sort((p, q) => p[0] - q[0]).forEach(([, e]) => vg.appendChild(e));
    const nz = 46 - d * 13;
    put(carr, prism(P, front, disc(NX, NY, 3), disc(NX, NY, 2), nz, 58));
    needle.setAttribute("d", seg(P(NX, NY, nz), P(NX, NY, nz - 12)));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(rot, now), tval(dip, now));
    return !(tdone(rot, now) && tdone(dip, now));
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, VT), rr = Math.hypot(x, y);
    if (rr < 13 || rr > 40) return -1;
    let best = -1, bd = Infinity;
    for (const v of vials) {
      const a = slotA(v.k) * D, dd = Math.hypot(x - Math.cos(a) * RR, y - Math.sin(a) * RR);
      if (dd < bd) { bd = dd; best = v.k; }
    }
    return best;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    const now = performance.now();
    let delta = a < 0 ? 0 : -((a * 36) % 360);
    if (delta < -180) delta += 360;
    const turn = Math.max(-reach, Math.min(reach, delta));
    tset(rot, turn, now, 0);
    tset(dip, a >= 0 && Math.abs(turn - delta) < 1 ? 1 : 0, now, a >= 0 ? 450 : 0);
    for (const v of vials) v.cap.sil.classList.toggle("hi", v.k === a);
    carr.sil.classList.toggle("hi", a < 0);
    read.textContent = a < 0 ? "rest" : "vial " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; const a = act; act = -3; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "autosampler",
  means: "A carousel of capped vials under a needle arm: the pointer picks a vial, the tray turns it under the arm and the needle dips.",
  rules: [1, 4, 5, 6, 8],
  range: [60, 150, 180],
  tour: [[219, 182], [168, 174], [251, 132], null],
  mount,
});
