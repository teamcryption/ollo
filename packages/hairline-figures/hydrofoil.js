/**
 * Hydrofoil: a pointed hull with a cabin, standing on two struts over a
 * wide bow foil and a narrower stern foil that stay at the waterline. The
 * pointer near the boat lifts the hull up its struts, clear of the water;
 * away it settles low. At rest it sits half-lifted, the bow foil bright.
 * The slider is how high the foils lift the hull.
 */
const {
  Cam, clamp, facing, fillet, fit, hull, lerp, open, poly, prism, proj, rings, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 112, B = 32, H = 12, REST = 0.3, LOW = 4, FX = 80, RX = 16;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[0, -B / 2 - 10, 0], [L, B / 2 + 10, 0], [FX, B / 2 + 12, 0], [0, 0, 48 + H + 12], [L, 0, 48 + H]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const half = (u) => (B / 2) * Math.pow(clamp((L - u) / (L * 0.5), 0, 1), 0.6);
  const ring = (z, k) => {
    const a = [];
    for (let i = 0; i <= 24; i++) { const u = (i / 24) * L; a.push(P(u, half(u) * k, z)); }
    for (let i = 24; i >= 0; i--) { const u = (i / 24) * L; a.push(P(u, -half(u) * k, z)); }
    return a;
  };
  // the foils: thin wings at the waterline, the stern one first
  const foil = (x, span, cls) => {
    const pts = [P(x - 6, -span, 0), P(x + 3, -span, 0), P(x + 3, span, 0), P(x - 6, span, 0), P(x - 6, span, -2), P(x - 6, -span, -2)];
    const s = solid(g);
    s.sil.setAttribute("d", poly(fillet(hull(pts), Array(hull(pts).length).fill(1.5))));
    s.cr.setAttribute("class", "nf lo");
    s.cr.setAttribute("d", seg(P(x - 5, -span + 2, 0), P(x - 5, span - 2, 0)));
    if (cls) s.sil.classList.add(cls);
    return s;
  };
  foil(RX, 16);
  const bow = foil(FX, 28, "hi");
  // the struts: one pair under the bow, one under the stern
  const struts = [[RX - 2, -5], [RX - 2, 5], [FX - 2, -7], [FX - 2, 7]].map(([x, y]) => ({ x, y, s: solid(g) }));
  // the hull and its cabin
  const hl = solid(g), cab = solid(g);
  const [cr, ci] = rings(26, -8, 60, 8, 5, 1.2);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const z = lerp(LOW, amp, t);
    struts.forEach(({ x, y, s }) => {
      const [sr, si] = rings(x - 2, y - 1.2, x + 2, y + 1.2, 1.2, 0.4);
      put(s, prism(P, front, sr, si, 0, z + 3));
    });
    hl.sil.setAttribute("d", poly(hull(ring(z, 0.4).concat(ring(z + H, 1)))));
    hl.cr.setAttribute("class", "nf lo");
    hl.cr.setAttribute("d", open(ring(z + H, 0.86)));
    put(cab, prism(P, front, cr, ci, z + H, z + H + 10));
  }
  const sp = spring(REST);
  const Bk = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(Bk.unregister);

  // the hit: a fixed patch of water round the boat; nearer its middle lifts higher
  function aim(t) {
    const on = t !== null;
    sp.t = on ? t : REST;
    bow.sil.classList.toggle("hi", !on);
    hl.sil.classList.toggle("hi", on);
    read.textContent = on ? "lift " + Math.round(lerp(LOW, amp, t)) : "rest";
    Bk.wake();
  }
  aim(null);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const [x, y] = unproj(C, sx, sy, 0);
      if (x < -30 || x > L + 30 || Math.abs(y) > 60) return aim(null);
      aim(clamp(1.4 - Math.hypot(x - L / 2, y) / 70, 0, 1));
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 20, 48); last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "hydrofoil",
  means: "A hydrofoil on two foils at the waterline: the pointer near the boat lifts the hull up its struts, clear of the water.",
  rules: [1, 3, 5, 8],
  range: [20, 38, 48],
  tour: [[200, 230], [120, 205], [290, 250], null],
  mount,
});
