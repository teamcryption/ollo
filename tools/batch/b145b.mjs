const Z = `{ noAccent: true }`;
const F = `body(R(3.5, 4.5, 17, 15, 2.5))`;
const T = (a) => a.map((t) => `'${t}'`).join(', ');
const lay = (name, title, tags, inner) => `icon('${name}', '${title}', [${T(tags)}, 'layout', 'ui'], [${F}, ${inner}], ${Z})`;
export default {
  interface: [
    lay('layout-two-thirds', 'Two Thirds Layout', ['asymmetric', 'columns', 'content and aside'], `line('M14.5 4.7v14.6')`),
    lay('layout-header-sidebar', 'Header and Sidebar', ['app shell', 'dashboard layout', 'navigation'], `line('M3.7 8.5h16.6M8.5 8.7v10.6')`),
    lay('layout-header-split', 'Header and Split', ['header', 'two panes', 'sections'], `line('M3.7 9h16.6M12 9.2v10.1')`),
  ],
};
