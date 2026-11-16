/**
 * IV pole: a pole on a cross base with a turning top arm that carries two drip bags. Pointer x turns the arm; the big bag is bright.
 */
const CFG = {"S":2.15,"ax":"z","pv":[0,0,0],"rest":30,"lo":-60,"hi":60,"parts":[{"c":[0,0,3],"h":[28,4,3]},{"c":[0,0,3.1],"h":[4,28,3]},{"c":[0,0,62],"h":[2,2,56]},{"c":[26,0,120],"h":[26,2,2],"m":1},{"c":[46,0,100],"h":[5,16,18],"m":1,"hi":1},{"c":[46,0,78],"h":[2.5,2.5,4],"m":1},{"c":[46,0,66],"h":[1,1,8],"m":1},{"c":[-20,0,120],"h":[20,2,2],"m":1},{"c":[-36,0,104],"h":[4,10,12],"m":1}]};

const { Cam, fit, hull, poly, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

function rot(p, q, ax, t) {
  const c = Math.cos(t), s = Math.sin(t), d = [p[0] - q[0], p[1] - q[1], p[2] - q[2]];
  if (ax === "z") return [q[0] + d[0] * c - d[1] * s, q[1] + d[0] * s + d[1] * c, p[2]];
  if (ax === "x") return [p[0], q[1] + d[1] * c - d[2] * s, q[2] + d[1] * s + d[2] * c];
  return [q[0] + d[0] * c - d[2] * s, p[1], q[2] + d[0] * s + d[2] * c];
}
function corners(b) {
  const [x, y, z] = b.c, [a, e, h] = b.h, out = [];
  for (const i of [-1, 1]) for (const j of [-1, 1]) for (const k of [-1, 1]) out.push([x + i * a, y + j * e, z + k * h]);
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, CFG.S);
  const pose = (b, t) => corners(b).map((p) => (b.m ? rot(p, CFG.pv, CFG.ax, t) : p));
  const ext = [];
  for (const b of CFG.parts) for (const t of [rad(CFG.rest), rad(CFG.rest + CFG.lo), rad(CFG.rest + CFG.hi)]) ext.push(...pose(b, t));
  fit(C, ext, 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const els = CFG.parts.map((b) => ({ b, el: mk("path", { class: b.hi ? "sil hi" : "sil" }, g) }));
  const sp = spring(rad(CFG.rest), { k: 90, c: 16 });
  let last = NaN;
  function draw() {
    if (sp.x === last) return;
    last = sp.x;
    const items = els.map((o) => {
      const pts = pose(o.b, sp.x);
      const ctr = pts.reduce((s, p) => [s[0] + p[0] / 8, s[1] + p[1] / 8, s[2] + p[2] / 8], [0, 0, 0]);
      o.el.setAttribute("d", poly(hull(pts.map((p) => P(p[0], p[1], p[2])))));
      return { o, d: ctr[0] + ctr[1] + (o.b.lay || 0) + ctr[2] * 0.01 };
    });
    items.sort((a, b) => a.d - b.d).forEach((it) => g.appendChild(it.o.el));
  }
  draw();
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  function aim(t) {
    sp.t = rad(t);
    read.textContent = Math.round(t) + "\u00b0";
    B.wake();
  }
  read.textContent = "rest";
  bag.add(pointer(stage, {
    move: ([sx, sy]) => {
      const u = clamp((sx - 200) / 130, -1, 1), f = amp / 100;
      aim(CFG.rest + (u < 0 ? -u * CFG.lo : u * CFG.hi) * f);
    },
    leave: () => { aim(CFG.rest); read.textContent = "rest"; },
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; }, destroy: bag.dispose };
}

hairline({
  name: "iv2",
  means: "An IV pole on a cross base: the pointer turns the top arm and its two hanging drip bags around the pole.",
  rules: [1, 3, 4, 5],
  range: [0, 100, 100],
  tour: [[219,131],[150,150],[280,140],null],
  mount,
});
