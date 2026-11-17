/**
 * Coal scuttle: a boxy fireside scuttle on a plinth, with a domed lid hinged
 * along its back edge and a knob at the front. At rest the lid sits ajar,
 * bright. The pointer over the scuttle swings the lid up and back on its
 * hinge to show the opening. The slider is how far the lid opens.
 *
 * The pattern: one part answering a hover, hit on the rest pose.
 */
const { Cam, circ, rrect, rings, prism, fit, hull, poly, proj, rad, facing, tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid } = HL;

const L = 44, Wd = 32, BZ = 36, HZ = BZ + 1;
const at = (ring, z, ox = 0, oy = 0) => ring.map((q) => [q.u + ox, q.v + oy, z]);
const roty = (p, a, cx, cz) => { const dx = p[0] - cx, dz = p[2] - cz, c = Math.cos(a), s = Math.sin(a); return [cx + dx * c + dz * s, p[1], cz - dx * s + dz * c]; };
const LID = [at(rrect(-1, -1, L + 1, Wd + 1, 5, 8), HZ), at(rrect(-1, -1, L + 1, Wd + 1, 5, 8), HZ + 3), at(rrect(5, 4, L - 6, Wd - 4, 6, 8), HZ + 9)];
const LIDCR = at(rrect(6.4, 5.4, L - 7.4, Wd - 5.4, 4.6, 8), HZ + 9);
const KNOB = [at(circ(2.4, 14), HZ + 2, L - 2, Wd / 2), at(circ(2.4, 14), HZ + 6, L + 2.5, Wd / 2)];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let open = value;
  const C = Cam(45, 0.5, 3.05);
  const pose = (p, a) => roty(p, -a, 0, HZ);
  const ext = [[-3, -3, 0], [L + 3, Wd + 3, 0], [L + 3, -3, 0], [-3, Wd + 3, 0]];
  for (const a of [0, rad(125)]) for (const r of LID.concat(KNOB)) for (const p of r) ext.push(pose(p, a));
  fit(C, ext, 200, 168);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const [pr, pi] = rings(-3, -3, L + 3, Wd + 3, 4, 1.4);
  put(solid(g), prism(P, front, pr, pi, 0, 4));
  const [br, bi] = rings(0, 0, L, Wd, 5, 2.2);
  const body = solid(g);
  put(body, prism(P, front, br, bi, 4, BZ));
  mk("path", { class: "nf lo", d: poly(at(rrect(4, 4, L - 4, Wd - 4, 3, 6), BZ - 0.2).map((p) => P(...p))) }, body.g);
  const lid = solid(g), knob = solid(g);
  lid.sil.classList.add("hi");
  const tw = tween(rad(14));
  let last = NaN;

  function draw(a) {
    if (a === last) return;
    last = a;
    const prj = (r) => r.map((p) => P(...pose(p, a)));
    lid.sil.setAttribute("d", poly(hull(LID.flatMap(prj))));
    lid.cr.setAttribute("d", poly(prj(LIDCR)));
    knob.sil.setAttribute("d", poly(hull(KNOB.flatMap(prj))));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const rest = ext.slice(0, 4).concat(LID.flat().map((p) => pose(p, rad(14)))).map((p) => P(...p));
  const xs = rest.map((q) => q[0]), ys = rest.map((q) => q[1]);
  const box = [Math.min(...xs) - 4, Math.min(...ys) - 4, Math.max(...xs) + 4, Math.max(...ys) + 4];
  const hit = ([sx, sy]) => sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? rad(open) : rad(14), performance.now(), 0);
    read.textContent = on ? "open" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { open = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "coalscuttle",
  means: "A boxy coal scuttle with a domed lid hinged at the back: under the pointer the lid swings up and open.",
  rules: [1, 4, 5, 8],
  range: [70, 105, 125],
  tour: [[240, 162], [200, 150], [190, 230], null],
  mount,
});
