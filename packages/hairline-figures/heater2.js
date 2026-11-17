/**
 * Oil heater: an oil-filled column heater, a bank of rounded fins on two
 * castor feet, a control box at one end with a round dial on top. The
 * pointer over the heater tips it back onto its rear castors, as a hand
 * does to wheel it away; leaving sets it down. At rest the dial is bright.
 * The slider is how far it tips.
 */
const {
  Cam, circ, fit, hull, poly, proj, rad, rings, clamp, tset, tval, tdone, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const Y0 = -10, REST = 4, N = 7, V = [0.61, 0.61, 0.5];
const rot = (a) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return ([x, y, z]) => [x, Y0 + (y - Y0) * c - z * s, (y - Y0) * s + z * c]; };
function tsolid(P, [ring, inner], z0, z1, T) {
  const at = (z) => ring.map((q) => P(...T([q.u, q.v, z])));
  const a = T([0, 0, z0]), b = T([0, 0, z1]);
  const up = (b[0] - a[0]) * V[0] + (b[1] - a[1]) * V[1] + (b[2] - a[2]) * V[2] >= 0;
  return { sil: poly(hull(at(z0).concat(at(z1)))), crease: poly(inner.map((q) => P(...T([q.u, q.v, up ? z1 : z0])))) };
}
const disc = (x, y, r) => circ(r, 28).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.15);
  const ext = [];
  for (const a of [0, 30]) for (const x of [0, 82]) for (const y of [Y0, 46]) for (const z of [0, 78]) ext.push(rot(a)([x, y, z]));
  fit(C, ext, 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const parts = [];
  const add = (r, z0, z1, hi) => { const s = solid(g); if (hi) s.sil.classList.add("hi"); parts.push({ s, r, z0, z1 }); };
  add(rings(6, Y0, 12, 46, 3, 1), 0, 5);
  add(rings(58, Y0, 64, 46, 3, 1), 0, 5);
  add(rings(2, 14, 80, 22, 3, 1), 5, 10);
  for (let i = 0; i < N; i++) add(rings(i * 10, 0, i * 10 + 7, 36, 3.5, 1), 9, 70 - (i % 2) * 0);
  add(rings(70, 4, 82, 32, 4, 1.2), 46, 72);
  add([disc(76, 18, 5), disc(76, 18, 3.5)], 72, 77, true);

  const ang = tween(REST);
  let last = NaN;
  function draw(a) {
    if (Math.abs(a - last) < 0.01) return;
    last = a;
    const T = rot(a);
    for (const p of parts) put(p.s, tsolid(P, p.r, p.z0, p.z1, T));
  }
  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  let on = null;
  function setOn(v) {
    if (v === on) return;
    on = v;
    tset(ang, on ? max : REST, performance.now(), 0);
    read.textContent = on ? Math.round(max) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    setOn(clamp(x, -8, 90) === x && clamp(y, Y0 - 6, 52) === y);
  }
  bag.add(pointer(stage, { move, leave: () => setOn(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; if (on) { on = null; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "heater2",
  means: "An oil-filled column heater on castor feet: the pointer tips it back onto its rear castors; leaving sets it down.",
  rules: [1, 3, 5, 8],
  range: [10, 20, 30],
  tour: [[169, 234], [196, 262], [150, 210], null],
  mount,
});
