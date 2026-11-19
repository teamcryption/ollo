/**
 * Snowcat groomer: a tracked snow groomer with a tapered cab, a tiller at
 * the back and a wide blade at the front on two push arms. The pointer over
 * the snowcat raises the blade high off the snow; leaving lowers it. At rest
 * the blade rides just clear of the ground, bright. The slider is how high
 * the blade lifts.
 */
const {
  Cam, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rings, rrect, ringAt, run, seg, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = 3, BX0 = 76, BX1 = 81, BH = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.25);
  fit(C, [[-14, -12, 0], [81, 58, 0], [-14, 58, 0], [81, -12, 0], [44, 23, 46], [81, -12, 36 + BH], [81, 58, 36 + BH]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the tiller at the back, the far track, the body
  put(solid(g), prism(P, front, ...rings(-14, -4, -2, 50, 4, 1.5), 2, 12));
  put(solid(g), prism(P, front, ...rings(0, 0, 70, 10, 5, 1.5), 0, 14));
  put(solid(g), prism(P, front, ...rings(6, 6, 64, 40, 5, 2), 8, 26));
  // the cab: a tapered solid, smaller at its top
  const foot = rrect(30, 10, 58, 36, 4, 4), top = rrect(34, 13, 54, 33, 3, 4), inner = rrect(35.4, 14.4, 52.6, 31.6, 1.6, 4);
  put(solid(g), { sil: poly(hull(ringAt(P, foot, 26).concat(ringAt(P, top, 46)))), crease: open(ringAt(P, run(inner, front), 46)) });
  const fx = (z) => lerp(58, 54, (z - 26) / 20);
  mk("path", { d: poly([P(fx(30), 14, 30), P(fx(30), 32, 30), P(fx(42), 31, 42), P(fx(42), 15, 42)]), class: "nf lo" }, g);
  // the push arms, then the near track over them
  const arms = mk("path", { class: "nf" }, g);
  put(solid(g), prism(P, front, ...rings(0, 36, 70, 46, 5, 1.5), 0, 14));
  let lugs = "";
  for (let x = 8; x <= 62; x += 9) lugs += seg(P(x, 46, 3), P(x, 46, 11));
  mk("path", { d: lugs, class: "nf lo" }, g);
  // the blade
  const blade = solid(g);
  blade.sil.classList.add("hi");
  const ring = rings(BX0, -12, BX1, 58, 2.5, 1);
  const lift = tween(REST);
  let last = NaN;
  function draw(z) {
    if (Math.abs(z - last) < 0.01) return;
    last = z;
    put(blade, prism(P, front, ...ring, z, z + BH));
    let d = "";
    for (const y of [12, 34]) d += seg(P(62, y, 14), P(BX0, y, z + 9)) + seg(P(62, y + 2, 16), P(BX0, y + 2, z + 11));
    arms.setAttribute("d", d);
  }
  const B = register(stage, (_dt, now) => { draw(tval(lift, now)); return !tdone(lift, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(lift, on ? max : REST, performance.now(), 0);
    read.textContent = on ? "up " + Math.round(max) : "rest";
    B.wake();
  }
  setOn(false);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setOn(clamp(x, -34, 92) === x && clamp(y, -34, 66) === y);
  }
  bag.add(pointer(stage, { move, leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "snowcat",
  means: "A snowcat groomer on its tracks: the pointer over it raises the wide front blade high on its push arms; leaving lowers it.",
  rules: [1, 3, 5, 8],
  range: [14, 28, 36],
  tour: [[150, 170], [226, 108], [220, 137], null],
  mount,
});
