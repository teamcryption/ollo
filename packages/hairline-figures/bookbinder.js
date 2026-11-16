/**
 * Comb binder: a comb binding machine, its punch lid hinged at the back, a plastic comb lying open along the front and the long handle at its end. The pointer over it tips the lid open and pulls the handle down; the slider is how far. At rest the lid sits ajar, bright.
 */
const { Cam, rad, clamp, fillet, fit, hull, poly, proj, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

// a world point turned about an axis along x or y through h, then moved by d
function rot(p, r) {
  if (!r) return p;
  let [x, y, z] = p;
  const c = Math.cos(r.a), s = Math.sin(r.a), d = r.d || [0, 0, 0];
  if (r.ax === "y") { const u = x - r.h[0], w = z - r.h[1]; x = r.h[0] + u * c - w * s; z = r.h[1] + u * s + w * c; }
  else if (r.ax === "x") { const u = y - r.h[0], w = z - r.h[1]; y = r.h[0] + u * c - w * s; z = r.h[1] + u * s + w * c; }
  return [x + d[0], y + d[1], z + d[2]];
}
const box = ([x0, y0, z0, x1, y1, z1]) => [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]];
const rnd = (pts, r) => fillet(pts, pts.map(() => r), 3);
function part(g, cls) { const p = mk("g", {}, g); return { g: p, sil: mk("path", { class: cls || "sil" }, p), cr: mk("path", { class: "nf lo" }, p) }; }
// a solid from its corners: a rounded hull, and the top face as its one crease
function draw(P, el, pts, top, r, rr) {
  const q = pts.map((p) => P(...rot(p, r)));
  el.sil.setAttribute("d", poly(rnd(hull(q), rr || 2.5)));
  el.cr.setAttribute("d", top ? poly(rnd(top.map((i) => q[i]), 1.5)) : "");
}
const TOPF = [4, 5, 6, 7];

function make(F) {
  return function mount({ stage, svg, read }, value) {
    const bag = disposer();
    let amp = value;
    const C = Cam(45, 0.5, F.S);
    fit(C, F.ext(F.range[2]), 200, 166);
    const P = proj(C), g = mk("g", {}, svg);
    const fig = F.build(g, P), tw = tween(F.rest);
    let last = NaN;
    const B = register(stage, (_dt, now) => {
      const t = tval(tw, now);
      if (t !== last) { last = t; fig.render(t, amp); }
      return !tdone(tw, now);
    });
    bag.add(B.unregister);
    // the hit: the pointer on a fixed plane through the resting body
    function hit([sx, sy]) {
      const [x, y] = unproj(C, sx, sy, F.hz), [x0, y0, x1, y1] = F.foot;
      return x > x0 && x < x1 && y > y0 && y < y1;
    }
    let act = null;
    function set(on) {
      if (on === act) return;
      act = on;
      tset(tw, on ? 1 : F.rest, performance.now(), 0);
      read.textContent = on ? F.say(amp) : "rest";
      B.wake();
    }
    set(false);
    fig.hi.classList.add("hi");
    bag.add(pointer(stage, { move: (p) => set(hit(p)), leave: () => set(false) }));
    bag.add(() => svg.replaceChildren());
    return { set: (v) => { amp = v; last = NaN; if (act) read.textContent = F.say(amp); B.wake(); }, destroy: bag.dispose };
  };
}
const hide = (el) => { el.sil.setAttribute("d", ""); el.cr.setAttribute("d", ""); };

const BL = 72, BW = 40;
const F = {
  S: 2.95, rest: 0.15, hz: 12, foot: [-4, -4, BL + 14, BW + 4], range: [40, 70, 85],
  say: (a) => "open " + Math.round(a) + "°",
  lid: (a) => ({ ax: "x", h: [0, 12], a: (a * Math.PI) / 180 }),
  lev: (t) => ({ ax: "y", h: [BL + 4, 8], a: rad(-8 - t * 62) }),
  ext: (a) => box([0, 0, 0, BL, BW, 12]).concat(box([2, 0, 12, BL - 2, 28, 15]).map((p) => rot(p, F.lid(a))), box([BL + 2, 16, 6, BL + 6, 24, 48]).map((p) => rot(p, F.lev(1)))),
  build(g, P) {
    const base = part(g), lid = part(g), comb = part(g), lev = part(g);
    draw(P, base, box([0, 0, 0, BL, BW, 12]), TOPF, null, 4);
    return {
      hi: lid.sil,
      render(t, a) {
        draw(P, lid, box([2, 1, 12, BL - 2, 28, 15]), TOPF, F.lid(t * a), 3);
        draw(P, comb, box([6, 31, 12, BL - 6, 37, 15]), null, null, 2);
        let d = "";
        for (let i = 0; i < 11; i++) { const x = 9 + i * 5.4, ring = []; for (let k = 0; k <= 8; k++) { const q = Math.PI * (k / 8); ring.push(P(x, 34 + 4 * Math.cos(q), 15 + 5 * Math.sin(q))); } d += "M" + ring.join("L"); }
        comb.cr.setAttribute("d", d);
        draw(P, lev, box([BL + 2, 16, 6, BL + 6, 24, 48]), null, F.lev(t), 2);
      },
    };
  },
};

hairline({
  name: "bookbinder",
  means: "A comb binding machine: the pointer over it tips the punch lid open and swings the long handle down.",
  rules: [3, 4, 5, 6],
  range: [40, 70, 85],
  tour: [[173, 178], [145, 160], [205, 250], null],
  mount: make(F),
});
