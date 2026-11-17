/**
 * Caulk gun: a long open cradle holding a tube, a grip and trigger at the
 * back and the plunger rod running out behind with its thumb ring. The
 * pointer over it squeezes the trigger and draws the rod back; the slider is
 * how far. At rest the rod stands part way out, bright.
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

const L = 70, W = 14;
const F = {
  S: 3.4, rest: 0.2, hz: 24, foot: [-50, -14, L + 6, W + 14], range: [24, 36, 46],
  say: (a) => "draw " + Math.round(a) + "mm",
  trig: (t) => ({ ax: "y", h: [-2, 22], a: (-t * 0.5) }),
  ext(a) {
    return box([-a - 14, 0, 0, L, W, 34]);
  },
  build(g, P) {
    const grip = part(g), trig = part(g), rod = part(g), ring = part(g), tube = part(g), cradle = part(g);
    draw(P, grip, box([-8, 2, 0, 2, W - 2, 22]), null, null, 3);
    draw(P, cradle, box([0, 0, 20, L, W, 24]), TOPF, null, 2);
    draw(P, tube, box([4, 1, 24, L - 4, W - 1, 36]), TOPF, null, 5);
    return {
      hi: rod.sil,
      render(t, a) {
        const x = -6 - t * a;
        draw(P, trig, box([2, 4, 4, 9, W - 4, 21]), null, F.trig(t), 2.5);
        draw(P, rod, box([x, 5, 27, 8, W - 5, 29]), null, null, 1);
        draw(P, ring, box([x - 7, 2, 22, x, W - 2, 34]), null, null, 3);
      },
    };
  },
};

hairline({
  name: "caulkgun",
  means: "A caulk gun: the pointer over it squeezes the trigger and draws the plunger rod and its thumb ring back.",
  rules: [3, 4, 5, 6],
  range: [24, 36, 46],
  tour: [[260, 175], [344, 218], [176, 133], null],
  mount: make(F),
});
