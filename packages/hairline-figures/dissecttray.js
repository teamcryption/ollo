/**
 * Dissection tray: a shallow wax-lined pan with a specimen pinned out on its
 * floor. The pointer tips the tray toward itself on a spring, and the pin
 * nearest it is bright. At rest the tray sits a little askew, one pin bright.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, ringAt, seg, unproj, spring, stepS, clamp,
  disposer, flatDot, mk, place, poly, pointer, put, register, solid,
} = HL;

const PINS = [[-17, -22], [17, -22], [-22, 10], [22, 10], [-12, 26], [12, 26], [0, -34]];
const FAV = 6, REST = [0.05, -0.06];
const oval = (cx, cy, a, b) => circ(1, 32).map((q) => ({ ...q, u: cx + q.u * a, v: cy + q.v * b }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.1);
  const ext = [];
  for (const x of [-62, 62]) for (const y of [-46, 46]) for (const z of [-16, 26]) ext.push([x, y, z]);
  fit(C, ext, 200, 162);
  const P = proj(C), front = facing(C);
  const TR = rings(-60, -44, 60, 44, 7, 1.8), FL = rings(-53, -37, 53, 37, 5, 1)[0];
  const BODY = oval(0, -2, 9, 15), HEAD = oval(0, -21, 6.5, 5.5);
  const g = mk("g", {}, svg);
  const tray = solid(g);
  const floor = mk("path", { class: "lo nf" }, g);
  const frog = mk("path", { class: "nf" }, g);
  const pins = PINS.map(([x, y], k) => ({ k, x, y })).sort((a, b) => a.x + a.y - (b.x + b.y));
  for (const p of pins) { p.sh = mk("path", { class: "nf sil" }, g); p.hd = flatDot(g, C, 1.9, "dot m"); }
  const tx = spring(REST[0]), ty = spring(REST[1]);
  let drawn = "";

  function draw() {
    const key = tx.x.toFixed(4) + "," + ty.x.toFixed(4);
    if (key === drawn) return;
    drawn = key;
    const Q = (x, y, z) => P(x, y, z + tx.x * x + ty.x * y);
    put(tray, prism(Q, front, TR[0], TR[1], 0, 9));
    floor.setAttribute("d", poly(ringAt(Q, FL, 4)));
    let d = poly(ringAt(Q, BODY, 4)) + poly(ringAt(Q, HEAD, 4));
    for (const p of pins) if (p.k !== FAV) d += seg(Q(Math.sign(p.x) * 6, p.y * 0.4, 4), Q(p.x, p.y, 4));
    frog.setAttribute("d", d);
    for (const p of pins) { p.sh.setAttribute("d", seg(Q(p.x, p.y, 4), Q(p.x, p.y, 16))); place(p.hd, Q(p.x, p.y, 16)); }
  }

  const B = register(stage, (dt) => {
    const m = stepS(tx, dt) | stepS(ty, dt);
    draw();
    return !!m;
  });
  bag.add(B.unregister);

  let over = null;
  function retarget() {
    let near = null;
    if (over) {
      let bd = Infinity;
      for (const p of pins) { const d = Math.hypot(over[0] - p.x, over[1] - p.y); if (d < bd) { bd = d; near = p; } }
      tx.t = -0.2 * value * clamp(over[0] / 60, -1, 1);
      ty.t = -0.2 * value * clamp(over[1] / 44, -1, 1);
    } else { tx.t = REST[0]; ty.t = REST[1]; }
    for (const p of pins) {
      const on = near ? p === near : p.k === FAV;
      p.sh.classList.toggle("hi", on);
      p.hd.setAttribute("class", on ? "dot" : "dot m");
    }
    read.textContent = near ? "pin " + (near.k + 1) : "rest";
    B.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], 9);
      over = Math.abs(x) > 72 || Math.abs(y) > 56 ? null : [x, y];
      retarget();
    },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { value = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "dissecttray",
  means: "A wax dissection tray with a pinned specimen: the tray tips toward the pointer, and the nearest pin is bright.",
  rules: [1, 3, 4, 5, 8],
  range: [0.4, 1, 1.6],
  tour: [[218, 166], [180, 95], [224, 220], null],
  mount,
});
