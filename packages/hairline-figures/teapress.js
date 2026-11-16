/**
 * Tea press: a glass jug on a foot with a lid, a rod and a knob. The pointer
 * over the press pushes the plunger down through the glass. At rest the
 * plunger stands high, bright. The slider is how far it goes.
 */
const { Cam, circ, fit, facing, open, prism, proj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const R = 20, H = 58, ROD = 48, REST = 0;
const disc = (x, y, r, n = 44) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.6);
  const box = [[-R - 2, -R - 2, 0], [R + 2, R + 16, 0], [R + 2, -R - 2, 0], [-R - 2, R + 2, 0], [0, 0, H + 14 + 3 + 8], [0, 0, 0]];
  fit(C, box.concat([[0, 0, 52 + ROD + 10]]), 200, 160);
  const P = proj(C), front = facing(C);
  const cyl = (s, r, z0, z1) => put(s, prism(P, front, disc(0, 0, r), disc(0, 0, r - 1.5), z0, z1));
  const g = mk("g", {}, svg);
  cyl(solid(g), R + 3, 0, 4);
  const glass = prism(P, front, disc(0, 0, R), disc(0, 0, R - 1), 4, H);
  mk("path", { d: glass.sil, class: "nf" }, g);
  mk("path", { d: open([P(0, R, H - 8), P(0, R + 13, H - 12), P(0, R + 13, 14), P(0, R, 10)]), class: "nf" }, g);
  const filt = solid(g), low = solid(g);
  cyl(solid(g), R + 1.5, H, H + 4);
  const high = solid(g), knob = solid(g);
  knob.sil.classList.add("hi");

  const tw = tween(REST);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const zf = H - 8 - v * (H - 18);
    cyl(filt, R - 2, zf, zf + 3);
    cyl(low, 2.5, zf + 3, H);
    cyl(high, 2.5, H + 4, zf + ROD);
    cyl(knob, 6, zf + ROD, zf + ROD + 8);
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const sp = box.concat([[0, 0, H - 8 + ROD + 8]]).map((p) => P(...p));
  const xs = sp.map((p) => p[0]), ys = sp.map((p) => p[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 8 && sx < Math.max(...xs) + 8 && sy > Math.min(...ys) - 8 && sy < Math.max(...ys) + 8;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? reach : REST, performance.now(), 0);
    read.textContent = a ? "press" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (act) { tset(tw, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "teapress",
  means: "A glass tea press: the pointer pushes the plunger and its mesh down through the jug.",
  rules: [1, 3, 5, 6],
  range: [0.4, 1, 1],
  tour: [[200, 160], [210, 150], [190, 170], null],
  mount,
});
