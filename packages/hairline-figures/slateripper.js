/**
 * Roof ladder: a roofer's ladder lying on the slope of a gable roof, its
 * hooked top end ready for the ridge. The pointer pushes it up the slope:
 * the nearer the pointer stands to the ridge, the higher the ladder slides,
 * until its hook drops over. At rest the hook is bright. The slider is reach.
 */
const {
  Cam, circ, fit, facing, hull, poly, proj, rrect, run, ringAt, open, clamp, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 10) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const RX = 70, RZ = 60, LEN = 56, W = 9, REST = 0.08, SL = 24;
const zs = (x) => RZ * (1 - Math.abs(x) / RX) + 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.0);
  fit(C, [[-RX, -40, 0], [RX, 40, 0], [0, -40, RZ + 6], [0, 40, RZ + 6]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const foot = rrect(-RX, -40, RX, 40, 3, 4), top = rrect(-1.5, -40, 1.5, 40, 1.5, 4), inner = rrect(-0.5, -38.5, 0.5, 38.5, 0.5, 4);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 0).concat(ringAt(P, top, RZ)))), crease: open(ringAt(P, run(inner, front), RZ)) });
  mk("path", { class: "lo nf", d: open([P(-RX, 40, 0), P(0, 40, RZ), P(RX, 40, 0)]) + " " + open([P(0, -40, RZ), P(0, 40, RZ)]) }, g);
  const rod = (a, b, r) => poly(hull(ringAt(P, disc(a[0], a[1], r), a[2]).concat(ringAt(P, disc(b[0], b[1], r), b[2]))));
  const railB = mk("path", { class: "sil" }, g), hookB = mk("path", { class: "sil" }, g);
  const rungs = mk("path", { class: "sil" }, g);
  const railF = mk("path", { class: "sil" }, g), hookF = mk("path", { class: "sil" }, g);
  const ladder = [railB, rungs, railF], hooks = [hookB, hookF];

  const sl = spring(REST);
  let last = NaN;
  function draw(s) {
    if (s === last) return;
    last = s;
    const xt = 4 + (1 - s) * SL, xb = xt + LEN;
    for (const [y, rail, hook] of [[-W, railB, hookB], [W, railF, hookF]]) {
      rail.setAttribute("d", rod([xt, y, zs(xt)], [xb, y, zs(xb)], 1.7));
      const up = [xt - 5, y, zs(xt) + 7], down = [xt - 12, y, zs(xt) + 1];
      hook.setAttribute("d", rod([xt, y, zs(xt)], up, 1.7) + " " + rod(up, down, 1.7));
    }
    let d = "";
    for (let x = xt + 6; x < xb - 2; x += 10) d += rod([x, -W, zs(x)], [x, W, zs(x)], 1.2) + " ";
    rungs.setAttribute("d", d);
  }
  const B = register(stage, (dt) => { const m = stepS(sl, dt); draw(sl.x); return m; });
  bag.add(B.unregister);

  const eave = P(RX, 0, 0), ridge = P(0, 0, RZ), cen = P(RX / 2, 0, RZ / 2);
  const vx = ridge[0] - eave[0], vy = ridge[1] - eave[1], vv = vx * vx + vy * vy;
  let on = null;
  function aim(p) {
    const inside = p && Math.abs(p[0] - cen[0]) < 150 && Math.abs(p[1] - cen[1]) < 130;
    const s = inside ? clamp(((p[0] - eave[0]) * vx + (p[1] - eave[1]) * vy) / vv, 0.25, 1) * reach : REST;
    sl.t = Math.max(s, REST);
    const act = !!inside;
    if (act !== on) {
      on = act;
      for (const el of hooks) el.classList.toggle("hi", !act);
      for (const el of ladder) el.classList.toggle("hi", act);
    }
    read.textContent = act ? (s > 0.92 ? "hooked" : Math.round(s * 100) + "%") : "rest";
    B.wake();
  }
  aim(null);
  bag.add(pointer(stage, { move: aim, leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "slateripper",
  means: "A roof ladder on a gable roof: it slides up the slope toward the pointer until its hook drops over the ridge.",
  rules: [1, 3, 4, 5],
  range: [40, 100, 100],
  tour: [[206, 99], [285, 226], [240, 160], null],
  mount,
});
