/**
 * Leather punch: a rotary punch seen side on, its wheel of tubes on the
 * upper jaw. The pointer over the tool squeezes the handles: the upper
 * handle swings down about the pivot and the anvil jaw rises to the wheel.
 * At rest the wheel is bright. The slider is how far it squeezes.
 */
const { Cam, fit, hull, poly, proj, circ, fillet, clamp, spring, stepS, disposer, mk, pointer, register } = HL;

const OPEN = 17, s = Math.SQRT1_2, Z0 = 46;
const W = (u, w, z) => [u * s + w * s, -u * s + w * s, z + Z0];
// fixed piece: upper jaw with wheel, lower handle
const JAW_B = [[-50, 2], [-50, 12], [6, 9], [6, 0]];
const HAN_B = [[-4, -2], [6, -8], [84, -20], [82, -28]];
// moving piece: anvil jaw, upper handle
const JAW_A = [[-52, -5], [-52, -12], [6, -7], [6, 3]];
const HAN_A = [[-4, 3], [6, 8], [84, 16], [82, 24]];
const WC = [-42, 7], WR = 11;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [W(-56, 0, -40), W(90, 0, 40), W(90, 0, -40), W(-56, 0, 30)], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const rnd = (pts) => fillet(pts, pts.map(() => 2.5), 3);
  function part(cls) {
    const q = mk("g", {}, g);
    return { sil: mk("path", { class: "sil " + cls }, q), cr: mk("path", { class: "nf lo" }, q) };
  }
  function draw(pt, pts, w0, w1, th) {
    const c = Math.cos(th), si = Math.sin(th);
    const r = rnd(pts).map(([u, z]) => [u * c - z * si, u * si + z * c]);
    const a = r.map(([u, z]) => P(...W(u, w0, z))), b = r.map(([u, z]) => P(...W(u, w1, z)));
    pt.sil.setAttribute("d", poly(hull(a.concat(b))));
    pt.cr.setAttribute("d", poly(b));
  }
  const circle = (cx, cz, R, n = 32) => circ(R, n).map((q) => [cx + q.u, cz + q.v]);
  const jb = part(""), hb = part(""), wheel = part(""), hub = part("");
  draw(jb, JAW_B, 0, 6, 0); draw(hb, HAN_B, 0, 6, 0);
  draw(wheel, circle(WC[0], WC[1], WR), -2, 9, 0);
  draw(hub, circle(WC[0], WC[1], 3.5, 16), 9, 10.5, 0);
  const tubes = [];
  for (let k = 0; k < 6; k++) {
    const t = (k / 6) * Math.PI * 2 + 0.5, d = mk("path", { class: "nf" }, g);
    const pts = circle(WC[0] + Math.cos(t) * 7.4, WC[1] + Math.sin(t) * 7.4, 1.5, 10).map(([u, z]) => P(...W(u, 9, z)));
    d.setAttribute("d", poly(pts)); tubes.push(d);
  }
  const ja = part(""), ha = part(""), boss = part("");
  draw(boss, circle(0, 0, 6, 20), -1, 13, 0);
  const th = spring(rad(OPEN));
  let last = NaN;
  function redraw() {
    if (th.x === last) return;
    last = th.x;
    draw(ja, JAW_A, 6, 12, th.x); draw(ha, HAN_A, 6, 12, th.x);
    boss.sil.parentNode.parentNode.appendChild(boss.sil.parentNode);
  }
  redraw();
  const B = register(stage, (dt) => { const m = stepS(th, dt); redraw(); return m; });
  bag.add(B.unregister);
  const box = [W(-56, 0, -36), W(90, 0, 36)].map((p) => P(...p));
  let on = null;
  function set(p) {
    const inside = p && p[0] > box[0][0] - 8 && p[0] < box[1][0] + 8 && Math.abs(p[1] - (box[0][1] + box[1][1]) / 2) < 70;
    const t = inside ? clamp((p[0] - box[0][0]) / (box[1][0] - box[0][0]), 0, 1) : -1;
    th.t = rad(OPEN) * (inside ? 1 - amt * (0.4 + 0.6 * t) : 1);
    if (inside !== on) {
      on = inside;
      wheel.sil.classList.toggle("hi", !inside);
      ha.sil.classList.toggle("hi", inside); ja.sil.classList.toggle("hi", inside);
    }
    read.textContent = inside ? "sq " + Math.round(100 * (1 - th.t / rad(OPEN))) : "rest";
    B.wake();
  }
  set(null);
  bag.add(pointer(stage, { move: set, leave: () => set(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; }, destroy: bag.dispose };
}
const rad = (d) => (d * Math.PI) / 180;

hairline({
  name: "leatherpunch",
  means: "A rotary leather punch side on: the pointer squeezes its handles, and the anvil jaw swings up to the wheel of tubes.",
  rules: [1, 3, 5, 8],
  range: [0, 0.8, 1],
  tour: [[36, 166], [342, 131], [351, 127], null],
  mount,
});
