/**
 * Sandwich press: a ribbed lower plate on a low body, a heavy lid hinged
 * along the back with a handle bar on its front. Over the press, the lid
 * swings open on its hinge to show the ribbed plate; leaving lets it fall
 * back to rest, just ajar, the handle bright. The slider is how wide it opens.
 *
 * The pattern: one part on a hinge (lid).
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rad, rings, rrect, run, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const W = 92, D = 70, BZ = 16, T = 9, REST = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let wide = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-2, -10, 0], [W + 2, D + 2, 0], [W + 2, -10, 0], [-2, D + 2, 0], [0, 6, 88], [W, 6, 88]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, W, D, 8, 2);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  const lidG = mk("g", {}, g);
  const lid = mk("path", { class: "sil" }, lidG), lidCr = mk("path", { class: "nf lo" }, lidG), handle = mk("path", { class: "sil" }, lidG);
  const ribs = [];
  for (let j = 0; j < 7; j++) ribs.push({ y: 10 + j * 8.5, el: mk("path", { class: "nf lo" }, g) });
  const ring = rrect(0, 0, W, D, 8, 4), inner = rrect(2, 2, W - 2, D - 2, 6, 4);
  const hb = rrect(W * 0.22, D, W * 0.78, D + 7, 3, 4);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const s = Math.sin(rad(a)), c = Math.cos(rad(a));
    const at = (q, w) => P(q.u, q.v * c - w * s, BZ + 1 + q.v * s + w * c);
    lid.setAttribute("d", poly(hull(ring.map((q) => at(q, 0)).concat(ring.map((q) => at(q, T))))));
    const up = c > 0.05;
    lidCr.setAttribute("d", up ? open(run(inner, front).map((q) => at(q, T))) : "");
    handle.setAttribute("d", poly(hull(hb.map((q) => at(q, 2)).concat(hb.map((q) => at(q, 6))))));
    for (const r of ribs) r.el.setAttribute("d", r.y > D * c + 3 ? seg(P(6, r.y, BZ), P(W - 6, r.y, BZ)) : "");
    lidG.after(...ribs.map((r) => r.el));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let act = -1;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? 40 + wide * 0.4 : REST, performance.now(), 0);
    lid.classList.toggle("hi", on);
    handle.classList.toggle("hi", true);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, BZ);
    return x > -14 && x < W + 14 && y > -20 && y < D + 16;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { wide = v; if (act) { act = -1; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "toastmaker",
  means: "A sandwich press: over it, the heavy lid swings open on its back hinge to show the ribbed plate, then falls back ajar.",
  rules: [1, 4, 5, 6],
  range: [0, 50, 90],
  tour: [[194, 214], [120, 205], [280, 222], null],
  mount,
});
