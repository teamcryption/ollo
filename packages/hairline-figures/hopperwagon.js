/**
 * Hopper wagon: a tapering hopper on two bogies over a pair of rails, with
 * two bottom doors under its chute. At rest the doors hang a little open,
 * bright. The pointer over the wagon swings them down and a heap of ballast
 * spreads between the rails. The slider is how far the doors swing.
 */
const {
  Cam, clamp, facing, fit, hull, open, poly, prism, proj, rings, ringAt, rrect, run, rad, seg, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZF = 24, ZT = 50, DL = 24, YW = 12, REST = 20;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-44, -16, 0], [44, 16, 0], [-44, 16, 0], [44, -16, 0], [-42, 0, ZT + 16], [42, 0, ZT + 16]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  mk("path", { class: "nf lo", d: seg(P(-56, -8, 0), P(56, -8, 0)) + seg(P(-56, 8, 0), P(56, 8, 0)) }, g);
  const heap = mk("path", { class: "lo" }, g);
  function bogie(x) {
    const b = solid(g), [r, i] = rings(x - 9, -11, x + 9, 11, 2.5, 1);
    put(b, prism(P, front, r, i, 5, 13));
    let d = "";
    for (const wx of [x - 5, x + 5]) {
      const w = [];
      for (let k = 0; k < 16; k++) { const a = (k / 16) * Math.PI * 2; w.push(P(wx + 4.5 * Math.cos(a), 11.5, 5 + 4.5 * Math.sin(a))); }
      d += poly(w);
    }
    mk("path", { d }, b.g);
    const post = solid(g), [pr, pi] = rings(x - 3, -9, x + 3, 9, 1.5, 0.6);
    put(post, prism(P, front, pr, pi, 13, 40));
  }
  bogie(-33);
  const doors = [-1, 1].map(() => mk("path", { class: "sil hi" }, g));
  bogie(33);
  // the hopper: a top ring over a smaller foot, written by hand (rule 09)
  const hop = solid(g);
  const foot = rrect(-DL, -YW, DL, YW, 3, 6), top = rrect(-42, -15, 42, 15, 4, 6), inner = rrect(-41, -14, 41, 14, 3, 6);
  put(hop, { sil: poly(hull(ringAt(P, foot, ZF).concat(ringAt(P, top, ZT)))), crease: open(ringAt(P, run(inner, front), ZT)) });

  const load = mk("path", { class: "lo" }, g), mound = rrect(-38, -12, 38, 12, 6, 6);
  const ang = tween(REST);
  let last = NaN;
  function draw(t) {
    if (t === last) return;
    last = t;
    const c = Math.cos(rad(t)), s = Math.sin(rad(t));
    [-1, 1].forEach((sg, k) => {
      const hx = sg * DL, tx = hx - sg * DL * c, tz = ZF - DL * s;
      doors[k].setAttribute("d", poly([P(hx, -YW, ZF), P(hx, YW, ZF), P(tx, YW, tz), P(tx, -YW, tz)]));
    });
    const f = clamp((t - REST) / (85 - REST), 0, 1), rx = 5 + 34 * f, ry = 4 + 20 * f, pts = [];
    for (let k = 0; k < 20; k++) { const a = (k / 20) * Math.PI * 2; pts.push(P(rx * Math.cos(a), ry * Math.sin(a), 0)); }
    pts.push(P(0, 0, 2 + 20 * f));
    heap.setAttribute("d", poly(hull(pts)));
    const lz = 16 * (1 - f) - 2, ld = [];
    load.setAttribute("d", lz <= 0 ? "" : poly(hull(ringAt(P, mound, ZT - 1).concat([P(-14, 0, ZT + lz), P(14, 0, ZT + lz)]))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // the hit: the pointer on the ground plane under the wagon, which never moves
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? reach : REST, performance.now(), 0);
    read.textContent = v ? "open " + Math.round(reach) : "rest";
    B.wake();
  }
  setOn(false);
  const bx = [P(-44, -16, 0), P(44, 16, 0), P(-44, 16, 0), P(44, -16, 0), P(-42, 0, ZT), P(42, 0, ZT)];
  const xs = bx.map((p) => p[0]), ys = bx.map((p) => p[1]);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys)),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 40, 85); if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "hopperwagon",
  means: "A hopper wagon on its rails: the pointer over it swings the bottom doors down and ballast heaps between the rails.",
  rules: [1, 3, 5, 6],
  range: [40, 70, 85],
  tour: [[200, 176], [220, 198], [250, 214], null],
  mount,
});
