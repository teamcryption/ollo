/**
 * Luggage lock: a combination padlock, a body with three number wheels in a
 * window on its face and a tall shackle. Over the lock, the shackle lifts out
 * of its hole and swings round its left leg toward the pointer, open, and goes
 * bright. At rest it sits shut, a touch askew, the middle wheel bright. The
 * slider is how far the shackle swings.
 */
const {
  Cam, facing, fit, prism, proj, rings, unproj, poly, seg,
  tween, tset, tval, tdone, disposer, mk, pointer, put, register, solid,
} = HL;

const BX = 17, BY = 7, BZ = 26, LEG = 9.5, RAD = 9.5, TUBE = 1.8, LIFT = 9;
const OPEN = 1.35, REST = 0.12;

function uRing(h) {
  const out = [], inn = [];
  for (const [r, arr] of [[RAD + TUBE, out], [RAD - TUBE, inn]]) {
    arr.push([RAD - r, 0]);
    for (let i = 0; i <= 16; i++) { const t = Math.PI - (i / 16) * Math.PI; arr.push([RAD + r * Math.cos(t), h + r * Math.sin(t)]); }
    arr.push([RAD + r, 0]);
  }
  return out.concat(inn.reverse());
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  const C = Cam(45, 0.5, 4.6);
  const shPts = (phi, lift) => uRing(18).map(([u, z]) => [-LEG + u * Math.cos(phi), u * Math.sin(phi), BZ + lift + z]);
  const ext = [[-BX, -BY, 0], [BX, BY, 0], ...shPts(REST, 0), ...shPts(OPEN * 1.2, LIFT)];
  fit(C, ext, 200, 166);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  const shack = mk("path", { class: "sil" }, g);
  put(solid(g), prism(P, front, ...rings(-BX, -BY, BX, BY, 5, 1.6), 0, BZ));
  // the window on the near long face, and its three wheels
  const F = (x, z) => P(x, BY + 0.1, z);
  const win = [F(-12, 6), F(12, 6), F(12, 17), F(-12, 17)];
  mk("path", { class: "nf lo", d: poly(win) }, g);
  const wheels = [-8, 0, 8].map((x, i) => {
    const w = mk("path", { class: "nf" + (i === 1 ? "" : " lo") }, g);
    w.setAttribute("d", seg(F(x - 3, 8), F(x - 3, 15)) + seg(F(x + 3, 8), F(x + 3, 15)) + seg(F(x - 1, 8.5), F(x + 1, 8.5)) + seg(F(x - 1, 14.5), F(x + 1, 14.5)));
    return w;
  });
  const hole = mk("path", { class: "nf lo" }, g);
  hole.setAttribute("d", seg(P(-LEG + 2 * RAD - 2, -1.5, BZ), P(-LEG + 2 * RAD + 2, 1.5, BZ)));

  const tw = tween(0);
  let drawn = NaN, swing = value;
  function draw(now) {
    const k = tval(tw, now);
    if (Math.abs(k - drawn) < 1e-4) return;
    drawn = k;
    const lift = LIFT * Math.min(1, k * 1.6), phi = REST + (OPEN * swing - REST) * k;
    shack.setAttribute("d", poly(shPts(phi, lift).map((q) => P(...q))));
  }
  const B = register(stage, (dt, now) => { draw(now); return !tdone(tw, now); });
  bag.add(B.unregister);

  let cur = null;
  function set(open) {
    if (open === cur) return;
    cur = open;
    tset(tw, open ? 1 : 0, performance.now(), 0);
    shack.classList.toggle("hi", open);
    wheels[1].classList.toggle("sil", !open);
    wheels[1].classList.toggle("hi", !open);
    read.textContent = open ? "open" : "rest";
    B.wake();
  }
  bag.add(pointer(stage, {
    move: (p) => {
      const hit = (z) => { const [x, y] = unproj(C, p[0], p[1], z); return Math.abs(x) < BX + 16 && Math.abs(y) < BY + 22; };
      set(hit(0) || hit(BZ + 20));
    },
    leave: () => set(false),
  }));
  bag.add(() => svg.replaceChildren());
  set(false);
  draw(performance.now());
  return {
    set: (v) => { swing = v; drawn = NaN; draw(performance.now()); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "luggagetag",
  means: "A luggage combination lock: over it, the shackle lifts out of its hole and swings open, bright.",
  rules: [1, 3, 5, 8],
  range: [0.4, 1, 1],
  tour: [[137, 260], [235, 277], [332, 293], null],
  mount,
});
