/**
 * Tape measure: a rounded square case standing on its edge, its steel blade
 * running out of the mouth at the foot with a hook on the end. The pointer
 * over it pulls the blade out along the ground; the slider is how far. At
 * rest a short length of blade lies out, its hook bright.
 */
const { Cam, clamp, fillet, fit, hull, poly, proj, unproj, tween, tset, tval, tdone, disposer, mk, pointer, register } = HL;

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

const CS = 30, W = 12, BL = 64;
const F = {
  S: 3.8, rest: 0.4, hz: 2, foot: [-6, -14, CS + BL + 10, W + 14], range: [0.5, 0.8, 1],
  say: (a) => "out " + Math.round(a * 100) + "%",
  ext() {
    return box([0, 0, 0, CS + BL + 4, W, CS]);
  },
  build(g, P) {
    const blade = part(g), hook = part(g), cas = part(g), lock = part(g);
    draw(P, cas, box([0, 0, 0, CS, W, CS]), TOPF, null, 9);
    draw(P, lock, box([6, -1, CS - 4, 16, W + 1, CS + 1.5]), null, null, 1.5);
    return {
      hi: hook.sil,
      render(t, a) {
        const x = CS + 1 + BL * t * a;
        draw(P, blade, box([CS - 2, 1.5, 1, x, W - 1.5, 2.2]), TOPF, null, 0.6);
        draw(P, hook, box([x, 1, 0, x + 2.5, W - 1, 5]), null, null, 0.8);
      },
    };
  },
};

hairline({
  name: "tapemeasure",
  means: "A tape measure: the pointer over it pulls the steel blade out of the case along the ground, hook first.",
  rules: [3, 4, 5, 6],
  range: [0.5, 0.8, 1],
  tour: [[149, 183], [283, 250], [82, 150], null],
  mount: make(F),
});
