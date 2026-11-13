/**
 * Lecture podium: a lectern on a low dais, a book on its desk and a gooseneck
 * microphone at the desk's far corner. The microphone swings on a spring to
 * face the pointer wherever it is over the floor. At rest it leans toward the
 * hall, its head bright. The slider is how quickly it follows.
 *
 * The pattern: a continuous aim (office chairs' spring, on one angle); the hit
 * is on the floor's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, open, prism, proj, rings, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const MX = 10, MY = -8, TOP = 50, REST = 2.1;
const turn = (ring, a, cx, cy) => {
  const c = Math.cos(a), s = Math.sin(a);
  return ring.map((q) => ({ u: cx + q.u * c - q.v * s, v: cy + q.u * s + q.v * c, nu: q.nu * c - q.nv * s, nv: q.nu * s + q.nv * c }));
};
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-42, -32, -6], [42, 32, -6], [42, -32, -6], [-42, 32, -6], [MX, MY, TOP + 24], [MX - 16, MY, TOP + 22], [MX + 16, MY, TOP + 22]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const box = (x0, y0, x1, y1, r, b, z0, z1) => { const [o, i] = rings(x0, y0, x1, y1, r, b); const s = solid(g); put(s, prism(P, front, o, i, z0, z1)); return s; };
  box(-42, -32, 42, 32, 4, 1.6, -6, 0);
  box(-16, -12, 16, 12, 3, 1.2, 0, 4);
  box(-12, -9, 12, 9, 2.5, 1, 4, TOP - 3);
  box(-17, -13, 17, 13, 2.5, 1.2, TOP - 3, TOP);
  box(-10, -3, 6, 9, 1, 0.5, TOP, TOP + 2.6);
  mk("path", { class: "nf lo", d: seg(P(-2, -3, TOP + 2.6), P(-2, 9, TOP + 2.6)) + seg(P(-10, 9, TOP + 1.3), P(6, 9, TOP + 1.3)) }, g);
  put(solid(g), prism(P, front, circ(2.8, 24).map((q) => ({ ...q, u: q.u + MX, v: q.v + MY })), null, TOP, TOP + 1.6));
  const neck = mk("path", { class: "nf sil" }, g);
  const head = solid(g);
  head.sil.classList.add("hi");
  const HEAD = rings(8, -1.7, 15, 1.7, 1.5, 0.6);

  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    const a = sp.x;
    if (Math.abs(a - drawn) < 1e-4) return;
    drawn = a;
    const pts = [P(MX, MY, TOP + 1.6)];
    for (let i = 0; i <= 10; i++) {
      const t = (i / 10) * Math.PI / 2, rr = 9 * (1 - Math.cos(t)), zz = TOP + 10 + 9 * Math.sin(t);
      pts.push(P(MX + rr * Math.cos(a), MY + rr * Math.sin(a), zz));
    }
    neck.setAttribute("d", open(pts));
    put(head, prism(P, front, turn(HEAD[0], a, MX, MY), turn(HEAD[1], a, MX, MY), TOP + 17.2, TOP + 20.8));
    // the head goes behind the neck when it points away
    if (Math.cos(a) + Math.sin(a) < 0) neck.after(head.g); else head.g.after(neck);
  }

  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);

  function aimAt(over) {
    const aim = over ? Math.atan2(over[1] - MY, over[0] - MX) : REST;
    sp.t = sp.t + wrap(aim - sp.t);
    if (over) { const d = Math.round((aim * 180) / Math.PI); read.textContent = "aim " + ((d % 360) + 360) % 360 + "°"; } else read.textContent = "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 0);
      aimAt(Math.hypot(x - MX, y - MY) < 4 || Math.hypot(x, y) > 110 ? null : [x, y]);
    },
    leave: () => aimAt(null),
  }));
  bag.add(() => svg.replaceChildren());
  aimAt(null);
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "mortarboard",
  means: "A lectern with a book and a gooseneck microphone: the microphone swings round to face the pointer.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[72, 201], [328, 219], [249, 93], null],
  mount,
});
