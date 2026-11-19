/**
 * Weather balloon: a launch pad on the ground with a stake, a tether running
 * up through a small radiosonde box to a big round balloon with a tied neck.
 * The pointer swings the balloon on its tether: the further the pointer sits
 * to one side of the pad, the further the balloon leans over that way, the
 * sonde riding along the line. At rest it leans a little, the sonde bright.
 * The slider is how far the balloon may swing.
 */
const { Cam, circ, clamp, facing, fit, hull, open, poly, prism, proj, rings, run, seg, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const R = 27, LEN = 82, AZ = 3, MAX = 0.62, A0 = -0.14, Q = Math.SQRT1_2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  const tip = (a) => [Q * Math.sin(a) * (LEN + R), -Q * Math.sin(a) * (LEN + R), AZ + Math.cos(a) * (LEN + R)];
  fit(C, [[-24, -24, 0], [24, 24, 0], tip(MAX), tip(-MAX), [0, 0, AZ + LEN + R]].concat([MAX, -MAX, 0].map((a) => { const t = tip(a); return [t[0], t[1], t[2] + R]; })), 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, ...rings(-20, -20, 20, 20, 20, 1.6), 0, 3));
  put(solid(g), prism(P, front, ...rings(-1.6, -1.6, 1.6, 1.6, 1.6, 0.5), 3, AZ + 4));
  const line = mk("path", { class: "nf sil" }, g);
  const sonde = solid(g), bal = solid(g);
  const ax = P(0, 0, 0)[0];
  const sp = spring(A0);
  let lim = (MAX * value) / 1.4, last = NaN, over = null;
  const sph = [];
  for (let la = -90; la <= 90; la += 10) for (let lo = 0; lo < 360; lo += 10) {
    const p = (la * Math.PI) / 180, l = (lo * Math.PI) / 180;
    sph.push([R * Math.cos(p) * Math.cos(l), R * Math.cos(p) * Math.sin(l), R * Math.sin(p)]);
  }
  const eq = run(circ(R, 40), front);
  function draw() {
    const a = sp.x;
    if (Math.abs(a - last) < 1e-4) return;
    last = a;
    const d = [Q * Math.sin(a), -Q * Math.sin(a), Math.cos(a)];
    const c = [d[0] * (LEN + R), d[1] * (LEN + R), AZ + d[2] * (LEN + R)];
    const neck = [c[0] - d[0] * (R + 6), c[1] - d[1] * (R + 6), c[2] - d[2] * (R + 6)];
    const s = [neck[0] * 0.42, neck[1] * 0.42, AZ + (neck[2] - AZ) * 0.42];
    line.setAttribute("d", seg(P(0, 0, AZ + 4), P(...neck)));
    put(sonde, prism(P, front, ...rings(s[0] - 5, s[1] - 5, s[0] + 5, s[1] + 5, 1.8, 0.7), s[2] - 9, s[2]));
    bal.sil.setAttribute("d", poly(hull(sph.map((p) => P(c[0] + p[0], c[1] + p[1], c[2] + p[2])).concat([P(...neck)]))));
    bal.cr.setAttribute("d", open(eq.map((q) => P(c[0] + q.u, c[1] + q.v, c[2] - 2))));
  }
  bal.cr.setAttribute("class", "nf lo");
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function swing(t) {
    sp.t = t === null ? A0 : t * lim;
    bal.sil.classList.toggle("hi", t !== null);
    sonde.sil.classList.toggle("hi", t === null);
    read.textContent = t === null ? "rest" : Math.round((sp.t * 180) / Math.PI) + "°";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { over = clamp((p[0] - ax) / 110, -1, 1); swing(over); },
    leave: () => { over = null; swing(null); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); swing(null);
  return { set: (v) => { lim = (MAX * v) / 1.4; if (over !== null) swing(over); }, destroy: bag.dispose };
}

hairline({
  name: "weatherballoon",
  means: "A weather balloon on its tether: the balloon swings over toward the side of the launch pad the pointer is on.",
  rules: [1, 3, 5, 8],
  range: [0.3, 1, 1.4],
  tour: [[370, 96], [40, 140], [380, 140], null],
  mount,
});
