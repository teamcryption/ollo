/**
 * Camp chairs: a row of five folding camp chairs, each a canvas seat and back
 * on crossed legs. The pointer picks the chair under it by screen x: that one
 * swings open, its seat dropping level, and the rest fold shut, seat up flat
 * against the back, spreading out from it. At rest the row is mixed, some
 * open, some folded, one bright. The slider is how far the chosen chair opens.
 *
 * The pattern: a discrete choice (tween per chair, staggered by distance); the
 * hit is each chair's rest centre, which never moves.
 */
const { Cam, fit, proj, poly, fillet, seg, clamp, rad, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

const N = 5, GAP = 24, W = 8, HZ = 14, SL = 15, BZ = 34;
const REST = [0.2, 1, 0, 0.85, 0.1], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  const xs = Array.from({ length: N }, (_, i) => (i - (N - 1) / 2) * GAP);
  const ext = [];
  for (const x of [xs[0] - W, xs[N - 1] + W]) for (const y of [-15, 9]) for (const z of [0, BZ]) ext.push([x, y, z]);
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  let amt = value;

  const chairs = xs.map((cx, i) => {
    const grp = mk("g", {}, g);
    const legsB = mk("path", { class: "nf lo" }, grp);
    const back = mk("path", { class: "sil" }, grp);
    const seat = mk("path", { class: "sil" }, grp);
    const legsF = mk("path", { class: "nf sil" }, grp);
    return { i, cx, grp, legsB, back, seat, legsF, tw: tween(REST[i]), drawn: NaN, sx: P(cx, 0, HZ)[0] };
  });

  const plate = (pts) => poly(fillet(pts.map((p) => P(...p)), [1.6, 1.6, 1.6, 1.6]));
  function draw(ch, f) {
    if (Math.abs(f - ch.drawn) < 1e-4) return;
    ch.drawn = f;
    const x0 = ch.cx - W, x1 = ch.cx + W, th = rad((1 - f) * 84);
    const hy = -7, fy = hy + SL * Math.cos(th), fz = HZ + SL * Math.sin(th);
    const ty = hy - 7 * f, gy = hy + 3 * f, ly = hy + 15 * f;
    ch.back.setAttribute("d", plate([[x0, ty, BZ], [x1, ty, BZ], [x1, hy, HZ - 1], [x0, hy, HZ - 1]]));
    ch.seat.setAttribute("d", plate([[x0, hy, HZ], [x1, hy, HZ], [x1, fy, fz], [x0, fy, fz]]));
    const L = (x) => seg(P(x, gy, 0), P(x, ty, BZ)) + seg(P(x, ly, 0), P(x, fy, fz)) + seg(P(x, gy, 0), P(x, fy, fz));
    ch.legsB.setAttribute("d", L(x0));
    ch.legsF.setAttribute("d", L(x1));
  }

  const B = register(stage, (dt, now) => {
    let m = false;
    for (const ch of chairs) { draw(ch, tval(ch.tw, now)); if (!tdone(ch.tw, now)) m = true; }
    return m;
  });
  bag.add(B.unregister);

  let sel = null;
  function retarget() {
    const now = performance.now();
    for (const ch of chairs) {
      const to = sel === null ? REST[ch.i] : ch.i === sel ? clamp(amt, 0.3, 1) : 0;
      tset(ch.tw, to, now, sel === null ? 0 : Math.abs(ch.i - sel) * 45);
      const on = sel === null ? ch.i === FAV : ch.i === sel;
      ch.seat.classList.toggle("hi", on);
      ch.back.classList.toggle("hi", on);
    }
    read.textContent = sel === null ? "rest" : "chair " + (sel + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      let best = null, bd = Infinity;
      for (const ch of chairs) { const d = Math.abs(p[0] - ch.sx); if (d < bd) { bd = d; best = ch.i; } }
      const next = bd > GAP * 2 || p[1] < 40 || p[1] > 290 ? null : best;
      if (next !== sel) { sel = next; retarget(); }
    },
    leave: () => { sel = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amt = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "tentpoles",
  means: "Five folding camp chairs in a row: the one under the pointer swings open and the others fold shut around it.",
  rules: [1, 2, 5, 8],
  range: [0.3, 1, 1],
  tour: [[101, 129], [241, 199], [194, 176], null],
  mount,
});
