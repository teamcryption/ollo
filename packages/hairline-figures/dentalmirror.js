/**
 * Dental lamp: a weighted foot, a tall column, and a long swing arm with the
 * lamp head hanging at its end. The pointer is where the patient sits: the arm
 * swings round the column on a spring and the head turns to face it, bright.
 * At rest the arm stands half out over the chair and the foot's rim is lit.
 * The slider is how quickly the arm follows.
 *
 * The pattern: a continuous aim on one angle; the hit is the floor plane.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const ZT = 92, AL = 64, REST = -0.35;
const turn = (ring, a) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: q.u * c - q.v * s, v: q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.2);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([(AL + 8) * Math.cos(a), (AL + 8) * Math.sin(a), ZT + 6], [(AL + 8) * Math.cos(a), (AL + 8) * Math.sin(a), ZT - 35], [22 * Math.cos(a), 22 * Math.sin(a), 0]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const foot = solid(g);
  put(foot, prism(P, front, circ(22, 48), circ(20.4, 48), 0, 5));
  put(solid(g), prism(P, front, circ(9, 32), circ(7.8, 32), 5, 9));
  const post = mk("g", {}, g);
  put(solid(post), prism(P, front, circ(3.6, 24), null, 9, ZT));
  put(solid(post), prism(P, front, circ(5.5, 24), circ(4.5, 24), ZT - 2, ZT + 5));

  // local footprints along +x: the arm, the drop neck, the yoke, the lamp head
  const ARM = rings(0, -3, AL, 3, 2.5, 1);
  const NECK = rings(AL - 3, -1.8, AL + 0.6, 1.8, 1.2, 0.5);
  const YOKE = rings(AL - 6, -15, AL + 4, 15, 4, 1.2);
  const HEAD = rings(AL - 14, -13, AL + 6, 13, 8, 1.6);
  const swing = mk("g", {}, g);
  const head = solid(swing), yoke = solid(swing), neck = solid(swing), arm = solid(swing);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN, first = null;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const T = (r) => turn(r, a);
    put(head, prism(P, front, T(HEAD[0]), T(HEAD[1]), ZT - 34, ZT - 22));
    put(yoke, prism(P, front, T(YOKE[0]), T(YOKE[1]), ZT - 22, ZT - 19));
    put(neck, prism(P, front, T(NECK[0]), null, ZT - 19, ZT));
    put(arm, prism(P, front, T(ARM[0]), T(ARM[1]), ZT, ZT + 4));
    const behind = Math.cos(a) + Math.sin(a) < 0;
    if (behind !== first) {
      first = behind;
      if (behind) post.before(swing); else post.after(swing);
    }
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    const aim = over ? Math.atan2(over[1], over[0]) : REST;
    sp.t = sp.t + wrap(aim - sp.t);
    head.sil.classList.toggle("hi", !!over);
    foot.sil.classList.toggle("hi", !over);
    read.textContent = over ? Math.round(((aim * 180) / Math.PI + 360) % 360) + "°" : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0), r = Math.hypot(x, y);
      over = r < 8 || r > AL + 60 ? null : [x, y];
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
  name: "dentalmirror",
  means: "A dental lamp on a column: the long arm swings round to the pointer and the lamp head turns to face it, bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[340, 309], [200, 224], [76, 270], null],
  mount,
});
