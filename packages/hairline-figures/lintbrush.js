/**
 * Clothes brush: a long oval wooden back over a bed of bristle tufts. The
 * pointer over it rolls the brush over on its long axis, turning the
 * bristles up to face you, as if picked up to brush a coat. At rest it lies
 * tilted on its bristles and the back is bright; when the pointer plays, the
 * bristle bed is. The slider is how far it rolls.
 *
 * The pattern: one part turning about an axis (roll).
 */
const { Cam, fit, hull, poly, proj, rrect, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const L = 62, B = 19, BH = 12, TOP = 24, ZC = 12, REST = 18;
const back = rrect(-L, -B, L, B, B * 0.95, 6), bed = rrect(-L + 7, -B + 5, L - 7, B - 5, B - 6, 6);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.4);
  fit(C, [[-L, -B - 12, 0], [L, B + 12, 0], [L, -B - 12, 0], [-L, B + 12, 0], [0, 0, ZC + B + 30], [0, 0, ZC + B + 30]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const bristles = mk("g", {}, g), block = mk("g", {}, g);
  const bSil = mk("path", { class: "sil" }, bristles), tufts = mk("path", { class: "nf lo" }, bristles);
  const kSil = mk("path", { class: "sil" }, block), kTop = mk("path", { class: "nf lo" }, block);

  function draw(deg) {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), lift = 11 * Math.sin(Math.min(a, Math.PI / 2) * 1);
    const W = (x, y, z) => [x, y * c - (z - ZC) * s, ZC + lift + y * s + (z - ZC) * c];
    const Q = (x, y, z) => P(...W(x, y, z));
    const ring = (rr, z) => rr.map((q) => Q(q.u, q.v, z));
    kSil.setAttribute("d", poly(hull(ring(back, BH).concat(ring(back, TOP)))));
    const upTop = s * 0 - 0.61 * s + 0.5 * c > 0;
    kTop.setAttribute("d", poly(ring(rrect(-L + 2, -B + 2, L - 2, B - 2, B - 3, 6), upTop ? TOP : BH)));
    bSil.setAttribute("d", poly(hull(ring(bed, 0).concat(ring(bed, BH)))));
    const under = 0.61 * s - 0.5 * c > 0;
    let d = "";
    if (under) for (let i = 0; i < 9; i++) for (let j = -1; j <= 1; j++) {
      const x = -44 + i * 11, y = j * 7.5;
      d += poly(Array.from({ length: 10 }, (_, k) => { const t = (k / 10) * Math.PI * 2; return Q(x + 2.6 * Math.cos(t), y + 2.6 * Math.sin(t), 0); })) + " ";
    }
    tufts.setAttribute("d", d);
    // paint the part nearer the viewer last
    const v = (p) => 0.61 * p[0] + 0.61 * p[1] + 0.5 * p[2];
    if (v(W(0, 0, BH / 2)) > v(W(0, 0, (BH + TOP) / 2))) block.after(bristles); else bristles.after(block);
  }
  const tw = tween(REST);
  let last = NaN;
  const B2 = register(stage, (_dt, now) => { const x = tval(tw, now); if (x !== last) { last = x; draw(x); } return !tdone(tw, now); });
  bag.add(B2.unregister);

  const mid = P(0, 0, ZC);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + 110 * amp : REST, performance.now(), 0);
    bSil.classList.toggle("hi", on);
    kSil.classList.toggle("hi", !on);
    read.textContent = on ? "brush" : "rest";
    B2.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], sy - mid[1]) < 120;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "lintbrush",
  means: "A wooden clothes brush: over it, the brush rolls over on its long axis to turn its bristle tufts up to you.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 140], [285, 232], [115, 85], null],
  mount,
});
