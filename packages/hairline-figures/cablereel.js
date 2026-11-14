/**
 * Cable tray: a ladder rack, two rails joined by rungs, with three cables
 * laid along it. The pointer is a hand along the tray: the cables lift off
 * the rungs in a loop where it is, the middle one highest, and settle back
 * behind it. At rest the cables keep a small hump, the middle one bright.
 * The slider is the loop's height.
 *
 * The pattern: a field answering a continuous position (terrain), on a line.
 */
const {
  Cam, fit, facing, open, poly, prism, proj, rings, unproj, clamp,
  disposer, mk, pointer, put, register, solid, spring, stepS,
} = HL;

const L = 176, DW = 36, RH = 9, RUNG = 16, LIFT = 30, CAB = [[10, 0.75, 3.2], [18, 1, 3.8], [26, 0.6, 2.8]];
const REST_X = L * 0.32, REST_A = 0.3, SIG = 22;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let hgt = value;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[0, 0, 0], [L, 0, 0], [0, DW, 0], [L, DW, 0], [L / 2, 0, LIFT + 12], [0, DW / 2, LIFT + 12]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const bar = (x0, y0, x1, y1, z0, z1) => { const [r, i] = rings(x0, y0, x1, y1, 1, 0.5); put(solid(g), prism(P, front, r, i, z0, z1)); };
  bar(0, 0, L, 2.6, 0, RH);
  for (let x = 6; x < L; x += RUNG) bar(x, 2.6, x + 3, DW - 2.6, 1, 3.4);
  const cabs = CAB.map(([y, w, r], k) => ({ y, w, r, el: mk("path", { class: k === 1 ? "hi" : "" }, g) }));
  bar(0, DW - 2.6, L, DW, 0, RH);

  const cx = spring(REST_X), amp = spring(REST_A);
  let last = "";
  function draw() {
    const key = cx.x.toFixed(2) + amp.x.toFixed(3) + hgt;
    if (key === last) return;
    last = key;
    for (const cb of cabs) {
      const up = [], dn = [];
      for (let i = 0; i <= 60; i++) {
        const x = 1 + (i / 60) * (L - 2), b = Math.exp(-((x - cx.x) ** 2) / (2 * SIG * SIG)) * amp.x * hgt * LIFT * cb.w;
        const z = 3.4 + cb.r + b;
        up.push(P(x, cb.y, z + cb.r)); dn.push(P(x, cb.y, z - cb.r));
      }
      cb.el.setAttribute("d", poly(up.concat(dn.reverse())));
    }
  }

  const B = register(stage, (dt) => { const m = stepS(cx, dt) | stepS(amp, dt); draw(); return !!m; });
  bag.add(B.unregister);

  function aim(p) {
    let on = false;
    if (p) {
      const [x, y] = unproj(C, p[0], p[1], 0);
      if (x > -10 && x < L + 10 && y > -40 && y < DW + 40) { on = true; cx.t = clamp(x, 8, L - 8); amp.t = 1; }
    }
    if (!on) { cx.t = REST_X; amp.t = REST_A; }
    read.textContent = on ? "rung " + (1 + Math.round((cx.t - 7.5) / RUNG)) : "rest";
    B.wake();
  }
  draw();
  aim(null);
  bag.add(pointer(stage, { move: (p) => aim(p), leave: () => aim(null) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { hgt = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "cablereel",
  means: "A ladder cable tray: the cables lift off the rungs in a loop wherever the pointer runs along it, then settle back.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[103, 144], [252, 218], [301, 243], null],
  mount,
});
