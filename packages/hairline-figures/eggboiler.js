/**
 * Egg cooker: a round heating base holding a ring of eggs under a clear
 * dome hinged at the back. The pointer over the cooker swings the dome open
 * on its hinge to show the eggs; away, it sits just ajar, bright.
 * The slider is how far the dome swings.
 *
 * The pattern: one lid on a hinge (spotlights' rotated hull).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 40, CY = 40, R = 34, BZ = 10, DR = 31, DH = 30, REST = 0.22;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 2.75);
  const Y0 = CY - DR;
  const rot = (x, y, z, a) => [x, Y0 + (y - Y0) * Math.cos(a) - (z - BZ) * Math.sin(a), BZ + (y - Y0) * Math.sin(a) + (z - BZ) * Math.cos(a)];
  fit(C, [[CX - R, CY - R, 0], [CX + R, CY + R, 0], [CX - R, CY + R, 0], [CX + R, CY - R, 0], [CX, Y0 - DH, BZ + 2 * DR], [CX, CY, BZ + DH + 4]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(CX - R, CY - R, CX + R, CY + R, R, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  mk("path", { d: poly(ringAt(P, disc(CX, CY, DR + 1), BZ)), class: "nf lo" }, g);

  const eggs = mk("g", {}, g);
  const spots = [[CX, CY]];
  for (let k = 0; k < 6; k++) spots.push([CX + 17 * Math.cos(k * Math.PI / 3), CY + 17 * Math.sin(k * Math.PI / 3)]);
  spots.sort((a, b) => a[0] + a[1] - b[0] - b[1]);
  for (const [x, y] of spots) {
    const pts = [];
    for (const [r, z] of [[3.5, 0], [6, 4], [6.2, 7], [5.2, 11], [3.2, 14.5], [0.6, 16.5]]) pts.push(...ringAt(P, disc(x, y, r, 20), BZ + z));
    mk("path", { d: poly(hull(pts)) }, eggs);
  }

  const lid = mk("g", {}, g);
  const dome = mk("path", { class: "sil" }, lid), rim = mk("path", { class: "nf lo" }, lid), knob = mk("path", { class: "nf" }, lid);
  const sp = spring(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const ring = (r, z, n = 32) => circ(r, n).map((q) => P(...rot(CX + q.u, CY + q.v, z, a)));
    const pts = [];
    for (let i = 0; i <= 6; i++) { const t = (i / 6) * (Math.PI / 2); pts.push(...ring(DR * Math.cos(t) + 0.01, BZ + DH * Math.sin(t))); }
    dome.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ring(DR, BZ + 2.5)));
    knob.setAttribute("d", poly(hull(ring(3, BZ + DH, 16).concat(ring(3, BZ + DH + 4, 16)))));
    if (a > 0.7) g.insertBefore(lid, eggs); else g.appendChild(lid);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    sp.t = v ? open : REST;
    read.textContent = v ? "open" : "rest";
    B.wake();
  }
  dome.classList.add("hi");
  setOn(false);
  draw(REST);
  function hit([sx, sy]) {
    const m = P(CX, CY, BZ + 12);
    return Math.abs(sx - m[0]) < 100 && Math.abs(sy - m[1]) < 80;
  }
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "eggboiler",
  means: "An egg cooker: the pointer over it swings the dome open on its back hinge to show the ring of eggs inside.",
  rules: [1, 3, 5, 6],
  range: [0.9, 1.4, 1.75],
  tour: [[200, 152], [232, 172], [168, 140], null],
  mount,
});
