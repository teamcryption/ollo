/**
 * Layer cake: a round two-layer cake on a board, cut into eight slices. The
 * pointer picks the slice that faces it: that slice slides out from the
 * middle, showing the cream between its layers, and the slices beside it
 * part a little, staggered round the cake. At rest every cut shows a hair of
 * gap and one slice stands out, bright. The slider is how far a slice slides.
 *
 * The pattern: one of many, round a circle (riffle). Tweens per slice, a
 * stagger by distance round the ring, a hit test on the cake's own plane.
 */
const {
  Cam, circ, clamp, fit, hull, open, poly, prism, proj, rad, seg, unproj,
  tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, R = 46, H = 30, CREAM = 0.5, ARC = 8, RESTOUT = 1.6, FAV = 1;
const AZ = rad(45);
const faces = (nu, nv) => nu * Math.sin(AZ) + nv * Math.cos(AZ) >= 0;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let OUT = value;

  const C = Cam(45, 0.5, 1.9);
  fit(C, [[-R - 26, -R - 26, -3], [R + 26, R + 26, -3], [R + 26, -R - 26, -3], [-R - 26, R + 26, -3], [0, 0, H]], 200, 166);
  const P = proj(C);

  const g = mk("g", {}, svg);
  const board = circ(R + 12, 72);
  put(solid(g), prism(P, () => true, board, circ(R + 10.5, 72), -3, 0));

  const slices = [];
  for (let k = 0; k < N; k++) {
    const a0 = rad(k * (360 / N)), a1 = rad((k + 1) * (360 / N)), am = (a0 + a1) / 2;
    const s = solid(g), cut = mk("path", { class: "nf" }, s.g);
    slices[k] = { k, a0, a1, am, s, cut, tw: tween(k === FAV ? 10 : RESTOUT), last: NaN };
  }

  /** Slice sl pushed d out along its middle: silhouette, top crease, and the cream line on every face that shows. */
  function draw(sl, d) {
    const ox = Math.cos(sl.am) * d, oy = Math.sin(sl.am) * d;
    const arc = [];
    for (let i = 0; i <= ARC; i++) { const t = sl.a0 + ((sl.a1 - sl.a0) * i) / ARC; arc.push([ox + R * Math.cos(t), oy + R * Math.sin(t), t]); }
    const at = (z) => [P(ox, oy, z), ...arc.map(([x, y]) => P(x, y, z))];
    sl.s.sil.setAttribute("d", poly(hull(at(H).concat(at(0)))));
    const tip = P(ox, oy, H), e0 = P(arc[0][0], arc[0][1], H), e1 = P(arc[ARC][0], arc[ARC][1], H);
    sl.s.cr.setAttribute("d", seg(tip, e0) + seg(tip, e1));
    const zc = H * CREAM, q = (x, y) => P(x, y, zc);
    let c = "";
    if (faces(Math.sin(sl.a0), -Math.cos(sl.a0))) c += seg(q(ox, oy), q(arc[0][0], arc[0][1]));
    if (faces(-Math.sin(sl.a1), Math.cos(sl.a1))) c += seg(q(ox, oy), q(arc[ARC][0], arc[ARC][1]));
    const vis = arc.filter(([, , t]) => faces(Math.cos(t), Math.sin(t))).map(([x, y]) => q(x, y));
    c += open(vis);
    sl.cut.setAttribute("d", c);
  }

  // paint far to near by each slice's middle, slid or not: a slice pulled toward the viewer paints last
  let painted = "";
  const depth = (sl) => (Math.cos(sl.am) + Math.sin(sl.am)) * (R * 0.6 + sl.last);
  const B = register(stage, (_dt, now) => {
    let moving = false;
    for (const sl of slices) {
      const d = tval(sl.tw, now);
      if (d !== sl.last) { draw(sl, d); sl.last = d; }
      if (!tdone(sl.tw, now)) moving = true;
    }
    const byDepth = slices.slice().sort((a, b) => depth(a) - depth(b)), key = byDepth.map((sl) => sl.k).join();
    if (key !== painted) { painted = key; for (const sl of byDepth) g.appendChild(sl.s.g); }
    return moving;
  });
  bag.add(B.unregister);

  /** The slice facing the point, read on the plane of the cake's middle, which never moves; -1 off the board. */
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, H / 2);
    if (Math.hypot(x, y) > R + 34) return -1;
    const t = (Math.atan2(y, x) + 2 * Math.PI) % (2 * Math.PI);
    return clamp(Math.floor(t / rad(360 / N)), 0, N - 1);
  }

  let act = -2;
  const ring = (i, a) => { const d = Math.abs(i - a) % N; return Math.min(d, N - d); };
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    for (const sl of slices) {
      const r = a < 0 ? -1 : ring(sl.k, a);
      const d = a < 0 ? (sl.k === FAV ? 10 : RESTOUT) : r === 0 ? OUT : r === 1 ? 4 : RESTOUT;
      tset(sl.tw, d, now, from < 0 ? 0 : ring(sl.k, from) * 40);
      sl.s.sil.classList.toggle("hi", sl.k === (a < 0 ? FAV : a));
    }
    read.textContent = a < 0 ? "rest" : "slice " + (a + 1);
    B.wake();
  }

  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { OUT = v; if (act >= 0) { const a = act; act = -2; setActive(a); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "layercake",
  means: "A round cake cut in eight: the slice facing the pointer slides out to show its layers, and its neighbours part.",
  rules: [1, 2, 5, 9],
  range: [10, 18, 26],
  tour: [[270, 190], [150, 200], [200, 110], null],
  mount,
});
