/**
 * Guitar case: a hard case lying flat, body and neck, its lid hinged along
 * the far side. At rest the lid sits ajar and the front handle is bright;
 * the pointer over the case swings the lid open. The slider is how far.
 *
 * The pattern: one part that swings on a hinge.
 */
const { Cam, circ, fit, hull, poly, open, proj, rad, tween, tset, tval, tdone, mk, pointer, register, disposer } = HL;

const H = 16, T = 6, HY = 4, REST = 14;
const disc = (x, y, r, n = 36) => circ(r, n).map((q) => [q.u + x, q.v + y]);
const BODY = disc(40, 30, 27).concat(disc(96, 30, 21));
const NECK = [[112, 21], [176, 23], [176, 37], [112, 39]];
const rot = (a) => ([x, y, z]) => { const c = Math.cos(a), s = Math.sin(a), dy = y - HY, dz = z - H; return [x, HY + dy * c - dz * s, H + dy * s + dz * c]; };
const slab = (fp, z0, z1) => fp.map(([x, y]) => [x, y, z0]).concat(fp.map(([x, y]) => [x, y, z1]));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 1.9);
  const ext = slab(BODY.concat(NECK), 0, H + T).concat(slab(BODY.concat(NECK), H, H + T).map(rot(rad(110))));
  fit(C, ext, 200, 170);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const shape = (pts) => poly(hull(pts.map((p) => P(...p))));
  const ring = (fp, z, f = (p) => p) => poly(hull(fp.map(([x, y]) => P(...f([x, y, z])))));
  for (const fp of [BODY, NECK]) {
    mk("path", { d: shape(slab(fp, 0, H)), class: "sil" }, g);
    mk("path", { d: ring(fp, H), class: "nf lo" }, g);
  }
  mk("path", { d: shape([[50, 57, 5], [74, 57, 5], [74, 62, 5], [50, 62, 5], [50, 57, 10], [74, 57, 10], [74, 62, 10], [50, 62, 10]]), class: "sil" }, g);
  const handle = g.lastChild;
  const lid = [BODY, NECK].map(() => ({ sil: mk("path", { class: "sil" }, g), face: mk("path", { class: "nf lo" }, g) }));
  const tw = tween(REST);
  let last = NaN;
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const f = rot(rad(deg));
    [BODY, NECK].forEach((fp, i) => {
      lid[i].sil.setAttribute("d", shape(slab(fp, H, H + T).map(f)));
      lid[i].face.setAttribute("d", ring(fp, deg < 75 ? H + T : H, f));
    });
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = slab(BODY.concat(NECK), 0, H + T).map((p) => P(...p));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const box = [Math.min(...xs), Math.min(...ys) - 20, Math.max(...xs), Math.max(...ys)];
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + (110 - REST) * amt : REST, performance.now(), 0);
    lid.forEach((l) => l.sil.classList.toggle("hi", on));
    handle.classList.toggle("hi", !on);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  const inside = ([sx, sy]) => sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "guitarcase",
  means: "A hard guitar case lying flat: the pointer over it swings the lid open on its far hinge.",
  rules: [1, 4, 5, 6],
  range: [0.3, 1, 1],
  tour: [[132, 170], [200, 175], [250, 210], null],
  mount,
});
