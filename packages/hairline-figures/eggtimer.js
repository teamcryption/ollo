/**
 * Egg timer: a sand glass in a frame of two round plates and three posts.
 * The pointer's place across the figure turns the whole timer over about
 * its waist, so the sand that sat in the low bulb rides up. At rest it
 * leans a little and the top bulb is bright. The slider is the full turn.
 *
 * The pattern: one object, turned by a continuous input.
 */
const { Cam, circ, fit, hull, poly, proj, clamp, rad, spring, stepS, disposer, mk, pointer, register } = HL;

const H = 44, R = 14, PH = 3, MID = H / 2, REST = 10;
const V = [0.61, 0.61, 0.5];
const disc = (r, n = 28) => circ(r, n).map((q) => [q.u, q.v]);
const prof = (t) => 1.6 + 8.4 * Math.sin(Math.PI * Math.min(1, t * 1.04)); // bulb radius by height 0..1

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let TURN = value;
  const C = Cam(45, 0.5, 3.8);
  fit(C, [[-R, -R, MID - R - 6], [R, R, MID + R + 6], [R, -R, MID], [-R, R, MID], [0, 0, 0], [0, 0, H]], 200, 165);
  const P = proj(C);
  const g = mk("g", {}, svg);
  const floor = mk("path", { class: "dash" }, g);
  floor.setAttribute("d", poly(disc(R + 8, 40).map(([u, v]) => P(u, v, 0))));
  const parts = [];
  const add = (cls) => { const p = { el: mk("path", { class: cls }, g), cr: null, z: 0 }; parts.push(p); return p; };
  const bot = add("sil"), top = add("sil"), posts = [0, 1, 2].map(() => add("sil")), lowB = add("sil"), upB = add("sil");
  bot.cr = mk("path", { class: "nf lo" }, g); top.cr = mk("path", { class: "nf lo" }, g);
  lowB.sand = mk("path", { class: "nf lo" }, g); upB.sand = mk("path", { class: "nf lo" }, g);
  const ang = spring(REST, { k: 60, c
: 14 });
  let last = NaN;

  function draw(a) {
    if (a === last) return; last = a;
    const ca = Math.cos(rad(a)), sa = Math.sin(rad(a));
    const W = ([x, y, z]) => { const yy = y, zz = z - MID; return [x, yy * ca - zz * sa, MID + yy * sa + zz * ca]; };
    const S = (p) => { const w = W(p); return P(w[0], w[1], w[2]); };
    const dep = (p) => { const w = W(p); return w[0] * V[0] + w[1] * V[1] + w[2] * V[2]; };
    const cyl = (o, r, z0, z1, part) => {
      const ring = disc(r).map(([u, v]) => [u + o[0], v + o[1]]);
      const pts = [...ring.map(([u, v]) => S([u, v, z0])), ...ring.map(([u, v]) => S([u, v, z1]))];
      part.el.setAttribute("d", poly(hull(pts)));
      part.z = dep([o[0], o[1], (z0 + z1) / 2]);
      if (part.cr) { const capZ = dep([0, 0, z1]) > dep([0, 0, z0]) ? z1 : z0; part.cr.setAttribute("d", poly(ring.map(([u, v]) => S([u, v, capZ])))); }
    };
    cyl([0, 0], R, 0, PH, bot); cyl([0, 0], R, H - PH, H, top);
    posts.forEach((p, i) => { const t = rad(90 + i * 120); cyl([Math.cos(t) * (R - 3), Math.sin(t) * (R - 3)], 1.4, PH, H - PH, p); });
    const bulb = (z0, z1, part, sandFrom, sandTo) => {
      const pts = [];
      for (let i = 0; i <= 8; i++) { const t = i / 8, z = z0 + (z1 - z0) * t; pts.push(...disc(prof(z0 < MID ? 1 - t : t), 18).map(([u, v]) => S([u, v, z]))); }
      part.el.setAttribute("d", poly(hull(pts)));
      part.z = dep([0, 0, (z0 + z1) / 2]);
      const sp = [];
      for (let i = 0; i <= 4; i++) { const t = i / 4, z = sandFrom + (sandTo - sandFrom) * t; sp.push(...disc(prof(Math.abs(z - MID) / (MID - PH)) * 0.86, 14).map(([u, v]) => S([u, v, z]))); }
      part.sand.setAttribute("d", poly(hull(sp)));
    };
    bulb(PH, MID, lowB, PH + 1, PH + 9); bulb(MID, H - PH, upB, MID + 2, MID + 5);
    // paint far to near; sand rides with its bulb
    [...parts].sort((p, q) => p.z - q.z).forEach((p) => { g.appendChild(p.el); if (p.cr) g.appendChild(p.cr); if (p.sand) g.appendChild(p.sand); });
  }

  const B = register(stage, (dt) => { const m = stepS(ang, dt); draw(ang.x); return m; });
  bag.add(B.unregister);

  const L = P(-R, R, 0)[0] - 10, Rr = P(R, -R, 0)[0] + 10;
  const set = (a) => {
    ang.t = a;
    const turned = a > 90;
    upB.el.classList.toggle("hi", !turned); lowB.el.classList.toggle("hi", turned);
    read.textContent = a === REST ? "rest" : Math.round(a) + "°";
    B.wake();
  };
  set(REST);
  bag.add(pointer(stage, {
    move: ([sx, sy]) => { if (sx < L || sx > Rr || sy < 30 || sy > 300) return set(REST); set(Math.round(clamp((sx - L) / (Rr - L), 0, 1) * TURN)); },
    leave: () => set(REST),
  }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { TURN = v; }, destroy: bag.dispose };
}

hairline({
  name: "eggtimer",
  means: "A sand egg timer in its frame: the pointer turns it over about its waist, and the sand rides up as it turns.",
  rules: [1, 3, 5, 6],
  range: [90, 180, 180],
  tour: [[170, 200], [205, 160], [238, 111], null],
  mount,
});
