/**
 * Long stapler: a long-reach stapler, its arm hinged on a post at the back of a long base. The pointer over it swings the arm open; the slider is how far. At rest the arm sits just ajar, bright.
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

const L = 96, W = 14;
const F = {
  S: 3.0, rest: 0.22, hz: 8, foot: [-4, -6, L + 4, W + 6], range: [15, 32, 45],
  say: (a) => "open " + Math.round(a) + "°",
  arm: (a) => ({ ax: "y", h: [5, 8], a: (a * Math.PI) / 180 }),
  ext(a) {
    return box([0, -2, 0, L, W + 2, 4]).concat(box([2, 1, 8, L - 2, W - 1, 15]).map((p) => rot(p, F.arm(a))));
  },
  build(g, P) {
    const base = part(g), stop = part(g), post = part(g), arm = part(g);
    draw(P, base, box([0, -2, 0, L, W + 2, 4]), TOPF, null, 4);
    draw(P, stop, box([L - 22, 3, 4, L - 6, W - 3, 5.2]), null);
    draw(P, post, box([0, 1, 4, 12, W - 1, 11]), null, null, 3);
    return {
      hi: arm.sil,
      render(t, a) {
        const r = F.arm(t * a);
        draw(P, arm, box([2, 1, 8, L - 2, W - 1, 15]), TOPF, r, 3.5);
      },
    };
  },
};

hairline({
  name: "staplerbig",
  means: "A long-reach stapler: the pointer over it swings the long arm open on its back hinge.",
  rules: [3, 4, 5, 6],
  range: [15, 32, 45],
  tour: [[268, 225], [190, 195], [245, 250], null],
  mount: make(F),
});
