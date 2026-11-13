/**
 * Loudspeakers: a stack of four speaker cabinets, two by two on a riser, each
 * with a woofer and a tweeter on its front: a surround, a cone and a dust
 * cap. The cones near the pointer push out, each on its own spring, by a
 * falloff of their distance from it; the cabinet under the pointer is bright.
 * At rest the cones sit a little out, unevenly, and cab 3 is bright. The
 * slider is how far the cones throw.
 *
 * The pattern: a field (terrain's falloff to a floor) on the cones; the pick
 * is the cabinet whose resting face centre is nearest the pointer on screen.
 */
const {
  Cam, clamp, fit, poly, prism, proj, facing, rings, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 42, D = 30, H = 40, FAV = 2, REST = [1.2, 0.4, 2.2, 0.8, 0.6, 1.6, 0.3, 1];
const CABS = [[0, 0], [1, 0], [0, 1], [1, 1]].map(([c, r]) => ({ x0: c * (W + 1), z0: r * H }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let throw_ = value;
  const C = Cam(45, 0.5, 1.95);
  const X1 = 2 * W + 1;
  fit(C, [[-4, -4, -5], [X1 + 4, D + 14, -5], [X1 + 4, -4, -5], [-4, D + 14, -5], [0, 0, 2 * H], [X1, 0, 2 * H], [0, D + 8, 2 * H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [rr, ri] = rings(-4, -4, X1 + 4, D + 4, 3, 1.2);
  put(solid(g), prism(P, front, rr, ri, -5, 0));

  const vring = (cx, cz, y, r, n = 28) => Array.from({ length: n }, (_, i) => {
    const t = (i / n) * Math.PI * 2; return P(cx + r * Math.cos(t), y, cz + r * Math.sin(t));
  });
  const cones = [];
  const cabs = CABS.map((cb, k) => {
    const el = solid(g), [r, i] = rings(cb.x0, 0, cb.x0 + W, D, 3, 1.2);
    put(el, prism(P, front, r, i, cb.z0 + 0.4, cb.z0 + H));
    const cx = cb.x0 + W / 2;
    for (const [cz, R] of [[cb.z0 + 16, 12.5], [cb.z0 + 33, 4.2]]) {
      mk("path", { class: "lo", d: poly(vring(cx, cz, D, R)) }, el.g);
      const cone = mk("path", { class: "nf lo" }, el.g), cap = mk("path", {}, el.g);
      const j = cones.length;
      cones.push({ cx, cz, R, cone, cap, sp: spring(REST[j]), rest: REST[j], at: P(cx, D, cz), drawn: NaN });
    }
    return { k, el, mid: P(cx, D, cb.z0 + H / 2) };
  });

  function draw(q) {
    const p = q.sp.x;
    if (Math.abs(p - q.drawn) < 0.01) return;
    q.drawn = p;
    q.cone.setAttribute("d", poly(vring(q.cx, q.cz, D + p * 0.45, q.R * 0.72)));
    q.cap.setAttribute("d", poly(vring(q.cx, q.cz, D + p, q.R * 0.32, 20)));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const q of cones) { if (stepS(q.sp, dt)) m = true; draw(q); }
    return m;
  });
  bag.add(B.unregister);

  let pt = null;
  function retarget() {
    let best = -1, bd = Infinity;
    if (pt) cabs.forEach((c, k) => { const d = Math.hypot(c.mid[0] - pt[0], c.mid[1] - pt[1]); if (d < bd) { bd = d; best = k; } });
    if (bd > 70) best = -1;
    for (const q of cones) {
      if (best < 0) { q.sp.t = q.rest; continue; }
      const d = Math.hypot(q.at[0] - pt[0], q.at[1] - pt[1]) / 110;
      const f = d < 0.42 ? 1 - (d / 0.42) * 0.69 : Math.max(0.09, 0.31 - (d - 0.42) * 0.6);
      q.sp.t = clamp(f * 7 * throw_, 0, 9);
    }
    cabs.forEach((c, k) => c.el.sil.classList.toggle("hi", k === (best < 0 ? FAV : best)));
    read.textContent = best < 0 ? "rest" : "cab " + (best + 1);
    B.wake();
  }
  retarget();
  bag.add(pointer(stage, { move: (p) => { pt = p; retarget(); }, leave: () => { pt = null; retarget(); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { throw_ = v; if (pt) retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "loudspeakers",
  means: "A stack of four speaker cabinets: the cones near the pointer push out, and the cabinet under it is bright.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.25],
  tour: [[160, 150], [230, 200], [200, 120], null],
  mount,
});
