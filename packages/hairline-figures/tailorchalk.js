/**
 * Tailor shears: long bent-handled shears lying on the cutting table, the
 * lower blade flat on the cloth, the upper blade on one pivot screw with the
 * big finger bow. The pointer is the hand: over the shears, the upper blade
 * swings open, wider the nearer the pointer is to the bow. At rest the jaws
 * are a little open, the upper blade bright. The slider is how wide they open.
 */
const {
  Cam, fit, prism, proj, facing, fillet, circ, rrect, spring, stepS, clamp,
  disposer, mk, pointer, put, register, solid, flatDot, place, unproj,
} = HL;

const R = Math.PI / 180, REST = 7, OPEN = 34;
const LOWER = [[92, -1], [60, -4.5], [4, -6], [-8, -5], [-10, 1], [4, 1.5], [60, 1], [90, 0.4]];
const UPPER = [[90, 1.2], [60, 5.5], [4, 6.5], [-8, 6], [-10, 0], [4, -0.5], [60, -0.2], [92, 0]];
function ringOf(pts) {
  let a = 0;
  for (let i = 0; i < pts.length; i++) { const p = pts[i], q = pts[(i + 1) % pts.length]; a += p[0] * q[1] - q[0] * p[1]; }
  const sg = a > 0 ? 1 : -1;
  return pts.map((p, i) => {
    const pr = pts[(i - 1 + pts.length) % pts.length], nx = pts[(i + 1) % pts.length];
    const dx = nx[0] - pr[0], dy = nx[1] - pr[1], l = Math.hypot(dx, dy) || 1;
    return { u: p[0], v: p[1], nu: (sg * dy) / l, nv: (-sg * dx) / l };
  });
}
const off = (ring, du, dv) => ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }));
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.4);
  const ext = [[94, -8, 0], [-48, -22, 0], [-50, 26, 8]];
  for (let k = 0; k <= 8; k++) { const a = (k / 8) * (OPEN + 8) * R; ext.push([94 * Math.cos(a), 94 * Math.sin(a), 8], [-50 * Math.cos(a) + 18 * Math.sin(a), -50 * Math.sin(a) - 18 * Math.cos(a), 8]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const parts = [
    { z: 0, blade: ringOf(fillet(LOWER, [1, 3, 3, 2, 2, 2, 3, 1], 3)), loop: off(circ(9, 32), -22, -9), hole: off(circ(5.5, 32), -22, -9), up: false },
    { z: 2.4, blade: ringOf(fillet(UPPER, [1, 3, 3, 2, 2, 2, 3, 1], 3)), loop: rrect(-48, 3, -14, 24, 9, 6), hole: rrect(-44, 7, -18, 20, 6, 6), up: true },
  ].map((h) => { const grp = mk("g", {}, g); return { ...h, grp, L: solid(grp), B: solid(grp), H: solid(grp) }; });
  const screw = flatDot(g, C, 2.2, "dot off");
  const open = spring(REST);
  let drawn = NaN;

  function draw() {
    if (Math.abs(open.x - drawn) < 1e-3) return;
    drawn = open.x;
    for (const h of parts) {
      const a = (h.up ? open.x : -2) * R, z = h.z;
      put(h.L, prism(P, front, turn(h.loop, a), null, z, z + 2.4));
      put(h.H, prism(P, front, turn(h.hole, a), null, z + 2.3, z + 2.4));
      put(h.B, prism(P, front, turn(h.blade, a), null, z, z + 2.4));
    }
    place(screw, P(0, 0, 5));
  }
  const Bk = register(stage, (dt) => { const m = stepS(open, dt); draw(); return m; });
  bag.add(Bk.unregister);

  function set(t) {
    open.t = t == null ? REST : clamp(REST + (OPEN - REST) * value * t, REST, 44);
    read.textContent = t == null ? "rest" : Math.round(open.t) + "°";
    Bk.wake();
  }
  parts[1].B.sil.classList.add("hi");
  parts[1].L.sil.classList.add("hi");
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x < -60 || x > 100 || Math.abs(y) > 40) return set(null);
      set(clamp(0.55 + (20 - x) / 90, 0.4, 1));
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "tailorchalk",
  means: "Tailor shears on the cutting table: the upper blade swings open on its screw, wider as the pointer nears the bow.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[103, 134], [180, 175], [300, 228], null],
  mount,
});
