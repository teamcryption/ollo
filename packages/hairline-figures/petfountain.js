/**
 * Water fountain: a pet drinking fountain, a round bowl with a spout tower
 * in its middle. The spout turns to aim its arc of water at the pointer and
 * throws it as far as the pointer stands, splashing on the water's surface.
 * At rest it arcs toward the viewer, bright. The slider is the longest throw.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, rings, ringAt, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 52, ZB = 16, ZW = 12, TR = 11, ZT = 42, W = 3.6, PS = 2.1, RR = 24;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxR = value;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, ZT + 14]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const outer = circ(R, 72);
  put(solid(g), prism(P, front, outer, circ(R - 2, 72), 0, ZB));
  mk("path", { class: "nf", d: poly(ringAt(P, circ(R - 4, 72), ZB)) }, g);
  mk("path", { class: "nf lo", d: poly(ringAt(P, circ(R - 9, 72), ZW + 0.5)) }, g);
  const splash = mk("path", { class: "nf" }, g), splash2 = mk("path", { class: "nf lo" }, g);
  const tw = mk("g", {}, g);
  put(solid(tw), prism(P, front, circ(TR, 40), circ(TR - 1.5, 40), ZW, ZT));
  put(solid(tw), prism(P, front, circ(TR + 3, 40), circ(TR + 1, 40), ZT, ZT + 3));
  mk("path", { d: poly(hull(ringAt(P, circ(4, 20), ZT + 3).concat(ringAt(P, circ(3, 20), ZT + 8)))) }, tw);
  const sg = mk("g", {}, g);
  const stream = mk("path", { class: "sil hi" }, sg);
  const ang = spring(PS, { k: 80, c: 15 }), dist = spring(RR, { k: 80, c: 15 });
  let lastA = NaN, lastD = NaN, far = null;
  function draw(a, r) {
    if (Math.abs(a - lastA) < 1e-4 && Math.abs(r - lastD) < 1e-3) return;
    lastA = a; lastD = r;
    const cx = Math.cos(a), cy = Math.sin(a), H = ZT + 8 - ZW;
    const at = (t, o) => P((2 + r * t) * cx - o * cy, (2 + r * t) * cy + o * cx, ZT + 6 + 10 * t - (10 + H - 2) * t * t);
    const L = [], Rt = [];
    for (let i = 0; i <= 16; i++) { const t = i / 16; L.push(at(t, -W)); Rt.unshift(at(t, W)); }
    stream.setAttribute("d", poly(L.concat(Rt)));
    const lx = (2 + r) * cx, ly = (2 + r) * cy;
    splash.setAttribute("d", poly(ringAt(P, disc(lx, ly, 5, 24), ZW + 0.5)));
    splash2.setAttribute("d", poly(ringAt(P, disc(lx, ly, 10, 32), ZW + 0.5)));
    const f = cx + cy < 0;
    if (f !== far) { far = f; if (f) g.insertBefore(sg, tw); else tw.after(sg); }
  }
  const B = register(stage, (dt) => { const m1 = stepS(ang, dt), m2 = stepS(dist, dt); draw(ang.x, dist.x); return m1 || m2; });
  bag.add(B.unregister);
  function aim(p) {
    if (!p) { ang.t = PS; dist.t = RR; read.textContent = "rest"; B.wake(); return; }
    const [qx, qy] = unproj(C, p[0], p[1], ZW);
    let t = Math.atan2(qy, qx);
    while (t - ang.x > Math.PI) t -= 2 * Math.PI;
    while (t - ang.x < -Math.PI) t += 2 * Math.PI;
    ang.t = t;
    dist.t = clamp(Math.hypot(qx, qy), 14, maxR);
    read.textContent = Math.round(dist.t) + "cm";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { maxR = v; }, destroy: bag.dispose };
}

hairline({
  name: "petfountain",
  means: "A pet water fountain: the spout turns to aim its arc of water at the pointer and throws it as far as the pointer stands.",
  rules: [1, 3, 4, 5, 6],
  range: [24, 40, 40],
  tour: [[122, 178], [200, 186], [290, 178], null],
  mount,
});
