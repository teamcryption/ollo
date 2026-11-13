/**
 * Lunchboxes: four kids' lunch boxes in a row on a bench, each a rounded
 * body with a latch on its front and a hinged lid with a carry handle. The
 * pointer picks a box by where it stands: its lid flips open on the back
 * hinge to show a sandwich wedge inside, and the lids beside it lift a
 * little, staggered from it. At rest one lid stands half open, bright. The
 * slider is the stagger.
 *
 * The pattern: one of many in a single row (riffle); the pick is the box
 * whose resting middle is nearest the pointer's x on screen.
 */
const {
  Cam, fit, facing, hull, open, poly, prism, proj, rad, rings, rrect, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 4, BW = 30, D = 22, H = 16, STEP = 38, LT = 3, OPEN = 105, FAV = 2;
const REST = [6, 0, 62, 3], X1 = (N - 1) * STEP + BW;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 1.72);
  fit(C, [[-6, -6, -22], [X1 + 6, D + 6, -22], [X1 + 6, -6, -22], [-6, D + 6, -22], [0, -4, H + D + 8], [X1, -4, H + D + 8]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the bench: two legs and a plank
  for (const lx of [4, X1 - 10]) { const [r, i] = rings(lx, -2, lx + 6, D + 2, 1.5, 0.6); put(solid(g), prism(P, front, r, i, -22, -5)); }
  { const [r, i] = rings(-6, -6, X1 + 6, D + 6, 4, 1.5); put(solid(g), prism(P, front, r, i, -5, 0)); }

  const boxes = [];
  for (let k = 0; k < N; k++) {
    const x0 = k * STEP, grp = mk("g", {}, g), body = solid(grp);
    const [r, i] = rings(x0, 0, x0 + BW, D, 4, 1.4);
    put(body, prism(P, front, r, i, 0, H));
    // the latch on the front face
    const latch = rrect(x0 + BW / 2 - 3, H - 7, x0 + BW / 2 + 3, H - 1, 1, 3).map((q) => P(q.u, D, q.v));
    mk("path", { class: "nf", d: poly(latch) + seg(P(x0 + BW / 2 - 1.5, D, H - 4), P(x0 + BW / 2 + 1.5, D, H - 4)) }, body.g);
    const sand = solid(grp), lid = solid(grp), handle = mk("path", { class: "nf" }, grp);
    boxes.push({ k, x0, grp, body, sand, lid, handle, a: tween(REST[k]), last: NaN, behind: null });
  }

  // a point on the lid: u along x, v from the hinge, w off its face, turned up by th about the back top edge
  const L = (th, x, v, w) => P(x, v * Math.cos(th) - w * Math.sin(th), H + v * Math.sin(th) + w * Math.cos(th));
  function draw(b, deg) {
    if (deg === b.last) return;
    b.last = deg;
    const th = rad(deg), x0 = b.x0, outer = rrect(x0, 0, x0 + BW, D, 4, 4), inner = rrect(x0 + 1.4, 1.4, x0 + BW - 1.4, D - 1.4, 2.6, 4);
    const pts = outer.map((q) => L(th, q.u, q.v, 0)).concat(outer.map((q) => L(th, q.u, q.v, LT)));
    const up = -0.61 * Math.sin(th) + 0.5 * Math.cos(th) > 0;
    b.lid.sil.setAttribute("d", poly(hull(pts)));
    b.lid.cr.setAttribute("d", poly(inner.map((q) => L(th, q.u, q.v, up ? LT : 0))));
    const arch = [];
    for (let i = 0; i <= 10; i++) { const t = i / 10; arch.push(L(th, x0 + BW / 2 - 7 + 14 * t, D / 2, LT + 5 * Math.sin(Math.PI * t))); }
    b.handle.setAttribute("d", up ? open(arch) : "");
    // the sandwich wedge rises into view as the lid opens
    const f = Math.min(1, deg / 70), h = 11 * f, xc = x0 + BW / 2 + 2;
    if (f < 0.08) { b.sand.sil.setAttribute("d", ""); b.sand.cr.setAttribute("d", ""); }
    else {
      const tri = (x) => [[x, 6, H], [x, D - 4, H], [x, 6, H + h]].map((p) => P(...p));
      b.sand.sil.setAttribute("d", poly(hull(tri(xc - 4).concat(tri(xc + 4)))));
      b.sand.cr.setAttribute("d", open([P(xc + 4, D - 4, H), P(xc + 4, 6, H + h)]));
    }
    const behind = deg > 40;
    if (behind !== b.behind) { b.behind = behind; if (behind) { b.grp.append(b.lid.g, b.handle, b.sand.g); } else { b.grp.append(b.sand.g, b.lid.g, b.handle); } }
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const b of boxes) { draw(b, tval(b.a, now)); if (!tdone(b.a, now)) moving = true; }
    return moving;
  });
  bag.add(B.unregister);

  const mids = boxes.map((b) => P(b.x0 + BW / 2, D / 2, H / 2));
  function hit([sx, sy]) {
    let best = -1, bd = Infinity;
    mids.forEach((m, k) => { const dd = Math.abs(m[0] - sx); if (dd < bd) { bd = dd; best = k; } });
    return bd < 32 && Math.abs(mids[best][1] - sy) < 55 ? best : -1;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    boxes.forEach((b, k) => {
      const dd = Math.abs(k - a), deg = a < 0 ? REST[k] : dd === 0 ? OPEN : dd === 1 ? 16 : 5;
      tset(b.a, deg, now, from < 0 ? 0 : Math.abs(k - from) * stag);
      b.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "box " + (a + 1);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "lunchboxes",
  means: "Four lunch boxes on a bench: the lid under the pointer flips open on a sandwich, and its neighbours' lids lift a little.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[177, 158], [223, 181], [269, 204], null],
  mount,
});
