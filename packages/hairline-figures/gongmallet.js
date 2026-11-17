/**
 * Singing bowl: a brass bowl on a round cushion, its wooden mallet lying
 * across the rim. The pointer over the bowl picks the mallet up: it swings
 * from across the mouth to stand against the near rim, as if circling it.
 * At rest the rim is bright; when the pointer plays, the mallet is.
 * The slider is how far the mallet swings.
 *
 * The pattern: one part turning about a hinge (swing).
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, lerp, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const CR = 50, CZ = 8, B0 = 22, BR = 40, BH = 30, TOP = CZ + BH, MR = 3.6;
const REST = [[-50, 14, TOP + 3], [48, -16, TOP + 6]];
const PLAY = [[-6, 70, 2], [10, 30, TOP + 46]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-CR, -CR, 0], [CR, CR, 0], [CR, -CR, 0], [-CR, CR, 0], [-6, 72, 0], [10, 30, TOP + 50], [48, -16, TOP + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(CR, 56), circ(CR - 3, 56), 0, CZ));
  // the bowl: rings swelling from the foot to the rim
  const pts = [];
  for (let i = 0; i <= 8; i++) { const h = (i / 8) * BH, r = B0 + (BR - B0) * Math.sin((h / BH) * Math.PI / 2); pts.push(...circ(r, 48).map((q) => P(q.u, q.v, CZ + h))); }
  mk("path", { d: poly(hull(pts)), class: "sil" }, g);
  const rim = mk("path", { d: poly(circ(BR, 56).map((q) => P(q.u, q.v, TOP))), class: "nf" }, g);
  mk("path", { d: poly(circ(BR - 3, 56).map((q) => P(q.u, q.v, TOP - 0.5))), class: "nf lo" }, g);
  const stick = mk("path", { class: "sil" }, g), wrap = mk("path", { class: "nf" }, g);

  function cyl(a, b, r) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], n = Math.hypot(...d), e = d.map((x) => x / n);
    const z = Math.abs(e[2]) > 0.9 ? [1, 0, 0] : [0, 0, 1];
    let u = [e[1] * z[2] - e[2] * z[1], e[2] * z[0] - e[0] * z[2], e[0] * z[1] - e[1] * z[0]];
    const un = Math.hypot(...u); u = u.map((x) => x / un);
    const v = [u[1] * e[2] - u[2] * e[1], u[2] * e[0] - u[0] * e[2], u[0] * e[1] - u[1] * e[0]];
    const ring = (p) => Array.from({ length: 20 }, (_, i) => { const t = (i / 20) * Math.PI * 2; return P(...[0, 1, 2].map((j) => p[j] + r * (Math.cos(t) * u[j] + Math.sin(t) * v[j]))); });
    return poly(hull(ring(a).concat(ring(b))));
  }

  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const a = REST[0].map((x, j) => lerp(x, PLAY[0][j], t)), b = REST[1].map((x, j) => lerp(x, PLAY[1][j], t));
    stick.setAttribute("d", cyl(a, b, MR));
    const w = b.map((x, j) => lerp(x, a[j], 0.28));
    wrap.setAttribute("d", cyl(b, w, MR + 1.4));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, TOP - 6);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? amp : 0, performance.now(), 0);
    stick.classList.toggle("hi", on);
    wrap.classList.toggle("hi", on);
    rim.classList.toggle("hi", !on);
    read.textContent = on ? "ring" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], (sy - mid[1]) * 1.4) < 110;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "gongmallet",
  means: "A singing bowl on a cushion: over the bowl, the mallet lifts off the rim and stands against it to play.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 140], [168, 158], [232, 150], null],
  mount,
});
