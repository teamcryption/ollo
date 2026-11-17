/**
 * Putty knife: a broad flexible blade on a ferrule and a round handle, lying
 * on its blade edge. The pointer over it tips the knife up on that edge to a
 * scraping angle, handle rising; at rest it leans a little and the blade is
 * bright. The slider is how steeply it tips.
 *
 * The pattern: one part turning about a fixed edge, tweened on hover.
 */
const { Cam, circ, rrect, fit, proj, hull, poly, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const HX = -38, HZ = 0, REST = 4;
const V = [0.61, 0.61, 0.5];
const map = (ax, a, b, c) => (ax === "z" ? [a, b, c] : ax === "x" ? [c, a, b] : [a, c, b]);
const N = { z: [0, 0, 1], x: [1, 0, 0], y: [0, 1, 0] };
function bx(ax, a0, b0, a1, b1, c0, c1, r) {
  const q = rrect(a0, b0, a1, b1, r, 4), qi = rrect(a0 + 1.4, b0 + 1.4, a1 - 1.4, b1 - 1.4, Math.max(r - 1.4, 0.4), 4);
  return { pts: [c0, c1].flatMap((c) => q.map((s) => map(ax, s.u, s.v, c))), cr: qi.map((s) => map(ax, s.u, s.v, c1)), n: N[ax] };
}
function cy(ax, ca, cb, R, c0, c1) {
  const q = circ(R, 28), qi = circ(Math.max(R - 1.4, 0.5), 28);
  return { pts: [c0, c1].flatMap((c) => q.map((s) => map(ax, s.u + ca, s.v + cb, c))), cr: qi.map((s) => map(ax, s.u + ca, s.v + cb, c1)), n: N[ax] };
}
// open about the lid hinge (y axis through x HX, z HZ)
const turn = (p, a) => { const c = Math.cos(a), s = Math.sin(a), x = p[0] - HX, z = p[2] - HZ; return [HX + x * c - z * s, p[1], HZ + x * s + z * c]; };

const PARTS = [
  { s: bx("z", -38, -20, 2, 20, 0, 1.6, 4), m: 1, hi: 1, cup: 1 },
  { s: bx("z", -6, -8, 10, 8, 0, 4, 3), m: 1 },
  { s: cy("x", 0, 5, 7, 10, 58), m: 1 },
  { s: cy("x", 0, 5, 2, 58, 59), m: 1 },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.3);
  const ext = [];
  for (const a of [REST, REST + 20, REST + 40]) for (const pt of PARTS) for (const p of pt.s.pts) ext.push(pt.m ? turn(p, rad(a)) : p);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const els = PARTS.map((pt) => ({ pt, sil: mk("path", { class: pt.lo ? "nf lo" : "sil" + (pt.hi ? " hi" : "") }, g), cr: mk("path", { class: "nf lo" }, g) }));
  const t = tween(0);
  let last = NaN, order = false;
  function draw(v) {
    const a = rad(REST + v * amp);
    if (a === last) return;
    last = a;
    for (const e of els) {
      const f = e.pt.m ? (p) => turn(p, a) : (p) => p;
      e.sil.setAttribute("d", poly(hull(e.pt.s.pts.map((p) => P(...f(p))))));
      const o = f([HX, 0, HZ]), q = f([HX + e.pt.s.n[0], e.pt.s.n[1], HZ + e.pt.s.n[2]]), n = [q[0] - o[0], q[1] - o[1], q[2] - o[2]];
      const vis = !e.pt.lo && n[0] * V[0] + n[1] * V[1] + n[2] * V[2] > 0.15;
      e.cr.setAttribute("d", vis ? poly(e.pt.s.cr.map((p) => P(...f(p)))) : "");
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  const sc = ext.slice(0, ext.length / 3).map((p) => P(...p));
  const bb = [Math.min(...sc.map((p) => p[0])), Math.min(...sc.map((p) => p[1])), Math.max(...sc.map((p) => p[0])), Math.max(...sc.map((p) => p[1]))];
  const knobAt = P(10, 0, 8);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
        read.textContent = on ? "tip " + Math.round(REST + amp) + "°" : "rest";
    B.wake();
  }
  setActive(false);
  const inside = ([x, y]) => x > bb[0] - 6 && x < bb[2] + 6 && y > bb[1] - 6 && y < bb[3] + 6;
  bag.add(pointer(stage, { move: (p) => setActive(inside(p) && Math.hypot(p[0] - knobAt[0], p[1] - knobAt[1]) < 90), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; if (act) read.textContent = "tip " + Math.round(REST + amp) + "°"; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "caulkknife",
  means: "A putty knife lying on its blade: hover and it tips up on the blade edge to a scraping angle, handle rising.",
  rules: [1, 3, 5, 8],
  range: [15, 28, 40],
  tour: [[145, 204], [230, 240], [310, 275], null],
  mount,
});
