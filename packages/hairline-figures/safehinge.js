/**
 * Safe hinge: a wall safe, a heavy box with its door on the front face, a
 * round dial and a short handle on the door. The pointer over the safe swings
 * the door open on its hinge and turns the dial; leaving shuts it again. At
 * rest the door stands a crack ajar and the dial is bright. The slider is how
 * far the door swings.
 *
 * The pattern: one part turning on an axis (hinge).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, rrect, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const area = (p) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
const shift = (ring, du, dv) => ring.map((q) => ({ ...q, u: q.u + du, v: q.v + dv }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let swing = value;
  const C = Cam(45, 0.5, 2.3);
  const doorAt = (th) => (u, v, w) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return [52 - u * c + w * s, 50 + u * s + w * c, 8 + v]; };
  const ext = [[0, 0, 0], [60, 0, 0], [0, 50, 0], [60, 50, 0], [0, 0, 60], [60, 50, 60]];
  for (const th of [0, 50, 100]) { const f = doorAt(th); ext.push(f(44, 0, 9), f(44, 44, 9)); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const ref = Math.sign(area(circ(10, 12).map((q) => P(q.u, q.v, 0))));
  function body(el, ring, inner, w0, w1, f) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    const up = Math.sign(area(b)) === ref;
    put(el, { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...f(q.u, q.v, up ? w1 : w0)))) });
  }

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 60, 50, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, 60));
  const hole = [[8, 50, 8], [52, 50, 8], [52, 50, 52], [8, 50, 52]].map((p) => P(...p));
  mk("path", { d: poly(hole), class: "lo nf" }, g);
  const door = solid(g), dial = solid(g), handle = solid(g);
  const tick = mk("circle", { r: 1.6, class: "dot" }, g);
  const dR = rrect(0, 0, 44, 44, 4, 4), dI = rrect(1.8, 1.8, 42.2, 42.2, 2.5, 4);
  const cR = shift(circ(8, 28), 24, 24), cI = shift(circ(6, 28), 24, 24);
  const hR = rrect(6, 14, 10, 30, 1.6, 3), hI = rrect(6.8, 14.8, 9.2, 29.2, 1, 3);
  const st = { th: tween(14), d: tween(30) };
  let last = NaN;

  function draw(th, dg) {
    if (th + dg * 1000 === last) return;
    last = th + dg * 1000;
    const f = doorAt(th);
    body(door, dR, dI, 0, 5, f);
    body(dial, cR, cI, 5, 9, f);
    body(handle, hR, hI, 5, 8, f);
    const p = P(...f(24 + 5.5 * Math.cos(rad(dg)), 24 + 5.5 * Math.sin(rad(dg)), 9));
    tick.setAttribute("cx", p[0]); tick.setAttribute("cy", p[1]);
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(st.th, now), tval(st.d, now));
    return !tdone(st.th, now) || !tdone(st.d, now);
  });
  bag.add(B.unregister);

  const bx = ext.slice(0, 6).map((p) => P(...p)), xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(st.th, on ? swing : 14, now, 0);
    tset(st.d, on ? 210 : 30, now, 0);
    door.sil.classList.toggle("hi", on);
    dial.sil.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { swing = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "safehinge",
  means: "A wall safe: the pointer over it swings the door open on its hinge and turns the dial; leaving shuts it.",
  rules: [1, 4, 5, 8],
  range: [50, 80, 100],
  tour: [[167, 174], [240, 140], [170, 110], null],
  mount,
});
