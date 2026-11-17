/**
 * Hand mixer: a rounded motor body with a speed slider, a loop handle over
 * it, and two wire beaters hanging below. The pointer is the bowl it works:
 * the whole mixer tips on its beater tips toward the pointer's side, on a
 * spring, beaters swinging with it. At rest it leans a little forward, its
 * body bright. The slider is how far it may tip.
 *
 * The pattern: a continuous aim (one spring on an angle); the hit is the
 * pointer's screen x, which never moves with the figure.
 */
const {
  Cam, clamp, fit, hull, open, poly, proj, rrect, spring, stepS,
  disposer, mk, pointer, register, solid,
} = HL;

const REST = 9, BZ0 = 38, BZ1 = 58, BX = 30, BY = 12, HZ = 76;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.8);
  const ext = [];
  for (const a of [-40, 40]) {
    const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180);
    for (const [x, z] of [[-BX, 0], [BX, 0], [-BX, HZ], [BX, HZ]]) ext.push([x * c + z * s, 0, -x * s + z * c]);
  }
  ext.push([0, -16, 0], [0, 16, 0]);
  fit(C, ext, 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const bl = mk("path", { class: "nf" }, g), br = mk("path", { class: "nf" }, g);
  const body = solid(g), post = solid(g), bar = solid(g);
  const marks = mk("path", { class: "nf lo" }, body.g);
  const sp = spring(REST);
  let drawn = NaN;

  function box(T, ring, inner, z0, z1, s) {
    const foot = ring.map((q) => T(q.u, q.v, z0)), top = ring.map((q) => T(q.u, q.v, z1));
    s.sil.setAttribute("d", poly(hull(foot.concat(top))));
    s.cr.setAttribute("d", inner ? poly(inner.map((q) => T(q.u, q.v, z1))) : "");
  }
  // a beater: a stem and a wire whisk of three loops
  function beater(T, x0) {
    let d = open([T(x0, 0, BZ0), T(x0, 0, 26)]);
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI, pts = [];
      for (let i = 0; i <= 24; i++) { const t = (i / 24) * Math.PI * 2, u = 6.5 * Math.sin(t); pts.push(T(x0 + u * Math.cos(a), u * Math.sin(a), 14 - 12 * Math.cos(t))); }
      d += open(pts);
    }
    return d;
  }

  function draw(deg) {
    if (Math.abs(deg - drawn) < 0.01) return;
    drawn = deg;
    const t = deg * (Math.PI / 180), c = Math.cos(t), s = Math.sin(t);
    const T = (x, y, z) => P(x * c + z * s, y, -x * s + z * c);
    bl.setAttribute("d", beater(T, -8));
    br.setAttribute("d", beater(T, 8));
    // the body: a long rounded block, the nose a little lower than the tail
    box(T, rrect(-BX, -BY, BX, BY, 10, 8), rrect(-BX + 1.6, -BY + 1.6, BX - 1.6, BY - 1.6, 8.4, 8), BZ0, BZ1, body);
    marks.setAttribute("d", poly(rrect(-12, -2, 6, 2, 2, 4).map((q) => T(q.u, q.v, BZ1))) + open([T(BX, -5, BZ0 + 5), T(BX, 5, BZ0 + 5)]));
    // the handle: a post at the tail, a grip bar over the body
    box(T, rrect(-BX + 2, -4, -BX + 10, 4, 3, 4), null, BZ1, HZ - 3, post);
    box(T, rrect(-BX + 2, -4, BX - 8, 4, 4, 6), rrect(-BX + 3.2, -2.8, BX - 9.2, 2.8, 2.8, 6), HZ - 7, HZ, bar);
  }

  const B = register(stage, (dt) => {
    const m = stepS(sp, dt);
    draw(sp.x);
    return m;
  });
  bag.add(B.unregister);
  body.sil.classList.add("hi");

  // the hit: how far the pointer stands left or right of the mixer
  const cx = P(0, 0, 0)[0];
  function aim([sx, sy]) {
    if (sy < 10 || sy > 310) return null;
    return clamp((sx - cx) / 60, -1, 1);
  }
  let cur = null;
  function update(p) {
    cur = p;
    sp.t = p == null ? REST : -p * max;
    read.textContent = p == null ? "rest" : "tilt " + Math.round(Math.abs(sp.t)) + "°";
    B.wake();
  }
  update(null);
  bag.add(pointer(stage, { move: (p) => update(aim(p)), leave: () => update(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = clamp(v, 10, 40); update(cur); }, destroy: bag.dispose };
}

hairline({
  name: "handmixer",
  means: "A hand mixer: it tips on its beater tips toward the pointer's side, the two wire beaters swinging with the body.",
  rules: [1, 3, 5, 8],
  range: [10, 25, 40],
  tour: [[259, 155], [141, 150], [230, 120], null],
  mount,
});
