/**
 * Tambourine: a round hoop with a head, pairs of jingles set in slots round
 * its wall. At rest it lies tipped a little with one jingle bright; the
 * pointer over it tilts the hoop up on its side. The slider is how far.
 *
 * The pattern: one solid that tilts about an axis.
 */
const { Cam, fit, hull, poly, proj, rad, tween, tset, tval, tdone, mk, pointer, register, disposer } = HL;

const R = 50, HH = 11, NJ = 8, REST = 22, FAV = 1;
const rotX = (a) => ([x, y, z]) => { const c = Math.cos(a), s = -Math.sin(a); return [x, y * c - z * s, HH / 2 + y * s + (z - HH / 2) * c + (1 - c) * 0]; };
const ring = (r, z, n = 48) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [r * Math.cos(t), r * Math.sin(t), z]; });

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.8);
  const ext = [];
  for (const d of [REST, 55]) for (const z of [0, HH]) ext.push(...ring(R + 4, z, 16).map(rotX(rad(d))));
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const sil = mk("path", { class: "sil" }, g), head = mk("path", { class: "nf lo" }, g), rim = mk("path", { class: "nf lo" }, g);
  const jg = mk("g", {}, g);
  const jingles = Array.from({ length: NJ }, (_, k) => {
    const t = ((k + 0.5) / NJ) * 2 * Math.PI;
    return { t, el: mk("path", { class: k === FAV ? "sil hi" : "sil" }, jg), slot: mk("path", { class: "nf lo" }, jg) };
  });
  const tw = tween(REST);
  let last = NaN;
  const pp = (pts, f) => pts.map((p) => P(...f(p)));
  function draw(deg) {
    if (deg === last) return;
    last = deg;
    const f = rotX(rad(deg)), c = Math.cos(rad(deg)), s = -Math.sin(rad(deg));
    sil.setAttribute("d", poly(hull(pp(ring(R, 0).concat(ring(R, HH)), f))));
    head.setAttribute("d", poly(pp(ring(R, HH), f)));
    rim.setAttribute("d", poly(pp(ring(R - 3, HH), f)));
    for (const j of jingles) {
      const ux = Math.cos(j.t), uy = Math.sin(j.t), tx = -uy, ty = ux;
      const ny = uy * c, nz = uy * s; // the wall's normal, tilted
      const vis = ux + ny + nz * 0.82 > 0.15;
      if (!vis) { j.el.setAttribute("d", ""); j.slot.setAttribute("d", ""); continue; }
      const pts = [], sl = [];
      for (const o of [-1, 1]) for (const w of [-5, 5]) for (const h of [2.5, HH - 2.5]) pts.push([(R + 1.5 + o * 1.2) * ux + w * tx, (R + 1.5 + o * 1.2) * uy + w * ty, h]);
      for (const [w, h] of [[-7, 1.5], [7, 1.5], [7, HH - 1.5], [-7, HH - 1.5]]) sl.push([R * ux + w * tx, R * uy + w * ty, h]);
      j.slot.setAttribute("d", poly(pp(sl, f)));
      j.el.setAttribute("d", poly(hull(pp(pts, f))));
    }
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rest = ring(R + 4, 0, 24).concat(ring(R + 4, HH, 24)).map(rotX(rad(REST))).map((p) => P(...p));
  const xs = rest.map((p) => p[0]), ys = rest.map((p) => p[1]);
  const box = [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? REST + (55 - REST) * amt : REST, performance.now(), 0);
    sil.classList.toggle("hi", on);
    jingles.forEach((j, k) => j.el.classList.toggle("hi", !on && k === FAV));
    read.textContent = on ? "tilt" : "rest";
    B.wake();
  }
  setActive(false);
  const inside = ([sx, sy]) => sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (act) { act = null; setActive(true); } }, destroy: bag.dispose };
}

hairline({
  name: "triangle2",
  means: "A tambourine with jingles round its hoop: the pointer over it tilts the hoop up on its side.",
  rules: [1, 4, 5, 6],
  range: [0.3, 1, 1],
  tour: [[204, 142], [160, 170], [250, 160], null],
  mount,
});
