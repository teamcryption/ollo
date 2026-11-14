/**
 * Space capsule: a landing pad with a dashed target ring, a capsule with its
 * heat shield, hanging from a domed parachute by four shroud lines. The
 * pointer's height above the pad is the capsule's altitude: raise the
 * pointer and the capsule climbs back under its canopy, lower it and the
 * capsule settles onto the pad. At rest it hangs just above touchdown,
 * canopy bright. The slider is how high it can climb.
 *
 * The pattern: one part following the pointer on a spring.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, seg, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 40, CY = 40, PADZ = 4, REST = 8, CAN = 40, CR = 30, BR = 15, TR = 7, CH = 20;
const disc = (r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + CX, v: q.v + CY }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 1.75);
  const hi = PADZ + 40 + CH + CAN + CR * 0.6;
  fit(C, [[0, 0, 0], [80, 80, 0], [80, 0, 0], [0, 80, 0], [CX - CR, CY, hi], [CX + CR, CY, hi]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pad = rr(0, 0, 80, 80);
  put(solid(g), prism(P, front, pad[0], pad[1], 0, PADZ));
  mk("path", { d: poly(ringAt(P, disc(22), PADZ)), class: "nf lo dash" }, g);
  mk("path", { d: poly(ringAt(P, disc(BR + 1, 30), PADZ)), class: "nf lo" }, g);
  const shield = solid(g), body = solid(g), hatch = mk("path", { class: "nf lo" }, g);
  const lines = mk("path", { class: "nf lo" }, g);
  const canopy = solid(g), vent = mk("path", { class: "nf lo" }, g);
  canopy.sil.classList.add("hi");

  function rr(x0, y0, x1, y1) { return HL.rings(x0, y0, x1, y1, 10, 2); }
  const alt = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const z0 = PADZ + a, z1 = z0 + CH;
    put(shield, prism(P, front, disc(BR), disc(BR - 1.5), z0, z0 + 2.5));
    const foot = ringAt(P, disc(BR - 1, 32), z0 + 2.5), head = ringAt(P, disc(TR, 24), z1);
    body.sil.setAttribute("d", poly(hull(foot.concat(head))));
    body.cr.setAttribute("d", poly(ringAt(P, disc(TR - 1.4, 24), z1)));
    // a round hatch on the near flank
    const hz = z0 + 10, hp = [];
    for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; hp.push(P(CX + 11 * 0.7071 + Math.cos(t) * 2.2 * 0.7071, CY + 11 * 0.7071 - Math.cos(t) * 2.2 * 0.7071, hz + Math.sin(t) * 2.6)); }
    hatch.setAttribute("d", poly(hp));
    const cz = z1 + CAN, pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ringAt(P, disc(CR * Math.cos(t), 32), cz + CR * 0.6 * Math.sin(t))); }
    canopy.sil.setAttribute("d", poly(hull(pts)));
    canopy.cr.setAttribute("d", poly(ringAt(P, disc(CR - 2, 40), cz + 1)));
    vent.setAttribute("d", poly(ringAt(P, disc(3.5, 16), cz + CR * 0.6 - 0.4)));
    let d = "";
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) d += seg(P(CX + dx * TR * 0.8, CY + dy * TR * 0.8, z1), P(CX + dx * CR, CY + dy * CR, cz));
    lines.setAttribute("d", d);
    read.textContent = Math.abs(a - REST) < 0.5 && alt.t === REST ? "rest" : "alt " + Math.round(a);
  }

  const B = register(stage, (dt) => { const m = stepS(alt, dt); draw(alt.x); return m; });
  bag.add(B.unregister);

  const base = P(CX, CY, PADZ)[1], S = 1.75 * 0.866;
  function aim(sy) { return clamp((base - 30 - sy) / S, 0, top); }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const inX = Math.abs(sx - P(CX, CY, 0)[0]) < 80; alt.t = inX ? aim(sy) : REST; B.wake(); },
    leave: () => { alt.t = REST; B.wake(); },
  }));
  draw(REST);
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; }, destroy: bag.dispose };
}

hairline({
  name: "spacecapsule",
  means: "A capsule under its parachute above a landing pad: the pointer's height is its altitude, from touchdown to a climb.",
  rules: [1, 3, 5, 8],
  range: [20, 40, 40],
  tour: [[200, 122], [200, 237], [200, 61], null],
  mount,
});
