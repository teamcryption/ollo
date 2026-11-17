/**
 * Weather house: a little gabled house on a round base, two arched doors in
 * its front, and the weather pair on the turning ring round it, a woman in a
 * full skirt for fair days and a man in a brimmed hat for rain. At rest she
 * stands out at the left door, bright. The pointer over the house brings the
 * weather in: the ring swings round, she goes behind and he comes out at the
 * right door. The slider is how far the ring turns.
 *
 * The pattern: one gesture answering (a turn on a tween); figures repaint
 * behind or in front of the house as they pass; the hit is on fixed planes.
 */
const {
  Cam, circ, clamp, facing, fit, hull, lerp, open, poly, prism, proj, rings, ringAt, rrect, run, unproj, tdone, tset, tval, tween,
  disposer, mk, pointer, put, register, solid,
} = HL;

const CX = 30, CY = 20, RR = 25, HZ = 30, RZ = 48, A0 = 110, A1 = 250;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amt = value;
  const C = Cam(45, 0.5, 2.9);
  fit(C, [[CX - 34, CY - 34, 0], [CX + 34, CY + 34, 0], [CX - 34, CY + 34, 0], [CX + 34, CY - 34, 0], [CX, CY, RZ + 2], [CX - 34, CY + 34, 32]], 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const disc = (r, n) => circ(r, n).map((q) => ({ ...q, u: q.u + CX, v: q.v + CY }));

  put(solid(g), prism(P, front, disc(33, 64), disc(31.6, 64), 0, 3));
  const back = mk("g", {}, g), house = mk("g", {}, g), fore = mk("g", {}, g);
  // the house, its gable roof and the two arched doors
  const [hr, hi] = rings(12, 8, 48, 32, 3, 1);
  put(solid(house), prism(P, front, hr, hi, 3, HZ));
  const foot = rrect(9, 5, 51, 35, 3, 6), ridge = rrect(10, 19, 50, 21, 1, 4);
  const roof = solid(house);
  roof.sil.setAttribute("d", poly(hull(ringAt(P, foot, HZ).concat(ringAt(P, ridge, RZ)))));
  roof.cr.setAttribute("d", open(ringAt(P, run(rrect(10, 5.5, 50.5, 34.5, 3, 6), front), HZ + 0.6)));
  const arch = (x) => {
    const o = [P(x - 5, 32, 3)];
    for (let i = 0; i <= 10; i++) { const a = (i / 10) * Math.PI; o.push(P(x - 5 * Math.cos(a), 32, 16 + 5 * Math.sin(a))); }
    o.push(P(x + 5, 32, 3));
    return open(o);
  };
  mk("path", { class: "nf lo", d: arch(21) + arch(39) }, house);

  // a figure: a body hull, a head, and a skirt or a hat brim
  function figure(skirt) {
    const grp = mk("g", {}, fore);
    return { grp, body: mk("path", { class: "sil" }, grp), head: mk("path", { class: "sil" }, grp), skirt };
  }
  const ring = (x, y, r, z, n = 20) => { const o = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(P(x + r * Math.cos(a), y + r * Math.sin(a), z)); } return o; };
  const ball = (x, y, z, r) => { const [sx, sy] = P(x, y, z), k = r * 2.9, o = []; for (let i = 0; i < 20; i++) { const a = (i / 20) * Math.PI * 2; o.push([sx + k * Math.cos(a), sy + k * Math.sin(a)]); } return poly(o); };
  const her = figure(true), him = figure(false);
  function drawFig(f, a) {
    const x = CX + RR * Math.cos(a), y = CY + RR * Math.sin(a);
    f.body.setAttribute("d", f.skirt
      ? poly(hull(ring(x, y, 7.5, 3).concat(ring(x, y, 3, 22))))
      : poly(hull(ring(x, y, 4.5, 3).concat(ring(x, y, 4.5, 22)))));
    f.head.setAttribute("d", ball(x, y, 26.5, 4.2) + (f.skirt ? "" : poly(hull(ring(x, y, 7.5, 29.5).concat(ring(x, y, 7.5, 30.5), ring(x, y, 3.6, 34))))));
    const inFront = x + y > CX + CY + 4;
    if (f.grp.parentNode !== (inFront ? fore : back)) (inFront ? fore : back).appendChild(f.grp);
  }

  const t = tween(0);
  let last = NaN;
  function draw(k) {
    if (k === last) return;
    last = k;
    const a = (lerp(A0, lerp(A0, A1, clamp(amt, 0, 1)), k) * Math.PI) / 180;
    drawFig(her, a);
    drawFig(him, a + Math.PI);
  }
  const B = register(stage, (_dt, now) => { draw(tval(t, now)); return !tdone(t, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(t, on ? 1 : 0, performance.now(), 0);
    her.body.classList.toggle("hi", !on);
    him.body.classList.toggle("hi", on);
    read.textContent = on ? "rain" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    return [0, 15, HZ, RZ].some((z) => {
      const [x, y] = unproj(C, sx, sy, z);
      return Math.hypot(x - CX, y - CY) < 38;
    });
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amt = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "weatherhouse",
  means: "A weather house: the pointer over it swings the ring round, the fair-weather woman goes in and the rain man comes out.",
  rules: [1, 4, 5, 6],
  range: [0.4, 1, 1],
  tour: [[134, 158], [200, 140], [250, 200], null],
  mount,
});
