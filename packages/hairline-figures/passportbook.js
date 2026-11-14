/**
 * Stamp desk: an official's desk with an ink pad and an open document, and a
 * hand stamp. The stamp glides after the pointer across the desk on springs,
 * and presses down when it is over the document. At rest it waits lifted over
 * the ink pad, bright.
 */
const {
  Cam, circ, facing, fit, prism, proj, rings, seg, unproj, clamp,
  spring, stepS, disposer, mk, pointer, put, register, solid,
} = HL;

const TZ = 6, PAD = [-34, -18], DOC = [-8, -20, 34, 18];
const disc = (x, y, r, n = 24) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const box = (x, y, w, d, r, b) => rings(x - w, y - d, x + w, y + d, r, b);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-52, -36, 0], [52, 36, 0], [52, -36, 0], [-52, 36, 0], [-34, -18, 40]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const desk = rings(-52, -36, 52, 36, 6, 2);
  put(solid(g), prism(P, front, desk[0], desk[1], 0, TZ));
  const pad = box(PAD[0], PAD[1], 9, 7, 2, 1.2);
  put(solid(g), prism(P, front, pad[0], pad[1], TZ, TZ + 3));
  const doc = rings(DOC[0], DOC[1], DOC[2], DOC[3], 1.5, 0.8);
  put(solid(g), prism(P, front, doc[0], null, TZ, TZ + 0.8));
  let lines = seg(P(DOC[0] + 21, DOC[1] + 1, TZ + 0.8), P(DOC[0] + 21, DOC[3] - 1, TZ + 0.8));
  for (let i = 0; i < 4; i++) { const y = DOC[1] + 7 + i * 7; lines += seg(P(DOC[0] + 4, y, TZ + 0.8), P(DOC[0] + 17, y, TZ + 0.8)); }
  mk("path", { class: "lo nf", d: lines }, g);

  const block = solid(g), stem = solid(g), knob = solid(g);
  const LIFT = 16;
  const sx = spring(PAD[0]), sy = spring(PAD[1]), sh = spring(TZ + 3 + 9);
  let drawn = "";
  function draw() {
    const x = sx.x, y = sy.x, h = sh.x, key = x.toFixed(3) + y.toFixed(3) + h.toFixed(3);
    if (key === drawn) return;
    drawn = key;
    const b = box(x, y, 9, 8, 2, 1);
    put(block, prism(P, front, b[0], b[1], h, h + 6));
    put(stem, prism(P, front, disc(x, y, 1.8), null, h + 6, h + 17));
    put(knob, prism(P, front, disc(x, y, 6, 32), disc(x, y, 4.8, 32), h + 17, h + 23));
  }
  const B = register(stage, (dt) => {
    const m = [sx, sy, sh].map((s) => stepS(s, dt)).some(Boolean);
    draw();
    return m;
  });
  bag.add(B.unregister);

  function go(p) {
    let tag = "rest";
    if (!p) { sx.t = PAD[0]; sy.t = PAD[1]; sh.t = TZ + 12; }
    else {
      const x = clamp(p[0], -44, 44), y = clamp(p[1], -29, 29);
      const on = x > DOC[0] + 4 && x < DOC[2] - 4 && y > DOC[1] + 3 && y < DOC[3] - 3;
      sx.t = x; sy.t = y; sh.t = on ? TZ + 0.8 : TZ + LIFT * value;
      tag = on ? "stamp" : "lift";
    }
    block.sil.classList.add("hi");
    read.textContent = tag;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const [x, y] = unproj(C, p[0], p[1], TZ);
      go(Math.abs(x) > 70 || Math.abs(y) > 55 ? null : [x, y]);
    },
    leave: () => go(null),
  }));
  bag.add(() => svg.replaceChildren());
  go(null);
  draw();
  return { set: (v) => { value = v; }, destroy: bag.dispose };
}

hairline({
  name: "passportbook",
  means: "A stamp desk: the hand stamp glides after the pointer and presses down on the document when it is over it.",
  rules: [1, 3, 5, 8],
  range: [0.6, 1, 1.4],
  tour: [[80, 171], [226, 209], [222, 247], null],
  mount,
});
