/**
 * Drainpipes: a manhole in a street slab, its round cast cover sitting
 * slightly askew over the shaft, rungs going down inside. The pointer's
 * place along the street slides the cover off the collar on a spring, the
 * further the more open. At rest the cover sits a third off, bright. The
 * slider is how far the cover may travel.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 22, SL = 120, REST = 0.33;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-40, -40, 0], [SL - 40 + 30, 40, 0], [SL - 10, -40, 0], [-40, 40, 0], [0, 0, 8]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [sr, si] = rings(-40, -40, SL - 10, 40, 6, 2);
  put(solid(g), prism(P, front, sr, si, 0, 4));
  // the collar round the opening, then the dark shaft with its rungs
  put(solid(g), prism(P, front, disc(0, 0, R + 5), disc(0, 0, R + 3), 4, 5.4));
  mk("path", { d: poly(ringAt(P, disc(0, 0, R), 5.4)), class: "lo" }, g);
  let d = "";
  for (let i = 0; i < 3; i++) { const z = 1 - i * 5; d += open([P(-R + 1, -5, z), P(-R + 4, -5, z), P(-R + 4, 5, z), P(-R + 1, 5, z)]); }
  mk("path", { d, class: "nf lo" }, g);
  const cover = solid(g), tread = mk("path", { class: "nf lo" }, g), lift = mk("circle", { r: 1.6, class: "dot m" }, g);
  const s = spring(REST);
  let last = NaN;

  function draw(t) {
    if (t === last) return;
    last = t;
    const cx = t * SL * 0.62, cz = 5.4 + (t > 0.05 ? 0.6 : 0);
    const [cr, ci] = [disc(cx, 0, R + 1.5), disc(cx, 0, R - 0.5)];
    put(cover, prism(P, front, cr, ci, cz, cz + 2.2));
    let p = "";
    for (const r of [7, 14]) p += poly(ringAt(P, disc(cx, 0, r, 32), cz + 2.2));
    for (let a = 0; a < 4; a++) { const q = (a * Math.PI) / 4; p += seg(P(cx + Math.cos(q) * 14, Math.sin(q) * 14, cz + 2.2), P(cx - Math.cos(q) * 14, -Math.sin(q) * 14, cz + 2.2)); }
    tread.setAttribute("d", p);
    const k = P(cx + 17, 0, cz + 2.2);
    lift.setAttribute("cx", k[0]); lift.setAttribute("cy", k[1]);
  }

  const B = register(stage, (dt) => { const m = stepS(s, dt); draw(s.x); return m; });
  bag.add(B.unregister);

  let on = false;
  function aim(p) {
    if (!p) { on = false; s.t = REST; read.textContent = "rest"; cover.sil.classList.add("hi"); B.wake(); return; }
    const [wx] = unproj(C, p[0], p[1], 0);
    const t = clamp((wx + 30) / (SL + 10), 0, 1) * reach;
    s.t = t; on = true;
    read.textContent = "open " + Math.round(t * 100) + "%";
    cover.sil.classList.add("hi");
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; if (on) B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "drainpipes",
  means: "A manhole cover over its shaft in a street slab: the pointer's place along the street slides the cover open.",
  rules: [1, 3, 5, 8],
  range: [40, 100, 100],
  tour: [[175, 150], [231, 187], [262, 214], null],
  mount,
});
