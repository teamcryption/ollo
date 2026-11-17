/**
 * Meat slicer: a deli slicer, a heavy base with a round blade standing on it
 * under its guard, and a carriage in front of the blade carrying a block of
 * ham against it. The pointer pushes the carriage: it slides along its track
 * to follow the pointer, past the blade and back, on one spring. At rest the
 * carriage waits at the near end, the blade's guard bright. The slider is
 * how far the carriage may travel.
 *
 * The pattern: a continuous aim on one value; the hit is on the floor's
 * plane, which never moves.
 */
const {
  Cam, clamp, fit, poly, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 14, BY = 26, BZ = 30, R = 20, REST = 30;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[0, -14, 0], [44, -14, 0], [44, 66, 0], [0, 66, 0], [BX, BY, BZ + R + 3], [36, -14, 30], [36, 66, 30]], 200, 166);
  const P = proj(C), front = HL.facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, 44, 52, 8, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, 10));
  // the blade's post and the round blade in its guard, standing in the plane x = BX
  put(solid(g), prism(P, front, rings(BX - 6, BY - 5, BX, BY + 5, 2, 0.8)[0], null, 10, BZ));
  const disc = (r, x) => { const p = []; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; p.push(P(x, BY + r * Math.cos(a), BZ + r * Math.sin(a))); } return p; };
  const guard = mk("path", { class: "sil", d: poly(disc(R + 2.5, BX - 1.5)) }, g);
  mk("path", { class: "sil", d: poly(disc(R + 2.5, BX)) }, g);
  mk("path", { class: "nf lo", d: poly(disc(R - 3, BX)) + poly(disc(4, BX)) + seg(P(BX, BY - R, BZ), P(BX, BY - R - 4, BZ - 6)) }, g);
  // the track along y, in front of the blade
  mk("path", { class: "nf lo", d: seg(P(40, -12, 10), P(40, 64, 10)) + seg(P(22, -12, 10), P(22, 64, 10)) }, g);
  const cart = mk("g", {}, g), tray = solid(cart), ham = solid(cart), push = solid(cart);
  const hamFace = mk("path", { class: "nf lo" }, cart);
  const sp = spring(REST);
  let drawn = NaN;

  function draw(s) {
    if (Math.abs(s - drawn) < 1e-3) return;
    drawn = s;
    const [tr, ti] = rings(18, s - 12, 42, s + 12, 3, 1);
    put(tray, prism(P, front, tr, ti, 10, 13));
    const [hr, hi] = rings(BX + 2, s - 9, 34, s + 9, 6, 1.4);
    put(ham, prism(P, front, hr, hi, 13, 34));
    // the meat's grain on its cut face
    hamFace.setAttribute("d", seg(P(BX + 2, s - 4, 18), P(BX + 2, s + 4, 26)) + seg(P(BX + 2, s - 1, 16), P(BX + 2, s + 6, 21)));
    const [pr, pi] = rings(34, s - 6, 40, s + 6, 2, 0.8);
    put(push, prism(P, front, pr, pi, 13, 40));
  }

  const L = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(L.unregister);

  function set(y) {
    const on = y !== null;
    sp.t = on ? clamp(y, 26 - 26 * reach, 26 + 26 * reach) : REST;
    guard.classList.toggle("hi", !on);
    ham.sil.classList.toggle("hi", on);
    read.textContent = on ? "pos " + Math.round(sp.t) : "rest";
    L.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      set(x > -10 && x < 60 && y > -24 && y < 76 ? y : null);
    },
    leave: () => set(null),
  }));
  bag.add(() => svg.replaceChildren());
  set(null);
  return { set: (v) => { reach = v; }, destroy: bag.dispose };
}

hairline({
  name: "meatslicer",
  means: "A deli meat slicer: the carriage with its block of ham slides along its track past the round blade, following the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.4, 0.8, 1],
  tour: [[249, 172], [200, 215], [167, 250], null],
  mount,
});
