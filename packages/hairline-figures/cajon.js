/**
 * Cajon: a box drum on the floor, its front plate framed, a sound hole in its
 * back, a pedal beside it. At rest it stands with the pedal bright; the
 * pointer over it tips the box back onto its rear edge, as a player sits.
 *
 * The pattern: one solid that tilts about an edge.
 */
const { Cam, fit, hull, poly, proj, rad, tween, tset, tval, tdone, mk, pointer, register, disposer } = HL;

const W = 46, D = 46, H = 76, REST = 4;
const tip = (a) => ([x, y, z]) => { const c = Math.cos(a), s = Math.sin(a); return [x * c - z * s, y, x * s + z * c]; };
const box = (x0, y0, z0, x1, y1, z1) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, box(0, 0, 0, W, D, H).map(tip(rad(-22))).concat(box(0, 0, 0, W, D, H), box(W + 6, 10, 0, W + 30, 30, 6)), 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const pedal = mk("path", { class: "sil hi" }, g);
  pedal.setAttribute("d", poly(hull(box(W + 8, 12, 0, W + 30, 30, 5).map((p) => P(...p)))));
  const sil = mk("path", { class: "sil" }, g), top = mk("path", { class: "nf lo" }, g), edge = mk("path", { class: "nf lo" }, g), plate = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const f = tip(rad(-deg)), q = (pts) => pts.map((p) => P(...f(p)));
    sil.setAttribute("d", poly(hull(q(box(0, 0, 0, W, D, H)))));
    top.setAttribute("d", poly(q([[0, 0, H], [W, 0, H], [W, D, H], [0, D, H]])));
    edge.setAttribute("d", poly(q([[W, D, 0], [W, D, H]])));
    plate.setAttribute("d", poly(q([[W, 4, 5], [W, D - 4, 5], [W, D - 4, H - 5], [W, 4, H - 5]])));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = box(0, 0, 0, W, D, H).map((p) => P(...p));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const bx = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + 18 * amt : REST, performance.now(), 0);
    sil.classList.toggle("hi", on);
    pedal.classList.toggle("hi", !on);
    read.textContent = on ? "tip" : "rest";
    B.wake();
  }
  setActive(false);
  const inside = ([sx, sy]) => sx > bx[0] && sx < bx[2] && sy > bx[1] && sy < bx[3];
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cajon",
  means: "A cajon box drum with a pedal beside it: the pointer over the box tips it back onto its rear edge.",
  rules: [1, 4, 5, 6],
  range: [0.3, 1, 1],
  tour: [[181, 74], [175, 150], [215, 130], null],
  mount,
});
