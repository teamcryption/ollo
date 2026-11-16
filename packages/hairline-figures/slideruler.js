/**
 * Slide rule: a long stock with its middle slide and a glass cursor. The
 * pointer over the rule draws the slide out along the stock and runs the
 * cursor back the other way; leaving sets both near home. The slide is the
 * bright mark. The slider is the throw.
 */
const { Cam, fit, proj, facing, rings, prism, put, solid, mk, seg, tween, tset, tval, tdone, register, pointer, disposer, unproj, clamp } = HL;

const L = 180, REST = 10, OUT = 70;
const box = (P, front, el, x0, y0, x1, y1, z0, z1) => { const [r, i] = rings(x0, y0, x1, y1, 1.5, 0.8); put(el, prism(P, front, r, i, z0, z1)); };
const ticks = (P, x0, y, z, n, h) => { let d = ""; for (let k = 1; k <= n; k++) { const x = x0 + (L - 10) * Math.log10(k) / Math.log10(n); d += seg(P(x, y, z), P(x, y + (k % 5 === 0 ? h * 1.6 : h), z)); } return d; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, on = false;
  const C = Cam(45, 0.5, 1.75);
  fit(C, [[-OUT * 0.6, -4, 0], [L + OUT * 1.2, 34, 0], [L + OUT * 1.2, -4, 6], [-OUT * 0.6, 34, 6]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  box(P, front, solid(g), 0, 0, L, 10, 0, 4);
  mk("path", { class: "nf lo", d: ticks(P, 5, 7, 4, 20, 2) }, g);
  const sl = solid(g), slT = mk("path", { class: "nf lo" }, g);
  sl.sil.classList.add("hi");
  const near = solid(g);
  box(P, front, near, 0, 20, L, 30, 0, 4);
  mk("path", { class: "nf lo", d: ticks(P, 5, 21, 4, 20, 2) }, g);
  const cur = solid(g), hair = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    box(P, front, sl, o, 10.4, L + o, 19.6, 0.2, 3.8);
    slT.setAttribute("d", ticks(P, 5 + o, 11, 3.8, 20, 2.2));
    const cx = 120 - o * 1.3;
    box(P, front, cur, cx - 9, -4, cx + 9, 34, 4, 5.5);
    hair.setAttribute("d", seg(P(cx, -3, 5.5), P(cx, 33, 5.5)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? clamp(REST + (OUT - REST) * amt, REST, OUT * 1.2) : REST, performance.now(), 0);
    read.textContent = a ? "slide" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  B.wake();
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], 4); setOn(x > -10 && x < L + 10 && y > -14 && y < 44); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { on = false; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "slideruler",
  means: "A slide rule: the pointer draws the middle slide out along the stock and runs the glass cursor back the other way.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.2],
  tour: [[120, 120], [174, 147], [230, 175], null],
  mount,
});
