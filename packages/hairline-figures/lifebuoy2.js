/**
 * Throw line bag: a rescue throw bag hung by its rope from the arm of a
 * dockside post, a padded cylinder with a drawstring collar and a reflective
 * band. The pointer over the bag swings it out from the post on the discrete
 * clock, ready to throw. At rest it hangs with a slight lean, its collar
 * bright. The slider is how far it swings.
 */
const {
  Cam, fit, facing, hull, poly, prism, proj, rings, seg, tset, tval, tdone, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PZ = 100, PX = -26, R = 13, H0 = 12, H1 = 52, REST = 8;
const rad = (d) => (d * Math.PI) / 180;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value / 100;
  const C = Cam(45, 0.5, 2.55);
  fit(C, [[PX - 12, -14, 0], [PX + 12, 14, 0], [0, -R, PZ + 6], [0, R, PZ + 6], [H1 * 0.8 + R, R, PZ - H1 * 0.6], [-R, 0, PZ - H1]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(PX - 12, -14, PX + 12, 14, 5, 1.8);
  put(solid(g), prism(P, front, br, bi, 0, 3));
  const [pr, pi] = rings(PX - 3, -3, PX + 3, 3, 2.5, 0.8);
  put(solid(g), prism(P, front, pr, pi, 3, PZ + 6));
  const [ar, ai] = rings(PX - 3, -2.5, 4, 2.5, 2, 0.8);
  put(solid(g), prism(P, front, ar, ai, PZ + 2, PZ + 6));
  const rope = mk("path", { class: "nf" }, g);
  const body = solid(g), band = mk("path", { class: "nf lo" }, g), collar = mk("path", { class: "nf" }, g);
  const ang = tween(REST);
  let last = NaN;
  function ring(th, h, r) {
    const s = Math.sin(rad(th)), c = Math.cos(rad(th)), out = [];
    for (let i = 0; i < 36; i++) {
      const t = (i / 36) * 2 * Math.PI, cu = Math.cos(t) * r, cv = Math.sin(t) * r;
      out.push(P(h * s + cu * c, cv, PZ - h * c + cu * s));
    }
    return out;
  }
  function draw(th) {
    if (th === last) return;
    last = th;
    const s = Math.sin(rad(th)), c = Math.cos(rad(th));
    rope.setAttribute("d", seg(P(0, 0, PZ + 2), P(H0 * s, 0, PZ - H0 * c)) + seg(P(0, 0, PZ + 2), P((H0 + 1) * s - 3 * c, 0, PZ - (H0 + 1) * c - 3 * s)));
    const top = ring(th, H0 + 2, R - 1), bot = ring(th, H1, R), mid = ring(th, H0 + 5, R);
    body.sil.setAttribute("d", poly(hull(top.concat(mid, bot))));
    body.cr.setAttribute("d", poly(ring(th, H0 + 5, R - 1.5)));
    band.setAttribute("d", poly(hull(ring(th, 30, R + 0.2).concat(ring(th, 36, R + 0.2)))));
    collar.setAttribute("d", poly(hull(ring(th, H0, 5).concat(ring(th, H0 + 4, 7)))));
  }
  collar.classList.add("hi");
  body.cr.classList.add("lo");

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  // hit: the bag's rest outline on screen, which never moves
  const pts = ring(REST, H0, R).concat(ring(REST, H1, R));
  const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  const x0 = Math.min(...xs) - 10, x1 = Math.max(...xs) + 10, y0 = Math.min(...ys) - 10, y1 = Math.max(...ys) + 10;
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, v ? REST + 52 * amt : REST, performance.now(), 0);
    read.textContent = v ? "swing" : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: ([sx, sy]) => setOn(sx > x0 && sx < x1 && sy > y0 && sy < y1), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v / 100; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "lifebuoy2",
  means: "A rescue throw bag hung from a dockside post: the pointer over the bag swings it out on its rope, ready to throw.",
  rules: [1, 4, 5, 9],
  range: [30, 100, 100],
  tour: [[195, 138], [195, 160], [205, 110], null],
  mount,
});
