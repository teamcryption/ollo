/**
 * Archive box: a cardboard banker's box with a telescoping lid, hand holes in
 * its ends and a label frame on the front. Over the box the lid lifts off and
 * tips back, showing the files standing inside. At rest the lid sits a little
 * askew on top, bright. The slider is how high the lid lifts.
 */
const {
  Cam, facing, fit, hull, open, poly, prism, proj, rad, rings, ringAt, rrect, seg, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 104, Y1 = 66, H = 56, SK = 12;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [X1, Y1, 0], [X1, 0, 0], [0, Y1, 0], [0, -20, H + 70], [X1, -20, H + 70]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the files standing inside, painted before the body that frames them
  const files = [10, 26, 42, 58, 74, 88].map((x, k) => {
    const s = solid(g), top = H - 8 + (k % 3) * 3 - 3;
    const [fr, fi] = rings(x, 5, x + 3, Y1 - 5, 1, 0.6);
    put(s, prism(P, front, fr, fi, 2, top));
    return s;
  });

  // the body, open at the top
  const [br, bi] = rings(0, 0, X1, Y1, 3, 1.2);
  const bp = prism(P, front, br, bi, 0, H);
  mk("path", { class: "sil", "fill-rule": "evenodd", d: bp.sil + " " + poly(ringAt(P, rrect(1.6, 1.6, X1 - 1.6, Y1 - 1.6, 2, 4), H)) }, g);
  // hand hole in the right end, label frame on the front
  const hole = rrect(Y1 / 2 - 14, H - 20, Y1 / 2 + 14, H - 12, 4, 4).map((q) => P(X1, q.u, q.v));
  mk("path", { class: "lo", d: poly(hole) }, g);
  mk("path", { class: "nf lo", d: poly([P(X1 / 2 - 18, Y1, H - 34), P(X1 / 2 + 18, Y1, H - 34), P(X1 / 2 + 18, Y1, H - 22), P(X1 / 2 - 18, Y1, H - 22)]) }, g);

  // the lid: a shallow tray turned over, lifting and tipping about its back edge
  const lid = solid(mk("g", {}, g));
  const lo = rrect(-2, -2, X1 + 2, Y1 + 2, 3.5, 4), li = rrect(-0.6, -0.6, X1 + 0.6, Y1 + 0.6, 3, 4);
  const hole2 = mk("path", { class: "nf lo" }, lid.g);
  const LZ = H - SK + 1;
  const L = (u, v, z, a, h) => P(u, -2 + (v + 2) * Math.cos(a) - z * Math.sin(a), LZ + h + (v + 2) * Math.sin(a) + z * Math.cos(a));
  const up = tween(0);
  let last = NaN;

  function drawLid(t) {
    if (t === last) return;
    last = t;
    const h = 3 + t, a = rad(5 + t * 0.7);
    lid.sil.setAttribute("d", poly(hull(lo.map((q) => L(q.u, q.v, 0, a, h)).concat(lo.map((q) => L(q.u, q.v, SK, a, h))))));
    lid.cr.setAttribute("d", poly(li.map((q) => L(q.u, q.v, SK, a, h))));
    lid.cr.setAttribute("class", "nf lo");
    hole2.setAttribute("d", poly(rrect(Y1 / 2 - 10, 3, Y1 / 2 + 10, 8, 2.5, 4).map((q) => L(X1 + 2, q.u, q.v, a, h))));
  }

  const B = register(stage, (_dt, now) => {
    drawLid(tval(up, now));
    return !tdone(up, now);
  });
  bag.add(B.unregister);
  lid.sil.classList.add("hi");

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H / 2);
    return x > -16 && x < X1 + 16 && y > -16 && y < Y1 + 16;
  }
  let act = null;
  function setActive(a, force) {
    if (a === act && !force) return;
    act = a;
    tset(up, a ? lift : 0, performance.now(), 0);
    read.textContent = a ? "+" + Math.round(lift) : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; setActive(act, true); }, destroy: bag.dispose };
}

hairline({
  name: "archivebox",
  means: "A cardboard archive box: over it the telescoping lid lifts off and tips back to show the files inside; the slider sets the lift.",
  rules: [1, 4, 5, 6],
  range: [16, 44, 60],
  tour: [[188, 183], [206, 204], [170, 196], null],
  mount,
});
