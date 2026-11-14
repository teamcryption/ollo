/**
 * Cat bed: a round basket with a thick rim and a cushion sitting in it, a
 * dent where the cat curls. The pointer over the bed lifts the cushion clear
 * of the rim; leaving lets it settle back, a little proud of the floor. At
 * rest the cushion is the bright mark. The slider is how high it lifts.
 *
 * The pattern: one part lifting out of its holder (cloche).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, ringAt, run, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 46, RI = 37, H = 18, CR = 35, CT = 8, REST = 7;
const disc = (r, n = 40, x = 0, y = 0) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let top = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, 44 + CT]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const outer = disc(R, 48), inner = disc(RI, 48);

  // the basket: body, its opening, then the cushion, then the front wall over it
  put(solid(g), prism(P, front, outer, disc(R - 2, 48), 0, H));
  mk("path", { d: poly(ringAt(P, inner, H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringAt(P, disc(RI - 3, 48), H - 3)), class: "nf lo" }, g);
  const cg = mk("g", {}, g);
  const cush = solid(cg), dent = mk("path", { class: "nf lo" }, cg);
  const fo = run(outer, front), fi = run(inner, front);
  const wall = ringAt(P, fo, 0).concat(ringAt(P, fi, H).reverse());
  mk("path", { d: poly(wall), class: "fo" }, g);
  mk("path", { d: open(ringAt(P, fi, H)), class: "nf lo" }, g);
  mk("path", { d: open(ringAt(P, fo, 0)), class: "nf sil" }, g);
  mk("path", { d: open(ringAt(P, fo, H - 2)), class: "nf lo" }, g);

  const z = tween(REST);
  let last = NaN;
  function draw(z0) {
    if (z0 === last) return;
    last = z0;
    put(cush, prism(P, front, disc(CR, 40), disc(CR - 3, 40), z0, z0 + CT));
    const d = [];
    for (const [r, h] of [[16, 0], [11, -2]]) d.push(...ringAt(P, disc(r, 24, 2, 2), z0 + CT + h));
    dent.setAttribute("d", poly(hull(d)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  let act = null;
  function set(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? 18 + top : REST, performance.now(), 0);
    cush.sil.classList.add("hi");
    read.textContent = a ? "lift" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { const [x, y] = unproj(C, sx, sy, H); set(Math.hypot(x, y) < R + 6); },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { top = v; if (act) { act = null; set(true); } }, destroy: bag.dispose };
}

hairline({
  name: "petbed",
  means: "A round cat bed: the pointer over the basket lifts the cushion clear of the rim, and it settles back when the pointer leaves.",
  rules: [1, 5, 6, 8],
  range: [8, 18, 26],
  tour: [[200, 100], [140, 190], [260, 200], null],
  mount,
});
