/**
 * Watch roll: a leather travel roll for watches. The pointer over it unrolls
 * it along the table, laying the flat inside out with its row of watch
 * pillows, the roll travelling as it goes. At rest it is rolled up and the
 * roll is bright; when the pointer plays, the laid-out strip is. The slider
 * is how far it unrolls.
 *
 * The pattern: one part sliding out (unroll).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const W = 30, Y0 = -62, R0 = 17, REST = -2, OPEN = 74, PIL = [-48, -20, 8, 36, 64];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.6);
  fit(C, [[-W, Y0, 0], [W, Y0, 0], [-W, OPEN + R0, 0], [W, OPEN + R0, 0], [W, REST, 2 * R0 + 4], [-W, Y0, 2 * R0]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const strip = mk("path", { class: "sil" }, g), stripTop = mk("path", { class: "nf lo" }, g);
  const pills = PIL.map(() => mk("path", { class: "nf" }, g));
  const roll = mk("path", { class: "sil" }, g), end = mk("path", { class: "nf lo" }, g), core = mk("path", { class: "nf lo" }, g);
  const circ = (x, yc, zc, r, n = 32) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(x, yc + r * Math.cos(t), zc + r * Math.sin(t)); });

  function draw(yc) {
    const f = (yc - REST) / (OPEN - REST), r = R0 - 7 * f;
    const box = (x0, x1, y0, y1, z0, z1) => { const o = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) o.push(P(x, y, z)); return o; };
    strip.setAttribute("d", poly(hull(box(-W, W, Y0, yc, 0, 2))));
    stripTop.setAttribute("d", poly([P(-W + 3, Y0 + 3, 2), P(W - 3, Y0 + 3, 2), P(W - 3, yc, 2), P(-W + 3, yc, 2)]));
    PIL.forEach((y, i) => {
      const show = y + 8 < yc - r;
      pills[i].setAttribute("d", show ? poly(hull(circ(-W + 6, y, 8, 6, 16).concat(circ(W - 6, y, 8, 6, 16)))) : "");
    });
    roll.setAttribute("d", poly(hull(circ(-W, yc, r, r).concat(circ(W, yc, r, r)))));
    end.setAttribute("d", poly(circ(W, yc, r, r - 1.5)));
    core.setAttribute("d", poly(circ(W, yc, r, r * 0.35, 16)));
  }
  const tw = tween(REST);
  let last = NaN;
  const B = register(stage, (_dt, now) => { const x = tval(tw, now); if (x !== last) { last = x; draw(x); } return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, 4);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + (OPEN - REST) * amp : REST, performance.now(), 0);
    strip.classList.toggle("hi", on);
    roll.classList.toggle("hi", !on);
    read.textContent = on ? "unroll" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], sy - mid[1]) < 130;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "cufflinkbox",
  means: "A leather watch roll: over it, it unrolls along the table to lay out its row of watch pillows.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[230, 113], [116, 246], [337, 136], null],
  mount,
});
