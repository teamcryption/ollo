/**
 * Map tube: a long tube lying on its side, its cap on the near end. The
 * pointer over the tube pulls the cap off and the rolled map slides out after
 * it; leaving pushes both back to a cap left a little loose. The cap is the
 * bright mark. The slider is the pull.
 */
const { Cam, fit, proj, hull, poly, open, mk, tween, tset, tval, tdone, register, pointer, disposer, unproj, clamp } = HL;

const R = 15, TL = 100, CL = 30, REST = 6, OUT = 56;
const halfX = (P, x, r) => { const o = []; for (let i = 0; i <= 40; i++) { const t = -0.95 + (i / 40) * Math.PI; o.push(P(x, r * Math.cos(t), R + r * Math.sin(t))); } return o; };
const ringX = (P, x, r) => { const o = []; for (let i = 0; i < 40; i++) { const t = (i / 40) * Math.PI * 2; o.push(P(x, r * Math.cos(t), R + r * Math.sin(t))); } return o; };

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value, on = false;
  const C = Cam(45, 0.5, 2.2);
  fit(C, [[0, -R, 0], [0, R, 2 * R], [TL + OUT * 1.3 + CL, R, 0], [TL + OUT * 1.3 + CL, -R, 2 * R]], 200, 166);
  const P = proj(C);
  const g = mk("g", {}, svg);
  mk("path", { class: "sil", d: poly(hull(ringX(P, 0, R).concat(ringX(P, TL, R)))) }, g);
  mk("path", { class: "nf lo", d: open(halfX(P, 18, R)) + open(halfX(P, 21, R)) }, g);
  mk("path", { class: "lo", d: poly(ringX(P, TL, R)) }, g);
  const roll = mk("path", { class: "sil" }, g), rollEnd = mk("path", { class: "lo" }, g), rollIn = mk("path", { class: "nf lo" }, g);
  const cap = mk("path", { class: "sil hi" }, g), capEnd = mk("path", { class: "lo" }, g), capLip = mk("path", { class: "nf lo" }, g);
  const tw = tween(REST);
  let last = NaN;
  function draw(o) {
    if (o === last) return;
    last = o;
    const re = TL - CL + 4 + o;
    roll.setAttribute("d", poly(hull(ringX(P, TL - 2, R - 3).concat(ringX(P, re, R - 3)))));
    rollEnd.setAttribute("d", poly(ringX(P, re, R - 3)));
    rollIn.setAttribute("d", poly(ringX(P, re, 3)));
    const c0 = TL - CL + 6 + o, c1 = c0 + CL;
    cap.setAttribute("d", poly(hull(ringX(P, c0, R + 1.5).concat(ringX(P, c1, R + 1.5)))));
    capEnd.setAttribute("d", poly(ringX(P, c1, R + 1.5)));
    capLip.setAttribute("d", open(halfX(P, c0 + 4, R + 1.5)));
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  function setOn(a) {
    if (a === on) return;
    on = a;
    tset(tw, a ? clamp(REST + (OUT - REST) * amt, REST, OUT * 1.3) : REST, performance.now(), 0);
    read.textContent = a ? "open" : "rest";
    B.wake();
  }
  read.textContent = "rest";
  B.wake();
  bag.add(pointer(stage, {
    move: (p) => { const [x, y] = unproj(C, p[0], p[1], R); setOn(x > -10 && x < TL + 20 && Math.abs(y) < R + 12); },
    leave: () => setOn(false),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; if (on) { on = false; setOn(true); } }, destroy: bag.dispose };
}

hairline({
  name: "mapcase",
  means: "A map tube lying on its side: the pointer pulls its cap off and the rolled map slides out after it.",
  rules: [1, 4, 5, 8],
  range: [0.5, 1, 1.3],
  tour: [[120, 110], [174, 142], [230, 172], null],
  mount,
});
