/**
 * Woodwork vice: a bench edge with a wooden front jaw on a screw and tommy bar; the jaw slides open to the pointer.
 * The pointer's spot on the floor, read along one axis, sets where the moving
 * part sits; the floor never moves, so the hit holds still. The slider is how
 * stiffly it follows.
 */
const { Cam, fit, facing, prism, proj, rings, unproj, spring, stepS, disposer, mk, pointer, put, register, solid } = HL;

const FIX = [[-40,-34,40,0,30,38],[-40,-4,40,0,6,30]];
const MOV = [[-24,0,24,9,10,38],[-2.5,9,2.5,22,20,25],[-14,19,14,23,21,24]];
const AX = [0,1,0], LO = 1, HI = 26, REST = 0.3, HIB = 0;
const off = (u) => AX.map((a) => a * (LO + (HI - LO) * u));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.7);
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
  const set = (u, r) => { sp.t = u; read.textContent = r ? "rest" : Math.round(u * 25) + "mm"; B.wake(); };
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 30);
      if (Math.hypot(x, y) > 80) return set(REST, 1);
      const s = x * AX[0] + y * AX[1];
      set(Math.max(0, Math.min(1, (s - -5) / (35 - -5))));
    },
    leave: () => set(REST, 1),
  }));
  bag.add(() => svg.replaceChildren());
  draw(); set(REST, 1);
  return { set: (v) => { sp.k = 100 * v; sp.c = 18 * Math.sqrt(v); }, destroy: bag.dispose };
}

hairline({
  name: "benchvice",
  means: "A woodwork vice on a bench edge: its front jaw slides open on the screw as far as the pointer reaches, the jaw bright.",
  rules: [1, 3, 4, 5],
  range: [0.5, 1, 1.6],
  tour: [[132, 163], [189, 153], [123, 168], null],
  mount,
});
