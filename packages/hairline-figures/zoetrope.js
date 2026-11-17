/**
 * Zoetrope: a slotted drum on a spindle and round foot. The pointer over it
 * lifts the drum on its spindle and turns it by where the pointer stands, the
 * slots sliding round the wall. At rest the drum sits turned a little, its
 * rim bright. The slider is how far it turns.
 */
const { Cam, circ, fit, poly, prism, proj, ringAt, hull, seg, spring, stepS, clamp, mk, pointer, put, register, solid, disposer, facing } = HL;

const R = 32, H = 38, BZ = 10, N = 12, SR = 16, L0 = 8;
const ring = (r, n = 56) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, 0, BZ + 26 + H + 4]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ring(SR + 8), ring(SR + 6), 0, 3));
  put(solid(g), prism(P, front, ring(SR), ring(SR - 2), 3, 5));
  const spin = solid(g);
  const drum = solid(g);
  const lip = mk("path", { class: "nf lo" }, g), slots = mk("path", { class: "nf" }, g);
  drum.sil.classList.add("hi");
  const lift = spring(L0), rot = spring(0.35);
  let last = "";

  function draw() {
    const z0 = BZ + 4 + lift.x, z1 = z0 + H, a = rot.x, key = z0.toFixed(2) + a.toFixed(3);
    if (key === last) return;
    last = key;
    put(spin, prism(P, front, ring(3, 16), ring(2, 16), 5, z0 + 2));
    put(drum, prism(P, front, ring(R), ring(R - 2), z0, z1));
    lip.setAttribute("d", poly(ringAt(P, ring(R - 2.5), z1)));
    let d = "";
    for (let i = 0; i < N; i++) {
      const t = a + (i / N) * Math.PI * 2, nu = Math.cos(t), nv = Math.sin(t);
      if (!front({ u: R * nu, v: R * nv, nu, nv })) continue;
      for (const dt of [-0.06, 0.06]) {
        const c = Math.cos(t + dt), s = Math.sin(t + dt);
        d += seg(P(R * c, R * s, z1 - 4), P(R * c, R * s, z1 - 20));
      }
    }
    slots.setAttribute("d", d);
  }

  const B = register(stage, (dt) => {
    const m1 = stepS(lift, dt), m2 = stepS(rot, dt);
    draw();
    return m1 || m2;
  });
  bag.add(B.unregister);
  draw();

  const c0 = P(0, 0, BZ + 4 + H / 2);
  function move([sx, sy]) {
    const on = Math.abs(sx - c0[0]) < 120 && Math.abs(sy - c0[1]) < 90;
    if (!on) return leave();
    const f = clamp((sx - c0[0]) / 110, -1, 1);
    lift.t = 22;
    rot.t = 0.35 + f * Math.PI * (0.4 + amt);
    read.textContent = "turn " + Math.round(f * 100);
    B.wake();
  }
  function leave() { lift.t = L0; rot.t = 0.35; read.textContent = "rest"; B.wake(); }
  read.textContent = "rest";
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; }, destroy: bag.dispose };
}

hairline({
  name: "zoetrope",
  means: "A slotted zoetrope drum on its spindle: the pointer lifts the drum and turns it, its slots sliding round the wall.",
  rules: [3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[141, 104], [246, 134], [259, 163], null],
  mount,
});
