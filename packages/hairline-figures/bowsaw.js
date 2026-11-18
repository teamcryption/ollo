/**
 * Bow saw: a bent tubular bow holding a toothed blade across a log. The
 * pointer's x on the ground strokes the saw along its blade on a spring; at
 * rest it sits a little off centre. The slider is the stroke's reach.
 */
const { Cam, clamp, fit, hull, poly, open, proj, unproj, spring, stepS, disposer, mk, pointer, register } = HL;

const L = 86, ZB = 58, REST = 10;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 1.7);
  fit(C, [[-L - 40, 0, 50], [L + 40, 0, 50], [0, -50, 0], [0, 50, 0], [0, 0, ZB + 86]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const R = 30, end = (y) => Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; return P(R * Math.cos(a), y, R + R * Math.sin(a)); });
  mk("path", { class: "sil", d: poly(hull(end(-50).concat(end(50)))) }, g);
  mk("path", { class: "nf lo", d: poly(end(50)) }, g);
  mk("path", { class: "nf lo", d: poly(Array.from({ length: 20 }, (_, i) => { const a = (i / 20) * Math.PI * 2; return P(11 * Math.cos(a), 50, R + 11 * Math.sin(a)); })) }, g);
  const bow = mk("path", { class: "sil" }, g);
  const blade = mk("path", { class: "sil hi" }, g), teeth = mk("path", { class: "nf lo" }, g);
  const dx = spring(REST);
  let amp = value, last = null, over = null;
  function draw() {
    if (last === dx.x.toFixed(2)) return;
    last = dx.x.toFixed(2);
    const o = dx.x, Q = (x, y, z) => P(x + o, y, z);
    const outer = [], inner = [];
    for (let i = 0; i <= 24; i++) {
      const u = -1 + (2 * i) / 24, x = u * (L + 4);
      outer.push(Q(x, 0, ZB + 4 + 82 * (1 - u * u) + 6));
      inner.push(Q(x * 0.94, 0, ZB + 4 + 82 * (1 - u * u)));
    }
    outer.unshift(Q(-L - 4, 0, ZB - 2)); outer.push(Q(L + 4, 0, ZB - 2));
    inner.unshift(Q(-L + 2, 0, ZB - 2)); inner.push(Q(L - 2, 0, ZB - 2));
    bow.setAttribute("d", poly(outer.concat(inner.reverse())));
    const b = [Q(-L, -1.5, ZB), Q(L, -1.5, ZB), Q(L, 1.5, ZB), Q(-L, 1.5, ZB), Q(-L, -1.5, ZB + 10), Q(L, -1.5, ZB + 10), Q(L, 1.5, ZB + 10), Q(-L, 1.5, ZB + 10)];
    blade.setAttribute("d", poly(hull(b)));
    const t = [];
    for (let x = -L + 4; x <= L - 4; x += 8) t.push(Q(x, 1.5, ZB + 1), Q(x + 4, 1.5, ZB + 4));
    teeth.setAttribute("d", open(t));
  }
  const B = register(stage, (dt) => { const m = stepS(dx, dt); draw(); return m; });
  bag.add(B.unregister);
  function retarget() {
    dx.t = over == null ? REST : clamp(over, -1, 1) * 40 * amp;
    read.textContent = over == null ? "rest" : `${dx.t > 0 ? "+" : ""}${Math.round(dx.t)}`;
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 0); over = Math.hypot(x, y) > 150 ? null : (x - y) / 80; retarget(); },
    leave: () => { over = null; retarget(); },
  }));
  bag.add(() => svg.replaceChildren());
  retarget();
  return { set: (v) => { amp = v; retarget(); }, destroy: bag.dispose };
}

hairline({
  name: "bowsaw",
  means: "A bow saw across a log: it strokes along its blade toward the pointer and settles back just off centre.",
  rules: [1, 3, 5, 8],
  range: [0.5, 1, 1.4],
  tour: [[320, 293], [80, 221], [200, 257], null],
  mount,
});
