/**
 * Travel clock: a folding travel alarm, a flat square case whose lid holds
 * the clock. The pointer over it swings the lid up on its back hinge until
 * the dial stands to face you. At rest the lid is ajar and the case is
 * bright; when the pointer plays, the lid is. The slider is how far it opens.
 *
 * The pattern: one part turning about a hinge (swing).
 */
const { Cam, facing, fit, hull, poly, prism, proj, put, rings, rrect, seg, solid, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 34, H = 10, T = 7, REST = 50;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-W, -W, 0], [W, W, 0], [W, -W, 0], [-W, W, 0], [0, -W, H + 2 * W + 6]], 200, 172);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [cr, ci] = rings(-W, -W, W, W, 8, 2);
  const caseS = solid(g);
  put(caseS, prism(P, front, cr, ci, 0, H));
  const lid = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);
  const dial = mk("path", { class: "nf" }, g), hands = mk("path", { class: "nf" }, g);
  const sq = rrect(-W, 0, W, 2 * W, 8, 4);

  // lid point: local u across, v from the hinge, off out of the lid; turned up by deg about y = -W
  const L = (deg, u, v, off) => {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return P(u, -W + v * c - off * s, H + v * s + off * c);
  };
  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    lid.setAttribute("d", poly(hull(sq.map((q) => L(deg, q.u, q.v, 0)).concat(sq.map((q) => L(deg, q.u, q.v, T))))));
    const a = (deg * Math.PI) / 180, top = -0.61 * Math.sin(a) + 0.5 * Math.cos(a) > 0;
    const sq2 = rrect(-W + 2, 2, W - 2, 2 * W - 2, 6, 4);
    face.setAttribute("d", poly(sq2.map((q) => L(deg, q.u, q.v, top ? T : 0))));
    if (top) { dial.setAttribute("d", ""); hands.setAttribute("d", ""); return; }
    const ring = Array.from({ length: 40 }, (_, i) => { const t = (i / 40) * Math.PI * 2; return L(deg, 22 * Math.cos(t), W + 22 * Math.sin(t), -0.5); });
    dial.setAttribute("d", poly(ring));
    const o = L(deg, 0, W, -0.5);
    hands.setAttribute("d", seg(o, L(deg, 0, W + 17, -0.5)) + " " + seg(o, L(deg, 11, W + 4, -0.5)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, H);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + 50 * amp : REST, performance.now(), 0);
    lid.classList.toggle("hi", on);
    caseS.sil.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], sy - mid[1]) < 110;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "travelalarm",
  means: "A folding travel clock: over it, the lid holding the dial swings up on its back hinge to stand and face you.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 228], [200, 138], [200, 297], null],
  mount,
});
