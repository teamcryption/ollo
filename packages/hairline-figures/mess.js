/**
 * Mess tin: a rounded camping pan with a slotted handle hinged at its near
 * end. At rest the handle stands half folded over the tin, bright. The
 * pointer over the tin swings the handle out to lie level, ready to hold.
 * The slider is how far the handle opens.
 *
 * The pattern: one part swinging on a hinge.
 */
const {
  Cam, fit, facing, poly, prism, proj, rings, rrect, tdone, tset, tval, tween, rad, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const X1 = 56, Y1 = 34, H = 16, L = 52, W0 = 10, W1 = 24, REST = 35;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 3.2);
  fit(C, [[0, 0, 0], [X1 + L, Y1, 0], [X1, Y1, 0], [0, Y1, 0], [X1, 0, H + L], [0, 0, H]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [ring, inner] = rings(0, 0, X1, Y1, 8, 2);
  put(solid(g), prism(P, front, ring, inner, 0, H));
  // the hinge lug on the near end
  const [lr, li] = rings(X1 - 2, W0 + 1, X1 + 3, W1 - 1, 2, 0.8);
  put(solid(g), prism(P, front, lr, li, H - 4, H + 1));
  const hg = mk("g", {}, g);
  const plate = mk("path", { class: "sil" }, hg), slot = mk("path", { class: "nf lo" }, hg);
  const outer = rrect(0, W0, L, W1, 5, 4), hole = rrect(14, W0 + 4, L - 7, W1 - 4, 2.5, 4);
  const ang = tween(REST);
  let last = NaN;

  function at(s, th) {
    const c = Math.cos(rad(th)), sn = Math.sin(rad(th));
    return P(X1 - s.u * c, s.v, H + 1 + s.u * sn);
  }
  function draw(th) {
    if (th === last) return;
    last = th;
    plate.setAttribute("d", poly(outer.map((s) => at(s, th))));
    slot.setAttribute("d", poly(hole.map((s) => at(s, th))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -8 && x < X1 + L + 4 && y > -8 && y < Y1 + 8;
  }
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(ang, a ? open : REST, performance.now(), 0);
    plate.classList.add("hi");
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { tset(ang, v, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "mess",
  means: "A mess tin whose slotted handle stands half folded at rest and swings out level when the pointer comes over the tin.",
  rules: [1, 5, 6, 8],
  range: [120, 175, 180],
  tour: [[180, 149], [200, 190], [166, 137], null],
  mount,
});
