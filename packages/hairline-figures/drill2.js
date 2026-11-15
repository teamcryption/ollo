/**
 * Cordless drill: a drill standing on its battery, the grip rising to the
 * motor body, the chuck and bit at the nose. The pointer is what it aims at:
 * the drill swivels on its battery on a spring to point the bit there. At rest
 * it points off to one side, the chuck bright.
 */
const {
  Cam, facing, fit, prism, proj, rings, rrect, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const REST = -0.6, Z1 = 32, Z2 = 46;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.5);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([44 * Math.cos(a), 44 * Math.sin(a), Z2 - 4], [14 * Math.cos(a), 14 * Math.sin(a), 0]); }
  ext.push([0, 0, Z2 + 1]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const BAT = rings(-13, -9, 11, 9, 3, 1.2), GRIP = [rrect(-6, -4.5, 4, 4.5, 3, 4), null];
  const BODY = rings(-14, -6.5, 20, 6.5, 5, 1.2), CHUCK = rings(20, -4, 30, 4, 2.4, 0.9);
  const bat = solid(g), grip = solid(g), body = solid(g), chuck = solid(g);
  const bit = mk("path", { class: "nf sil" }, g);
  chuck.sil.classList.add("hi");

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, nose = null;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const T = (r) => r && turn(r, a);
    put(bat, prism(P, front, T(BAT[0]), T(BAT[1]), 0, 9));
    put(grip, prism(P, front, T(GRIP[0]), null, 9, Z1 + 1));
    put(body, prism(P, front, T(BODY[0]), T(BODY[1]), Z1, Z2));
    put(chuck, prism(P, front, T(CHUCK[0]), T(CHUCK[1]), Z1 + 3, Z2 - 3));
    const c = Math.cos(a), s = Math.sin(a), zc = (Z1 + Z2) / 2;
    bit.setAttribute("d", seg(P(30 * c, 30 * s, zc), P(44 * c, 44 * s, zc)));
    const away = c + s < 0;
    if (away !== nose) {
      nose = away;
      if (away) { body.g.before(chuck.g); chuck.g.before(bit); } else { body.g.after(chuck.g); chuck.g.after(bit); }
    }
  }
  draw();

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aim(t, live) {
    sp.t = sp.t + wrap(t - sp.t);
    const d = Math.round(((t * 180) / Math.PI + 360) % 360);
    read.textContent = live ? String(d).padStart(3, "0") + "°" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      if (r < 8 || r > 90) { aim(r < 8 ? sp.t : REST, r < 8); return; }
      aim(Math.atan2(y, x), true);
    },
    leave: () => aim(REST, false),
  }));
  bag.add(() => svg.replaceChildren());
  read.textContent = "rest";
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "drill2",
  means: "A cordless drill on its battery: it swivels on a spring to aim its chuck and bit at the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[348, 281], [200, 182], [52, 281], null],
  mount,
});
