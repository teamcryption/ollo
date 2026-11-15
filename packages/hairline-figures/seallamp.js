/**
 * Wax seal: a letter lying flat with a round blob of wax on its flap and a
 * seal stamp held above it, a broad head, a waist and a turned knob. The
 * pointer over the letter presses the stamp down into the wax; the slider is
 * how far it presses. At rest the wax is the bright mark; pressed, the stamp.
 */
const {
  Cam, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 22, CY = 15, UP = 24, WAX = 3;
const circ = (r) => rrect(CX - r, CY - r, CX + r, CY + r, r, 6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.4);
  fit(C, [[0, 0, 0], [44, 30, 0], [44, 0, 0], [0, 30, 0], [CX - 6, CY, UP + WAX + 24], [CX + 6, CY, UP + WAX + 24]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const s = solid(g), [o, i] = rings(x0, y0, x1, y1, r, b); put(s, prism(P, front, o, i, z0, z1)); return s; };
  const H3 = (pts) => poly(hull(pts.map((p) => P(...p))));
  const L3 = (pts) => pts.map((p, k) => (k ? "L" : "M") + P(...p).map((n) => n.toFixed(1)).join(" ")).join("");

  const letter = box(0, 0, 44, 30, 1, 0.5, 0, 1.2);
  mk("path", { class: "nf lo", d: L3([[0, 30, 1.2], [CX, 13, 1.2], [44, 30, 1.2]]) + L3([[3, 3, 1.2], [CX, 13, 1.2], [41, 3, 1.2]]) }, letter.g);
  const wax = box(CX - 6.5, CY - 6, CX + 6.5, CY + 6.5, 6, 1.6, 1.2, WAX);
  const parts = [solid(g), solid(g), solid(g)];
  const t = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const z = WAX + UP * (1 - v);
    put(parts[0], prism(P, front, circ(6.2), circ(5), z, z + 4));
    put(parts[1], prism(P, front, circ(2.8), circ(2.2), z + 4, z + 11));
    const knob = [];
    [[11, 3], [13, 5.2], [19, 5.6], [22, 4.4], [24, 2]].forEach(([h, r]) => knob.push(...ringAt(P, circ(r), z + h)));
    parts[2].sil.setAttribute("d", poly(hull(knob)));
    parts[2].cr.setAttribute("d", poly(ringAt(P, circ(5.2), z + 13)).replace(/Z$/, ""));
  }
  const zone = hull([[0, 0, 0], [44, 30, 0], [44, 0, 0], [0, 30, 0], [CX - 7, CY, UP + WAX + 25], [CX + 7, CY, UP + WAX + 25]].map((p) => P(...p)));
  const side = (q, k) => { const a = zone[k], b = zone[(k + 1) % zone.length]; return (b[0] - a[0]) * (q[1] - a[1]) - (b[1] - a[1]) * (q[0] - a[0]); };
  function hit(q) { const s = zone.map((_, k) => side(q, k)); return s.every((v) => v >= 0) || s.every((v) => v <= 0); }
  function mark(a) { wax.sil.classList.toggle("hi", !a); parts.forEach((p) => p.sil.classList.toggle("hi", !!a)); read.textContent = a ? "sealed" : "rest"; }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(t, a ? amt : 0, performance.now(), 0);
    mark(a);
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { tset(t, amt, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "seallamp",
  means: "A wax seal: the pointer over the letter presses the stamp down into the warm wax on its flap.",
  rules: [1, 3, 4, 5],
  range: [0.4, 1, 1],
  tour: [[200, 99], [183, 172], [217, 261], null],
  mount,
});
