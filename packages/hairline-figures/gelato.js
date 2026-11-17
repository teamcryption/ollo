/**
 * Popsicle mould: a squat block with one deep well and a pop frozen in it,
 * its stick standing up out of the top. The pointer over it draws the pop
 * up out of the well by its stick. At rest the pop sits a little proud of
 * the rim, the stick bright. The slider is how far it lifts.
 *
 * The pattern: one part sliding out of a fixed sleeve.
 */
const { Cam, fit, facing, prism, proj, rings, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const TOP = 30, BODY = 44, STICK = 20, REST = 6, LIFT = 34;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.05);
  fit(C, [[-26, -18, 0], [26, 18, 0], [-26, 18, 0], [26, -18, 0], [0, 0, TOP + LIFT + 8 + STICK]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // the mould block, its well a crease on top
  const [mr, mi] = rings(-26, -18, 26, 18, 7, 2);
  put(solid(g), prism(P, front, mr, mi, 0, TOP));
  const [wr] = rings(-17, -8, 17, 8, 6, 1);
  const [wr2, wi2] = rings(-17, -8, 17, 8, 6, 1.4);
  const well = mk("path", { class: "nf lo" }, g);
  put({ sil: well, cr: mk("path", { class: "nf" }, g) }, prism(P, front, wr, wr, TOP, TOP));

  const pop = solid(g);
  const stick = solid(g);
  stick.sil.classList.add("hi");
  const [pr, pi] = rings(-15.5, -6.5, 15.5, 6.5, 6, 1.6);
  const [sr, si] = rings(-3, -1.4, 3, 1.4, 1.4, 0.6);

  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const z0 = TOP - BODY + REST + z;
    put(pop, prism(P, front, pr, pi, TOP, z0 + BODY));
    put(stick, prism(P, front, sr, si, z0 + BODY, z0 + BODY + STICK));
  }
  const tw = tween(0);
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, TOP);
  let on = null;
  function set(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? LIFT * amp : 0, performance.now(), 0);
    read.textContent = v ? "lift" : "rest";
    B.wake();
  }
  set(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => set(Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 110), leave: () => set(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) { tset(tw, LIFT * amp, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "gelato",
  means: "A popsicle mould with one pop frozen in its well: the pointer draws the pop up out of the mould by its stick.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1],
  tour: [[200, 158], [160, 210], [240, 220], null],
  mount,
});
