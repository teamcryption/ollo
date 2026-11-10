const PAGE = `body('M5.5 5.5A2.5 2.5 0 0 1 8 3h5.5L18.5 8v10.5A2.5 2.5 0 0 1 16 21H8a2.5 2.5 0 0 1-2.5-2.5Z'), line('M13.5 3.2V6.5A1.5 1.5 0 0 0 15 8h3.3')`;
const FOLDER = `body('M3.5 7A2.5 2.5 0 0 1 6 4.5h3.2a2 2 0 0 1 1.5.7l1.3 1.6h6A2.5 2.5 0 0 1 20.5 9.3v8.2A2.5 2.5 0 0 1 18 20H6a2.5 2.5 0 0 1-2.5-2.5Z')`;
const G = {
  terminal: ['Terminal', 'M9 12l2.2 2-2.2 2M12.5 17h3', ['script', 'command line', 'shell', 'console']],
  flag: ['Flagged', 'M10 18v-6.5h4.5l-1 1.5 1 1.5H10', ['flag', 'important', 'marked', 'priority']],
  globe: ['Web', 'M12 11a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7ZM8.5 14.5h7M12 11c1 .9 1.5 2.1 1.5 3.5S13 17.1 12 18c-1-.9-1.5-2.1-1.5-3.5S11 11.9 12 11Z', ['website', 'html', 'public', 'internet']],
  dollar: ['Finance', 'M14 12.3c-.4-.6-1.1-.9-2-.9-1.2 0-2 .6-2 1.4s.8 1.2 2 1.5 2 .7 2 1.6-.8 1.5-2 1.5c-1 0-1.7-.4-2.1-1M12 10.5v.9M12 16.4v1', ['money', 'invoice', 'budget', 'accounts']],
  trash: ['Deleted', 'M9.5 12.5h5M10.3 12.5l.4 5h2.6l.4-5M11.2 12.5v-1h1.6v1', ['trash', 'bin', 'removed', 'deleted']],
};
const q = (a) => JSON.stringify(a).replace(/"/g, "'");
export default {
  files: Object.entries(G).flatMap(([k, [t, d, tags]]) => [
    `icon('file-${k}', '${t} File', ${q(tags.concat(['document']))}, [${PAGE}, accent('${d}')])`,
    `icon('folder-${k}', '${t} Folder', ${q(tags.concat(['directory']))}, [${FOLDER}, accent(translateD('${d}', 0, -1))])`,
  ]),
};
