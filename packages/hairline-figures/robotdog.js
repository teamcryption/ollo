/**
 * Robot dog: a quadruped on four jointed legs, a long body, a blocky head on
 * a pivot and a short antenna tail. The pointer is a hand held out: the dog
 * lifts its head and raises its near front paw to shake it, tail up. At rest
 * it sniffs the ground, head low, the beacon on its back the bright mark.
 * The slider is how high the paw and head come up.
 *
 * The pattern: one answer on a spring; the hit is the rest pose's screen box.
 */
const {
  Cam, circ, facing, fit, hull, open, poly, proj, rings, run, seg, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, register, solid,
} = HL;

const disc = (x, y, r) => circ(r, 14).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const LEGS = [[-13, -6], [13, -6], [-13, 6], [13, 6]];
const HIP = 19, KNEE = 9;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 4.4);
  fit(C, [[-26, -9, 0], [34, 9, 0], [-26, 9, 0], [34, -9, 0], [-26, 0, 38], [34, 0, 44], [36, 6, 22]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const leg = () => { const grp = mk("g", {}, g); return { grp, a: mk("path", { class: "sil" }, grp), b: mk("path", { class: "sil" }, grp), knee: flatDot(grp, C, 1.2, "dot off") }; };
  const legs = LEGS.map(([x, y]) => ({ x, y, ...leg() }));
  const BODY = rings(-18, -8, 18, 8, 4, 1.4), HEAD = rings(14, -6.5, 30, 6.5, 3.2, 1.3);
  const body = solid(g);
  const tail = mk("path", { class: "nf sil" }, g), tip = flatDot(g, C, 1.3, "dot off");
  const beacon = flatDot(g, C, 1.8, "dot");
  const head = solid(g), eye = mk("path", { class: "nf lo" }, g), ear = mk("path", { class: "nf sil" }, g);
  // the near legs go in front of the body's lower edge, the far ones behind it
  g.prepend(legs[0].grp, legs[1].grp);
  g.insertBefore(legs[2].grp, body.g); g.insertBefore(legs[3].grp, head.g);

  // a solid from a ring and its crease ring, both carried through T
  const box = (ring, inner, z0, z1, T) => {
    const pts = [];
    for (const z of [z0, z1]) for (const q of ring) pts.push(P(...T(q.u, q.v, z)));
    return { sil: poly(hull(pts)), cr: open(run(inner, front).map((q) => P(...T(q.u, q.v, z1)))) };
  };
  const bar = (a, b, r) => {
    const pts = [];
    for (const [x, y, z] of [a, b]) for (const q of disc(x, y, r)) pts.push(P(q.u, q.v, z));
    return poly(hull(pts));
  };
  const S = (s, d) => { s.sil.setAttribute("d", d.sil); s.cr.setAttribute("d", d.cr); };
  S(body, box(BODY[0], BODY[1], 17, 25, (x, y, z) => [x, y, z]));
  place(beacon, P(-6, 0, 25));

  const sp = spring(0);
  let drawn = NaN;
  function draw() {
    const t = sp.x;
    if (Math.abs(t - drawn) < 1e-4) return;
    drawn = t;
    // the near front paw swings forward and up about its hip
    for (const L of legs) {
      const lift = L === legs[3] ? t * 1.5 : 0, bend = L === legs[3] ? t * 0.3 : 0;
      const hip = [L.x, L.y, L === legs[3] ? 18 : HIP];
      const kn = [L.x + 2 + Math.sin(lift) * (HIP - KNEE), L.y, HIP - Math.cos(lift) * (HIP - KNEE)];
      const la = lift - 0.25 - bend;
      const ft = [kn[0] + Math.sin(la) * KNEE, L.y, Math.max(0.8, kn[2] - Math.cos(la) * KNEE)];
      L.a.setAttribute("d", bar(hip, kn, 2.1));
      L.b.setAttribute("d", bar(kn, ft, 1.7));
      place(L.knee, P(...kn));
    }
    // the head pitches about its neck: low at rest, raised as it answers
    const ph = -0.22 + t * 0.75, c = Math.cos(ph), s = Math.sin(ph);
    const T = (x, y, z) => { const dx = x - 15, dz = z - 25; return [15 + dx * c - dz * s, y, 25 + dx * s + dz * c]; };
    S(head, box(HEAD[0], HEAD[1], 21, 31, T));
    eye.setAttribute("d", seg(P(...T(30, -4, 27.5)), P(...T(30, 4, 27.5))));
    ear.setAttribute("d", seg(P(...T(17, -3, 31)), P(...T(14, -3, 36))) + seg(P(...T(17, 3, 31)), P(...T(14, 3, 36))));
    const ta = 0.6 + t * 0.7, te = [-18 - Math.cos(ta) * 10, 0, 23 + Math.sin(ta) * 10];
    tail.setAttribute("d", seg(P(-18, 0, 23), P(...te)));
    place(tip, P(...te));
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  const box0 = [P(-26, 0, 20)[0], P(34, 0, 20)[0], P(0, 0, 40)[1] - 20, P(0, 0, 0)[1] + 30];
  let on = false;
  function setOn(v) {
    on = v;
    sp.t = on ? clamp(amp, 0, 1) : 0;
    head.sil.classList.toggle("hi", on);
    legs[3].a.classList.toggle("hi", on); legs[3].b.classList.toggle("hi", on);
    beacon.setAttribute("class", on ? "dot off" : "dot");
    read.textContent = on ? "paw" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: ([sx, sy]) => setOn(sx > box0[0] - 10 && sx < box0[1] + 10 && sy > box0[2] && sy < box0[3]),
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  setOn(false);
  return {
    set: (v) => { amp = v; if (on) { sp.t = clamp(amp, 0, 1); B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "robotdog",
  means: "A robot dog on four jointed legs: offered the pointer it lifts its head and raises a front paw to shake; at rest it sniffs the ground.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1],
  tour: [[256, 149], [275, 139], [180, 150], null],
  mount,
});
