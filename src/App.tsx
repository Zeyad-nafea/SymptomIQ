import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { LanguageProvider } from './contexts/language-context';
import { ThemeProvider } from './contexts/theme-context';
import { RegionProvider } from './contexts/region-context';

export default function App() {
  return (
    <ThemeProvider>
      <RegionProvider>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </RegionProvider>
    </ThemeProvider>
  );
}