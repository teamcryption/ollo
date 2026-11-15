/**
 * Street lamp: a cast base, a tall post, and a swing arm carrying a lantern.
 * The pointer is where the street needs light: the arm swivels round the post
 * on a spring to hang the lantern over it, and the pool of light on the
 * ground follows. At rest the arm stands askew over the kerb, lantern bright.
 * The slider is how quickly the arm follows.
 *
 * The pattern: a continuous aim (one spring on an angle); the hit is on the
 * ground plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const TOP = 56, ARM = 30, REST = 2.2;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 3.5);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([(ARM + 8) * Math.cos(a), (ARM + 8) * Math.sin(a), TOP + 4], [(ARM + 7) * Math.cos(a), (ARM + 7) * Math.sin(a), 0]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const pool = flatDot(g, C, 7, "dot off");
  const arm = mk("g", {}, g);
  const post = mk("g", {}, g);
  put(solid(post), prism(P, front, circ(9, 40), circ(7.6, 40), 0, 3));
  put(solid(post), prism(P, front, circ(5.5, 32), circ(4.4, 32), 3, 12));
  put(solid(post), prism(P, front, circ(2.2, 20), null, 12, TOP));
  put(solid(post), prism(P, front, circ(3.6, 24), circ(2.8, 24), TOP, TOP + 3));
  // arm footprints, pointing +x from the post
  const BAR = rings(2, -1.4, ARM, 1.4, 0.7, 0.4);
  const STRUT = rings(2, -1, ARM * 0.55, 1, 0.5, 0.3);
  const CAP = rings(ARM - 8, -8, ARM + 8, 8, 3, 1.4);
  const LAMP = rings(ARM - 6, -6, ARM + 6, 6, 3.5, 1.4);
  const sBar = solid(arm), sStrut = solid(arm), sLamp = solid(arm), sCap = solid(arm);
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, behind = null;

  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const T = (r) => turn(r, a);
    put(sStrut, prism(P, front, T(STRUT[0]), null, TOP - 12, TOP - 10));
    put(sBar, prism(P, front, T(BAR[0]), T(BAR[1]), TOP - 1, TOP + 1.5));
    put(sLamp, prism(P, front, T(LAMP[0]), T(LAMP[1]), TOP - 16, TOP - 5));
    put(sCap, prism(P, front, T(CAP[0]), T(CAP[1]), TOP - 5, TOP - 2));
    place(pool, P(ARM * Math.cos(a), ARM * Math.sin(a), 0));
    const b = Math.cos(a) + Math.sin(a) < 0;
    if (b !== behind) { behind = b; if (b) post.before(arm); else post.after(arm); }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    const aim = over ? Math.atan2(over[1], over[0]) : REST;
    sp.t = sp.t + wrap(aim - sp.t);
    sCap.sil.classList.toggle("hi", true);
    pool.setAttribute("class", over ? "dot m" : "dot off");
    const deg = Math.round(((aim * 180) / Math.PI + 360) % 360);
    read.textContent = over ? deg + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r < 4 || r > ARM + 40 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  draw();
  retarget();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "streetlamp",
  means: "A street lamp whose swing arm turns round the post to hang its lantern, and its pool of light, over the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[126, 221], [274, 221], [126, 295], null],
  mount,
});
