/**
 * Butter bell: a French butter crock, a fat pot holding water, and its bell
 * lid, a flanged cup packed with butter that stands upside down in the pot.
 * The pointer over the crock lifts the bell up and out, tilting it, to show
 * the butter in its cup. At rest the bell sits a little proud of the pot,
 * bright. The slider is how far the bell lifts.
 *
 * The pattern: one part answering (a tween), hit on a fixed screen box.
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PR = 24, PH = 30, BR = 17, FR = 27, CUP = 22, REST = 4, LIFT = 30, SLIDE = 16;
const disc = (x, y, r, n = 40) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-PR, -PR, 0], [PR, PR, 0], [PR, -PR, 0], [-PR, PR, 0], [SLIDE * 1.1 - FR, -FR * 0.6, PH + LIFT * 1.1 + 12], [SLIDE * 1.1 + FR, FR * 0.6, PH + LIFT * 1.1 - 26], [0, 0, PH + REST + 12]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the pot: a foot, a body, a lip
  put(solid(g), prism(P, front, disc(0, 0, PR - 3), null, 0, 3));
  const [pr, pi] = rings(-PR, -PR, PR, PR, PR, 2.2);
  put(solid(g), prism(P, front, pr, pi, 3, PH));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(0, 0, BR + 2), PH)) }, g);
  // the bell: cup, butter, flange, knob
  const bell = mk("g", {}, g);
  const cup = solid(bell), butter = mk("path", { class: "nf lo" }, bell), flange = solid(bell), knob = solid(bell);
  const t = tween(0);
  let last = NaN;

  function draw(v) {
    if (v === last) return;
    last = v;
    const lift = REST + v * LIFT * amt, dx = v * SLIDE * amt, base = PH + lift;
    const z0 = Math.max(PH, base - CUP);
    put(cup, prism(P, front, disc(dx, 0, BR), null, z0, base));
    const bz = base - CUP - 6;
    butter.setAttribute("d", bz + 6 > PH ? poly(hull(ringAt(P, disc(dx, 0, BR - 3, 28), Math.max(PH, bz)).concat(ringAt(P, disc(dx, 0, BR - 3, 28), base - CUP)))) : "");
    put(flange, prism(P, front, disc(dx, 0, FR), disc(dx, 0, FR - 3), base, base + 3));
    const kr = [];
    for (let i = 0; i <= 5; i++) { const a = (i / 5) * (Math.PI / 2); kr.push(...ringAt(P, disc(dx, 0, 9 * Math.cos(a), 24), base + 3 + 9 * Math.sin(a))); }
    knob.sil.setAttribute("d", poly(hull(kr)));
    knob.cr.setAttribute("d", "");
  }

  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(t, a ? 1 : 0, performance.now(), 0);
    flange.sil.classList.add("hi");
    read.textContent = a ? "lifted" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(Math.abs(sx - 200) < 120 && Math.abs(sy - 168) < 140),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "butterbell",
  means: "A butter bell crock: the pointer lifts the bell lid up and out of its pot, showing the butter packed in its cup.",
  rules: [1, 3, 5, 6],
  range: [0.5, 1, 1.1],
  tour: [[200, 79], [144, 234], [270, 40], null],
  mount,
});
