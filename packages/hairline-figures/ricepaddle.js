/**
 * Rice cooker: a round warmer body on short feet, a hinged domed lid with a
 * knob, a steam vent and a front latch. The pointer over the cooker swings
 * the lid open about its back hinge; how far it opens follows the pointer
 * from the front to the back. At rest the lid sits ajar, bright.
 *
 * The pattern: one part swinging on a hinge, hit on the ground plane.
 */
const {
  Cam, circ, clamp, facing, fit, hull, poly, prism, proj, rings, ringAt, seg, spring, stepS, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 30, H = 30, LH = 14, REST = 0.22, MAXA = 1.75;
const disc = (x, y, r, n = 44) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let reach = value / 100;
  const C = Cam(45, 0.5, 2.92);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, -R - 16, H + 2 * R], [0, 0, H + LH + 8]], 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = [disc(0, 0, R), disc(0, 0, R - 2)];
  put(solid(g), prism(P, front, br, bi, 0, H));
  mk("path", { class: "nf lo", d: poly(ringAt(P, disc(0, 0, R - 5), H)) + seg(P(R * 0.7, R * 0.7, 8), P(R * 0.7, R * 0.7, 16)) }, g);
  const lid = mk("path", { class: "sil" }, g), lidRim = mk("path", { class: "nf lo" }, g), knob = mk("path", { class: "nf" }, g);
  const yh = -R, zh = H;
  function rot([x, y, z], a) {
    const dy = y - yh, dz = z - zh;
    return [x, yh + dy * Math.cos(a) - dz * Math.sin(a), zh + dy * Math.sin(a) + dz * Math.cos(a)];
  }
  const dome = [];
  for (let i = 0; i <= 5; i++) { const t = (i / 5) * (Math.PI / 2); for (const q of disc(0, 0, R * Math.cos(t) + 0.01, 32)) dome.push([q.u, q.v, H + 1 + LH * Math.sin(t)]); }
  const rim = disc(0, 0, R, 44).map((q) => [q.u, q.v, H + 1]);
  const kn = [];
  for (const q of disc(0, R * 0.25, 5, 16)) { kn.push([q.u, q.v, H + LH]); kn.push([q.u, q.v, H + LH + 5]); }
  const ang = spring(REST, { k: 90, c: 16 });
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    lid.setAttribute("d", poly(hull(dome.map((p) => P(...rot(p, a))))));
    lidRim.setAttribute("d", poly(rim.map((p) => P(...rot(p, a)))));
    knob.setAttribute("d", poly(hull(kn.map((p) => P(...rot(p, a))))));
  }
  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);
  function move([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0);
    if (Math.hypot(x, y) > R + 14) return leave();
    const t = clamp((x + y + R * 1.4) / (R * 2.8), 0, 1);
    ang.t = REST + (0.35 + 0.65 * t) * (MAXA - REST) * (0.4 + 0.6 * reach);
    lid.classList.add("hi");
    read.textContent = Math.round((ang.t * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; lid.classList.add("hi"); read.textContent = "rest"; B.wake(); }
  leave();
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { reach = v / 100; }, destroy: bag.dispose };
}

hairline({
  name: "ricepaddle",
  means: "A rice warmer: the lid swings open on its back hinge, wider as the pointer moves toward the front of the cooker.",
  rules: [1, 3, 5, 8],
  range: [0, 100, 100],
  tour: [[200, 233], [200, 265], [200, 295], null],
  mount,
});
