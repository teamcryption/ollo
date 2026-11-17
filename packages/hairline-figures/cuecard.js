/**
 * Cue card stand: a board on two legs holding a pad of cards, the top card hinged at
 * the top edge. The pointer flips the card up and over, further the further right it is; the card is bright.
 */
const { Cam, fit, proj, hull, poly, seg, clamp, lerp, rad, spring, stepS, disposer, mk, pointer, register, solid } = HL;

/** The eight corners of a box from o along a, b, c, each passed through f. */
function corners(o, a, b, c, f) {
  const pts = [];
  for (const i of [0, 1]) for (const j of [0, 1]) for (const k of [0, 1])
    pts.push(f([0, 1, 2].map((n) => o[n] + a[n] * i + b[n] * j + c[n] * k)));
  return pts;
}
/** A box as a silhouette, with the three edges of its nearest corner as the crease. */
function drawBox(s, P, pts) {
  const sp = pts.map((q) => P(q[0], q[1], q[2]));
  let n = 0, bd = -1e9;
  pts.forEach((q, i) => { const d = (q[0] + q[1]) * 0.612 + q[2] * 0.5; if (d > bd) { bd = d; n = i; } });
  s.sil.setAttribute("d", poly(hull(sp)));
  s.cr.setAttribute("d", [1, 2, 4].map((m) => seg(sp[n], sp[n ^ m])).join(""));
}
/** Turns a point about the x axis (in y, z) or the y axis (in x, z) through a pivot. */
const rotX = (p, c, A) => { const y = p[1] - c[1], z = p[2] - c[2], co = Math.cos(A), si = Math.sin(A); return [p[0], c[1] + y * co - z * si, c[2] + y * si + z * co]; };
const rotY = (p, c, A) => { const x = p[0] - c[0], z = p[2] - c[2], co = Math.cos(A), si = Math.sin(A); return [c[0] + x * co - z * si, p[1], c[2] + x * si + z * co]; };
const ID = (p) => p;

const PIV = [0, 3, 120], REST = 12;
function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.6);
  fit(C, [[-50, -30, 0], [50, 30, 0], [-50, 3, 124], [50, 3, 124], [0, 3, 196], [0, -55, 175], [0, 25, 110]], 200, 160);
  const P = proj(C), g = mk("g", {}, svg);
  const back = mk("g", {}, g), front = mk("g", {}, g);
  for (const x of [-40, 40]) { drawBox(solid(front), P, corners([x - 3, -24, 0], [6, 0, 0], [0, 48, 0], [0, 0, 5], ID)); drawBox(solid(front), P, corners([x - 3, -2, 5], [6, 0, 0], [0, 4, 0], [0, 0, 40], ID)); }
  drawBox(solid(front), P, corners([-50, -2, 40], [100, 0, 0], [0, 4, 0], [0, 0, 82], ID));
  drawBox(solid(front), P, corners([-46, 2, 44], [92, 0, 0], [0, 1, 0], [0, 0, 76], ID));
  for (const z of [100, 86, 72]) mk("path", { class: "nf lo", d: seg(P(-34, 3, z), P(z === 72 ? 10 : 34, 3, z)) }, front);
  const card = solid(front), lines = mk("path", { class: "nf" }, front);
  card.sil.classList.add("hi");
  let amp = value, over = null, last = "", behind = false;
  const A = spring(REST);
  function draw() {
    const key = A.x.toFixed(2); if (key === last) return; last = key;
    const f = (p) => rotX(p, PIV, rad(A.x));
    const host = A.x > 92 ? back : front;
    if ((host === back) !== behind) { behind = host === back; host.append(card.g, lines); }
    drawBox(card, P, corners([-48, 3, 44], [96, 0, 0], [0, 1.5, 0], [0, 0, 76], f));
    let d = "";
    for (const z of [104, 90, 76]) d += seg(P(...f([-36, 4.5, z])), P(...f([z === 76 ? 0 : 36, 4.5, z])));
    lines.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(A, dt); draw(); return m; });
  bag.add(B.unregister);
  function retarget() {
    A.t = over == null ? REST : clamp(REST + (70 + 60 * over) * amp, REST, 140);
    read.textContent = over == null ? "rest" : "flip " + Math.round(A.t) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp((p[0] - 100) / 200, 0, 1); retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "cuecard",
  means: "A cue card stand: the pointer flips the top card up and over its hinge, further the further right it is.",
  rules: [1,3,5,8],
  range: [0.5, 1, 1.6],
  tour: [[185,166],[140,175],[260,160],null],
  mount,
});
