/**
 * Wine press: a slatted basket on a round tray between two posts, a beam
 * across them and a screw through the beam with a long crank bar on top.
 * The crank turns to face the pointer round the screw, on a spring. At rest
 * it sits at a slant, bright. The slider is how stiff the screw turns.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rad, rings, ringAt, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BR = 26, BZ = 46, PX = 36, TOP = 92, ARM = 50, REST = 150;
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[-42, -42, 0], [42, 42, 0], [42, -42, 0], [-42, 42, 0], [-ARM, 0, TOP + 8], [ARM, 0, TOP + 8], [0, ARM, TOP + 8], [0, -ARM, TOP + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, 38, 40), disc(0, 0, 35, 40), 0, 5));
  const post = (x) => put(solid(g), prism(P, front, ...rings(x - 4, -4, x + 4, 4, 2, 1), 5, 84));
  post(-PX);
  put(solid(g), prism(P, front, disc(0, 0, BR, 40), disc(0, 0, BR - 2, 40), 5, BZ));
  for (let i = 0; i < 16; i++) {
    const t = (i / 16) * 2 * Math.PI, x = BR * Math.cos(t), y = BR * Math.sin(t);
    if (x + y > 4) mk("path", { d: seg(P(x, y, 7), P(x, y, BZ - 2)), class: "nf lo" }, g);
  }
  put(solid(g), prism(P, front, disc(0, 0, BR - 4, 36), disc(0, 0, BR - 6, 36), BZ, BZ + 5));
  post(PX);
  put(solid(g), prism(P, front, ...rings(-PX - 6, -6, PX + 6, 6, 3, 1.4), 76, 84));
  const back = mk("g", {}, g);
  put(solid(g), prism(P, front, disc(0, 0, 3, 16), disc(0, 0, 2, 16), BZ + 5, TOP + 4));
  const fore = mk("g", {}, g);
  const arm = mk("path", { class: "sil hi" }, back), knob = mk("path", { class: "sil hi" }, back);

  const sp = spring(REST, { k: 100, c: 18 + value * 0.2, m: 1 });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const c = Math.cos(rad(a)), s = Math.sin(rad(a)), ex = ARM * c, ey = ARM * s;
    arm.setAttribute("d", poly(hull(ringAt(P, disc(-6 * c, -6 * s, 2.4, 12), TOP).concat(ringAt(P, disc(ex, ey, 2.4, 12), TOP), ringAt(P, disc(-6 * c, -6 * s, 2.4, 12), TOP + 4), ringAt(P, disc(ex, ey, 2.4, 12), TOP + 4)))));
    knob.setAttribute("d", poly(hull(ringAt(P, disc(ex, ey, 3.4, 14), TOP + 4).concat(ringAt(P, disc(ex, ey, 3.4, 14), TOP + 13)))));
    const parent = c + s > 0 ? fore : back;
    if (arm.parentNode !== parent) parent.append(arm, knob);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);

  function aim(t) {
    let d = t - sp.t;
    d -= 360 * Math.round(d / 360);
    sp.t += d;
    const deg = ((Math.round(sp.t) % 360) + 360) % 360;
    read.textContent = String(deg).padStart(3, "0") + "°";
    B.wake();
  }
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.hypot(x, y) < 6) return;
    aim((Math.atan2(y, x) * 180) / Math.PI);
  }
  function leave() { aim(REST); read.textContent = "rest"; }
  read.textContent = "rest";
  draw(REST);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { sp.c = 18 + v * 0.2; }, destroy: bag.dispose };
}

hairline({
  name: "winepress",
  means: "A wine press: the long crank bar on top of the screw turns to face the pointer round the basket.",
  rules: [1, 3, 5, 8],
  range: [0, 20, 60],
  tour: [[324, 250], [76, 250], [200, 300], null],
  mount,
});
