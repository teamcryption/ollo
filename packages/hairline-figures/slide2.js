/**
 * Spring rider: a playground rider on a coil spring, set in a round pad.
 * The pointer pulls the rider over towards it: the seat and head tilt and
 * the coil leans with them, more towards its top. At rest the rider leans
 * forward a little, its seat bright. The slider is the most it may tilt.
 *
 * The pattern: one object answering the pointer's position (aim).
 */
const {
  Cam, fit, hull, poly, open, prism, proj, facing, rings, rrect, circ, unproj, rad, clamp,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const Z0 = 22, RA = 9, RB = -5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxT = value;
  const C = Cam(45, 0.5, 3.6);
  fit(C, [[-32, -32, 0], [32, 32, 0], [32, -32, 0], [-32, 32, 0], [0, 0, Z0 + 32], [30, 0, Z0 + 26], [-30, 0, Z0 + 14]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pad = circ(30, 48).map((q) => ({ ...q }));
  const padIn = circ(28, 48).map((q) => ({ ...q }));
  put(solid(g), prism(P, front, pad, padIn, 0, 3));
  const coil = mk("path", { class: "sil nf" }, g);
  const parts = [
    { ring: rrect(-18, -8, 14, 8, 4, 4), inner: rrect(-16.5, -6.5, 12.5, 6.5, 2.5, 4), z0: Z0, z1: Z0 + 9 },
    { ring: rrect(-20, -7, -13, 7, 3, 4), inner: rrect(-19, -6, -14, 6, 2, 4), z0: Z0 + 9, z1: Z0 + 15 },
    { ring: rrect(8, -6, 20, 6, 4, 4), inner: rrect(9.5, -4.5, 18.5, 4.5, 2.5, 4), z0: Z0 + 9, z1: Z0 + 26 },
    { ring: rrect(12, -13, 16, 13, 2, 4), inner: rrect(12.8, -12.2, 15.2, 12.2, 1.2, 4), z0: Z0 + 21, z1: Z0 + 24 },
  ].map((p) => ({ ...p, s: solid(g) }));
  parts[0].s.sil.classList.add("hi");

  const ta = spring(RA), tb = spring(RB);
  let last = "";
  function T(x, y, z, a, b) {
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b);
    const dz = z - Z0, x1 = x * ca + dz * sa, z1 = -x * sa + dz * ca;
    return P(x1, y * cb + z1 * sb, Z0 - y * sb + z1 * cb);
  }
  function draw(A, Bd) {
    const key = A.toFixed(2) + "," + Bd.toFixed(2);
    if (key === last) return;
    last = key;
    const a = rad(A), b = rad(Bd), pts = [];
    for (let i = 0; i <= 90; i++) {
      const f = i / 90, t = f * Math.PI * 2 * 6, z = 3 + f * (Z0 - 3);
      const lean = f * f;
      pts.push(T(7 * Math.cos(t), 7 * Math.sin(t), Z0 - (1 - f) * (Z0 - 3) + 0 * z, a * lean, b * lean));
    }
    coil.setAttribute("d", open(pts));
    for (const p of parts) {
      const lo = p.ring.map((q) => T(q.u, q.v, p.z0, a, b)), hiR = p.ring.map((q) => T(q.u, q.v, p.z1, a, b));
      p.s.sil.setAttribute("d", poly(hull(lo.concat(hiR))));
      p.s.cr.setAttribute("d", poly(p.inner.map((q) => T(q.u, q.v, p.z1, a, b))));
    }
  }

  let act = false;
  const B = register(stage, (dt) => {
    const m = stepS(ta, dt) | stepS(tb, dt);
    draw(ta.x, tb.x);
    read.textContent = act ? "tilt " + Math.round(Math.hypot(ta.x, tb.x)) : "rest";
    return !!m;
  });
  bag.add(B.unregister);

  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    act = true;
    ta.t = clamp(wx / 45, -1, 1) * maxT;
    tb.t = clamp(-wy / 45, -1, 1) * maxT;
    B.wake();
  }
  function leave() { act = false; ta.t = RA; tb.t = RB; B.wake(); }
  draw(RA, RB);
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxT = v; }, destroy: bag.dispose };
}

hairline({
  name: "slide2",
  means: "A spring rider in a round pad: the rider tilts over towards the pointer and its coil leans with it.",
  rules: [3, 5, 8, 9],
  range: [10, 22, 28],
  tour: [[73, 148], [327, 275], [73, 275], null],
  mount,
});
