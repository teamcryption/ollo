/**
 * Glue gun: a hot glue gun standing on its grip, a fat barrel, a tapered
 * nozzle, a trigger and a glue stick out of the back. The pointer over it
 * squeezes the trigger and tips the whole gun nozzle-down onto the bench, a
 * bead of glue at the tip. At rest the trigger is bright. The slider is how
 * far it tips.
 */
const { Cam, fillet, fit, hull, poly, proj, rrect, tween, tset, tval, tdone, unproj, disposer, mk, pointer, register } = HL;

const rz = (a) => ([x, y, z]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const pitch = (a) => ([x, y, z]) => [x * Math.cos(a) - z * Math.sin(a), y, x * Math.sin(a) + z * Math.cos(a)];
const tr = (dx, dy, dz) => ([x, y, z]) => [x + dx, y + dy, z + dz];
const chain = (...fs) => (p) => fs.reduce((q, f) => f(q), p);
const D = Math.PI / 180, BASE = -8 * D, PX = -30;
const rr = (u0, v0, u1, v1, r) => rrect(u0, v0, u1, v1, r).map((q) => [q.u, q.v]);

// side profiles [u = x, v = z], each extruded across y, in paint order
const STICK = rr(-64, 39, -36, 47, 4);
const GRIP = fillet([[-38, 40], [-14, 40], [-20, 0], [-40, 0]], [3, 3, 4, 4]);
const BARREL = rr(-42, 32, 30, 54, 10);
const NOZZLE = fillet([[28, 37], [28, 49], [48, 44.5], [48, 41.5]], [2, 2, 1.2, 1.2]);
const TRIG = rr(-12, 14, -4, 32, 3.5);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.35);
  const pose = (o) => chain(tr(-PX, 0, 0), pitch(-max * o * D), tr(PX, 0, 0), rz(BASE));
  const ext = [];
  for (const o of [0, 1]) for (const p of [[-66, 0, 48], [50, 0, 44], [-40, 0, 0], [-14, 0, 56], [50, 0, 0]]) for (const y of [-12, 12]) ext.push(chain(tr(0, y, 0), (q) => q)(pose(o)(p)));
  max = 60; for (const p of [[50, 0, 44], [-66, 0, 48]]) ext.push(pose(1)(p)); max = value;
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const pad = rrect(-58, -22, 64, 22, 8);
  mk("path", { class: "nf lo", d: poly(pad.map((q) => P(...rz(BASE)([q.u, q.v, 0])))) }, g);
  const drop = mk("path", { class: "nf" }, g);
  const parts = [[STICK, -4, 4], [GRIP, -7, 7], [TRIG, -4, 4], [BARREL, -9, 9], [NOZZLE, -4, 4]].map(([pr, y0, y1]) => ({ pr, y0, y1, sil: mk("path", { class: "sil" }, g), cr: mk("path", { class: "nf lo" }, g) }));
  const trig = parts[2], noz = parts[4];
  const tw = tween(0);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const Tf = pose(o);
    for (const pt of parts) {
      let pr = pt.pr;
      if (pt === trig) pr = pr.map(([u, v]) => [u - 6 * o * (32 - v) / 18, v]);
      const at = (y) => pr.map(([u, v]) => P(...Tf([u, y, v])));
      pt.sil.setAttribute("d", poly(hull(at(pt.y0).concat(at(pt.y1)))));
      const cx = pr.reduce((s, p) => s + p[0], 0) / pr.length, cz = pr.reduce((s, p) => s + p[1], 0) / pr.length;
      pt.cr.setAttribute("d", pt === trig ? "" : poly(pr.map(([u, v]) => P(...Tf([cx + (u - cx) * 0.86, pt.y1, cz + (v - cz) * 0.8])))));
    }
    const tip = Tf([49, 0, 43]);
    const r = 3.5 * o, ring = rrect(-r, -r, r, r, r).map((q) => P(tip[0] + q.u, tip[1] + q.v, 0));
    drop.setAttribute("d", o > 0.05 ? poly(hull(ring.concat(ring.map(([x, y]) => [x, y - 4 * o])))) : "");
  }

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(tw, a ? 1 : 0, performance.now(), 0);
    trig.sil.classList.toggle("hi", !a);
    noz.sil.classList.toggle("hi", a);
    read.textContent = a ? "tip " + Math.round(max) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), [u, v] = rz(-BASE)([x, y, 0]);
    return u > -70 && u < 66 && Math.abs(v) < 30;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "gluegun",
  means: "A hot glue gun on a bench pad: the pointer over it squeezes the trigger and tips the gun nozzle-down, a bead of glue at the tip.",
  rules: [1, 3, 5, 8],
  range: [20, 32, 42],
  tour: [[205, 173], [160, 152], [111, 137], null],
  mount,
});
