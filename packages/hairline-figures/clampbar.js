/**
 * Bar clamp: a long steel bar with a fixed head and screw handle at one end; the sliding jaw runs along the bar toward the head.
 * The pointer's spot on a fixed plane, read along one axis, sets where the
 * moving part sits; the plane never moves, so the hit holds still. The slider
 * is how stiffly it follows.
 */
const { Cam, fit, facing, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const FIX = [[-70,-2.5,62,2.5,34,40],[54,-5,64,5,6,40],[64,-3,86,3,10,17],[52,-4,54,4,8,22]];
const MOV = [[-6,-6,6,6,4,44],[-6,-4,6,4,-14,4],[6,-4,8,4,8,22]];
const AX = [1,0,0], LO = -56, HI = 30, REST = 0.35, HIB = 0;
const off = (u) => AX.map((a) => a * (LO + (HI - LO) * u));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  const ext = [];
  const corners = (b, o) => { for (const x of [b[0], b[2]]) for (const y of [b[1], b[3]]) for (const z of [b[4], b[5]]) ext.push([x + o[0], y + o[1], z + o[2]]); };
  FIX.forEach((b) => corners(b, [0, 0, 0]));
  MOV.forEach((b) => { corners(b, off(0)); corners(b, off(1)); });
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const mid = off(0.5);
  const items = FIX.map((b) => ({ b, m: false })).concat(MOV.map((b, i) => ({ b, m: true, i })));
  const key = (it) => { const o = it.m ? mid : [0, 0, 0]; const b = it.b; return (b[0] + b[2]) / 2 + (b[1] + b[3]) / 2 + o[0] + o[1] + ((b[4] + b[5]) / 2 + o[2]) * 0.02; };
  items.sort((p, q) => key(p) - key(q));
  const box = (b, o) => { const r = Math.min(b[2] - b[0], b[3] - b[1]); const c = Math.min(1.4, r / 4); return prism(P, front, ...rings(b[0] + o[0], b[1] + o[1], b[2] + o[0], b[3] + o[1], c * 1.4, c), b[4] + o[2], b[5] + o[2]); };
  const movs = [];
  for (const it of items) {
    const so = solid(g);
    if (it.m) { movs[it.i] = so; } else put(so, box(it.b, [0, 0, 0]));
  }
  const sp = spring(REST, { k: 100 * value, c: 18 * Math.sqrt(value) });
  let drawn = NaN;
  function draw() {
    if (Math.abs(sp.x - drawn) < 1e-4) return;
    drawn = sp.x;
    const o = off(sp.x);
    MOV.forEach((b, i) => put(movs[i], box(b, o)));
  }
  movs[HIB].sil.classList.add("hi");
  const B = register(stage, (dt) => { const m = stepS(sp, dt); draw(); return m; });
  bag.add(B.unregister);
  const set = (u, r) => { sp.t = u; read.textContent = r ? "rest" : Math.round((1 - u) * 86) + "mm"; B.wake(); };
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 20);
      if (Math.hypot(x - 0, y - 0) > 110) return set(REST, 1);
      const s = x * AX[0] + y * AX[1];
      set(Math.max(0, Math.min(1, (s - -50) / (40 - -50))));
    },
    leave: () => set(REST, 1),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); set(REST, 1);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "clampbar",
  means: "A bar clamp: its sliding jaw runs along the bar toward the fixed head as far as the pointer reaches, the jaw bright.",
  rules: [1, 3, 4, 5],
  range: [0.5, 1, 1.6],
  tour: [[222,180],[93,116],[258,198],null],
  mount,
});
