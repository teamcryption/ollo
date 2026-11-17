/**
 * Leaf grabber: a scissor-action leaf grabber lying on the lawn, two long
 * arms crossed at a bolt, each ending in a fanned rake head. The pointer over
 * it opens the jaws: both arms swing apart round the bolt. At rest the jaws
 * are almost closed and the upper head is bright. The slider is how wide.
 */
const { Cam, fit, hull, poly, proj, rrect, seg, tween, tset, tval, tdone, unproj, disposer, mk, pointer, register } = HL;

const rz = (a) => ([x, y, z]) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a), z];
const chain = (...fs) => (p) => fs.reduce((q, f) => f(q), p);
const D = Math.PI / 180, REST = 4, BASE = -12 * D, T = 3;

function fan(r0, r1, h0, h1, n = 10) {
  const out = [{ u: r0, v: -h0 }];
  for (let i = 0; i <= n; i++) { const a = (-1 + 2 * i / n) * h1; out.push({ u: r1 * Math.cos(a) + r0 * 0.15, v: r1 * Math.sin(a) }); }
  out.push({ u: r0, v: h0 });
  return out;
}

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let max = value;
  const C = Cam(45, 0.5, 2.3);
  const ext = [];
  for (const s of [-1, 1]) for (const th of [REST, 30]) for (const p of [[-84, 0, 0], [62, 22, 0], [62, -22, 0], [0, 0, 10]]) ext.push(chain(rz(s * th * D), rz(BASE))(p));
  fit(C, ext, 200, 160);
  const P = proj(C);
  const g = mk("g", {}, svg);

  const parts = [
    { ring: rrect(-76, -2.5, 6, 2.5, 2.5), z0: 0, z1: T },
    { ring: rrect(-86, -4.5, -52, 4.5, 4.5), z0: 0, z1: T + 2 },
    { ring: fan(4, 60, 3, 0.36), z0: 0, z1: 1.6, head: true },
  ];
  const arms = [1, -1].map((s, k) => {
    const grp = mk("g", {}, g);
    const els = parts.map((pt) => ({ pt, sil: mk("path", { class: "sil" }, grp), cr: mk("path", { class: "nf lo" }, grp) }));
    const tines = mk("path", { class: "nf lo" }, grp);
    return { s, k, dz: k * (T + 2), els, tines };
  });
  const bolt = mk("path", { class: "" }, g);
  const open = tween(0);
  let last = NaN;

  function draw(o) {
    if (o === last) return;
    last = o;
    const th = (REST + (max - REST) * o) * D;
    for (const a of arms) {
      const Tf = chain(rz(a.s * th), rz(BASE)), at = (q, z) => P(...Tf([q.u, q.v, z + a.dz]));
      for (const e of a.els) {
        const { ring, z0, z1 } = e.pt;
        const top = ring.map((q) => at(q, z1));
        e.sil.setAttribute("d", poly(hull(ring.map((q) => at(q, z0)).concat(top))));
        const inner = ring.map((q) => ({ u: q.u * 0.94 + (e.pt.head ? 2.5 : -2.2) * 0.4, v: q.v * 0.8 }));
        e.cr.setAttribute("d", poly(inner.map((q) => at(q, z1))));
      }
      let d = "";
      for (let i = -3; i <= 3; i++) { const an = i * 0.1; d += seg(at({ u: 30 * Math.cos(an), v: 30 * Math.sin(an) }, 1.6), at({ u: 66 * Math.cos(an), v: 66 * Math.sin(an) }, 1.6)); }
      a.tines.setAttribute("d", d);
    }
    const ring = rrect(-3.5, -3.5, 3.5, 3.5, 3.5).map((q) => P(...rz(BASE)([q.u, q.v, 0])));
    const ringT = rrect(-3.5, -3.5, 3.5, 3.5, 3.5).map((q) => P(...rz(BASE)([q.u, q.v, 2 * T + 5])));
    bolt.setAttribute("d", poly(hull(ring.concat(ringT))));
  }

  const B = register(stage, (_dt, now) => { draw(tval(open, now)); return !tdone(open, now); });
  bag.add(B.unregister);

  let act = null;
  function setActive(a) {
    if (a === act) return;
    act = a;
    tset(open, a ? 1 : 0, performance.now(), 0);
    arms[0].els[2].sil.classList.toggle("hi", !a);
    arms[1].els[2].sil.classList.toggle("hi", a);
    read.textContent = a ? "open " + Math.round(max) + "°" : "rest";
    B.wake();
  }
  function hit([sx, sy]) {
    const [x, y] = unproj(C, sx, sy, 0), [u, v] = rz(-BASE)([x, y, 0]);
    return u > -90 && u < 70 && Math.abs(v) < 34;
  }
  setActive(false);
  bag.add(pointer(stage, { move: (p) => setActive(hit(p)), leave: () => setActive(false) }));
  bag.add(() => svg.replaceChildren());
  return { set: (v) => { max = v; last = NaN; B.wake(); }, destroy: bag.dispose };
}

hairline({
  name: "logsplitter2",
  means: "A scissor leaf grabber on the lawn: the pointer over it swings both rake-headed arms apart round the bolt, opening the jaws.",
  rules: [1, 3, 5, 8],
  range: [14, 24, 32],
  tour: [[280, 180], [200, 160], [125, 130], null],
  mount,
});
