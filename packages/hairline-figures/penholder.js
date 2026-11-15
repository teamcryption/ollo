/**
 * Brush jar: a round jar with a lip, seven paint brushes standing in it, each a
 * handle and a pointed tuft of bristles. The pointer is where the light comes
 * from: every brush tips over in the jar to lean toward it, on its own spring,
 * and the brush whose tip is nearest is bright. At rest the brushes fan out
 * unevenly and the jar's lip is bright. The slider is how far they lean.
 *
 * The pattern: a continuous aim (a spring pair per brush); the hit is on the
 * floor's plane, which never moves, and the nearest tip is read from rest.
 */
const {
  Cam, circ, facing, fit, prism, proj, hull, unproj, spring, stepS,
  disposer, mk, pointer, put, register, solid, poly, seg, clamp,
} = HL;

const JR = 17, JH = 30, N = 7;
const LEN = [58, 50, 62, 54, 47, 60, 52], FAN = [0.32, 0.22, 0.38, 0.18, 0.3, 0.26, 0.34], FAV = 2;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.75);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([JR * Math.cos(a), JR * Math.sin(a), 0], [44 * Math.cos(a), 44 * Math.sin(a), JH + 44]); }
  ext.push([0, 0, JH + 62]);
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const jar = solid(g);
  put(jar, prism(P, front, circ(JR, 48), circ(JR - 1.6, 48), 0, JH));
  const lip = solid(g);
  put(lip, prism(P, front, circ(JR + 1.6, 48), circ(JR - 1.2, 48), JH - 3, JH));

  const brushes = [];
  for (let i = 0; i < N; i++) {
    const a = 0.5 + (i / N) * Math.PI * 2, rr = i % 2 ? 9 : 5;
    const b = { i, x: Math.cos(a) * rr, y: Math.sin(a) * rr, L: LEN[i], rx: Math.cos(a) * FAN[i], ry: Math.sin(a) * FAN[i] };
    b.sx = spring(b.rx, { k: 100, c: 18 }); b.sy = spring(b.ry, { k: 100, c: 18 });
    b.restTip = P(b.x + b.rx * b.L, b.y + b.ry * b.L, JH + b.L * Math.sqrt(1 - b.rx * b.rx - b.ry * b.ry));
    brushes.push(b);
  }
  brushes.sort((p, q) => p.x + p.y - (q.x + q.y));
  for (const b of brushes) {
    b.g = mk("g", {}, g);
    b.handle = mk("path", { class: "nf sil" }, b.g);
    b.tuft = solid(b.g);
    b.drawn = "";
  }
  let gain = value;

  function draw(b) {
    const lx = b.sx.x, ly = b.sy.x, key = lx.toFixed(4) + ly.toFixed(4);
    if (key === b.drawn) return;
    b.drawn = key;
    const lz = Math.sqrt(Math.max(0.1, 1 - lx * lx - ly * ly));
    const at = (t) => [b.x + lx * b.L * t, b.y + ly * b.L * t, JH - 6 + lz * b.L * t];
    const f = at(0.7), tip = at(1), m = at(0.86), ring = circ(2.2, 12).map((q) => P(f[0] + q.u, f[1] + q.v, f[2])).concat(circ(3.4, 12).map((q) => P(m[0] + q.u, m[1] + q.v, m[2])));
    const a = at(7 / (lz * b.L));
    b.handle.setAttribute("d", seg(P(...a), P(...f)));
    b.tuft.sil.setAttribute("d", poly(hull(ring.concat([P(...tip)]))));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const b of brushes) { if (stepS(b.sx, dt)) m = true; if (stepS(b.sy, dt)) m = true; draw(b); }
    return m;
  });
  bag.add(B.unregister);

  function aim(w, scr) {
    let near = null, bd = Infinity;
    for (const b of brushes) {
      if (w) {
        const dx = w[0] - b.x, dy = w[1] - b.y, d = Math.hypot(dx, dy) || 1, m = clamp(d / 50, 0.25, 1) * 0.55 * gain;
        b.sx.t = (dx / d) * m; b.sy.t = (dy / d) * m;
        const sd = Math.hypot(scr[0] - b.restTip[0], scr[1] - b.restTip[1]);
        if (sd < bd) { bd = sd; near = b; }
      } else { b.sx.t = b.rx; b.sy.t = b.ry; }
    }
    for (const b of brushes) b.tuft.sil.classList.toggle("hi", w ? b === near : false);
    lip.sil.classList.toggle("hi", !w);
    read.textContent = near ? "brush " + (near.i + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const w = unproj(C, p[0], p[1], 0);
      if (Math.abs(p[0] - 200) > 150) return aim(null);
      aim(w, p);
    },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  for (const b of brushes) draw(b);
  return {
    set: (v) => { gain = clamp(v, 0.5, 1.2); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "penholder",
  means: "A jar of paint brushes: every brush tips in the jar to lean toward the pointer, and the brush whose tip is nearest is bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[123, 84], [272, 150], [205, 250], null],
  mount,
});
