/**
 * Cookie press: a barrel press standing on a baking sheet, plunger rod on
 * top, pistol grip and trigger at its side. The pointer squeezes: the
 * trigger pulls in and the press lifts clear on a spring, leaving the fresh
 * cookie under its nozzle bright. At rest the trigger is bright.
 * The slider is how high the press lifts.
 */
const {
  Cam, circ, fit, facing, prism, proj, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BZ = 3, NZ = 10, TOPZ = 70, REST = 4;
const at = (ring, x, y) => ring.map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-40, -40, 0], [40, 40, 0], [40, -40, 0], [-40, 40, 0], [0, 0, TOPZ + 34 + 40], [34, 0, TOPZ + 40]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [tr, ti] = rings(-40, -40, 40, 40, 6, 2);
  put(solid(g), prism(P, front, tr, ti, 0, BZ));
  let fresh;
  for (const [x, y] of [[-24, -22], [22, -24], [0, 0], [-24, 20]]) {
    const s = solid(g);
    put(s, prism(P, front, at(circ(8, 24), x, y), at(circ(5, 24), x, y), BZ, BZ + 3));
    if (!x && !y) fresh = s;
  }
  const parts = [
    { ring: at(circ(1.8, 12), 0, 0), inner: at(circ(1, 12), 0, 0), z0: TOPZ + 4, z1: TOPZ + 34 },
    { ring: at(circ(6, 24), 0, 0), inner: at(circ(4.5, 24), 0, 0), z0: TOPZ + 34, z1: TOPZ + 37 },
    { ring: at(circ(5, 20), 0, 0), inner: at(circ(3.5, 20), 0, 0), z0: NZ, z1: NZ + 8 },
    { ring: at(circ(13, 40), 0, 0), inner: at(circ(11, 40), 0, 0), z0: NZ + 8, z1: TOPZ },
    { ring: at(circ(15, 40), 0, 0), inner: at(circ(13, 40), 0, 0), z0: TOPZ, z1: TOPZ + 5 },
    { ring: rings(8, -4, 36, 4, 3, 1.2)[0], inner: rings(8, -4, 36, 4, 3, 1.2)[1], z0: TOPZ - 6, z1: TOPZ + 2 },
    { trig: true, z0: TOPZ - 28, z1: TOPZ - 6 },
    { ring: rings(30, -4.5, 38, 4.5, 3, 1.2)[0], inner: rings(30, -4.5, 38, 4.5, 3, 1.2)[1], z0: TOPZ - 36, z1: TOPZ - 6 },
  ].map((p) => ({ ...p, s: solid(g) }));
  const trig = parts.find((p) => p.trig);
  const sw = spring(REST);
  let last = NaN;

  function draw() {
    const L = sw.x;
    if (L === last) return;
    last = L;
    const pull = Math.min(1, L / 24) * 7;
    for (const p of parts) {
      if (p.trig) {
        const [r, i] = rings(16 + pull, -3, 22 + pull, 3, 2.5, 1);
        put(p.s, prism(P, front, r, i, p.z0 + L, p.z1 + L));
      } else put(p.s, prism(P, front, p.ring, p.inner, p.z0 + L, p.z1 + L));
    }
  }
  const B = register(stage, (dt) => { const m = stepS(sw, dt); draw(); return m; });
  bag.add(B.unregister);

  const mid = P(10, 0, 40);
  function setOver(p) {
    const on = !!p && Math.hypot(p[0] - mid[0], p[1] - mid[1]) < 150;
    sw.t = on ? reach : REST;
    trig.s.sil.classList.toggle("hi", !on);
    fresh.sil.classList.toggle("hi", on);
    read.textContent = on ? "press" : "rest";
    B.wake();
  }
  setOver(null);
  bag.add(pointer(stage, { move: setOver, leave: () => setOver(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "cookiecutter",
  means: "A cookie press on a baking sheet: its trigger pulls and the press lifts clear, leaving a fresh cookie under the nozzle.",
  rules: [3, 4, 5, 8],
  range: [16, 32, 40],
  tour: [[200, 192], [110, 250], [290, 150], null],
  mount,
});
