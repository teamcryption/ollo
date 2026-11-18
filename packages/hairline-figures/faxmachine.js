/**
 * Fax machine: a squat body with a paper tray at the back, a handset on its
 * cradle and a keypad of dots. The pointer over it feeds the printed sheet
 * out of the front slot; the slider is how far the sheet runs out.
 */
const {
  Cam, fit, facing, fillet, poly, prism, proj, rings, clamp, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid, flatDot, place, unproj, seg,
} = HL;

const L = 50, W = 70, H = 16, REST = 10, FEED = 56;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let run = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-14, 0, 0], [L + REST + FEED, 6, 0], [L, 0, 0], [L, W, 0], [-14, 6, 44], [0, W, 0]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const tray = mk("path", { class: "sil" }, g);
  const tq = (x0, z0, x1, z1) => [P(x0, 8, z0), P(x0, 50, z0), P(x1, 50, z1), P(x1, 8, z1)];
  tray.setAttribute("d", poly(fillet(tq(6, H, -12, 44), [1, 1, 2, 2])));
  mk("path", { class: "lo nf", d: poly(fillet(tq(5, H + 2, -9, 40), [1, 1, 2, 2])) }, g);
  const [br, bi] = rings(0, 0, L, W, 7, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { class: "lo nf", d: seg(P(L, 4, 5), P(L, 60, 5)) }, g);
  const [cr, ci] = rings(10, 54, 44, 66, 4, 1);
  put(solid(g), prism(P, front, cr, ci, H, H + 2));
  const [hr, hi] = rings(8, 55, 46, 65, 5, 1.2);
  put(solid(g), prism(P, front, hr, hi, H + 2, H + 8));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++)
    place(flatDot(g, C, 1.1, "dot off"), P(20 + i * 7, 18 + j * 7, H));
  const sheet = mk("path", { class: "sil hi" }, g), lines = mk("path", { class: "lo nf" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(f) {
    const fr = Math.round(f * 10) / 10;
    if (fr === last) return;
    last = fr;
    const x1 = L + fr, sag = clamp(fr / 6, 0, 8);
    const at = (x, y) => P(x, y, 5 - clamp((x - L) / 8, 0, sag) * 0.6);
    sheet.setAttribute("d", poly(fillet([at(L, 6), at(x1, 6), at(x1, 58), at(L, 58)], [0.5, 1.5, 1.5, 0.5])));
    let d = "";
    for (let k = 1; k * 9 < fr - 3; k++) d += seg(at(L + k * 9, 12), at(L + k * 9, 52));
    lines.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + FEED * (0.35 + 0.65 * run) : REST, performance.now(), 0);
    read.textContent = on ? "feed" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); return x > -6 && x < L + REST + 6 && y > -6 && y < W + 6; };
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { run = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "faxmachine",
  means: "A fax machine with tray and handset: the pointer over it feeds the printed sheet out of the front slot.",
  rules: [1, 3, 5, 9],
  range: [0, 1, 1],
  tour: [[156, 177], [165, 137], [129, 226], null],
  mount,
});
