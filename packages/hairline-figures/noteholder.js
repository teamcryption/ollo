/**
 * Note spike: a heavy round base with a steel spike and a stack of notes
 * speared on it, each turned a little. The pointer over the spike slides the
 * notes up the spike and fans them, staggered from the top. At rest the top
 * note is bright.
 */
const { Cam, circ, facing, fit, prism, proj, rings, unproj, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const N = 5, ANG = [8, -12, 20, -4, 14], NZ = 10, GAPZ = 2.4, RISE = [4, 8, 12, 16, 20];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let step = value;
  const C = Cam(45, 0.5, 3.75);
  fit(C, [[-22, -22, 0], [22, 22, 0], [0, 0, 62], [-22, -22, 40], [22, 22, 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const rot = (ring, deg) => { const a = deg * Math.PI / 180, c = Math.cos(a), s = Math.sin(a); return ring.map((p) => ({ u: p.u * c - p.v * s, v: p.u * s + p.v * c, nu: p.nu * c - p.nv * s, nv: p.nu * s + p.nv * c })); };
  { const base = circ(16, 28), inner = circ(14.6, 28); put(solid(g), prism(P, front, base, inner, 0, 7)); }
  const lowSpike = solid(g);
  const notes = Array.from({ length: N }, (_, k) => ({ el: solid(g), z: tween(0), a: tween(0), last: "" }));
  const tip = solid(g);
  const [nr, ni] = rings(-15, -15, 15, 15, 1.6, 1.2);
  { const r = circ(0.9, 12); put(lowSpike, prism(P, front, r, null, 7, NZ + N * GAPZ)); put(tip, prism(P, front, r, null, NZ + N * GAPZ, 62)); }
  function drawNote(n, k, dz, da) {
    const key = dz.toFixed(2) + "," + da.toFixed(2); if (key === n.last) return; n.last = key;
    const z = NZ + k * GAPZ + dz, a = ANG[k] + da;
    put(n.el, prism(P, front, rot(nr, a), rot(ni, a), z, z + 0.8));
  }
  const B = register(stage, (_dt, now) => {
    let m = false;
    notes.forEach((n, k) => { drawNote(n, k, tval(n.z, now), tval(n.a, now)); if (!tdone(n.z, now) || !tdone(n.a, now)) m = true; });
    return m;
  });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, NZ + 10);
    return Math.hypot(x, y) < 26 ? 1 : 0;
  }
  let act = -1;
  function setActive(a) {
    if (a === act) return; act = a;
    const now = performance.now();
    notes.forEach((n, k) => { const d = (N - 1 - k) * step; tset(n.z, a ? RISE[k] : 0, now, d); tset(n.a, a ? (k % 2 ? -1 : 1) * 14 * (k + 1) / N : 0, now, d); });
    notes[N - 1].el.sil.classList.toggle("hi", !a);
    notes[0].el.sil.classList.toggle("hi", !!a);
    read.textContent = a ? "notes" : "rest";
    B.wake();
  }
  setActive(0);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(0) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { step = v; }, destroy: bag.dispose };
}

hairline({
  name: "noteholder",
  means: "A note spike: the speared notes slide up the spike and fan out, one after another from the top.",
  rules: [1, 2, 5, 8],
  range: [0, 40, 80],
  tour: [[200, 173], [253, 173], [147, 173], null],
  mount,
});
