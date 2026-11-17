/**
 * Collar box: a round leather box for stiff collars, a drum with a hinged
 * lid and a coiled collar inside. The pointer over it swings the lid open on
 * its back hinge. At rest the lid sits ajar and the drum is bright; when the
 * pointer plays, the lid is. The slider is how far the lid opens.
 *
 * The pattern: one part turning about a hinge (swing).
 */
const { Cam, fit, hull, poly, proj, tdone, tset, tval, tween, disposer, mk, pointer, register } = HL;

const R = 36, H = 26, T = 6, REST = 34;
const ringPts = (P, r, z, n = 48, cx = 0, cy = 0) => Array.from({ length: n }, (_, i) => { const t = (i / n) * Math.PI * 2; return P(cx + r * Math.cos(t), cy + r * Math.sin(t), z); });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.45);
  fit(C, [[-R, -R, 0], [R, R, 0], [R, -R, 0], [-R, R, 0], [0, -R - 1, H + 2 * R + 8]], 200, 171);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const drum = mk("path", { d: poly(hull(ringPts(P, R, 0).concat(ringPts(P, R, H)))), class: "sil" }, g);
  mk("path", { d: poly(ringPts(P, R, H)), class: "nf lo" }, g);
  mk("path", { d: poly(ringPts(P, R - 3, H)), class: "nf lo" }, g);
  const coil = [];
  for (let i = 0; i <= 80; i++) { const t = (i / 80) * Math.PI * 4.5, r = 26 - i * 0.2; coil.push(P(r * Math.cos(t), r * Math.sin(t), H - 2)); }
  mk("path", { d: "M" + coil.map((p) => p.join(",")).join("L"), class: "nf" }, g);
  const lid = mk("path", { class: "sil" }, g), face = mk("path", { class: "nf lo" }, g);

  // the lid: a disc hinged at y = -R on top of the drum, turned up by deg
  function lidRing(deg, off) {
    const a = (deg * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a);
    return Array.from({ length: 48 }, (_, i) => {
      const t = (i / 48) * Math.PI * 2, x = (R + 1) * Math.cos(t), v = (R + 1) * Math.sin(t) + R + 1;
      return P(x, -R - 1 + v * c - off * s, H + v * s + off * c);
    });
  }
  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    lid.setAttribute("d", poly(hull(lidRing(deg, 0).concat(lidRing(deg, T)))));
    const a = (deg * Math.PI) / 180, top = -0.61 * Math.sin(a) + 0.5 * Math.cos(a) > 0;
    face.setAttribute("d", poly(lidRing(deg, top ? T : 0)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(0, 0, H);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + 76 * amp : REST, performance.now(), 0);
    lid.classList.toggle("hi", on);
    drum.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.hypot(sx - mid[0], sy - mid[1]) < 110;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "collarbox",
  means: "A round collar box with a coiled collar inside: over it, the hinged lid swings open on its back hinge.",
  rules: [1, 4, 5, 8],
  range: [0.4, 1, 1],
  tour: [[200, 213], [200, 141], [200, 312], null],
  mount,
});
