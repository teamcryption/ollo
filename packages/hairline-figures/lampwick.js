/**
 * Oil lamp: a round font on a foot, a brass collar and burner, a wick with
 * its flame, and a tall glass chimney with a bulb seated on the burner. The
 * pointer on the lamp lifts the chimney clear of the flame; leaving sets it
 * back, just off its seat. The slider is the lift.
 */
const { Cam, circ, fit, facing, hull, poly, prism, proj, ringAt, tset, tval, tdone, tween, disposer, mk, pointer, put, register, solid } = HL;

const ring = (r, n = 32) => circ(r, n);
const BZ = 40, LIFT = 30, REST = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.35);
  fit(C, [[-32, -32, 0], [32, 32, 0], [32, -32, 0], [-32, 32, 0], [0, 0, BZ + 56 + LIFT]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const lathe = (prof, z0 = 0) => { const pts = []; for (const [r, z] of prof) pts.push(...ringAt(P, ring(r), z0 + z)); return poly(hull(pts)); };
  put(solid(g), prism(P, front, ring(23), ring(21), 0, 4));
  const font = solid(g);
  font.sil.setAttribute("d", lathe([[21, 4], [30, 11], [32, 17], [25, 25], [12, 29]]));
  font.cr.setAttribute("d", poly(ringAt(P, ring(30), 17)));
  font.cr.setAttribute("class", "nf lo");
  put(solid(g), prism(P, front, ring(10), ring(8.6), 29, 35));
  put(solid(g), prism(P, front, ring(8), ring(6.8), 35, BZ));
  mk("path", { d: lathe([[1.4, BZ], [3.4, BZ + 5], [2.6, BZ + 9], [0.4, BZ + 15]]), class: "nf" }, g);
  const ch = mk("g", {}, g), bulb = solid(ch), neck = solid(ch);
  bulb.sil.classList.add("hi"); neck.sil.classList.add("hi");
  const tw = tween(REST);
  let last = NaN;
  function draw(z) {
    if (z === last) return;
    last = z;
    const z0 = BZ + z;
    bulb.sil.setAttribute("d", lathe([[7.5, 0], [12, 8], [14, 16], [12, 26], [7, 32]], z0));
    bulb.cr.setAttribute("d", "");
    put(neck, prism(P, front, ring(6.5), ring(5.2), z0 + 30, z0 + 56));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const l = P(-32, 32, 0)[0], r = P(32, -32, 0)[0], top = P(0, 0, BZ + 62)[1], bot = P(32, 32, 0)[1];
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(tw, v ? REST + (LIFT - REST) * lift : REST, performance.now(), 0);
    read.textContent = v ? "lifted" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > l && sx < r && sy > top && sy < bot + 6), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; if (on) { tset(tw, REST + (LIFT - REST) * lift, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "lampwick",
  means: "An oil lamp with a tall glass chimney: the pointer on the lamp lifts the chimney clear of the flame; leaving sets it back.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[200, 84], [200, 235], [240, 190], null],
  mount,
});
