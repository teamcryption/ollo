/**
 * Trampoline: a round frame on six legs, a ring of springs and a woven mat.
 * The pointer is the jumper's foot: the mat sinks where it lands, its rings
 * and seams bending into a dip that follows on a spring, and the dip's lip is
 * bright. At rest the mat sags a little off centre. The slider is how deep
 * the mat gives.
 *
 * The pattern: a continuous press (a spring on the dip's centre and depth);
 * the hit is on the frame's plane, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, seg, unproj, open, spring, stepS, clamp,
  disposer, flatDot, mk, place, pointer, put, register, solid,
} = HL;

const RF = 54, RM = 46, ZF = 22, NL = 6, NS = 32, RINGS = [8, 16, 24, 32, 40], SPOKES = 12;
const REST = [-9, 7, 5];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.05);
  const ext = [];
  for (let k = 0; k < 12; k++) { const a = (k / 12) * Math.PI * 2; ext.push([RF * Math.cos(a), RF * Math.sin(a), 0], [RF * Math.cos(a), RF * Math.sin(a), ZF + 1]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  let depthK = value;

  // legs: a U of tube under each pair, drawn first so the mat covers the far ones
  const legs = [];
  for (let i = 0; i < NL; i++) {
    const a = (i / NL) * Math.PI * 2 + 0.3, x = RF * Math.cos(a), y = RF * Math.sin(a);
    legs.push(seg(P(x, y, ZF), P(x * 1.04, y * 1.04, 0)));
    place(flatDot(g, C, 1.2, "dot off"), P(x * 1.04, y * 1.04, 0));
  }
  mk("path", { class: "nf sil", d: legs.join("") }, g);
  // the frame tube and its skirt: an opaque plate the far legs hide behind
  put(solid(g), prism(P, front, circ(RF, 72), circ(RF - 1.6, 72), ZF - 2.5, ZF));
  // springs: short hooks from the frame to the mat's hem
  const spr = [];
  for (let i = 0; i < NS; i++) {
    const a = (i / NS) * Math.PI * 2;
    spr.push(seg(P((RF - 2) * Math.cos(a), (RF - 2) * Math.sin(a), ZF), P(RM * Math.cos(a), RM * Math.sin(a), ZF - 0.6)));
  }
  mk("path", { class: "nf lo", d: spr.join("") }, g);
  mk("path", { class: "nf sil", d: open(circ(RM, 72).concat(circ(RM, 72).slice(0, 1)).map((q) => P(q.u, q.v, ZF - 0.6))) }, g);
  const seams = mk("path", { class: "nf lo", d: "" }, g);
  const rings = mk("path", { class: "nf", d: "" }, g);
  const lip = mk("path", { class: "nf sil hi", d: "" }, g);

  const sx = spring(REST[0]), sy = spring(REST[1]), sd = spring(REST[2]);
  let drawn = "";
  const zAt = (x, y) => {
    const r = Math.hypot(x, y), d2 = (x - sx.x) ** 2 + (y - sy.x) ** 2;
    const edge = clamp(1 - (r / RM) ** 4, 0, 1);
    return ZF - 0.6 - sd.x * Math.exp(-d2 / (2 * 15 * 15)) * edge;
  };
  const loop = (pts) => open(pts.concat([pts[0]]));
  function draw() {
    const key = sx.x.toFixed(2) + sy.x.toFixed(2) + sd.x.toFixed(2);
    if (key === drawn) return;
    drawn = key;
    let rd = "", sd2 = "";
    for (const R of RINGS) {
      const pts = [];
      for (let k = 0; k < 64; k++) { const a = (k / 64) * Math.PI * 2, x = R * Math.cos(a), y = R * Math.sin(a); pts.push(P(x, y, zAt(x, y))); }
      rd += loop(pts);
    }
    for (let s = 0; s < SPOKES; s++) {
      const a = (s / SPOKES) * Math.PI * 2, pts = [];
      for (let k = 0; k <= 16; k++) { const r = (k / 16) * RM, x = r * Math.cos(a), y = r * Math.sin(a); pts.push(P(x, y, zAt(x, y))); }
      sd2 += open(pts);
    }
    rings.setAttribute("d", rd);
    seams.setAttribute("d", sd2);
    const lp = [], lr = 7 + sd.x * 0.25;
    for (let k = 0; k < 40; k++) {
      const a = (k / 40) * Math.PI * 2, x = sx.x + lr * Math.cos(a), y = sy.x + lr * Math.sin(a);
      lp.push(P(x, y, zAt(x, y)));
    }
    lip.setAttribute("d", loop(lp));
  }

  const B = register(stage, (dt) => {
    let m = false;
    for (const s of [sx, sy, sd]) if (stepS(s, dt)) m = true;
    draw();
    return m;
  });
  bag.add(B.unregister);

  function aim(p) {
    if (!p) { sx.t = REST[0]; sy.t = REST[1]; sd.t = REST[2]; read.textContent = "rest"; B.wake(); return; }
    const r = Math.hypot(p[0], p[1]), k = Math.min(1, 30 / Math.max(r, 1e-6));
    sx.t = p[0] * k; sy.t = p[1] * k; sd.t = 16 * depthK;
    read.textContent = "ring " + clamp(Math.round(Math.min(r, 40) / 8), 0, 5);
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (q) => { const p = unproj(C, q[0], q[1], ZF); aim(Math.hypot(p[0], p[1]) > RF + 8 ? null : p); },
    leave: () => aim(null),
  }));
  bag.add(() => svg.replaceChildren());
  aim(null);
  draw();
  return {
    set: (v) => { depthK = v; if (sd.t !== REST[2]) { sd.t = 16 * v; B.wake(); } },
    destroy: bag.dispose,
  };
}

hairline({
  name: "trampoline",
  means: "A round trampoline: the mat sinks into a dip under the pointer, its rings and seams bending, the dip's lip bright.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[186, 111], [200, 147], [207, 173], null],
  mount,
});
