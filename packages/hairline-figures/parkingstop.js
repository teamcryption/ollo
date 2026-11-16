/**
 * Parking barrier: a fold-down parking post on its hinge plate, padlock at the
 * foot. Bring the pointer to it and the post folds flat on its hinge so a car
 * can pass; leave and it stands back up. The post is the bright mark.
 */
const { Cam, clamp, fit, hull, poly, proj, rings, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register, solid } = HL;

const H = 62, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.3);
  fit(C, [[-18, -14, 0], [18, 14, 0], [0, 0, H + 6], [H + 8, 6, 8], [H + 8, -6, 0]], 200, 166);
  const P = proj(C), g = mk("g", {}, svg);
  const body = (s, ring, inner, w0, w1, M) => {
    const a = ring.map((q) => P(...M(q.u, q.v, w0))), b = ring.map((q) => P(...M(q.u, q.v, w1)));
    s.sil.setAttribute("d", poly(hull(a.concat(b))));
    s.cr.setAttribute("d", poly(inner.map((q) => P(...M(q.u, q.v, w1)))));
  };
  const up = (u, v, w) => [u, v, w];
  const [br, bi] = rings(-18, -14, 18, 14, 4, 1.5);
  body(solid(g), br, bi, 0, 3, up);
  const [lr, li] = rings(-14, -11, -6, -3, 2, 0.8);
  body(solid(g), lr, li, 3, 9, up);
  const post = solid(g), band = mk("path", { class: "nf lo" }, post.g);
  post.sil.classList.add("hi");
  const [qr, qi] = rings(-4.5, -5, 4.5, 5, 2.2, 1);
  const tw = tween(REST);
  let last = NaN, on = false;
  function draw(now) {
    const ang = tval(tw, now);
    if (Math.abs(ang - last) < 0.02) return;
    last = ang;
    const r = (ang * Math.PI) / 180, c = Math.cos(r), s = Math.sin(r);
    const M = (u, v, w) => [u * c + w * s, v, 6 - u * s + w * c];
    body(post, qr, qi, 0, H, M);
    band.setAttribute("d", poly(qr.map((q) => P(...M(q.u, q.v, H - 14)))));
  }
  const B = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(B.unregister);
  const set = (o) => {
    on = o;
    tset(tw, o ? REST + 84 * amp : REST, performance.now(), 0);
    read.textContent = o ? "down" : "rest";
    B.wake();
  };
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      set(x > -30 && x < H + 20 && Math.abs(y) < 40);
    },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  draw(performance.now());
  return { set: (v) => { amp = v; if (on) set(true); }, destroy: bag.dispose };
}

hairline({
  name: "parkingstop",
  means: "A fold-down parking post on its hinge plate: bring the pointer near and it folds flat so a car can pass.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[163, 249], [256, 296], [200, 240], null],
  mount,
});
