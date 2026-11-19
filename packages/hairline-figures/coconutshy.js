/**
 * Coconut shy: one stand of a fairground shy, a round foot, a tall post and
 * a cup on top holding a coconut, its three eyes looking up; a wooden ball
 * lies on the ground ready to throw. The pointer knocks the coconut off: it
 * topples from the cup, tumbling over, and rolls away along the ground.
 * At rest the coconut is bright. The slider is how far it rolls.
 *
 * The pattern: one part tipping off its seat and falling (topple).
 */
const { Cam, circ, fit, facing, hull, open, poly, prism, proj, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid } = HL;

const PT = 74, CR = 13, CH = 15, CZ = PT + 6 + CH - 4, V = [0.612, 0.612, 0.5];
const disc = (x, y, r, n = 28) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let amp = value;
  const C = Cam(45, 0.5, 2.3);
  fit(C, [[-26, -26, 0], [26, 26, 0], [-26, 26, 0], [26, -26, 0], [0, 0, CZ + CH + 2], [96, -26, 0], [96, -6, 30], [-16, 56, 0], [104, -28, 0]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, circ(26, 48), circ(23, 48), 0, 6));
  put(solid(g), prism(P, front, circ(3.5, 20), circ(2.5, 20), 6, PT));
  // the cup: a flared dish on the post
  const cup = mk("path", { class: "sil" }, g);
  cup.setAttribute("d", poly(hull(disc(0, 0, 5).map((q) => P(q.u, q.v, PT)).concat(disc(0, 0, 11, 36).map((q) => P(q.u, q.v, PT + 6))))));
  mk("path", { d: poly(disc(0, 0, 9, 36).map((q) => P(q.u, q.v, PT + 6))), class: "nf lo" }, g);
  // the ball, on the ground
  const bp = [];
  for (let i = 0; i <= 6; i++) { const a = (i / 6) * Math.PI; bp.push(...disc(-10, 50, 6 * Math.sin(a) + 0.01, 20).map((q) => P(q.u, q.v, 6 - 6 * Math.cos(a)))); }
  mk("path", { d: poly(hull(bp)), class: "sil" }, g);
  const nut = mk("path", { class: "sil" }, g), seam = mk("path", { class: "nf lo" }, g);
  const eyes = [0, 1, 2].map(() => mk("circle", { r: 1.7, class: "dot m" }, g));

  // the coconut in its own frame: an egg, a seam over the poles, three eyes at the top
  const pts = [];
  for (let i = 0; i <= 10; i++) for (let j = 0; j < 20; j++) { const a = (i / 10) * Math.PI, b = (j / 20) * Math.PI * 2; pts.push([CR * Math.sin(a) * Math.cos(b), CR * Math.sin(a) * Math.sin(b), -CH * Math.cos(a)]); }
  const mer = Array.from({ length: 40 }, (_, i) => { const a = (i / 40) * Math.PI * 2; return [CR * Math.sin(a), 0, CH * Math.cos(a)]; });
  const eyeL = [0, 1, 2].map((k) => { const b = (k / 3) * Math.PI * 2 + 0.5, a = 0.3; return [CR * Math.sin(a) * Math.cos(b), CR * Math.sin(a) * Math.sin(b), CH * Math.cos(a)]; });
  const rot = (p, th) => [p[0] * Math.cos(th) + p[2] * Math.sin(th), p[1], -p[0] * Math.sin(th) + p[2] * Math.cos(th)];

  const tw = tween(0);
  let last = NaN;
  function draw(t) {
    const key = t + amp;
    if (key === last) return;
    last = key;
    const D = 40 + 50 * amp, th = t * (1.2 + amp * 2.2);
    const c = [D * t, -14 * t, CZ + 18 * t - (CZ + 18 - CH) * t * t];
    c[2] = Math.max(CH, c[2]);
    const W = (p) => { const r = rot(p, th); return [r[0] + c[0], r[1] + c[1], r[2] + c[2]]; };
    nut.setAttribute("d", poly(hull(pts.map((p) => P(...W(p))))));
    const vis = (p) => { const r = rot(p, th); return r[0] * V[0] / CR + r[1] * V[1] / CR + r[2] * V[2] / CH > 0.05; };
    const runs = [];
    let cur = [];
    for (let i = 0; i <= mer.length; i++) { const p = mer[i % mer.length]; if (vis(p)) cur.push(P(...W(p))); else if (cur.length) { runs.push(cur); cur = []; } }
    if (cur.length) runs.push(cur);
    seam.setAttribute("d", runs.filter((r) => r.length > 1).map(open).join(" "));
    eyes.forEach((e, k) => { const p = P(...W(eyeL[k])); e.setAttribute("cx", p[0]); e.setAttribute("cy", p[1]); e.setAttribute("r", vis(eyeL[k]) ? 1.7 : 0); });
  }
  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);

  const mid = P(10, 0, 44);
  let act = null;
  function setActive(on) {
    if (on === act) return;
    act = on;
    tset(tw, on ? 1 : 0, performance.now(), 0);
    nut.classList.toggle("hi", true);
    read.textContent = on ? "knock" : "rest";
    B.wake();
  }
  setActive(false);
  const hit = ([sx, sy]) => Math.abs(sx - mid[0]) < 110 && Math.abs(sy - mid[1]) < 120;
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { amp = v; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "coconutshy",
  means: "A coconut shy stand: over it, the coconut topples out of its cup, tumbling, and rolls away along the ground.",
  rules: [1, 4, 5, 8],
  range: [0.2, 0.8, 1],
  tour: [[151, 47], [151, 150], [170, 230], null],
  mount,
});
