/**
 * Bucket and spade: a sand bucket stands on the beach beside its spade. The
 * pointer over the bucket tips it over its front foot, pouring, and the
 * handle swings with it. At rest it leans a little, rim bright. The slider is
 * how far it tips.
 */
const { Cam, circ, fit, hull, poly, open, proj, rings, prism, facing, tween, tset, tval, tdone, mk, put, solid, register, pointer, disposer, rad } = HL;

const RB = 15, RT = 21, H = 32, PX = 15, REST = 8;
const disc = (r, n = 36) => circ(r, n).map((q) => [q.u, q.v]);
function tip(a) {
  const c = Math.cos(rad(a)), s = Math.sin(rad(a));
  return ([x, y, z]) => [PX + (x - PX) * c + z * s, y, -(x - PX) * s + z * c];
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let most = 40 + 50 * value;
  const C = Cam(45, 0.5, 3.4);
  const far = tip(90);
  const ext = [[-62, -50, 0], [40, 30, 0], [-RT, 0, H + 18], [RT, 0, H + 18]];
  for (const q of [[-RT, 0, H], [-RT, RT, H], [-RT, -RT, H], [0, 0, H + 18]]) ext.push(far(q));
  fit(C, ext, 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);
  // the spade, lying on the sand behind the bucket
  const [hr, hi] = rings(-60, -40, -14, -36, 2, 0.8);
  put(solid(g), prism(P, front, hr, hi, 0, 2.5));
  const [br, bi] = rings(-14, -48, 10, -28, 6, 1.5);
  put(solid(g), prism(P, front, br, bi, 0, 2));
  const grip = mk("path", { class: "nf lo" }, g);
  grip.setAttribute("d", poly(hull([[-66, -42, 0], [-58, -42, 0], [-66, -34, 0], [-58, -34, 0], [-66, -42, 4], [-58, -34, 4]].map((p) => P(...p)))));

  const bg = mk("g", {}, g);
  const body = mk("path", { class: "sil" }, bg), rim = mk("path", { class: "nf lo" }, bg), inner = mk("path", { class: "nf lo" }, bg), handle = mk("path", { class: "nf" }, bg);
  const tw = tween(REST);
  let last = NaN;
  function draw(a) {
    if (a === last) return;
    last = a;
    const f = tip(a), pr = (p) => P(...f(p));
    const pts = disc(RB).map(([x, y]) => pr([x, y, 0])).concat(disc(RT).map(([x, y]) => pr([x, y, H])));
    body.setAttribute("d", poly(hull(pts)));
    rim.setAttribute("d", poly(disc(RT).map(([x, y]) => pr([x, y, H]))));
    inner.setAttribute("d", poly(disc(RT - 2.5).map(([x, y]) => pr([x, y, H - 1.5]))));
    const hp = [];
    for (let i = 0; i <= 16; i++) { const t = (i / 16) * Math.PI; hp.push(pr([0, RT * Math.cos(t), H - 4 + 18 * Math.sin(t)])); }
    handle.setAttribute("d", open(hp));
  }
  body.classList.add("hi");

  const B = register(stage, (_dt, now) => { draw(tval(tw, now)); return !tdone(tw, now); });
  bag.add(B.unregister);
  const rp = disc(RT).map(([x, y]) => P(...tip(REST)([x, y, H]))).concat(disc(RB).map(([x, y]) => P(x, y, 0)));
  const xs = rp.map((p) => p[0]), ys = rp.map((p) => p[1]);
  const box = [Math.min(...xs) - 8, Math.min(...ys) - 30, Math.max(...xs) + 8, Math.max(...ys) + 8];
  let on = false;
  function setOn(v) {
    on = v;
    tset(tw, on ? most : REST, performance.now(), 0);
    read.textContent = on ? "tip " + Math.round(most) + "°" : "rest";
    B.wake();
  }
  setOn(false);
  const hit = ([sx, sy]) => sx > box[0] && sx < box[2] && sy > box[1] && sy < box[3];
  bag.add(pointer(stage, { move: (p) => { if (hit(p) !== on) setOn(hit(p)); }, leave: () => { if (on) setOn(false); } }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { most = 40 + 50 * v; if (on) setOn(true); }, destroy: bag.dispose };
}

hairline({
  name: "beachspade",
  means: "A sand bucket beside its spade: the pointer over the bucket tips it over its front foot to pour.",
  rules: [1, 3, 5, 8],
  range: [0, 0.6, 1],
  tour: [[144, 110], [93, 85], [160, 125], null],
  mount,
});
