/**
 * Clay stamp: a block print stamp on a sheet, a square block with a turned
 * knob on top and a carved motif on its face. The pointer over it lifts the
 * block off the sheet and tilts its face up to show the carving, the print
 * left on the paper. At rest the knob is bright. The slider is the tilt.
 */
const { Cam, fit, hull, poly, proj, rrect, tween, tset, tval, tdone, unproj, disposer, mk, pointer, register } = HL;

const pitch = (a) => ([x, y, z]) => [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)];
const tr = (dx, dy, dz) => ([x, y, z]) => [x + dx, y + dy, z + dz];
const chain = (...fs) => (p) => fs.reduce((q, f) => f(q), p);
const D = Math.PI / 180, LIFT = 34;
const disc = (r, n = 24) => rrect(-r, -r, r, r, r, n / 4);
const MOTIF = [[-12, -12, 12, 12, 3], [-5, -16, 5, -10, 2], [-5, 10, 5, 16, 2], [-16, -5, -10, 5, 2], [10, -5, 16, 5, 2]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-50, -40, 0], [50, 40, 0], [-50, 40, 0], [50, -40, 0], [0, 0, 70], [26, 0, 60]], 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const sheet = rrect(-48, -38, 48, 38, 3);
  mk("path", { class: "sil", d: poly(hull(sheet.map((q) => P(q.u, q.v, 0)).concat(sheet.map((q) => P(q.u, q.v, 1))))) }, g);
  const print = mk("path", { class: "nf lo" }, g);
  const knob = mk("path", { class: "sil hi" }, g), body = mk("path", { class: "sil" }, g), bcr = mk("path", { class: "nf lo" }, g);
  const relief = mk("path", { class: "nf" }, g);
  const tw = tween(0);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const Tf = chain(tr(0, 0, -7), pitch(-max * o * D), tr(0, 0, 8 + LIFT * o));
    const at = (r, z) => r.map((q) => P(...Tf([q.u, q.v, z])));
    const blk = rrect(-22, -22, 22, 22, 4);
    body.setAttribute("d", poly(hull(at(blk, 0).concat(at(blk, 14)))));
    bcr.setAttribute("d", o > 0.5 ? poly(at(rrect(-20, -20, 20, 20, 3), 0)) : poly(at(rrect(-20, -20, 20, 20, 3), 14)));
    const neck = at(disc(4), 14).concat(at(disc(4), 24)), ball = at(disc(9), 24).concat(at(disc(9), 30), at(disc(6), 33));
    knob.setAttribute("d", poly(hull(neck.concat(ball))));
    if (o < 0.5) bcr.after(knob); else body.before(knob);
    let d = "";
    if (o > 0.5) for (const [a, b, c, e, r] of MOTIF) d += poly(hull(at(rrect(a, b, c, e, r), 0).concat(at(rrect(a, b, c, e, r), -2))));
    relief.setAttribute("d", d);
    let pd = "";
    if (o > 0.3) for (const [a, b, c, e, r] of MOTIF) pd += poly(rrect(-e, b, -a, e, r).map((q) => P(q.u, q.v, 1)));
    print.setAttribute("d", pd);
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    knob.classList.toggle("hi", !a);
    body.classList.toggle("hi", a);
    read.textContent = a ? "tilt " + Math.round(max) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return Math.abs(x) < 52 && Math.abs(y) < 42;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "stampblock",
  means: "A block print stamp on a sheet: the pointer over it lifts the block and tilts its carved face up, the print left on the paper.",
  rules: [1, 3, 5, 8],
  range: [60, 90, 110],
  tour: [[200, 214], [150, 200], [76, 187], null],
  mount,
});
