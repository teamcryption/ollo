/**
 * Cattle gate: a five-rail farm gate hung on a stout post, latching to a
 * second post across a strip of ground. The gate swings on its hinge to
 * point toward the pointer, held to a quarter turn. At rest it hangs ajar
 * with its top rail bright. The slider is how far it may open.
 *
 * The pattern: one part turning to face the pointer (spring).
 */
const {
  Cam, circ, clamp, fit, facing, poly, prism, proj, rad, rings, rrect, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const LEN = 64, PH = 30, REST = 24;
const RAILS = [5, 10.5, 16, 21.5, 27];
const disc = (x, y, r, n = 16) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const turn = (ring, a) => { const c = Math.cos(a), s = Math.sin(a); return ring.map((q) => ({ u: q.v * s + q.u * c, v: q.v * c - q.u * s, nu: q.nv * s + q.nu * c, nv: q.nv * c - q.nu * s })); };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxA = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-14, -10, 0], [LEN * 0.9, LEN * 0.4, 0], [14, LEN + 12, 0], [-8, -8, PH + 4], [LEN * 0.95, 4, PH]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-12, -10, 14, LEN + 12, 6, 2);
  put(solid(g), prism(P, front, sr, si, -3, 0));
  const [hr, hi] = rings(-3, -6, 3, 0, 1.5, 1);
  put(solid(g), prism(P, front, hr, hi, 0, PH + 3));
  const gate = mk("g", {}, g);
  const rails = RAILS.map(() => solid(gate)), brace = mk("path", { class: "nf" }, gate);
  const [lr, li] = rings(-2.5, LEN + 1, 2.5, LEN + 6, 1.5, 1);
  const latch = solid(g);
  put(latch, prism(P, front, lr, li, 0, PH + 1));
  const rail = rrect(-1, 0.5, 1, LEN, 0.8, 4), railIn = rrect(-0.4, 1.1, 0.4, LEN - 0.6, 0.3, 4);
  const sp = spring(REST);
  let last = NaN;

  function draw(deg) {
    const d = Math.round(deg * 20) / 20;
    if (d === last) return;
    last = d;
    const a = rad(d), R = turn(rail, a), Ri = turn(railIn, a);
    RAILS.forEach((z, i) => put(rails[i], prism(P, front, R, Ri, z, z + 2.4)));
    const at = (t, z) => P(Math.sin(a) * LEN * t, Math.cos(a) * LEN * t, z);
    const [b0, b1] = [at(0.08, RAILS[0] + 1), at(0.92, RAILS[4] + 1)];
    brace.setAttribute("d", "M" + b0.join(",") + "L" + b1.join(","));
    // a gate swung toward the viewer passes in front of the latch post
    if (d > 8) g.appendChild(gate); else latch.g.after(gate), g.appendChild(latch.g);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { sp.t = REST; rails[4].sil.classList.add("hi"); read.textContent = "rest"; B.wake(); return; }
    const [wx, wy] = unproj(C, p[0], p[1], PH / 2);
    const deg = clamp((Math.atan2(wx, Math.max(wy, 1)) * 180) / Math.PI, 0, maxA);
    sp.t = deg;
    read.textContent = deg < 2 ? "shut" : Math.round(deg) + "°";
    B.wake();
  }
  aim(null);
  draw(REST);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxA = v; aim(null); }, destroy: bag.dispose };
}

hairline({
  name: "cattlegate",
  means: "A five-rail farm gate on its hinge post: it swings open toward the pointer, up to a quarter turn, and hangs ajar at rest.",
  rules: [1, 3, 5, 8],
  range: [40, 80, 90],
  tour: [[93, 206], [246, 221], [318, 206], null],
  mount,
});
