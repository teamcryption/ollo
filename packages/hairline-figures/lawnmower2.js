/**
 * Lawn mower: a push mower with a deck, an engine cap, a grass box behind
 * and a long handle. The pointer over it pushes it: the whole mower rolls
 * forward on a spring, the wheels turning as it goes. At rest the deck is
 * bright. The slider is how far one push rolls it.
 *
 * The pattern: a single object on a spring (terrain's spring, on a slide).
 */
const {
  Cam, circ, fit, facing, hull, open, poly, prism, proj, rings, ringAt, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.15);
  fit(C, [[-46, -6, 0], [50 + 46, -6, 0], [50 + 46, 36, 0], [-46, 36, 0], [-44, 15, 56], [96, 15, 22]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const mkWheel = () => ({ s: mk("path", {}, g), h: mk("path", { class: "nf lo" }, g) });
  const wFar = [mkWheel(), mkWheel()];
  const box = solid(g), deck = solid(g), cap = solid(g);
  const handle = mk("path", { class: "nf" }, g), grip = mk("path", { class: "nf" }, g);
  const wNear = [mkWheel(), mkWheel()];
  deck.sil.classList.add("hi");

  function wheel(w, x, y, z, R, t, ang) {
    const a = disc(0, 0, R, 24).map((q) => P(x + q.u, y, z + q.v)), b = disc(0, 0, R, 24).map((q) => P(x + q.u, y + t, z + q.v));
    w.s.setAttribute("d", poly(hull(a.concat(b))));
    const yo = t > 0 ? y + t : y, c = Math.cos(ang) * R * 0.7, s = Math.sin(ang) * R * 0.7;
    w.h.setAttribute("d", seg(P(x - c, yo, z - s), P(x + c, yo, z + s)) + seg(P(x + s, yo, z - c), P(x - s, yo, z + c)));
  }
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const ang = o / 9;
    wheel(wFar[0], 6 + o, -4, 9, 9, 3, ang); wheel(wFar[1], 38 + o, -4, 7, 7, 3, ang);
    const [br, bi] = rings(-28 + o, 3, 0 + o, 27, 5, 1.6);
    put(box, prism(P, front, br, bi, 10, 30));
    const [dr, di] = rings(0 + o, 0, 46 + o, 30, 9, 2);
    put(deck, prism(P, front, dr, di, 4, 13));
    put(cap, prism(P, front, disc(25 + o, 15, 10), disc(25 + o, 15, 8.4), 13, 21));
    handle.setAttribute("d", seg(P(-2 + o, 5, 15), P(-44 + o, 5, 54)) + seg(P(-2 + o, 25, 15), P(-44 + o, 25, 54)));
    grip.setAttribute("d", poly(hull(ringAt(P, disc(-44 + o, 4, 1.6, 10), 54).concat(ringAt(P, disc(-44 + o, 26, 1.6, 10), 54)))));
    wheel(wNear[0], 6 + o, 30, 9, 9, 3, ang); wheel(wNear[1], 38 + o, 30, 7, 7, 3, ang);
  }

  const sp = spring(0);
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(sp.x); return m; });
  bag.add(B.unregister);
  draw(0);

  let on = false;
  function setOn(a) {
    on = a;
    sp.t = a ? reach : 0;
    read.textContent = a ? "push" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    return x > -46 && x < 50 && y > -8 && y < 38;
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v; if (on) { sp.t = v; B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "lawnmower2",
  means: "A push mower with a grass box and long handle: the pointer over it pushes it, and it rolls forward on turning wheels.",
  rules: [1, 3, 5, 8],
  range: [20, 36, 46],
  tour: [[197, 188], [162, 170], [228, 200], null],
  mount,
});
