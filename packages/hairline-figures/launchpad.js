/**
 * Launchpad: a rocket standing on its pad beside a lattice tower, three
 * service arms reaching from the tower to the rocket. The pointer picks an
 * arm by its height: it slides back into the tower, and the arms beside it
 * pull back a little, staggered from it. At rest the middle arm is drawn
 * back, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single column.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, rings, ringAt, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, proj,
} = HL;

const PZ = 4, TX0 = 8, TX1 = 20, TY0 = 20, TY1 = 32, TZ = 96;
const RX = 54, RY = 26, RR = 9, RZ = 78, NOSE = 16;
const AZ = [30, 50, 70], FULL = RX - RR - TX1 + 1, FAV = 1;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const restLen = (k) => (k === FAV ? 3 : FULL);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.8);
  fit(C, [[-4, -4, 0], [74, 52, 0], [74, -4, 0], [-4, 52, 0], [TX0, TY0, TZ], [RX, RY, PZ + RZ + NOSE]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-4, -4, 74, 52, 4, 2);
  put(solid(g), prism(P, front, pr, pi, 0, PZ));
  // flame trench: a dashed ring on the pad under the rocket
  mk("path", { d: poly(ringAt(P, disc(RX, RY, RR + 4), PZ)), class: "dash nf" }, g);

  // the tower: a tall box with lattice cross-braces on its front faces
  const tw = mk("g", {}, g);
  const [tr, ti] = rings(TX0, TY0, TX1, TY1, 1, 0.8);
  put(solid(tw), prism(P, front, tr, ti, PZ, TZ));
  let d = "";
  for (let z = PZ; z + 10 <= TZ - 2; z += 10) {
    d += seg(P(TX1, TY0, z), P(TX1, TY1, z + 10)) + seg(P(TX1, TY1, z), P(TX1, TY0, z + 10));
    d += seg(P(TX0, TY1, z), P(TX1, TY1, z + 10)) + seg(P(TX1, TY1, z), P(TX0, TY1, z + 10));
  }
  mk("path", { d, class: "nf lo" }, tw);
  const [hr, hi2] = rings(TX0 - 2, TY0 - 2, TX1 + 2, TY1 + 2, 1, 0.8);
  put(solid(tw), prism(P, front, hr, hi2, TZ, TZ + 3));

  const arms = AZ.map((z, k) => {
    const grp = mk("g", {}, g);
    return { k, z, grp, s: solid(grp), len: tween(restLen(k)), last: NaN };
  });

  // the rocket: a body, a band, a nose cone
  const rg = mk("g", {}, g);
  put(solid(rg), prism(P, front, disc(RX, RY, RR), disc(RX, RY, RR - 1), PZ, PZ + RZ));
  mk("path", { d: poly(ringAt(P, disc(RX, RY, RR), PZ + RZ * 0.62).slice(0, 21)), class: "nf lo" }, rg);
  const cone = [];
  for (let i = 0; i <= 6; i++) cone.push(...ringAt(P, disc(RX, RY, Math.max(0.4, RR * (1 - i / 6) ** 0.8), 28), PZ + RZ + (NOSE * i) / 6));
  mk("path", { d: poly(hull(cone)) }, rg);
  for (const a of [0, Math.PI / 2]) {
    const x = RX + RR * Math.cos(a) * 1.0, y = RY + RR * Math.sin(a);
    const [fr, fi] = rings(x - 1, y - 1, x + 1 + 5 * Math.cos(a), y + 1 + 5 * Math.sin(a), 0.6, 0.4);
    put(solid(rg), prism(P, front, fr, fi, PZ + 2, PZ + 16));
  }

  function draw(a, L) {
    if (L === a.last) return;
    a.last = L;
    const [ar, ai] = rings(TX1 - 1, RY - 3, TX1 + Math.max(1.2, L), RY + 3, 0.8, 0.6);
    put(a.s, prism(P, front, ar, ai, a.z, a.z + 5));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const a of arms) { draw(a, tval(a.len, now)); if (!tdone(a.len, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = arms.map((a) => P(TX1 + FULL / 2, RY, a.z + 1.5));
  function hit([sx, sy]) {
    if (Math.abs(sx - mids[0][0]) > 60) return -1;
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[1] - sy); if (dd < bd) { bd = dd; best = k; } });
    return bd < 24 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    arms.forEach((it, k) => {
      const dd = Math.abs(k - a), L = a < 0 ? restLen(k) : dd === 0 ? 1.2 : dd === 1 ? FULL * 0.6 : FULL;
      tset(it.len, L, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      it.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "arm " + (3 - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "launchpad",
  means: "A rocket beside its launch tower: the service arm under the pointer slides back into the tower, its neighbours pull back a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[197, 112], [197, 144], [197, 175], null],
  mount,
});
