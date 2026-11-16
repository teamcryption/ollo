/**
 * Pen stand: a bank counter pen standing in a round socket on a weighted
 * base, tied to it by a sagging chain. The pointer over the stand tilts the
 * pen out of its socket toward the writer and swings it round; leaving lets
 * it fall back to a slight lean. The pen is the bright part. The slider is
 * how far the pen tilts.
 *
 * The pattern: one part tilting on a pivot (aim).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, rad, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const area = (p) => p.reduce((s, a, i) => { const b = p[(i + 1) % p.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0);
const BX = 24, BY = 24, BZ = 14, LEN = 72;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lean = value;
  const C = Cam(45, 0.5, 2.65);
  const at = (th, ph) => (u, v, w) => {
    const c = Math.cos(rad(th)), s = Math.sin(rad(th)), lx = Math.cos(rad(ph)), ly = Math.sin(rad(ph));
    return [BX + u * c * lx - v * ly + w * s * lx, BY + u * c * ly + v * lx + w * s * ly, BZ - u * s + w * c];
  };
  const ext = [[0, 0, 0], [48, 0, 0], [0, 48, 0], [48, 48, 0]];
  for (const [th, ph] of [[14, 140], [62, -20], [62, 30], [30, -20]]) { const f = at(th, ph); ext.push(f(0, 0, LEN + 8), f(4, 0, LEN + 8)); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const ref = Math.sign(area(circ(10, 12).map((q) => P(q.u, q.v, 0))));
  function body(el, ring, inner, w0, w1, f) {
    const a = ring.map((q) => P(...f(q.u, q.v, w0))), b = ring.map((q) => P(...f(q.u, q.v, w1)));
    const up = Math.sign(area(b)) === ref;
    put(el, { sil: poly(hull(a.concat(b))), crease: poly(inner.map((q) => P(...f(q.u, q.v, up ? w1 : w0)))) });
  }
  const disc = (r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + BX, v: q.v + BY }));

  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 48, 48, 14, 2);
  put(solid(g), prism(P, front, br, bi, 0, 8));
  put(solid(g), prism(P, front, disc(9), disc(6.5), 8, BZ));
  const chain = mk("path", { class: "lo nf" }, g);
  const pen = solid(g), cap = solid(g), nib = solid(g);
  const st = { th: tween(14), ph: tween(140) };
  let last = "";

  function draw(th, ph) {
    const key = th.toFixed(2) + "," + ph.toFixed(2);
    if (key === last) return;
    last = key;
    const f = at(th, ph);
    const a = P(46, 30, 4), b = P(...f(0, 3.5, 30)), pts = [];
    for (let i = 0; i <= 12; i++) { const t = i / 12; pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + 26 * t * (1 - t)]); }
    chain.setAttribute("d", open(pts));
    body(nib, circ(1.6, 16), circ(0.9, 16), -6, 0, f);
    body(pen, circ(3.4, 24), circ(2.4, 24), 0, LEN - 14, f);
    body(cap, circ(4, 24), circ(3, 24), LEN - 14, LEN, f);
  }

  const B = register(stage, (_dt, now) => {
    draw(tval(st.th, now), tval(st.ph, now));
    return !tdone(st.th, now) || !tdone(st.ph, now);
  });
  bag.add(B.unregister);

  const bx = ext.slice(0, 4).map((p) => P(...p)).concat([P(BX, BY, LEN)]), xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    const now = performance.now();
    tset(st.th, on ? lean : 14, now, 0);
    tset(st.ph, on ? -20 : 140, now, 0);
    pen.sil.classList.add("hi");
    read.textContent = on ? "write" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lean = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "chequepen",
  means: "A bank pen in a socket on a chained stand: the pointer over it tilts the pen out toward the writer; leaving lets it fall back.",
  rules: [1, 4, 5, 8],
  range: [35, 50, 62],
  tour: [[158, 158], [220, 190], [150, 230], null],
  mount,
});
