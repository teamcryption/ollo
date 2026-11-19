/**
 * Automaton: a wooden box with a crank on its side and a bird on a post on
 * its lid. The pointer over the box turns the crank, and the bird tips on its
 * pivot and pecks down at the lid. At rest the bird sits head up, bright.
 * The slider is how deep the bird pecks.
 */
const {
  Cam, circ, fit, facing, hull, poly, open, prism, proj, rings, ringAt, rad, lerp, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 50, BY = 32, BZ = 24, PX = 25, PY = 16, PZ = BZ + 13, REST = -12;
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 3.0);
  fit(C, [[0, 0, 0], [BX + 14, BY, 0], [BX, 0, 0], [0, BY, 0], [PX - 26, PY, PZ + 22], [PX + 30, PY, PZ + 20]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(0, 0, BX, BY, 4, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, BZ));
  // the lid's thin plate
  const [lr, li] = rings(-2, -2, BX + 2, BY + 2, 5, 1.4);
  put(solid(g), prism(P, front, lr, li, BZ, BZ + 2.5));

  // crank wheel on the +x face
  const CX = BX, CY = PY, CZ = BZ / 2, WR = 8;
  const wheel = (x) => { const o = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; o.push(P(x, CY + WR * Math.cos(t), CZ + WR * Math.sin(t))); } return o; };
  mk("path", { d: poly(hull(wheel(CX).concat(wheel(CX + 2.5)))) }, g);
  mk("path", { d: poly(wheel(CX + 2.5)), class: "nf lo" }, g);
  const arm = mk("path", { class: "nf" }, g), knob = mk("path", { class: "sil" }, g);

  // the post the bird pivots on
  put(solid(g), prism(P, front, disc(PX, PY, 1.8, 16), disc(PX, PY, 1, 16), BZ + 2.5, PZ));

  const body = mk("path", { class: "sil" }, g), wing = mk("path", { class: "nf lo" }, g);
  const head = mk("path", { class: "sil" }, g), beak = mk("path", { class: "sil" }, g);
  const eye = mk("circle", { r: 1.6, class: "dot" }, g);

  // bird parts in local coordinates around the pivot: u forward, z up
  const rot = (u, y, z, a) => { const c = Math.cos(a), s = Math.sin(a); return P(PX + u * c + z * s, PY + y, PZ + z * c - u * s); };
  const blob = (sec, a) => { const o = []; for (const [u, r, z] of sec) for (let i = 0; i < 16; i++) { const t = (i / 16) * Math.PI * 2; o.push(rot(u, r * Math.cos(t), z + r * Math.sin(t) * 0.9, a)); } return o; };
  const BODY = [[-24, 2, 6], [-18, 6, 4], [-10, 10, 3], [0, 11, 3], [8, 9, 5], [13, 5, 9]];
  const HEAD = [[14, 5.5, 13], [18, 6.5, 14], [22, 5, 14]];

  const p = tween(0);
  let last = NaN;
  function draw(v) {
    if (v === last) return;
    last = v;
    const a = rad(lerp(REST, amp, v));
    body.setAttribute("d", poly(hull(blob(BODY, a))));
    wing.setAttribute("d", open([[-16, 9, 6], [-8, 10.5, 7], [2, 10.5, 6], [-4, 10, 1], [-14, 8, 2]].map(([u, y, z]) => rot(u, y, z, a))));
    head.setAttribute("d", poly(hull(blob(HEAD, a))));
    beak.setAttribute("d", poly(hull([rot(22, 1.6, 15.5, a), rot(22, -1.6, 15.5, a), rot(22, 0, 11.5, a), rot(32, 0, 13, a)])));
    const e = rot(19, 5.2, 16, a);
    eye.setAttribute("cx", e[0]); eye.setAttribute("cy", e[1]);
    const th = v * Math.PI * 1.5 + 0.6, hy = CY + 6 * Math.cos(th), hz = CZ + 6 * Math.sin(th);
    arm.setAttribute("d", poly(hull([P(CX + 3, CY + 1.5, CZ), P(CX + 3, CY - 1.5, CZ), P(CX + 3, hy + 1.5, hz), P(CX + 3, hy - 1.5, hz)])));
    const kn = []; for (let i = 0; i < 12; i++) { const t = (i / 12) * Math.PI * 2; kn.push(P(CX + 3, hy + 1.8 * Math.cos(t), hz + 1.8 * Math.sin(t)), P(CX + 11, hy + 1.8 * Math.cos(t), hz + 1.8 * Math.sin(t))); }
    knob.setAttribute("d", poly(hull(kn)));
  }

  const B = register(stage, (_dt, now) => { draw(tval(p, now)); return !tdone(p, now); });
  bag.add(B.unregister);

  const box = hull([P(0, 0, 0), P(BX + 12, 0, 0), P(BX + 12, BY, 0), P(0, BY, 0), P(0, 0, PZ + 16), P(BX + 12, BY, PZ + 16), P(BX + 12, 0, PZ + 16), P(0, BY, PZ + 16)]);
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const hit = ([sx, sy]) => sx > Math.min(...xs) && sx < Math.max(...xs) && sy > Math.min(...ys) && sy < Math.max(...ys);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(p, a ? 1 : 0, performance.now(), 0);
    knob.classList.toggle("hi", a);
    for (const el of [body, head, beak]) el.classList.toggle("hi", !a);
    read.textContent = a ? "peck" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (q) => setActive(hit(q)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "automaton",
  means: "A wooden automaton box: the pointer turns its side crank, and the bird on the lid tips forward on its pivot to peck.",
  rules: [1, 4, 5, 8],
  range: [15, 38, 55],
  tour: [[200, 127], [230, 200], [181, 84], null],
  mount,
});
