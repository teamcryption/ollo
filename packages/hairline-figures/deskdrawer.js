/**
 * Pedestal: an office pedestal, a tall cabinet on a plinth with three drawers
 * on its front. The pointer picks a drawer by its height on the face: that
 * drawer slides right out, the others ease open a little, staggered from it.
 * At rest the middle drawer is left ajar, bright. The slider is the stagger.
 */
const { Cam, clamp, facing, fit, prism, proj, rings, tdone, tset, tval, tween, disposer, mk, pointer, put, register, solid, seg } = HL;

const W = 30, D = 34, H = 62, PL = 4, OUT = 30, BUMP = 5;
const DR = [[PL + 1, 24], [25, 43], [44, H - 2]], REST = [1, 8, 2], FAV = 1;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let stag = value;
  const C = Cam(45, 0.5, 3.1);
  fit(C, [[0, 0, 0], [W, 0, 0], [0, D + OUT + 2, 0], [W, D + OUT + 2, 0], [0, 0, H], [W, D + OUT, H]], 200, 165);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  const body = solid(g);
  const [r, i] = rings(0, 0, W, D, 2, 1);
  put(body, prism(P, front, r, i, 0, H));
  mk("path", { class: "nf lo", d: seg(P(0, D, PL), P(W, D, PL)) }, body.g);

  const drawers = DR.map(([z0, z1], k) => {
    const s = solid(g);
    const pull = mk("path", { class: "nf lo" }, s.g);
    return { k, z0, z1, s, pull, o: tween(REST[k]), last: NaN };
  });
  function draw(d, o) {
    if (o === d.last) return;
    d.last = o;
    const [r, i] = rings(1.5, D - 0.5, W - 1.5, D + o + 2, 1.2, 0.6);
    put(d.s, prism(P, front, r, i, d.z0, d.z1));
    const zm = (d.z0 + d.z1) / 2 + 2, y = D + o + 2;
    d.pull.setAttribute("d", seg(P(W / 2 - 6, y, zm), P(W / 2 + 6, y, zm)));
  }

  const B = register(stage, (_dt, now) => {
    let moving = false;
    drawers.forEach((d) => { draw(d, tval(d.o, now)); if (!tdone(d.o, now)) moving = true; });
    return moving;
  });
  bag.add(B.unregister);

  // the hit: the drawer whose resting front centre is nearest the pointer's screen y
  const cy = DR.map(([z0, z1]) => P(W / 2, D, (z0 + z1) / 2));
  const xl = P(0, D, 0)[0] - 4, xr = P(W, D, 0)[0] + 4;
  function hit([sx, sy]) {
    if (sx < xl || sx > xr || sy < P(W, D, H)[1] - 10 || sy > P(0, D, 0)[1] + 4) return -1;
    let b = -1, bd = 1e9;
    cy.forEach((c, k) => { const dd = Math.abs(c[1] - sy); if (dd < bd) { bd = dd; b = k; } });
    return b;
  }

  let act = -2;
  function setActive(a) {
    if (a === act) return;
    const now = performance.now(), from = a >= 0 ? a : act;
    act = a;
    drawers.forEach((d, k) => {
      tset(d.o, a < 0 ? REST[k] : k === a ? OUT : clamp(BUMP - 2 * Math.abs(k - a), 1, BUMP), now, from < 0 ? 0 : Math.abs(k - from) * stag);
      d.s.sil.classList.toggle("hi", k === (a < 0 ? FAV : a));
    });
    read.textContent = a < 0 ? "rest" : "dr " + (3 - a);
    B.wake();
  }
  setActive(-1);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(-1) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { stag = v; }, destroy: bag.dispose };
}

hairline({
  name: "deskdrawer",
  means: "An office pedestal: the drawer at the pointer's height slides right out, the others ease open a little after it.",
  rules: [1, 2, 5, 6],
  range: [0, 45, 90],
  tour: [[193, 112], [193, 160], [193, 211], null],
  mount,
});
