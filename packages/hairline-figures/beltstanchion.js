/**
 * Queue barrier: two posts on weighted round bases, a belt pulled from the
 * cassette atop the first post and clipped to the second. The pointer on
 * the floor slides the second post along the queue line, and the belt pays
 * out or reels back to follow it. At rest the belt runs a short bay, bright.
 * The slider is the longest the belt pays out.
 *
 * The pattern: one part following the pointer along a line; the hit is on
 * the ground plane, which never moves.
 */
const { Cam, clamp, fit, hull, open, poly, proj, unproj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const PH = 34, PR = 1.6, BR = 6, BZ = 26, BW = 2.6, X0 = 0, REST = 30, MIN = 18, Y = 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let far = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-BR, -BR, 0], [70 + BR, BR, 0], [-BR, BR, PH + 3], [70 + BR, -BR, PH + 3], [-BR, BR, 0], [70 + BR, -BR, 0]], 200, 160);
  const P = proj(C);
  const ring = (cx, r, z, n = 24) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push([cx + r * Math.cos(a), Y + r * Math.sin(a), z]); } return o; };
  const g = mk("g", {}, svg);
  const guide = mk("path", { class: "nf lo dash" }, g);
  guide.setAttribute("d", open([P(-8, Y, 0), P(80, Y, 0)]));
  function post(gr) {
    return { base: mk("path", { class: "sil" }, gr), pole: mk("path", { class: "sil" }, gr), cap: mk("path", { class: "sil" }, gr), d: mk("path", { class: "nf lo" }, gr) };
  }
  const ga = mk("g", {}, g), belt = mk("path", { class: "sil" }, g), gb = mk("g", {}, g);
  const A = post(ga), Bp = post(gb);
  function drawPost(p, x, cassette) {
    p.base.setAttribute("d", poly(hull(ring(x, BR, 0).concat(ring(x, BR, 1.6)).map((q) => P(...q)))));
    p.pole.setAttribute("d", poly(hull(ring(x, PR, 1.6, 12).concat(ring(x, PR, PH, 12)).map((q) => P(...q)))));
    const cr = cassette ? 2.8 : 2.1, ch = cassette ? 5 : 2.5;
    p.cap.setAttribute("d", poly(hull(ring(x, cr, PH).concat(ring(x, cr, PH + ch)).map((q) => P(...q)))));
    p.d.setAttribute("d", open(ring(x, BR * 0.55, 1.6).map((q) => P(...q))));
  }
  drawPost(A, X0, true);
  const bx = tween(REST);
  let last = NaN;
  function draw(x) {
    if (x === last) return;
    last = x;
    drawPost(Bp, x, false);
    belt.setAttribute("d", poly([P(X0 + 2.6, Y, BZ + BW + 3), P(x - 1.6, Y, BZ + BW + 3), P(x - 1.6, Y, BZ + 3), P(X0 + 2.6, Y, BZ + 3)]));
  }
  belt.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(bx, now)); return !tdone(bx, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (x < -10 || x > 85 || y < -20 || y > 20) return -1;
    return clamp(x, MIN, far);
  }
  let act = -2;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(bx, a < 0 ? REST : a, performance.now(), 0);
    read.textContent = a < 0 ? "rest" : Math.round((a - X0) / 10) / 2 + " m";
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { far = v; }, destroy: bag.dispose };
}

hairline({
  name: "beltstanchion",
  means: "A queue barrier: the pointer slides the second post along the floor and the belt pays out or reels back after it.",
  rules: [1, 3, 5, 6],
  range: [40, 70, 70],
  tour: [[272, 242], [165, 188], [223, 218], null],
  mount,
});
