/**
 * Djembe: a goblet drum, a wide bowl on a narrow waist and flared foot, with
 * rope lacing running down the bowl. The pointer rocks the drum on its foot
 * toward the side it stands on, the skin bright, as a player tips it to play.
 * At rest it leans a little, head lit. The slider is how far it rocks.
 *
 * The pattern: one part following the pointer (spring).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, proj, ringAt, run, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = -0.08, MAX = 0.32;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-40, -30, 0], [40, 30, 0], [-40, -30, 70], [40, 30, 70], [-30, 30, 66], [30, -30, 66]], 200, 166);
  const P0 = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const foot = solid(mk("g", {}, g)), bowl = solid(mk("g", {}, g));
  const rope = mk("path", { class: "nf lo" }, g);
  const head = mk("path", { class: "nf hi" }, g);
  const tilt = spring(REST);
  let last = "";

  function draw() {
    const a = tilt.x, key = a.toFixed(4);
    if (key === last) return;
    last = key;
    // rock about the foot rim on the side it leans to
    const px = a > 0 ? 17 : -17, ca = Math.cos(a), sa = Math.sin(a);
    const P = (x, y, z) => { const dx = x - px; return P0(px + dx * ca + z * sa, y, -dx * sa + z * ca + Math.abs(px * sa) * 0); };
    const R = (ring, z) => ring.map((q) => P(q.u, q.v, z));
    const Rf = (ring, z) => ring.filter((q) => front({ nu: q.nu * ca, nv: q.nv })).map((q) => P(q.u, q.v, z));
    const f0 = disc(17), w = disc(8), b0 = disc(9), top = disc(25), inn = disc(23.4);
    put(foot, { sil: poly(hull(R(f0, 0).concat(R(w, 30)))), crease: open(Rf(run(disc(15.6), front), 1.6)) });
    put(bowl, { sil: poly(hull(R(b0, 30).concat(R(top, 66)))), crease: open(R(run(inn, front), 64.4)) });
    let s = "";
    for (let i = 0; i < 14; i++) {
      const t = (i / 14) * Math.PI * 2, c = Math.cos(t), n = Math.sin(t);
      if (!front({ nu: c, nv: n })) continue;
      const t2 = t + Math.PI / 14, c2 = Math.cos(t2), n2 = Math.sin(t2);
      s += open([P(c * 24, n * 24, 61), P(c2 * 15, n2 * 15, 44), P(Math.cos(t + Math.PI / 7) * 24, Math.sin(t + Math.PI / 7) * 24, 61)]);
    }
    rope.setAttribute("d", s);
    head.setAttribute("d", poly(R(top, 66)));
  }

  const L = register(stage, (dt) => { const m = stepS(tilt, dt); draw(); return m; });
  bag.add(L.unregister);

  function aim(p) {
    if (!p) { tilt.t = REST; read.textContent = "rest"; L.wake(); return; }
    const [x, y] = unproj(C, p[0], p[1], 66);
    if (Math.hypot(x, y) > 70) return aim(null);
    const k = Math.max(-1, Math.min(1, (x - y) / 40));
    tilt.t = k * MAX * reach;
    read.textContent = (k < 0 ? "L" : "R") + Math.round(Math.abs(k) * 9);
    L.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; L.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "djembe",
  means: "A djembe goblet drum that rocks on its foot toward the pointer, its laced skin lit.",
  rules: [3, 4, 5, 9],
  range: [0.3, 1, 1],
  tour: [[303, 98], [97, 78], [250, 110], null],
  mount,
});
