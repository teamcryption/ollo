/**
 * Vacuum bell jar: a glass bell jar sealed on a pump plate, a small bell
 * inside it. The pointer over it tilts the jar open on its back edge,
 * breaking the seal. At rest the jar sits sealed, its knob bright. The
 * slider is how far it tilts.
 *
 * The pattern: a lid hinging open (tilt).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const BZ = 10, PZ = 13, JR = 24, JH = 32;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-36, -36, 0], [36, 36, 0], [36, -36, 0], [-36, 36, 0], [0, -24, PZ + 74], [0, 30, PZ + 58]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ba, bb] = rings(-36, -36, 36, 36, 6, 1.5);
  put(solid(g), prism(P, front, ba, bb, 0, BZ));
  put(solid(g), prism(P, front, disc(0, 0, 30), disc(0, 0, 28), BZ, PZ));
  put(solid(g), prism(P, front, disc(0, 0, 2, 16), disc(0, 0, 1.4, 16), PZ, PZ + 14));
  const bell = mk("path", { class: "sil" }, g);
  { const pts = []; for (const [r, z] of [[7, 0], [5, 4], [3.5, 9], [2, 12]]) pts.push(...ringAt(P, disc(0, 0, r, 20), PZ + 1 + z)); bell.setAttribute("d", poly(hull(pts))); }
  const jar = mk("path", { class: "nf" }, g), rim = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "sil" }, g);
  const t = tween(0); let last = NaN;
  // rotate a jar-local point about the hinge line y = -JR, z = PZ, around the x axis
  function W(x, y, z, a) { const yy = y + JR, c = Math.cos(a), s = Math.sin(a); return P(x, -JR + yy * c - z * s, PZ + yy * s + z * c); }
  function ring(r, z, a, n = 32) { return circ(r, n).map((q) => W(q.u, q.v, z, a)); }
  function draw(v) {
    if (v === last) return; last = v;
    const a = (v * maxA * Math.PI) / 180, pts = [];
    for (let i = 0; i <= 4; i++) pts.push(...ring(JR, (JH * i) / 4, a));
    for (let i = 1; i <= 5; i++) { const th = (i / 5) * (Math.PI / 2); pts.push(...ring(JR * Math.cos(th), JH + 18 * Math.sin(th), a)); }
    jar.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(ring(JR, 2, a)));
    knob.setAttribute("d", poly(hull(ring(3.5, JH + 18, a, 16).concat(ring(3.5, JH + 24, a, 16)))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const l = P(-36, 36, 0), r = P(36, -36, 0), top = P(0, 0, PZ + 74), bot = P(36, 36, 0);
  const inside = ([sx, sy]) => sx > l[0] - 10 && sx < r[0] + 10 && sy > top[1] - 10 && sy < bot[1] + 10;
  let act = null;
  function setActive(on) {
    if (on === act) return; act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
    knob.classList.toggle("hi", !on); bell.classList.toggle("hi", on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "vacuumpump",
  means: "A glass bell jar sealed on a vacuum plate: the pointer tilts the jar open on its back edge to reveal the bell inside.",
  rules: [1, 2, 5, 6],
  range: [30, 50, 60],
  tour: [[200, 154], [93, 226], [307, 226], null],
  mount,
});
