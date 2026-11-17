/**
 * Hatch wheel: a round hatch in a deck collar, its locking wheel on top. At
 * rest the hatch sits ajar, the wheel bright. The pointer spins the wheel and
 * swings the hatch open on its hinge; leaving closes it back. The slider is
 * how far it opens.
 */
const { Cam, circ, rrect, fit, hull, poly, open, proj, spring, stepS, clamp, rad, mk, pointer, register, disposer } = HL;

const RX = (a) => ([x, y, z]) => { const c = Math.cos(a), s = Math.sin(a); return [x, y * c - z * s, y * s + z * c]; };
const RZ = (a) => ([x, y, z]) => { const c = Math.cos(a), s = Math.sin(a); return [x * c - y * s, x * s + y * c, z]; };
const CX = 35, CY = 35, R = 26, ZB = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value / 100;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-2, -2, 0], [72, 72, 0], [72, -2, 0], [-2, 72, 0], [CX, CY + R + 12, 70], [CX - R, CY + R, 40], [CX + R, CY + R, 40]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const disc = (r, z0, z1, T, n = 36) => { const pts = []; for (const z of [z0, z1]) for (const q of circ(r, n)) pts.push(T([q.u, q.v, z])); return poly(hull(pts)); };
  const W = (p) => P(p[0] + CX, p[1] + CY, p[2]);
  const slab = []; for (const z of [0, 6]) for (const q of rrect(0, 0, 70, 70, 8, 4)) slab.push(P(q.u, q.v, z));
  mk("path", { class: "sil", d: poly(hull(slab)) }, g);
  mk("path", { class: "sil", d: disc(R + 6, 6, ZB, W) }, g);
  mk("path", { class: "nf lo", d: poly(circ(R - 1, 36).map((q) => W([q.u, q.v, ZB]))) }, g);
  const lid = mk("path", { class: "sil" }, g), lidcr = mk("path", { class: "nf lo" }, g);
  const wheel = mk("path", { class: "sil hi" }, g), spokes = mk("path", { class: "nf" }, g);
  const sp = spring(0);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const a = rad(18 + o * amp * 82), s = rad(o * amp * 200);
    const T = (p) => { const q = RX(-a)([p[0], p[1] - R, p[2]]); return W([q[0], q[1] + R, q[2] + ZB]); };
    const TW = (p) => T(RZ(s)(p));
    lid.setAttribute("d", disc(R, 0, 4, T));
    lidcr.setAttribute("d", poly(circ(R - 2, 36).map((q) => T([q.u, q.v, 4]))));
    wheel.setAttribute("d", disc(15, 5, 9, TW, 28));
    let d = poly(circ(11, 28).map((q) => TW([q.u, q.v, 9]))) + " " + poly(circ(3, 12).map((q) => TW([q.u, q.v, 9])));
    for (let k = 0; k < 4; k++) { const c = Math.cos(k * Math.PI / 2), si = Math.sin(k * Math.PI / 2); d += " " + open([TW([3 * c, 3 * si, 9]), TW([11 * c, 11 * si, 9])]); }
    spokes.setAttribute("d", d);
  }
  draw(0);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  function aim(p) { sp.t = p ? clamp(0.8 + (p[0] - 200) / 500, 0.6, 1) : 0; read.textContent = p ? "open " + Math.round(sp.t * 100) : "rest"; B.wake(); }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v / 100; last = NaN; draw(sp.x); }, destroy: bag.dispose };
}

hairline({
  name: "airlock2",
  means: "A round hatch in a deck collar: the pointer spins its wheel and swings it open on the hinge; leaving shuts it.",
  rules: [1, 3, 5, 8],
  range: [50, 100, 100],
  tour: [[230, 125], [260, 140], [180, 150], null],
  mount,
});
