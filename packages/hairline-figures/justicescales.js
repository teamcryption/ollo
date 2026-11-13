/**
 * Scales of justice: a round pillar on a stepped plinth, a beam on a pivot at
 * its head, and two shallow pans hung from the beam's ends on three chains
 * each. The pointer's side of the pillar is the heavier one: the beam tips
 * toward it on a spring, by how far the pointer stands from the middle, and
 * the lower pan is bright. At rest the beam leans slightly to one side.
 * The slider is how quickly the beam follows.
 *
 * The pattern: a continuous lean (spring on an angle); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, run, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PH = 70, L = 34, HANG = 30, PR = 11, MAX = 14, REST = 7, R2 = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-L * R2 - PR, L * R2 - PR, PH - HANG - 12], [L * R2 + PR, -L * R2 + PR, PH - HANG - 12], [-20, 20, -6], [20, -20, -6], [0, 0, PH + 8], [-L * R2, L * R2, PH + 10], [L * R2, -L * R2, PH + 10]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const [r0, i0] = rings(-20, -20, 20, 20, 3, 1.2); put(solid(g), prism(P, front, r0, i0, -6, -2));
  const [r1, i1] = rings(-14, -14, 14, 14, 3, 1.2); put(solid(g), prism(P, front, r1, i1, -2, 2));
  const far = mk("g", {}, g);
  put(solid(g), prism(P, front, circ(3, 32), circ(2.2, 32), 2, PH));
  put(solid(g), prism(P, front, circ(4.5, 32), circ(3.6, 32), PH - 3, PH));
  const beam = mk("path", { class: "sil" }, g), knob = solid(g);
  put(knob, prism(P, front, circ(2, 20), circ(1.4, 20), PH, PH + 8));
  const near = mk("g", {}, g);
  const pans = [far, near].map((parent) => {
    const chains = mk("path", { class: "nf lo" }, parent), dish = solid(parent);
    return { chains, dish };
  });

  const foot = circ(PR * 0.55, 32), top = circ(PR, 40), inner = circ(PR - 1, 40);
  const tilt = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let last = NaN;

  function draw() {
    const t = tilt.x;
    if (t === last) return;
    last = t;
    const a = (t * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    // the beam: a bar through the pivot, a positive tilt drops its +x end
    const ring = (x, z) => Array.from({ length: 16 }, (_, i) => {
      const q = (i / 16) * Math.PI * 2, rr = 1.4;
      const b = x - rr * Math.cos(q) * s, w = rr * Math.sin(q);
      return P(b * R2 + w * R2, -b * R2 + w * R2, z + rr * Math.cos(q) * c);
    });
    const e0 = [-L * c, PH + 4 + L * s], e1 = [L * c, PH + 4 - L * s];
    beam.setAttribute("d", poly(hull(ring(e0[0], e0[1]).concat(ring(e1[0], e1[1])))));
    [e0, e1].forEach(([x, z], k) => {
      const zb = z - HANG, p = pans[k];
      const X = x * R2, Y = -x * R2, shift = (rg) => rg.map((q) => ({ ...q, u: q.u + X, v: q.v + Y }));
      const ft = shift(foot), tp = shift(top), inn = shift(inner);
      put(p.dish, { sil: poly(hull(ringAt(P, ft, zb).concat(ringAt(P, tp, zb + 3)))), crease: open(ringAt(P, run(inn, front), zb + 3)) });
      let ch = "";
      for (let j = 0; j < 3; j++) { const q = (j / 3) * Math.PI * 2 + 0.5; ch += seg(P(X, Y, z - 1.4), P(X + (PR - 1) * Math.cos(q), Y + (PR - 1) * Math.sin(q), zb + 3)); }
      p.chains.setAttribute("d", ch);
    });
  }

  const B = register(stage, (dt) => { const m = stepS(tilt, dt); draw(); return m; });
  bag.add(B.unregister);

  function lean(p) {
    let tt = REST, on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0), d = (x - y) / Math.SQRT2;
      if (Math.abs(d) < 90 && Math.abs(x + y) < 120) { on = true; tt = clamp(Math.round(d * 0.4), -MAX, MAX); }
    }
    tilt.t = tt;
    pans[0].dish.sil.classList.toggle("hi", tt < 0);
    pans[1].dish.sil.classList.toggle("hi", tt >= 0);
    read.textContent = on ? `tilt ${Math.abs(tt)}°` : "rest";
    B.wake();
  }
  lean(null);
  bag.add(pointer(stage, { move: lean, leave: () => lean(null) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { tilt.k = 100 * v; tilt.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "justicescales",
  means: "A balance scale on a pillar: the beam tips toward the side the pointer is on, and the lower pan is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[283, 160], [117, 160], [330, 200], null],
  mount,
});
