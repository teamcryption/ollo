/**
 * Stamp mill: a long iron mortar box with one heavy stamp standing in it,
 * a shoe on a tall stem with a tappet collar. The pointer over the mill
 * lifts the stamp high out of the mortar, as the cam would; leaving lets it
 * settle back to a small rest lift. At rest the tappet collar is bright.
 * The slider is how high the stamp is lifted.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const MZ = 12, SR = 13, SH = 16, STEM = 3.5, SL = 70, CR = 7, CZ = 34, REST = 8;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.1);
  fit(C, [[-34, -20, 0], [34, 20, 0], [34, -20, 0], [-34, 20, 0], [0, 0, MZ + 50 + SH + SL]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // mortar box, and its open feed slot on top
  const [mr, mi] = rings(-34, -20, 34, 20, 5, 2);
  put(solid(g), prism(P, front, mr, mi, 0, MZ));
  mk("path", { d: poly(ringAt(P, rings(-26, -15, 26, 15, 4, 1)[0], MZ)), class: "nf lo" }, g);
  // the stamp: shoe, stem, tappet collar
  const sg = mk("g", {}, g);
  const shoe = solid(sg), stem = solid(sg), coll = solid(sg);
  coll.sil.classList.add("hi");
  const z = tween(REST);
  let last = NaN;
  function draw(h) {
    if (h === last) return;
    last = h;
    const b = MZ + h;
    put(shoe, prism(P, front, disc(0, 0, SR), disc(0, 0, SR - 2), b, b + SH));
    put(stem, prism(P, front, disc(0, 0, STEM, 16), disc(0, 0, STEM - 1, 16), b + SH, b + SH + SL));
    put(coll, prism(P, front, disc(0, 0, CR, 24), disc(0, 0, CR - 1.6, 24), b + SH + CZ, b + SH + CZ + 6));
  }
  const B = register(stage, (_dt, now) => { draw(tval(z, now)); return !tdone(z, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(z, a ? lift : REST, performance.now(), 0);
    read.textContent = a ? "lift " + Math.round(lift) : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    const top = P(0, 0, MZ + REST + SH + SL)[1];
    return Math.abs(x) < 44 && Math.abs(y) < 30 || (Math.abs(sx - P(0, 0, 0)[0]) < 30 && sy > top - 10 && sy < P(0, 0, 0)[1]);
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return {
    set: (v) => { lift = v; if (act) { act = null; setActive(true); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "stampmill",
  means: "A stamp mill's heavy stamp in its mortar: the pointer lifts the shoe and stem high out of the box, as the cam would.",
  rules: [3, 5, 8],
  range: [20, 35, 50],
  tour: [[200, 202], [200, 129], [200, 93], null],
  mount,
});
