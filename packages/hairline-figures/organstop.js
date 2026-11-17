/**
 * Organ stop: one draw-knob in a wooden jamb, a turned round knob on a long
 * shank. Over the figure the knob draws out of the jamb; at rest it sits
 * pushed in, its bright face toward the player. The slider is the draw.
 */
const { Cam, fit, proj, poly, hull, clamp, tset, tval, tdone, tween, disposer, mk, pointer, register } = HL;

const KZ = 34, KR = 14, SR = 5;
const FACES = [[0, 2, 3, 1], [4, 5, 7, 6], [0, 4, 6, 2], [1, 3, 7, 5], [0, 1, 5, 4], [2, 6, 7, 3]];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value;
  const C = Cam(45, 0.5, 2.95);
  fit(C, [[-10, -26, 0], [-10, 26, 0], [-10, -26, 70], [-10, 26, 70], [70, 0, KZ + KR], [70, 0, KZ - KR]], 200, 160);
  const P = proj(C);
  const area = (q) => { let s = 0; for (let i = 0; i < q.length; i++) { const a = q[i], b = q[(i + 1) % q.length]; s += a[0] * b[1] - b[0] * a[1]; } return s; };
  const up = Math.sign(area([[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map((p) => P(...p))));
  function box(x0, x1, y0, y1, z0, z1) {
    const c = [];
    for (let k = 0; k < 8; k++) c.push(P(k & 1 ? x1 : x0, k & 2 ? y1 : y0, k & 4 ? z1 : z0));
    return FACES.map((fc) => fc.map((i) => c[i])).filter((q) => Math.sign(area(q)) === up).map(poly).join("");
  }
  const ring = (x, r) => { const o = []; for (let i = 0; i < 36; i++) { const a = (i / 36) * 2 * Math.PI; o.push(P(x, r * Math.cos(a), KZ + r * Math.sin(a))); } return o; };
  const g = mk("g", {}, svg);
  mk("path", { d: box(-10, 0, -26, 26, 0, 70) }, g);
  mk("path", { d: poly(ring(0.1, SR + 4)), class: "nf lo" }, g);
  const shank = mk("path", {}, g), knob = mk("path", {}, g), face = mk("path", { class: "hi" }, g), bead = mk("path", { class: "nf lo" }, g);
  const t = tween(0);

  function draw(f) {
    const x = 8 + f * reach;
    shank.setAttribute("d", poly(hull(ring(0, SR).concat(ring(x, SR)))));
    knob.setAttribute("d", poly(hull(ring(x, KR - 3).concat(ring(x + 4, KR), ring(x + 12, KR)))));
    face.setAttribute("d", poly(ring(x + 12, KR)));
    bead.setAttribute("d", poly(ring(x + 12, KR - 5)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  const a = P(-10, 26, 0), b = P(62, -26, 70);
  const hit = ([sx, sy]) => sx > Math.min(a[0], b[0]) - 20 && sx < Math.max(a[0], b[0]) + 20 && sy > b[1] - 30 && sy < a[1] + 30;
  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(t, v ? 1 : 0, performance.now(), 0);
    read.textContent = v ? "on " + Math.round(reach) : "rest";
    B.wake();
  }
  setOn(false);
  bag.add(pointer(stage, { move: (p) => setOn(hit(p)), leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = clamp(v, 20, 40); draw(tval(t, performance.now())); }, destroy: bag.dispose };
}

hairline({
  name: "organstop",
  means: "An organ draw-knob in its jamb: under the pointer the round knob pulls out on its shank to sound the stop.",
  rules: [1, 3, 5],
  range: [20, 36, 40],
  tour: [[206, 155], [222, 175], [190, 125], null],
  mount,
});
