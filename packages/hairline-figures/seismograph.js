/**
 * Seismograph: a recording drum on two posts over a base plate, a pen arm on a
 * post reaching onto the drum, and five traces wrapped round it, each with a
 * burst of tremor. The pointer turns the drum: its x along the drum sets how far
 * the drum has rolled and slides the pen to the trace under it, which goes
 * bright. At rest the drum shows the start of the burst and the pen is bright.
 *
 * The pattern: a continuous turn (one spring on the phase, one on the pen);
 * the hit is on the drum's own rest axis height, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, hull, poly, open, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid, clamp,
} = HL;

const L = 40, R = 18, ZC = 30, N = 5, REST = 0.6;
const X = [-28, -14, 0, 14, 28];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  fit(C, [[-56, -32, 0], [56, 40, 0], [-48, 0, ZC + R], [48, 0, ZC + R], [0, 40, 50]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const post = (x, y, z1) => { const [r, i] = rings(x - 3.5, y - 3.5, x + 3.5, y + 3.5, 1.5, 0.8); put(solid(g), prism(P, front, r, i, 2.5, z1)); };
  const [br, bi] = rings(-56, -30, 56, 30, 6, 1.6);
  put(solid(g), prism(P, front, br, bi, 0, 2.5));
  post(-47, 0, ZC + 3);
  // the drum: the hull of its two end circles, the near end as its crease
  const end = (x, r) => { const o = []; for (let k = 0; k < 48; k++) { const t = (k / 48) * Math.PI * 2; o.push(P(x, r * Math.cos(t), ZC + r * Math.sin(t))); } return o; };
  const drum = solid(g);
  drum.sil.setAttribute("d", poly(hull(end(-L, R).concat(end(L, R)))));
  drum.cr.setAttribute("d", poly(end(L + 0.01, R - 1.4)));
  const tr = [];
  for (let i = 0; i < N; i++) tr.push(mk("path", { class: "nf lo" }, g));
  post(47, 0, ZC + 3);
  // pen arm: a post in front, an arm out to the drum, a pen tip
  const [ar, ai] = rings(-4, 36, 4, 44, 2, 1);
  put(solid(g), prism(P, front, ar, ai, 2.5, 48));
  const arm = solid(g);

  const ph = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  const pen = spring(X[2], { k: 100 * value, c: 18 * Math.sqrt(value) });
  const vis = (t) => 0.612 * Math.cos(t) + 0.5 * Math.sin(t) > 0.02;
  let dPh = NaN, dPen = NaN, on = -1;

  function draw() {
    if (!(Math.abs(ph.x - dPh) < 1e-4)) {
      dPh = ph.x;
      for (let i = 0; i < N; i++) {
        let d = "", run = [];
        for (let k = 0; k <= 120; k++) {
          const s = (k / 120) * Math.PI * 2, t = s + ph.x;
          const burst = Math.exp(-Math.pow(s - Math.PI, 2) / (0.35 + i * 0.05)) * (6.5 - Math.abs(i - 2));
          const x = X[i] + burst * Math.sin(s * 30 + i);
          if (vis(t)) run.push(P(x, (R + 0.2) * Math.cos(t), ZC + (R + 0.2) * Math.sin(t)));
          else if (run.length) { if (run.length > 1) d += open(run); run = []; }
        }
        if (run.length > 1) d += open(run);
        tr[i].setAttribute("d", d);
      }
    }
    if (!(Math.abs(pen.x - dPen) < 1e-4)) {
      dPen = pen.x;
      const a = 0.9, tip = [pen.x, (R + 0.5) * Math.cos(a), ZC + (R + 0.5) * Math.sin(a)];
      const a0 = [0, 40, 46], a1 = [pen.x, tip[1] + 4, tip[2] + 4];
      const pts = [];
      for (const q of [a0, a1]) for (const [dx, dz] of [[-2, -1.5], [2, -1.5], [2, 1.5], [-2, 1.5]]) pts.push(P(q[0] + dx, q[1], q[2] + dz));
      arm.sil.setAttribute("d", poly(hull(pts)) + open([P(...a1), P(...tip)]));
      arm.cr.setAttribute("d", open([P(0, 40, 47.5), P(pen.x, a1[1], a1[2] + 1.5)]));
    }
  }

  const B = register(stage, (dt) => { const m = stepS(ph, dt) | stepS(pen, dt); draw(); return !!m; });
  bag.add(B.unregister);

  function mark(i) {
    on = i;
    arm.sil.classList.toggle("hi", i < 0);
    tr.forEach((p, j) => p.classList.toggle("hi", j === i));
    read.textContent = i < 0 ? "rest" : "trace " + (i + 1);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], ZC);
      if (Math.abs(y) > 60 || Math.abs(x) > 60) { ph.t = REST; pen.t = X[2]; mark(-1); return; }
      const cx = clamp(x, -L + 6, L - 6);
      let i = 0; for (let j = 1; j < N; j++) if (Math.abs(X[j] - cx) < Math.abs(X[i] - cx)) i = j;
      ph.t = REST + ((cx + L) / (2 * L)) * Math.PI * 1.4;
      pen.t = X[i];
      mark(i);
    },
    leave: () => { ph.t = REST; pen.t = X[2]; mark(-1); },
  }));
  bag.add(() => svg.replaceChildren());
  draw(); mark(-1);
  return {
    set: (v) => { for (const s of [ph, pen]) { s.k = 100 * v; s.c = 18 * Math.sqrt(v); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "seismograph",
  means: "A seismograph drum: the pointer rolls the drum to bring the tremor round and slides the pen to the trace it lands on.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[243, 160], [148, 112], [200, 140], null],
  mount,
});
