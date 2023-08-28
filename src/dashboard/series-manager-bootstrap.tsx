import React from 'react';
import { createRoot } from 'react-dom/client';
import { SeriesManager } from './SeriesManager';

const root = createRoot(document.getElementById('root')!);
root.render(<SeriesManager />);
