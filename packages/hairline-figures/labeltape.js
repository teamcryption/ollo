/**
 * Tape gun: a label tape gun, a body with a pistol grip, a roll of labels
 * riding on top and the label strip feeding out of the nose. Over the gun the
 * strip runs out of the nose, a long tail of labels. At rest a short tab
 * shows at the nose, bright. The slider is how far the strip runs.
 */
const { Cam, clamp, facing, fit, hull, poly, prism, proj, rings, seg, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, unproj } = HL;

const BX = 44, Y0 = 2, Y1 = 14, Z0 = 14, Z1 = 26, RC = [18, 36], RR = 11, REST = 4;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let run = 30 + value / 3;
  const C = Cam(45, 0.5, 4.3);
  fit(C, [[0, Y0, 0], [BX + 60, Y1, Z0], [0, Y1, 0], [RC[0], Y0, RC[1] + RR], [BX + 60, Y0, Z0 + 4]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const grip = solid(g);
  const [gr, gi] = rings(4, Y0 + 1, 16, Y1 - 1, 4, 1);
  put(grip, prism(P, front, gr, gi, 0, Z0 + 1));
  const roll = solid(g);
  const disc = (y) => { const o = []; for (let i = 0; i < 28; i++) { const t = (i / 28) * Math.PI * 2; o.push(P(RC[0] + RR * Math.cos(t), y, RC[1] + RR * Math.sin(t))); } return o; };
  const near = disc(Y1 - 1);
  roll.sil.setAttribute("d", poly(hull(disc(Y0 + 1).concat(near))));
  const hub = []; for (let i = 0; i < 20; i++) { const t = (i / 20) * Math.PI * 2; hub.push(P(RC[0] + 4 * Math.cos(t), Y1 - 1, RC[1] + 4 * Math.sin(t))); }
  roll.cr.setAttribute("d", poly(near) + poly(hub));
  const body = solid(g);
  const [br, bi] = rings(0, Y0, BX, Y1, 4, 1.2);
  put(body, prism(P, front, br, bi, Z0, Z1));
  const strip = solid(g);

  const out = tween(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const [r, i] = rings(BX - 2, Y0 + 2, BX + o, Y1 - 2, 0.5, 0.3);
    put(strip, prism(P, front, r, i, Z0 + 2, Z0 + 3));
    let d = "";
    for (let x = BX + 8; x < BX + o - 2; x += 10) d += seg(P(x, Y0 + 2, Z0 + 3), P(x, Y1 - 2, Z0 + 3));
    strip.cr.setAttribute("d", strip.cr.getAttribute("d") + d);
  }

  const B = register(stage, (_dt, now) => { draw(tval(out, now)); return !tdone(out, now); });
  bag.add(B.unregister);

  // the hit: the pointer on the ground plane under the gun's resting footprint
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, Z0);
    return x > -6 && x < BX + 10 && y > Y0 - 12 && y < Y1 + 12;
  }

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(out, on ? run : REST, performance.now(), 0);
    strip.sil.classList.add("hi");
    read.textContent = on ? "feed" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { run = clamp(30 + v / 3, 30, 60); if (act) { tset(out, run, performance.now(), 0); B.wake(); } }, destroy: bag.dispose };
}

hairline({
  name: "labeltape",
  means: "A label tape gun: over it the label strip slides out of the nose in a long tail of labels.",
  rules: [1, 3, 5, 6],
  range: [0, 45, 90],
  tour: [[109, 117], [90, 160], [140, 215], null],
  mount,
});
