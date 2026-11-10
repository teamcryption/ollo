// Entry for the standalone preview page (scripts/build-preview.mjs): the same Library UI as the site.
import { createRoot } from 'react-dom/client';
import { Library } from '@/components/Library';

createRoot(document.getElementById('root')!).render(<Library />);
