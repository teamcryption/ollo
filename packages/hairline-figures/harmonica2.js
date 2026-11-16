/**
 * Harmonica: a harmonica lying in its hinged case, the lid resting ajar.
 * The pointer over the case swings the lid open on its back hinge, showing
 * the harmonica with its row of holes; the lid turns bright. At rest the
 * harmonica's edge is the bright mark. The slider is how far the lid opens.
 *
 * The pattern: one part turning about a hinge (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const L = 110, D = 34, HC = 10, T = 7, REST = 0.32;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-4, -4, 0], [L + 4, D + 4, 0], [L + 4, -4, 0], [-4, D + 4, 0], [0, -10, HC + D + 4], [L, -10, HC + D + 4]], 200, 168);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const boxPts = (x0, y0, z0, x1, y1, z1) => { const p = []; for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) p.push(P(x, y, z)); return hull(p); };
  const lidG = mk("g", {}, g);
  const tray = mk("g", {}, g);
  mk("path", { d: poly(boxPts(0, 0, 0, L, D, HC)) }, tray);
  const ins = (z) => [P(4, 4, z), P(L - 4, 4, z), P(L - 4, D - 4, z), P(4, D - 4, z)];
  mk("path", { d: poly(ins(HC)), class: "nf lo" }, tray);
  // harmonica: comb body with covers, a row of holes on its front
  const hx0 = 14, hx1 = L - 14, hy0 = 10, hy1 = 24, hz0 = HC - 3, hz1 = HC + 6;
  const harm = mk("path", { d: poly(boxPts(hx0, hy0, hz0, hx1, hy1, hz1)), class: "sil" }, tray);
  mk("path", { d: poly([P(hx0, hy1, hz0 + 3), P(hx1, hy1, hz0 + 3)]), class: "nf lo" }, tray);
  for (let i = 0; i < 10; i++) {
    const x = hx0 + 5 + i * ((hx1 - hx0 - 10) / 9);
    mk("path", { d: poly([P(x - 1.6, hy1, hz0 + 4), P(x + 1.6, hy1, hz0 + 4), P(x + 1.6, hy1, hz0 + 6.5), P(x - 1.6, hy1, hz0 + 6.5)]), class: "nf" }, tray);
  }
  const lid = mk("path", { class: "sil" }, lidG), lidIn = mk("path", { class: "nf lo" }, lidG);

  const ang = tween(REST);
  let last = NaN, behind = null;
  // hinge on the back edge (y = 0, z = HC); s runs toward the front, n along the lid's normal
  function pt(x, s, n, a) { return P(x, s * Math.cos(a) - n * Math.sin(a), HC + s * Math.sin(a) + n * Math.cos(a)); }
  function draw(a) {
    if (a === last) return;
    last = a;
    const p = [];
    for (const x of [0, L]) for (const s of [0, D]) for (const n of [0, T]) p.push(pt(x, s, n, a));
    lid.setAttribute("d", poly(hull(p)));
    lidIn.setAttribute("d", poly([pt(4, 4, 0, a), pt(L - 4, 4, 0, a), pt(L - 4, D - 4, 0, a), pt(4, D - 4, 0, a)]));
    const b = a > 0.9;
    if (b !== behind) { behind = b; if (b) g.insertBefore(lidG, tray); else g.appendChild(lidG); }
  }

  const B = register(stage, (_dt, now) => { draw(tval(ang, now)); return !tdone(ang, now); });
  bag.add(B.unregister);

  const mid = P(L / 2, D / 2, HC);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(ang, on ? 1.2 + 0.8 * (amp / 90) : REST, performance.now(), 0);
    lid.classList.toggle("hi", on);
    harm.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 130 && Math.abs(sy - mid[1]) < 70;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "harmonica2",
  means: "A harmonica in its hinged case: the pointer over the case swings the lid open on its back hinge to show the harmonica.",
  rules: [1, 3, 4, 5],
  range: [0, 60, 90],
  tour: [[198, 197], [170, 185], [240, 205], null],
  mount,
});
