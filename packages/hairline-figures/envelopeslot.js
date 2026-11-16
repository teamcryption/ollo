/**
 * Deposit slot: an upright wall panel with a letterbox slot and a hinged
 * flap over it, a deposit envelope half pushed in under the flap. The
 * pointer over the panel slides the envelope through the slot and the flap
 * swings shut behind it; leaving brings it back out. At rest the envelope is
 * bright. The slider is how far the flap lifts at rest.
 *
 * The pattern: one part sliding through an opening (slide).
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, rrect, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const area = (p) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
const FY = 14, SZ = 50, L = 52;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.2);
  const at = (th) => (u, v, w) => { const c = Math.cos(rad(th)), s = Math.sin(rad(th)); return [12 + u, FY + w * c + v * s, SZ + w * s - v * c]; };
  const ext = [[0, 0, 0], [70, 0, 0], [0, FY, 0], [70, FY, 0], [0, 0, 84], [70, FY, 84], [15, FY + L, 44], [55, FY + L, 44]];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const ref = Math.sign(area(rrect(0, 0, 10, 10, 2, 3).map((q) => P(q.u, q.v, 0))));
  function body(el, ring, inner, w0, w1, f) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    const up = Math.sign(area(b)) === ref;
    put(el, { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...f(q.u, q.v, up ? w1 : w0)))) });
  }

  const g = mk("g", {}, svg);
  const [pr, pi] = rings(0, 0, 70, FY, 5, 1.8);
  put(solid(g), prism(P, front, pr, pi, 0, 84));
  mk("path", { d: poly([[12, FY, 42.5], [58, FY, 42.5], [58, FY, 49], [12, FY, 49]].map((p) => P(...p))), class: "nf" }, g);
  const env = solid(g), flap = solid(g);
  const fR = rrect(0, 0, 46, 9, 2, 3), fI = rrect(1.2, 1.2, 44.8, 7.8, 1.2, 3);
  const st = { d: tween(0), th: tween(value) };
  let last = NaN;

  function draw(d, th) {
    if (d * 1000 + th === last) return;
    last = d * 1000 + th;
    const vis = L - d;
    if (vis < 2) put(env, { sil: "", crease: "" }); else { const [er, ei] = rings(15, FY, 55, FY + vis, 2, 1.2); put(env, prism(P, front, er, ei, 43.5, 45.5)); }
    body(flap, fR, fI, 0, 2.2, at(th));
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(st.d, now), tval(st.th, now));
    return !tdone(st.d, now) || !tdone(st.th, now);
  });
  bag.add(B.unregister);

  const bx = ext.slice(0, 6).map((p) => P(...p)), xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(st.d, on ? L : 8, now, 0);
    tset(st.th, on ? 4 : lift, now, on ? 260 : 0);
    env.sil.classList.toggle("hi", !on);
    flap.sil.classList.toggle("hi", on);
    read.textContent = on ? "in" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; const a = act; act = null; setActive(a); }, destroy: bag.dispose };
}

hairline({
  name: "envelopeslot",
  means: "A deposit slot in a wall panel: the pointer over it slides the envelope through the slot and the flap swings shut.",
  rules: [1, 4, 5, 8],
  range: [30, 45, 60],
  tour: [[229, 120], [250, 160], [205, 190], null],
  mount,
});
