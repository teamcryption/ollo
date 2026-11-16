/**
 * Card index: a small cabinet whose drawer of index cards slides out toward the reader when the pointer comes over it; the slider is how far. At rest the drawer is a little open, its front bright.
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

const CW = 44, CD = 52, CH = 28, DD = 38, N = 9;
const F = {
  S: 2.6, rest: 0.3, hz: 10, foot: [-2, -2, CW + 2, CD + 46], range: [22, 36, 42],
  say: (a) => "out " + Math.round(a),
  ext: (a) => box([0, 0, 0, CW, CD, CH]).concat(box([2, CD, 2, CW - 2, CD + a + 3, 22])),
  build(g, P) {
    const cab = part(g);
    draw(P, cab, box([0, 0, 0, CW, CD, CH]), TOPF, null, 4);
    mk("path", { class: "nf lo", d: poly(rnd([P(4, CD, 3), P(CW - 4, CD, 3), P(CW - 4, CD, 24), P(4, CD, 24)], 1.5)) }, cab.g);
    const tray = part(g), cards = [], dl = mk("g", {}, g);
    for (let i = 0; i < N; i++) cards.push(part(dl));
    const side = part(g), front = part(g);
    return {
      hi: front.sil,
      render(t, a) {
        const fy = CD + 4 + t * a, back = fy - DD, y0 = Math.max(CD, back);
        [tray, side].forEach(hide);
        if (fy - y0 > 0.5) {
          draw(P, tray, box([5, y0, 3, CW - 5, fy, 16]), TOPF, null, 1.5);
          draw(P, side, box([CW - 7, y0, 3, CW - 5, fy, 16]), null, null, 1);
        }
        cards.forEach((c, i) => {
          const yc = back + 5 + i * 3.6, lean = (0.25 + (i % 3) * 0.06);
          hide(c);
          if (yc > CD + 1 && yc < fy - 1) draw(P, c, box([8, yc, 4, CW - 8, yc + 0.5, 22 + (i % 2) * 2]), null, { ax: "x", h: [yc, 4], a: -lean }, 1.5);
        });
        draw(P, front, box([3, fy, 1, CW - 3, fy + 3, 18]), null, null, 2);
        front.cr.setAttribute("d", poly(rnd([P(CW / 2 - 6, fy + 3, 11), P(CW / 2 + 6, fy + 3, 11), P(CW / 2 + 6, fy + 3, 14), P(CW / 2 - 6, fy + 3, 14)], 1.2)));
      },
    };
  },
};

hairline({
  name: "rolodex",
  means: "A card index cabinet: the pointer over it slides the drawer out, its leaning cards coming into view.",
  rules: [3, 4, 5, 6],
  range: [22, 36, 42],
  tour: [[170, 174], [205, 150], [165, 215], null],
  mount: make(F),
});
