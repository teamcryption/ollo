/**
 * Geoboard: a square board with a grid of pegs and a rubber band stretched
 * round four of them. The pointer tips the board toward itself on a spring,
 * and the band's free corner hooks onto the peg nearest it. At rest the band
 * is a lopsided quad, bright, the board a little askew.
 */
const {
  Cam, facing, fit, prism, proj, rings, seg, unproj, spring, stepS, clamp,
  disposer, flatDot, mk, place, poly, pointer, put, register, solid,
} = HL;

const FIX = [[-40, -20], [20, -40], [40, 20]], FREE = [-20, 40], REST = [0.06, -0.05];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.0);
  const ext = [];
  for (const x of [-52, 52]) for (const y of [-52, 52]) for (const z of [-14, 30]) ext.push([x, y, z]);
  fit(C, ext, 200, 162);
  const P = proj(C), front = facing(C);
  const BR = rings(-50, -50, 50, 50, 7, 1.8);
  const g = mk("g", {}, svg);
  const board = solid(g);
  const pegs = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) pegs.push({ x: -40 + i * 20, y: -40 + j * 20, i, j });
  pegs.sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const p of pegs) { p.sh = mk("path", { class: "nf lo" }, g); p.hd = flatDot(g, C, 1.6, "dot off"); }
  const band = mk("path", { class: "nf sil hi" }, g);
  const tx = spring(REST[0]), ty = spring(REST[1]);
  let free = FREE, drawn = "";

  function draw() {
    const key = tx.x.toFixed(4) + "," + ty.x.toFixed(4) + "," + free;
    if (key === drawn) return;
    drawn = key;
    const Q = (x, y, z) => P(x, y, z + tx.x * x + ty.x * y);
    put(board, prism(Q, front, BR[0], BR[1], 0, 8));
    for (const p of pegs) { p.sh.setAttribute("d", seg(Q(p.x, p.y, 8), Q(p.x, p.y, 15))); place(p.hd, Q(p.x, p.y, 15)); }
    const quad = [FIX[0], FIX[1], FIX[2], free];
    const hull = quad.map(([x, y]) => [x, y, Math.atan2(y, x)]).sort((a, b) => a[2] - b[2]);
    band.setAttribute("d", poly(hull.map(([x, y]) => Q(x, y, 12))));
  }

  const B = register(stage, (dt) => { const m = stepS(tx, dt) | stepS(ty, dt); draw(); return !!m; });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null;
    if (over) {
      let bd = Infinity;
      for (const p of pegs) {
        if (FIX.some(([x, y]) => x === p.x && y === p.y) || (Math.abs(p.x) < 5 && Math.abs(p.y) < 5)) continue;
        const d = Math.hypot(over[0] - p.x, over[1] - p.y);
        if (d < bd) { bd = d; near = p; }
      }
      tx.t = -0.2 * value * clamp(over[0] / 50, -1, 1);
      ty.t = -0.2 * value * clamp(over[1] / 50, -1, 1);
    } else { tx.t = REST[0]; ty.t = REST[1]; }
    free = near ? [near.x, near.y] : FREE;
    for (const p of pegs) p.hd.setAttribute("class", p === near ? "dot" : "dot off");
    read.textContent = near ? "peg " + (near.i + 1) + "·" + (near.j + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 8);
      over = Math.abs(x) > 62 || Math.abs(y) > 62 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "geoboard",
  means: "A geoboard with a rubber band on its pegs: the board tips toward the pointer and the band hooks the nearest peg.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1.6],
  tour: [[200, 206], [200, 93], [313, 150], null],
  mount,
});
