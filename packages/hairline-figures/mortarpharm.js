/**
 * Pill tin: a round pocket tin of pills with a hinged lid. The pointer over
 * the tin swings the lid open on its back hinge to show the pills. At rest
 * the lid sits ajar, bright. The slider is how far the lid opens.
 *
 * The pattern: one part following the pointer (swing).
 */
const { Cam, circ, fit, hull, poly, proj, clamp, spring, stepS, mk, pointer, register, disposer, flatDot, place } = HL;

const R = 30, H = 15, LH = 6, PIV = [-R - 1, 0, H];
const rot = (p, o, a) => { const x = p[0] - o[0], z = p[2] - o[2], c = Math.cos(a), s = Math.sin(a); return [o[0] + x * c - z * s, p[1], o[2] + x * s + z * c]; };
const ring = (r, z, n = 40) => circ(r, n).map((q) => [q.u, q.v, z]);
const REST = 0.42, OPEN = 1.5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let sw = value;
  const C = Cam(45, 0.5, 2.95);
  const lidPts = (a) => ring(R + 1.5, H, 32).concat(ring(R + 1.5, H + LH, 32)).map((p) => rot(p, PIV, a));
  fit(C, ring(R, 0, 16).concat(lidPts(OPEN), lidPts(REST)), 200, 162);
  const P = proj(C), T = (p) => P(...p);
  const g = mk("g", {}, svg);
  const lidG = mk("g", {}, g), baseG = mk("g", {}, g);
  mk("path", { class: "sil", d: poly(hull(ring(R, 0).concat(ring(R, H)).map(T))) }, baseG);
  mk("path", { class: "lo", d: poly(ring(R - 2.2, H).map(T)) }, baseG);
  const pills = [[-8, -6], [6, -12], [12, 4], [-4, 10], [-16, 4], [2, -1], [16, -8], [-12, -16], [8, 16]];
  for (const [x, y] of pills) place(flatDot(baseG, C, 2.6, "dot m"), T([x, y, H]));
  const lid = mk("path", { class: "sil hi" }, lidG), lidIn = mk("path", { class: "nf lo" }, lidG);
  const sp = spring(REST);
  let last = NaN, behind = null;
  function draw(a) {
    if (a === last) return;
    last = a;
    lid.setAttribute("d", poly(hull(lidPts(a).map(T))));
    lidIn.setAttribute("d", poly(ring(R - 1, H + LH, 32).map((p) => T(rot(p, PIV, a)))));
    const b = a > 0.9;
    if (b !== behind) { behind = b; if (b) g.insertBefore(lidG, baseG); else baseG.after(lidG); }
  }
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  const box = hull(ring(R + 2, 0).concat(ring(R + 2, H + LH)).map(T));
  const xs = box.map((p) => p[0]), ys = box.map((p) => p[1]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys) - 30, y1 = Math.max(...ys) + 10;
  function aim(p) {
    const inside = p && p[0] > x0 && p[0] < x1 && p[1] > y0 && p[1] < y1;
    const t = inside ? clamp(1.2 - (p[1] - y0) / (y1 - y0), 0.35, 1) : null;
    sp.t = t === null ? REST : REST + t * (OPEN - REST) * (sw / 100);
    lid.classList.add("hi");
    read.textContent = t === null ? "rest" : "lid " + Math.round(t * 100) + "%";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sw = v; }, destroy: bag.dispose };
}

hairline({
  name: "mortarpharm",
  means: "A round pocket pill tin: the hinged lid swings open on its back hinge as the pointer comes over, showing the pills.",
  rules: [1, 3, 4, 5],
  range: [40, 100, 100],
  tour: [[225, 263], [225, 205], [225, 165], null],
  mount,
});
