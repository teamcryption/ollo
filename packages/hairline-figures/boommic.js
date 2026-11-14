/**
 * Boom mic: a weighted stand with a post, a boom pivoting on its top with a
 * counterweight behind, and a microphone hanging from the boom's far end on
 * a short cord. The boom swings round the post to hang the mic over the
 * pointer, its spot marked on the floor by a dashed drop. At rest it leans
 * out to one side, the mic bright. The slider is how far the boom reaches.
 *
 * The pattern: one part turning to face the pointer (aim).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, unproj, rings, ringAt, seg, clamp, lerp, rad, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const PZ = 72, A0 = rad(-15), A1 = rad(105), REST = rad(15);
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  const ext = [[-16, -16, 0], [16, 16, 0], [0, 0, PZ + 14]];
  for (let a = A0; a <= A1 + 1e-6; a += (A1 - A0) / 6) ext.push([80 * Math.cos(a), 80 * Math.sin(a), PZ + 12], [80 * Math.cos(a), 80 * Math.sin(a), 0]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [br, bi] = rings(-14, -14, 14, 14, 14, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, 4));
  const spot = flatDot(g, C, 2.4, "dot m");
  const back = solid(g), weight = solid(g);
  put(solid(g), prism(P, front, disc(0, 0, 2.4, 16), disc(0, 0, 1.4, 16), 4, PZ));
  put(solid(g), prism(P, front, disc(0, 0, 3.4, 16), disc(0, 0, 2.4, 16), PZ - 3, PZ + 3));
  const boom = solid(g);
  const drop = mk("path", { class: "dash nf" }, g);
  const cord = mk("path", { class: "nf lo" }, g);
  const mic = solid(g);
  mic.sil.classList.add("hi");

  const ang = spring(REST), len = spring(lerp(48, 72, value));
  let last = "";
  const rod = (a, b, r) => hull([a, b].flatMap(([x, y, z]) => ringAt(P, disc(x, y, r, 12), z - r).concat(ringAt(P, disc(x, y, r, 12), z + r))));

  function draw() {
    const a = ang.x, L = len.x, key = a.toFixed(4) + L.toFixed(3);
    if (key === last) return;
    last = key;
    const c = Math.cos(a), s = Math.sin(a);
    const tip = [L * c, L * s, PZ + 10], tail = [-16 * c, -16 * s, PZ - 2];
    back.sil.setAttribute("d", poly(rod([0, 0, PZ], tail, 1.4)));
    weight.sil.setAttribute("d", poly(rod([tail[0] * 0.8, tail[1] * 0.8, PZ - 2], [tail[0] * 1.1, tail[1] * 1.1, PZ - 2.6], 3.6)));
    boom.sil.setAttribute("d", poly(rod([0, 0, PZ], tip, 1.2)));
    const mz = PZ + 2, mb = mz - 18;
    cord.setAttribute("d", "M" + P(tip[0], tip[1], tip[2]).join(",") + "L" + P(tip[0], tip[1], mz).join(","));
    put(mic, prism(P, front, disc(tip[0], tip[1], 3.6), disc(tip[0], tip[1], 2.4), mb, mz));
    drop.setAttribute("d", seg(P(tip[0], tip[1], mb), P(tip[0], tip[1], 0)));
    place(spot, P(tip[0], tip[1], 0));
  }

  const B = register(stage, (dt) => {
    const m = stepS(ang, dt) | stepS(len, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);

  function aim(p) {
    const [wx, wy] = unproj(C, p[0], p[1], 0);
    if (Math.hypot(wx, wy) < 6) return;
    let a = Math.atan2(wy, wx);
    if (a < -Math.PI * 0.75) a += Math.PI * 2;
    ang.t = clamp(a, A0, A1);
    read.textContent = Math.round((ang.t * 180) / Math.PI) + "°";
    B.wake();
  }
  function leave() { ang.t = REST; read.textContent = "rest"; B.wake(); }
  leave();
  draw();
  bag.add(pointer(stage, { move: aim, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { len.t = lerp(48, 72, v); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "boommic",
  means: "A boom mic on a weighted stand: the boom swings round its post to hang the microphone over the pointer.",
  rules: [1, 3, 5, 8],
  range: [0, 0.5, 1],
  tour: [[148, 269], [250, 255], [300, 215], null],
  mount,
});
