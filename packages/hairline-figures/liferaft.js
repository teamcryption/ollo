/**
 * Life raft canister: a capsule-shaped canister lying in its deck cradle,
 * two saddles under it and two straps round it. Its top shell lifts off the
 * lower half, and the raft's canopy swells up out of the opening, its arch
 * tube crossing it. At rest the shell sits just cracked open, bright. The
 * slider is how far the shell lifts and the canopy swells.
 *
 * The pattern: one part answering (cloches' lift, single); the hit is on the
 * canister's resting seam plane, which never moves.
 */
const {
  Cam, clamp, fit, open, poly, prism, proj, rings, rrect, ringAt, hull, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 92, R = 18, DZ = 4, ZC = DZ + 12 + R, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.95);
  fit(C, [[-12, -R - 10, 0], [L + 12, R + 10, 0], [L + 12, -R - 10, 0], [-12, R + 10, 0], [0, 0, ZC + R + 62], [L, 0, ZC + R + 62]], 200, 170);
  const P = proj(C);
  const front = () => true;
  const g = mk("g", {}, svg);

  // the deck plate and the two saddles of the cradle
  const [dr, di] = rings(-12, -R - 10, L + 12, R + 10, 6, 2);
  put(solid(g), prism(P, front, dr, di, 0, DZ));
  for (const x of [L * 0.2, L * 0.8]) {
    const [sr, si] = rings(x - 6, -R + 2, x + 6, R - 2, 3, 1.2);
    put(solid(g), prism(P, front, sr, si, DZ, ZC - R + 5));
  }

  // a half of the canister: end caps from angle a0 to a1, at height offset dz
  const arc = (x, a0, a1, dz, n = 18) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + ((a1 - a0) * i) / n; return P(x, R * Math.cos(a), ZC + dz + R * Math.sin(a)); });
  const lowSil = mk("path", { class: "sil" }, g);
  lowSil.setAttribute("d", poly(hull(arc(0, Math.PI, 2 * Math.PI, 0).concat(arc(L, Math.PI, 2 * Math.PI, 0)))));
  let lowCr = poly([P(0, -R, ZC), P(L, -R, ZC), P(L, R, ZC), P(0, R, ZC)]) + open(arc(L, Math.PI * 1.5, 2 * Math.PI, 0));
  for (const x of [L * 0.3, L * 0.7]) lowCr += open(arc(x, Math.PI * 1.5, 2 * Math.PI, 0, 8));
  mk("path", { class: "nf lo", d: lowCr }, g);

  const canopy = mk("path", { class: "sil" }, g), arch = mk("path", { class: "nf lo" }, g);
  const top = mk("path", { class: "sil hi" }, g), topCr = mk("path", { class: "nf lo" }, g);
  const base = rrect(8, -R + 4, L - 8, R - 4, 12, 6);

  const tw = tween(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    const H = h * 0.85;
    if (H < 2) { canopy.setAttribute("d", ""); arch.setAttribute("d", ""); }
    else {
      const pts = [];
      for (let i = 0; i <= 6; i++) {
        const t = (i / 6) * (Math.PI / 2), c = Math.cos(t), mx = L / 2;
        pts.push(...ringAt(P, base.map((q) => ({ ...q, u: mx + (q.u - mx) * (0.55 + 0.45 * c), v: q.v * c })), ZC + H * Math.sin(t)));
      }
      canopy.setAttribute("d", poly(hull(pts)));
      const w = R - 4, ar = [];
      for (let i = 0; i <= 16; i++) { const y = -w + (2 * w * i) / 16; ar.push(P(L / 2, y, ZC + H * Math.sqrt(Math.max(0, 1 - (y / w) ** 2)))); }
      arch.setAttribute("d", open(ar));
    }
    top.setAttribute("d", poly(hull(arc(0, 0, Math.PI, h).concat(arc(L, 0, Math.PI, h)))));
    let cr = poly(arc(L, 0, Math.PI, h).concat([P(L, -R, ZC + h)]));
    for (const x of [L * 0.3, L * 0.7]) cr += open(arc(x, 0, Math.PI, h, 12));
    topCr.setAttribute("d", cr);
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, ZC);
    return x > -14 && x < L + 14 && Math.abs(y) < R + 14;
  }
  let on = null;
  function setOn(o) {
    if (o === on) return;
    on = o;
    tset(tw, o ? lift : REST, performance.now(), 0);
    read.textContent = o ? "open" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { lift = clamp(v, 10, 60); if (on) { tset(tw, lift, performance.now(), 0); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "liferaft",
  means: "A life raft canister in its cradle: under the pointer its top shell lifts and the raft's canopy swells up out of it.",
  rules: [1, 5, 6, 8],
  range: [10, 34, 60],
  tour: [[200, 165], [245, 190], [160, 142], null],
  mount,
});
