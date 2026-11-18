/**
 * Timpani: a copper kettle on three legs with a foot pedal, its head held by
 * a counterhoop and tension rods, two mallets resting on the head. The
 * pointer over the drum presses the pedal: the head rises on its rods to
 * tune up and both mallets swing high to strike, staggered. At rest the
 * pedal stands raised, bright. The slider is how far the head and mallets go.
 *
 * The pattern: one object answering as a whole; the hit is on the ground plane.
 */
const {
  Cam, circ, clamp, fit, facing, hull, open, poly, prism, proj, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 34, RZ = 58, L = 52, S = 2.45;
const SQ = Math.SQRT1_2;
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
function ring3(c, a, r, n = 16) {
  const h = Math.abs(a[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0];
  let u = [a[1] * h[2] - a[2] * h[1], a[2] * h[0] - a[0] * h[2], a[0] * h[1] - a[1] * h[0]];
  const lu = Math.hypot(...u); u = u.map((q) => q / lu);
  const v = [a[1] * u[2] - a[2] * u[1], a[2] * u[0] - a[0] * u[2], a[0] * u[1] - a[1] * u[0]];
  return Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2, c1 = Math.cos(t) * r, s1 = Math.sin(t) * r; return [0, 1, 2].map((j) => c[j] + u[j] * c1 + v[j] * s1); });
}
const cyl = (a, b, r0, r1) => { const d = sub(b, a), l = Math.hypot(...d), ax = d.map((q) => q / l); return ring3(a, ax, r0).concat(ring3(b, ax, r1)); };
const ball = (c, r) => { let o = []; for (let i = -3; i <= 3; i++) { const z = (i / 3) * r; o = o.concat(ring3([c[0], c[1], c[2] + z], [0, 0, 1], Math.sqrt(Math.max(0, r * r - z * z)) + 0.01, 14)); } return o; };
const ANG = [Math.PI / 4 - 0.55, Math.PI / 4 + 0.55];
const BUTT = ANG.map((a) => [Math.cos(a) * (R + 30), Math.sin(a) * (R + 30), RZ + 10]);
const DROP = Math.asin(9 / L);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, S);
  fit(C, [[-R - 4, -R - 4, 0], [R + 34, R + 34, 0], [R + 4, -R - 4, 0], [-R - 4, R + 4, 0], [0, 0, RZ + 16], [-10, -10, RZ + 10 + L * 0.7 + 6], [BUTT[0][0], BUTT[0][1], RZ + 10 + L * 0.7], [BUTT[1][0], BUTT[1][1], RZ + 10 + L * 0.7]], 200, 170);
  const P = proj(C), front = facing(C);
  const pp = (pts) => pts.map((q) => P(...q));
  const g = mk("g", {}, svg);
  // legs and casters, away from the pedal side
  for (const a of [Math.PI / 4 + 2.1, Math.PI / 4 + Math.PI, Math.PI / 4 - 2.1]) {
    const foot = [Math.cos(a) * 30, Math.sin(a) * 30, 4];
    mk("path", { d: poly(hull(pp(cyl([Math.cos(a) * 8, Math.sin(a) * 8, 22], foot, 2, 2)))), class: "sil" }, g);
    mk("path", { d: poly(hull(pp(ball(foot, 4)))), class: "sil" }, g);
  }
  // the pedal: a footplate hinged at its back end, on a strut under the kettle
  mk("path", { d: poly(hull(pp(cyl([0, 0, 22], [SQ * 10, SQ * 10, 4], 2.2, 2.2)))), class: "sil" }, g);
  const pedal = mk("path", { class: "sil" }, g);
  // the kettle: a deep bowl, hull of its rings
  const bowl = [];
  for (let i = 0; i <= 8; i++) { const t = i / 8, r = 9 + (R - 9) * Math.sin((t * Math.PI) / 2), z = 20 + (RZ - 20) * Math.pow(t, 0.7); bowl.push(...pp(circ(r, 40).map((q) => [q.u, q.v, z]))); }
  mk("path", { d: poly(hull(bowl)), class: "sil" }, g);
  const arc = [];
  for (let i = 0; i <= 20; i++) { const a = Math.PI / 4 - 1.3 + (i / 20) * 2.6; arc.push(P(Math.cos(a) * (R - 1.5), Math.sin(a) * (R - 1.5), RZ - 9)); }
  mk("path", { d: open(arc), class: "nf lo" }, g);
  const rods = mk("path", { class: "nf" }, g);
  const hoop = solid(g);
  const mallets = BUTT.map((b) => {
    const grp = mk("g", {}, g);
    return { b, body: mk("path", { class: "sil" }, grp), tip: mk("path", { class: "sil" }, grp), up: tween(0) };
  });
  const press = tween(0);
  let last = "";

  function draw(now) {
    const p = tval(press, now), a = mallets.map((m) => tval(m.up, now)), key = p + "," + a.join() + amp;
    if (key === last) return;
    last = key;
    const lift = p * amp * 12, hz = RZ + lift;
    // pedal tilts down from 16° as the head rises
    const tilt = (1 - p * clamp(amp + 0.2, 0, 1)) * 0.3, d = [SQ, SQ], n = [-SQ, SQ];
    const pt = (s, w, h) => [d[0] * (10 + s * Math.cos(tilt)) + n[0] * w, d[1] * (10 + s * Math.cos(tilt)) + n[1] * w, 3 + s * Math.sin(tilt) + h];
    const plate = [];
    for (const s of [0, 24]) for (const w of [-7, 7]) for (const h of [0, 2.5]) plate.push(P(...pt(s, w, h)));
    pedal.setAttribute("d", poly(hull(plate)));
    let rd = "";
    for (let i = 0; i < 5; i++) {
      const q = Math.PI / 4 - 1.2 + i * 0.6, c = Math.cos(q), s = Math.sin(q);
      const lo = P(c * (R + 1.5), s * (R + 1.5), RZ - 12), hi = P(c * (R + 1.5), s * (R + 1.5), hz + 1);
      rd += `M${lo[0]},${lo[1]}L${hi[0]},${hi[1]}`;
    }
    rods.setAttribute("d", rd);
    put(hoop, prism(P, front, circ(R + 2.5, 48), circ(R + 0.5, 48), hz - 2, hz + 2));
    mallets.forEach((m, k) => {
      const e = -DROP + a[k] * amp * 0.9, dir = [-Math.cos(ANG[k]) * Math.cos(e), -Math.sin(ANG[k]) * Math.cos(e), Math.sin(e)];
      const tip = [0, 1, 2].map((j) => m.b[j] + dir[j] * L + (j === 2 ? lift * (1 - a[k]) : 0));
      m.body.setAttribute("d", poly(hull(pp(cyl(m.b, tip, 1.8, 1.4)))));
      m.tip.setAttribute("d", poly(hull(pp(ball(tip, 5.5)))));
    });
  }

  const B = register(stage, (_dt, now) => { draw(now); return !(tdone(press, now) && mallets.every((m) => tdone(m.up, now))); });
  bag.add(B.unregister);

  let act = -2;
  function setActive(on) {
    const id = on ? 1 : -1;
    if (id === act) return;
    act = id;
    const now = performance.now();
    tset(press, on ? 1 : 0, now, 0);
    mallets.forEach((m, k) => tset(m.up, on ? 1 : 0, now, on ? 60 + k * 60 : 0));
    pedal.classList.toggle("hi", !on);
    hoop.sil.classList.toggle("hi", on);
    read.textContent = on ? "+" + Math.round(amp * 12) + " mm" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0), [u, v] = unproj(C, p[0], p[1], RZ); setActive(Math.hypot(x - 6, y - 6) < R + 34 || Math.hypot(u, v) < R + 8); },
    leave: () => setActive(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = clamp(v, 0.2, 1); last = ""; if (act > 0) read.textContent = "+" + Math.round(amp * 12) + " mm"; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "timpani",
  means: "A timpani kettle with a foot pedal: the pointer presses the pedal, the head rises on its rods and both mallets swing up to strike.",
  rules: [1, 2, 4, 5],
  range: [0.3, 0.75, 1],
  tour: [[200, 110], [200, 185], [240, 150], null],
  mount,
});
