/**
 * Potter wheel: a round pedestal, a wheel head on it and a lump of clay on the
 * head. The pointer is the potter's hands: raise it over the wheel and the clay
 * is pulled up from a squat bowl into a tall vase with a neck, while the wheel
 * head turns its three marks. At rest the clay is a low, wide bowl and the wheel
 * head's edge is bright. The slider is how quickly the clay follows.
 *
 * The pattern: a continuous pull (one spring) read from the pointer's screen
 * height inside a fixed band, which never moves.
 */
const {
  Cam, circ, facing, fit, prism, proj, spring, stepS,
  disposer, mk, place, pointer, put, register, solid, poly, open, lerp, clamp,
} = HL;

const ZH = 19, LV = 7;
const REST = [21, 24, 25, 24.5, 23, 22, 22.5], PULL = [15, 19, 20, 17, 11, 9.5, 11];
const HR = 13, HP = 56;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.95);
  const ext = [];
  for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI * 2; ext.push([36 * Math.cos(a), 36 * Math.sin(a), 0], [20 * Math.cos(a), 20 * Math.sin(a), ZH + HP]); }
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(30, 64), circ(28.4, 64), 0, 4));
  put(solid(g), prism(P, front, circ(12, 48), null, 4, ZH - 4));
  const pan = solid(g);
  put(pan, prism(P, front, circ(36, 72), circ(34.2, 72), ZH - 4, ZH - 1.5));
  const head = solid(g);
  put(head, prism(P, front, circ(27, 64), circ(25.6, 64), ZH - 1.5, ZH));
  const marks = [0, 1, 2].map(() => mk("circle", { class: "dot off", r: 1.6 }, g));
  const clay = solid(g);
  const sp = spring(0, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;

  const ell = (r, z) => { const o = []; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; o.push(P(r * Math.cos(a), r * Math.sin(a), z)); } return o; };
  const ext2 = (pts) => { let l = 0, rr = 0; pts.forEach((p, i) => { if (p[0] < pts[l][0]) l = i; if (p[0] > pts[rr][0]) rr = i; }); return [l, rr]; };
  const arc = (pts, a, b, dir) => { const o = []; for (let i = a; ; i = (i + dir + 48) % 48) { o.push(pts[i]); if (i === b) break; } return o; };

  function draw() {
    const p = clamp(sp.x, 0, 1);
    if (Math.abs(p - drawn) < 1e-4) return;
    drawn = p;
    const H = lerp(HR, HP, p), L = [], R = [];
    let bot = null, top = null, bi = null, ti = null;
    for (let j = 0; j < LV; j++) {
      const pts = ell(lerp(REST[j], PULL[j], p), ZH + (H * j) / (LV - 1)), [l, r] = ext2(pts);
      L.push(pts[l]); R.push(pts[r]);
      if (j === 0) { bot = pts; bi = [l, r]; }
      if (j === LV - 1) { top = pts; ti = [l, r]; }
    }
    const nearSide = (pts, a, b) => { const m = arc(pts, a, b, 1); return m[m.length >> 1][1] > pts[a][1] ? 1 : -1; };
    const db = nearSide(bot, bi[1], bi[0]), dt = nearSide(top, ti[0], ti[1]);
    const sil = [...L.slice(0, -1), ...arc(top, ti[0], ti[1], -dt), ...R.slice(1).reverse().slice(0, -1), ...arc(bot, bi[1], bi[0], db)];
    clay.sil.setAttribute("d", poly(sil));
    clay.cr.setAttribute("d", open(arc(top, ti[0], ti[1], dt)));
    const turnA = p * Math.PI * 1.6;
    marks.forEach((m, i) => { const a = turnA + 0.4 + (i * Math.PI * 2) / 3; place(m, P(31.5 * Math.cos(a), 31.5 * Math.sin(a), ZH - 1.5)); });
  }

  const B = register(stage, (dts) => { const m = stepS(sp, dts); draw(); return m; });
  bag.add(B.unregister);
  const base = P(0, 0, ZH)[1];

  function set(on, t) {
    sp.t = t;
    clay.sil.classList.toggle("hi", on);
    head.sil.classList.toggle("hi", !on);
    read.textContent = on ? "h " + Math.round(lerp(HR, HP, t)) : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (q) => {
      const dx = Math.abs(q[0] - 200);
      if (dx > 110 || q[1] > base + 40) return set(false, 0);
      set(true, clamp((base + 20 - q[1]) / 170, 0.15, 1));
    },
    leave: () => set(false, 0),
  }));
  bag.add(() => svg.replaceChildren());
  set(false, 0);
  draw();
  return {
    set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pottery",
  means: "A potter wheel: raise the pointer over it and the clay is pulled up from a squat bowl into a tall necked vase.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.6],
  tour: [[200, 165], [200, 80], [200, 125], null],
  mount,
});
