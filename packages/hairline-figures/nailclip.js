/**
 * Nail clippers: two springy strips riveted at the back and meeting at the
 * jaw, a pin through them and a long lever riding on the pin. The pointer
 * sweeping from the back toward the jaw swings the lever up on its pin and
 * over, from stowed to the ready position. At rest the lever stands half up,
 * bright. The slider is how far over a full sweep swings it.
 *
 * The pattern: a continuous swing on a spring; the hit is the pointer's
 * screen x against the clipper's fixed rest pose.
 */
const {
  Cam, clamp, fit, facing, hull, poly, prism, proj, rings, circ, rrect, spring, stepS, rad, ringAt,
  disposer, mk, pointer, put, register, solid,
} = HL;

const L = 56, PX = 44, PZ = 11, LL = 50, LW = 5, TH = 1.4, REST = 50;
const at = (x, y, r, n) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let over = value;
  const C = Cam(45, 0.5, 3.5);
  fit(C, [[-6, -7, 0], [L + 2, 7, 0], [L + 2, -7, 0], [-6, 7, 0], [PX, 0, PZ + LL + 2], [PX + LL * 0.7, 0, PZ + LL * 0.7], [PX - LL * 0.7, 0, PZ + LL * 0.7]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(0, -6, L, 6, 4, 1), 0, 2.4));
  // the top strip rises from the rivet to the jaw
  const strip = rrect(0, -6, L - 1, 6, 4, 4), sp2 = [];
  for (const q of strip) { const z = 2.4 + (q.u / L) * 4.2; sp2.push(P(q.u, q.v, z), P(q.u, q.v, z + 2)); }
  mk("path", { class: "sil", d: poly(hull(sp2)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, at(4, 0, 1.6, 16), 4.6)) }, g);
  put(solid(g), prism(P, front, at(PX, 0, 1.8, 20), at(PX, 0, 1.2, 20), 7.5, PZ));
  const lever = mk("path", { class: "sil hi" }, g), dimple = mk("path", { class: "nf lo" }, g);
  const ring = rrect(-4, -LW, LL, LW, 3.5, 4);
  const sp = spring(REST);
  let last = "";

  function draw() {
    const key = sp.x.toFixed(2);
    if (key === last) return;
    last = key;
    const a = rad(sp.x), c = Math.cos(a), s = Math.sin(a);
    const pt = (u, v, t) => P(PX - u * c + t * s, v, PZ + u * s + t * c);
    const pts = [];
    for (const q of ring) pts.push(pt(q.u, q.v, 0), pt(q.u, q.v, TH));
    lever.setAttribute("d", poly(hull(pts)));
    const d = circ(2.6, 16).map((q) => pt(LL - 7 + q.u, q.v, TH));
    dimple.setAttribute("d", poly(d));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const back = P(-4, 0, 0), jaw = P(L, 0, 0), mid = P(L / 2, 0, PZ);
  function aim(p) {
    if (!p || Math.abs(p[1] - mid[1]) > 130) { sp.t = REST; read.textContent = "rest"; B.wake(); return; }
    const f = clamp((p[0] - back[0]) / (jaw[0] - back[0]), 0, 1), deg = f * 180 * over;
    sp.t = deg;
    read.textContent = Math.round(deg) + "°";
    B.wake();
  }
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  read.textContent = "rest";
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { over = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "nailclip",
  means: "Nail clippers: sweeping the pointer from the rivet toward the jaw swings the lever up on its pin and over into place.",
  rules: [1, 3, 4, 5, 8],
  range: [0.4, 0.85, 1],
  tour: [[120, 190], [185, 220], [257, 253], null],
  mount,
});
