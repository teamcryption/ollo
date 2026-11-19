/**
 * Twin bell alarm clock: a round clock on two feet, two bells on top and a
 * hammer between them. The pointer over the clock sets it ringing: the bells
 * swing out on their posts and the hammer throws over to one side. At rest
 * the hammer is bright. The slider is how far the bells swing.
 */
const { Cam, fit, proj, hull, poly, open, rad, tween, tset, tval, tdone, mk, pointer, register, disposer, solid } = HL;

const R = 24, CZ = 32, D = 9, BR = 13, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[-R - 26, 0, 0], [R + 26, 0, 0], [0, -D, 0], [0, D, 0], [0, 0, CZ + R + 30], [-R - 22, 0, CZ + R + 18], [R + 22, 0, CZ + R + 18]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const circXZ = (cx, y, cz, r, n = 40) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return P(cx + r * Math.cos(t), y, cz + r * Math.sin(t)); });
  // feet
  for (const s of [-1, 1]) {
    const f = solid(g), pts = [];
    for (const y of [-4, 4]) pts.push(...circXZ(s * 15, y, 7, 4, 16));
    pts.push(...circXZ(s * 19, 0, 2, 3, 12));
    f.sil.setAttribute("d", poly(hull(pts)));
  }
  // bells and hammer, behind the body
  const bells = [-1, 1].map((s) => ({ s, el: solid(g), post: mk("path", { class: "lo nf" }, g) }));
  const ham = solid(g);
  // body
  const body = solid(g);
  body.sil.setAttribute("d", poly(hull(circXZ(0, -D, CZ, R).concat(circXZ(0, D, CZ, R)))));
  body.cr.setAttribute("d", poly(circXZ(0, D, CZ, R - 3)));
  const c0 = P(0, D, CZ);
  mk("path", { class: "nf", d: open([P(0, D, CZ + 13), c0, P(10, D, CZ - 3)]) }, g);
  for (let i = 0; i < 12; i++) { const t = (i / 12) * 2 * Math.PI, q = P(17 * Math.cos(t), D, CZ + 17 * Math.sin(t)); mk("circle", { class: "dot off", r: 0.9, cx: q[0], cy: q[1] }, g); }
  mk("circle", { class: "dot m", r: 1.6, cx: c0[0], cy: c0[1] }, g);

  const sw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    for (const b of bells) {
      const ang = rad(a) * b.s, A = [Math.sin(ang), 0, Math.cos(ang)], U = [Math.cos(ang), 0, -Math.sin(ang)];
      const base = [b.s * 12, 0, CZ + R - 4], o = [base[0] + A[0] * 8, 0, base[2] + A[2] * 8];
      const at = (u, v, h) => P(o[0] + u * U[0] + h * A[0], v, o[2] + u * U[2] + h * A[2]);
      const pts = [];
      for (let i = 0; i <= 5; i++) { const ph = (i / 5) * Math.PI / 2, r = BR * Math.cos(ph) + 0.01, h = BR * 0.85 * Math.sin(ph); for (let j = 0; j < 24; j++) { const t = (j / 24) * 2 * Math.PI; pts.push(at(r * Math.cos(t), r * Math.sin(t), h)); } }
      b.el.sil.setAttribute("d", poly(hull(pts)));
      b.el.cr.setAttribute("d", poly(Array.from({ length: 24 }, (_, j) => { const t = (j / 24) * 2 * Math.PI; return at((BR - 1.5) * Math.cos(t), (BR - 1.5) * Math.sin(t), 1.2); })));
      b.post.setAttribute("d", open([P(...base), at(0, 0, 0)]));
    }
    const h = -rad(a) * 1.1, hp = [0, 0, CZ + R - 2], tip = [hp[0] + 24 * Math.sin(h), 0, hp[2] + 24 * Math.cos(h)];
    const pts = circXZ(tip[0], -3, tip[2], 4.5, 16).concat(circXZ(tip[0], 3, tip[2], 4.5, 16));
    const n = [Math.cos(h) * 1.4, 0, -Math.sin(h) * 1.4];
    pts.push(P(hp[0] + n[0], 0, hp[2] + n[2]), P(hp[0] - n[0], 0, hp[2] - n[2]));
    ham.sil.setAttribute("d", poly(hull(pts)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(sw, now)); return !tdone(sw, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(sw, v ? amp : REST, performance.now(), 0);
    for (const b of bells) b.el.sil.classList.toggle("hi", v);
    ham.sil.classList.toggle("hi", !v);
    read.textContent = v ? "ring " + Math.round(amp) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  const mid = P(0, 0, CZ + 8);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 100 && Math.abs(sy - mid[1]) < 110;
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "alarmclock2",
  means: "A twin bell alarm clock: the pointer sets it ringing, the bells swing out and the hammer throws over to one side.",
  rules: [1, 3, 5, 9],
  range: [20, 40, 55],
  tour: [[225, 92], [200, 150], [229, 170], null],
  mount,
});
