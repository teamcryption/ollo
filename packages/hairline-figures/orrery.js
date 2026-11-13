/**
 * Orrery: a brass orrery, a round plinth and a column carrying the sun's
 * sphere, and four planets on arms at stepped heights and radii, each riding
 * a short rod, the outermost with its ring. The pointer is where the planets
 * should be: every arm turns on its own spring to swing its planet toward the
 * pointer's angle, and the planet whose orbit is nearest it is bright. At
 * rest the planets lie spread round the sun, the third bright. The slider is
 * how quickly the arms follow (a stiffer or softer spring).
 *
 * The pattern: a continuous aim (officechairs' spring, on an angle per arm);
 * the hit is on each arm's own fixed plane, which never moves.
 */
const {
  Cam, circ, facing, fit, open, poly, prism, proj, ringAt, run, seg, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid,
} = HL;

const PL = [{ R: 22, z: 14, r: 3 }, { R: 33, z: 21, r: 4.4 }, { R: 44, z: 28, r: 5.2 }, { R: 55, z: 35, r: 4, ring: 1 }];
const REST = [200, 115, 25, 300], FAV = 2, ROD = 6, COL = 46, SUN = 9;
const wrap = (a) => a - Math.PI * 2 * Math.round(a / (Math.PI * 2));
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.8);
  const ext = [];
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; ext.push([60 * Math.cos(a), 60 * Math.sin(a), 0], [60 * Math.cos(a), 60 * Math.sin(a), 46]); }
  ext.push([0, 0, COL + SUN * 2 + 2]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(17, 48), circ(15.6, 48), 0, 4));
  const hub = mk("g", {}, g);
  put(solid(hub), prism(P, front, circ(2.4, 20), null, 4, COL));
  put(solid(hub), prism(P, front, circ(4.5, 24), circ(3.6, 24), COL - 1, COL + 1));
  const sun = solid(hub);
  const sphere = (el, cx, cy, cz, r) => {
    const eq = ringAt(P, disc(cx, cy, r), cz), c = P(cx, cy, cz);
    const rad = (Math.max(...eq.map((p) => p[0])) - Math.min(...eq.map((p) => p[0]))) / 2;
    el.sil.setAttribute("d", poly(Array.from({ length: 36 }, (_, i) => [c[0] + rad * Math.cos((i / 36) * Math.PI * 2), c[1] + rad * Math.sin((i / 36) * Math.PI * 2)])));
    el.cr.setAttribute("d", open(ringAt(P, run(disc(cx, cy, r * 0.97), front), cz)));
  };
  sphere(sun, 0, 0, COL + 1 + SUN, SUN);

  const arms = PL.map((o, k) => {
    const grp = mk("g", {}, g), rest = (REST[k] * Math.PI) / 180;
    return {
      k, o, grp, rest, sp: spring(rest, { k: 100 * value, c: 18 * Math.sqrt(value) }), drawn: NaN,
      bar: mk("path", { class: "nf sil" }, grp), back: o.ring ? mk("path", { class: "nf lo" }, grp) : null,
      ball: solid(grp), fore: o.ring ? mk("path", { class: "nf lo" }, grp) : null,
    };
  });
  let order = "";

  function draw(a) {
    const t = a.sp.x;
    if (Math.abs(t - a.drawn) < 1e-4) return;
    a.drawn = t;
    const { R, z, r } = a.o, c = Math.cos(t), s = Math.sin(t), x = R * c, y = R * s, pz = z + ROD + r;
    a.key = x + y;
    a.bar.setAttribute("d", seg(P(2.4 * c, 2.4 * s, z), P(x, y, z)) + seg(P(x, y, z), P(x, y, pz - r)));
    sphere(a.ball, x, y, pz, r);
    if (a.back) {
      const rg = disc(x, y, r * 1.9, 36);
      a.back.setAttribute("d", poly(ringAt(P, rg, pz)));
      a.fore.setAttribute("d", open(ringAt(P, run(rg, front), pz)));
    }
  }
  function sort() {
    const list = [{ el: hub, key: 0 }, ...arms.map((a) => ({ el: a.grp, key: a.key }))].sort((p, q) => p.key - q.key);
    const sig = list.map((it) => (it.el === hub ? "h" : it.el.dataset.k ?? "")).join("");
    if (sig === order) return;
    order = sig;
    for (const it of list) g.appendChild(it.el);
  }
  arms.forEach((a) => { a.grp.dataset.k = a.k; });

  const B = register(stage, (dt) => {
    let m = false;
    for (const a of arms) { if (stepS(a.sp, dt)) m = true; draw(a); }
    sort();
    return m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = -1, bd = 14;
    if (over) arms.forEach((a, k) => { const d = Math.abs(over[k][1] - a.o.R); if (d < bd) { bd = d; near = k; } });
    const live = over && near >= 0;
    arms.forEach((a, k) => {
      const aim = live ? over[near][0] + (k - near) * 0.42 : a.rest;
      a.sp.t = a.sp.t + wrap(aim - a.sp.t);
      a.ball.sil.classList.toggle("hi", k === (live ? near : FAV));
    });
    read.textContent = live ? "planet " + (near + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      over = PL.map((o) => { const [x, y] = unproj(C, p[0], p[1], o.z + ROD + o.r); return [Math.atan2(y, x), Math.hypot(x, y)]; });
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return {
    set: (v) => { for (const a of arms) { a.sp.k = 100 * v; a.sp.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "orrery",
  means: "A brass orrery: every arm swings its planet toward the pointer's angle, and the planet on the nearest orbit is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[174, 138], [349, 93], [242, 185], null],
  mount,
});
