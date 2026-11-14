/**
 * Spice carousel: a round turntable carrying eight small jars around a
 * centre post. Circling the pointer round it turns the carousel like a dial;
 * the jar that comes to the front lifts out of its seat, bright. At rest the
 * carousel stands a little turned with one jar raised. The slider is the lift.
 *
 * The pattern: a dial turned by the pointer's angle on the ground.
 */
const {
  Cam, circ, fit, facing, poly, prism, proj, rings, spring, stepS, tdone, tset, tval, tween, unproj,
  disposer, mk, pointer, put, register, solid,
} = HL;

const N = 8, R = 34, JR = 8, BR = 47, HS = [22, 18, 24, 20, 23, 17, 21, 19], FAV = 2, FRONT = Math.PI / 4;
const STEP = (2 * Math.PI) / N;
const disc = (x, y, r, n = 32) => circ(r, n).map((q) => ({ ...q, u: q.u + x, v: q.v + y }));
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let lift = value;
  const C = Cam(45, 0.5, 2.5);
  fit(C, [[-BR, -BR, 0], [BR, BR, 0], [BR, -BR, 0], [-BR, BR, 0], [0, 0, 52], [R * 0.7, R * 0.7, 6 + 24 + 40 + 5]], 200, 170);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  put(solid(g), prism(P, front, disc(0, 0, BR, 56), disc(0, 0, BR - 2, 56), 0, 5));
  const top = mk("g", {}, g);
  const post = solid(top);
  put(post, prism(P, front, disc(0, 0, 3.5, 20), disc(0, 0, 2.5, 20), 5, 46));
  put(solid(post.g), prism(P, front, disc(0, 0, 9, 28), disc(0, 0, 7.5, 28), 46, 49));
  const jars = HS.map((h, k) => {
    const grp = mk("g", {}, top);
    return { k, h, grp, body: solid(grp), lid: solid(grp), z: tween(k === FAV ? 0.5 : 0), last: NaN, lr: NaN };
  });

  const r0 = FRONT - FAV * STEP + 0.14;
  const rot = spring(r0);

  function drawJar(j, r, t) {
    if (r === j.lr && t === j.last) return;
    j.lr = r; j.last = t;
    const a = r + j.k * STEP, x = R * Math.cos(a), y = R * Math.sin(a), z0 = 5 + lift * t, z1 = z0 + j.h;
    j.d = x + y;
    put(j.body, prism(P, front, disc(x, y, JR), disc(x, y, JR - 1.2), z0, z1));
    put(j.lid, prism(P, front, disc(x, y, JR + 0.8), disc(x, y, JR - 0.6), z1, z1 + 4));
  }

  const B = register(stage, (dt, now) => {
    const m = stepS(rot, dt);
    let moving = m;
    for (const j of jars) { drawJar(j, rot.x, tval(j.z, now)); if (!tdone(j.z, now)) moving = true; }
    const order = jars.map((j) => ({ g: j.grp, d: j.d })).concat([{ g: post.g, d: 0 }]).sort((a, b) => a.d - b.d);
    for (const o of order) top.appendChild(o.g);
    return moving;
  });
  bag.add(B.unregister);

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now();
    act = a;
    jars.forEach((j, k) => {
      tset(j.z, a < 0 ? (k === FAV ? 0.5 : 0) : k === a ? 1 : 0, now, 0);
      j.lid.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "jar " + (a + 1);
  }
  // the jar the target turn brings nearest the front
  const facingJar = () => {
    let best = 0, bd = Infinity;
    jars.forEach((j, k) => { const d = Math.abs(wrap(rot.t + k * STEP - FRONT)); if (d < bd) { bd = d; best = k; } });
    return best;
  };
  let prev = null;
  function leave() {
    prev = null;
    rot.t = r0 + Math.round((rot.t - r0) / (2 * Math.PI)) * 2 * Math.PI;
    setActive(-1);
    B.wake();
  }
  function move([sx, sy]) {
    const [wx, wy] = unproj(C, sx, sy, 0);
    if (Math.hypot(wx, wy) > BR + 26) return leave();
    const th = Math.atan2(wy, wx);
    if (prev !== null) rot.t += wrap(th - prev);
    prev = th;
    setActive(facingJar());
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move, leave }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { lift = v; jars.forEach((j) => { j.last = NaN; }); B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "spicejars",
  means: "A spice carousel: circling the pointer turns it like a dial, and the jar brought to the front lifts out of its seat.",
  rules: [1, 3, 4, 5, 6],
  range: [16, 30, 40],
  tour: [[115, 156], [200, 199], [285, 156], null],
  mount,
});
