/**
 * Pillar box: a round post box on a plinth, a domed cap, a slot under the cap
 * and the collection plate below it. At rest a letter sticks out of the slot,
 * bright. The pointer over the box posts it: the letter slides in through
 * the slot and the slot's lip takes the bright. The slider is how far the
 * letter rests out.
 *
 * The pattern: one part sliding (single object).
 */
const {
  Cam, circ, fit, facing, hull, poly, prism, proj, rings, ringAt, tdone, tset, tval, tween, clamp,
  disposer, mk, pointer, put, register, solid,
} = HL;

const R = 22, H = 66, ZS = 54, W2 = 15, A = Math.PI / 4;
const disc = (r, n = 40) => circ(r, n);

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let outR = value;
  const C = Cam(45, 0.5, 2.7);
  const n = [Math.cos(A), Math.sin(A)], t = [-n[1], n[0]];
  fit(C, [[-27, -27, 0], [27, 27, 0], [0, 0, H + 18], [n[0] * (R + 28), n[1] * (R + 28), ZS]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // plinth, body, cap band, dome, knob
  put(solid(g), prism(P, front, disc(27, 44), disc(25, 44), 0, 5));
  put(solid(g), prism(P, front, disc(R, 48), disc(R - 1.5, 48), 5, H));
  put(solid(g), prism(P, front, disc(R + 3, 48), disc(R + 1.5, 48), H, H + 4));
  const dome = [];
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * (Math.PI / 2); dome.push(...ringAt(P, disc((R + 1) * Math.cos(a), 32), H + 4 + 11 * Math.sin(a))); }
  mk("path", { d: poly(hull(dome)), class: "sil" }, g);
  put(solid(g), prism(P, front, disc(3, 16), disc(2, 16), H + 14, H + 18));
  // surface point at angle a and height z
  const at = (a, z, r = R) => P(r * Math.cos(a), r * Math.sin(a), z);
  const arc = (a0, a1, z, r) => { const o = []; for (let i = 0; i <= 10; i++) o.push(at(a0 + ((a1 - a0) * i) / 10, z, r)); return o; };
  // collection plate: a panel on the front, its two edges and a keyhole dot
  const pa = 0.5;
  mk("path", { d: poly(arc(A - pa, A + pa, 22, R + 0.4).concat(arc(A + pa, A - pa, 44, R + 0.4))), class: "nf lo" }, g);
  mk("path", { d: poly(arc(A - 0.1, A + 0.1, 36, R + 0.4).concat(arc(A + 0.1, A - 0.1, 38, R + 0.4))), class: "nf lo" }, g);
  // the slot: a hooded opening under the cap
  const sa = Math.asin((W2 + 2) / R);
  const slot = mk("path", { d: poly(arc(A - sa, A + sa, ZS - 1.5, R + 0.4).concat(arc(A + sa, A - sa, ZS + 2.5, R + 0.4))), class: "nf" }, g);
  // the letter: a flat envelope from the slot's arc out along n
  const lg = mk("g", {}, g);
  const lt = mk("path", { class: "sil" }, lg), le = mk("path", { class: "nf lo" }, lg);
  const la = Math.asin(W2 / R), out = tween(outR), last = { v: NaN };
  const W = (d, s, z) => P(n[0] * d + t[0] * s, n[1] * d + t[1] * s, z);
  function draw(o) {
    if (o === last.v) return;
    last.v = o;
    if (o < 0.5) { lt.setAttribute("d", ""); le.setAttribute("d", ""); return; }
    const d = Math.sqrt(R * R - W2 * W2) + o;
    const top = arc(A + la, A - la, ZS + 1.2, R).concat([W(d, -W2, ZS + 1.2), W(d, W2, ZS + 1.2)]);
    const bot = arc(A + la, A - la, ZS, R).concat([W(d, -W2, ZS), W(d, W2, ZS)]);
    lt.setAttribute("d", poly(hull(top.concat(bot))));
    le.setAttribute("d", "M" + W(d - 1.5, -W2 + 1.5, ZS + 1.2).join(",") + "L" + W(d - Math.min(o, 9), 0, ZS + 1.2).join(",") + "L" + W(d - 1.5, W2 - 1.5, ZS + 1.2).join(","));
  }
  const B = register(stage, (_dt, now) => { draw(tval(out, now)); return !tdone(out, now); });
  bag.add(B.unregister);
  const box = [P(-R, R, 0), P(R, -R, 0), P(0, 0, H + 18), P(n[0] * (R + 28), n[1] * (R + 28), ZS)];
  const xs = box.map((q) => q[0]), ys = box.map((q) => q[1]);
  const inside = ([sx, sy]) => sx > Math.min(...xs) - 6 && sx < Math.max(...xs) + 6 && sy > Math.min(...ys) - 6 && sy < Math.max(...ys) + 6;
  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(out, a ? 0 : outR, performance.now(), 0);
    lt.classList.toggle("hi", !a);
    slot.classList.toggle("hi", a);
    read.textContent = a ? "posted" : "rest";
    B.wake();
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(inside(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { outR = clamp(v, 8, 28); if (!act) { act = null; setActive(false); } }, destroy: bag.dispose };
}

hairline({
  name: "postbox",
  means: "A round pillar box with a letter in its slot: point at the box and the letter slides in, posted.",
  rules: [1, 4, 5, 8],
  range: [8, 22, 28],
  tour: [[200, 140], [200, 70], [232, 236], null],
  mount,
});
