/**
 * Banjo: a banjo lying on its back, the round pot with its drum head and a
 * long fretted neck, five strings running from the tailpiece to the pegs.
 * The pointer picks the string under it: that string is plucked up off the
 * head, and the strings beside it lift a little, staggered from it. At rest
 * the top string is half plucked, bright. The slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle), picked on a plane.
 */
const {
  Cam, circ, clamp, fit, facing, open, poly, prism, proj, rings, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PR = 30, PZ = 8, SZ = 11, SP = 2.6, N = 5, XT = -24, XE = 112, PRESS = 10, FAV = 4;
const disc = (r, n) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-PR, -PR, 0], [PR, PR, 0], [XE + 6, -9, 0], [XE + 6, 9, SZ], [50, 6, SZ + 10], [-PR, 0, SZ]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(PR, 48), disc(PR - 2.5, 48), 0, PZ));
  mk("path", { d: poly(ringAt0(disc(PR - 5, 48), PZ)), class: "nf lo" }, g);
  const [nr, ni] = rings(PR - 4, -7, XE - 10, 7, 2, 1.2);
  put(solid(g), prism(P, front, nr, ni, PZ - 2, PZ + 1.5));
  const [hr, hi] = rings(XE - 12, -9, XE + 6, 9, 4, 1.4);
  put(solid(g), prism(P, front, hr, hi, PZ - 2, PZ + 1.5));
  let fr = "";
  for (let x = PR + 4, w = 12; x < XE - 14; x += w, w *= 0.92) fr += seg(P(x, -7, PZ + 1.5), P(x, 7, PZ + 1.5));
  mk("path", { d: fr, class: "nf lo" }, g);
  const [br, bi] = rings(-10, -9, -7, 9, 1, 0.5);
  put(solid(g), prism(P, front, br, bi, PZ, SZ - 0.5));
  const [tr, ti] = rings(XT - 4, -6, XT + 2, 6, 2, 1);
  put(solid(g), prism(P, front, tr, ti, PZ, SZ));
  function ringAt0(ring, z) { return ring.map((q) => P(q.u, q.v, z)); }

  const items = [];
  for (let k = 0; k < N; k++) {
    const y = (k - (N - 1) / 2) * SP, s = mk("path", { class: "nf lo" }, g);
    items.push({ k, y, s, z: tween(k === FAV ? PRESS * 0.7 : 0), last: NaN });
  }
  function draw(it, d) {
    if (d === it.last) return;
    it.last = d;
    it.s.setAttribute("d", open([P(XT, it.y, SZ), P(-8.5, it.y, SZ), P(50, it.y + d * 0.4, SZ + d), P(XE, it.y, SZ - 2)]));
  }
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const it of items) { draw(it, tval(it.z, now)); if (!tdone(it.z, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, SZ);
    if (x < XT || x > XE || Math.abs(y) > 10) return -1;
    return clamp(Math.round(y / SP + (N - 1) / 2), 0, N - 1);
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    items.forEach((it, k) => {
      const dd = Math.abs(k - a), z = a < 0 ? (k === FAV ? PRESS * 0.7 : 0) : dd === 0 ? PRESS : dd === 1 ? 0.8 : 0;
      tset(it.z, z, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      const on = k === (a < 0 ? FAV : a);
      it.s.classList.toggle("hi", on);
      it.s.classList.toggle("lo", !on);
    });
    read.textContent = a < 0 ? "rest" : "str " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "banjos",
  means: "A banjo on its back, five strings over the drum and fretted neck: the string under the pointer is plucked up off the head.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[194, 152], [220, 173], [262, 203], null],
  mount,
});
