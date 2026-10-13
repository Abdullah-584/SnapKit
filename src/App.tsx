import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ToolsDirectoryPage } from './pages/ToolsDirectoryPage';
import { ImageToolsPage, TextToolsPage } from './pages/CategoryPages';
import { ImageCompressorPage } from './pages/ImageCompressorPage';
import { ImageResizerPage } from './pages/ImageResizerPage';
import { ImageConverterPage } from './pages/ImageConverterPage';
import { WordCounterPage } from './pages/WordCounterPage';
import { SocialImageSizesPage } from './pages/SocialImageSizesPage';
import { Guides } from './pages/Guides';
import { GuideArticle } from './pages/GuideArticle';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';
import { CookiePreferences } from './pages/CookiePreferences';
import { ProcessImage } from './pages/ProcessImage';
import { NotFound } from './pages/NotFound';

/**
 * Canonical URLs end with a slash (except the root). Any slashless deep link
 * is redirected so there is exactly one URL per page.
 */
function CanonicalRedirect() {
  const { pathname, search } = useLocation();
  if (pathname !== '/' && !pathname.endsWith('/')) {
    return <Navigate to={{ pathname: `${pathname}/`, search }} replace />;
  }
  return null;
}

export default function App() {
  return (
    <>
      <CanonicalRedirect />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tools/" element={<ToolsDirectoryPage />} />
          <Route path="/image-tools/" element={<ImageToolsPage />} />
          <Route path="/text-tools/" element={<TextToolsPage />} />
          <Route path="/image-compressor/" element={<ImageCompressorPage />} />
          <Route path="/image-resizer/" element={<ImageResizerPage />} />
          <Route path="/image-converter/" element={<ImageConverterPage />} />
          <Route path="/word-counter/" element={<WordCounterPage />} />
          <Route path="/social-image-sizes/" element={<SocialImageSizesPage />} />
          <Route path="/guides/" element={<Guides />} />
          <Route path="/guides/:slug/" element={<GuideArticle />} />
          <Route path="/about/" element={<About />} />
          <Route path="/contact/" element={<Contact />} />
          <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use/" element={<TermsOfUse />} />
          <Route path="/cookie-preferences/" element={<CookiePreferences />} />
          <Route path="/process-images/" element={<ProcessImage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
