import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applySeoTags, buildSeoTags } from '../lib/seo';
import { findRoute } from '../lib/routes';

export interface PageSeoProps {
  /** Extra JSON-LD blocks that describe visible content on this page. */
  jsonLd?: unknown[];
  /** Override the registry title (used only by the 404 page). */
  title?: string;
  description?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
}

/**
 * Applies the route's metadata (from the central route registry) to
 * <head> on mount and on every client-side navigation.
 */
export function PageSeo({ jsonLd, title, description, noindex, type }: PageSeoProps) {
  const location = useLocation();

  useEffect(() => {
    const route = findRoute(location.pathname);
    const fallbackTitle = 'Page Not Found | SnapKit';
    const fallbackDescription =
      'This page does not exist. Browse the free tools and guides available on SnapKit.';
    const tags = buildSeoTags({
      title: title ?? route?.title ?? fallbackTitle,
      description: description ?? route?.description ?? fallbackDescription,
      path: route ? route.path : location.pathname,
      noindex: noindex ?? (!route || route.noindex === true),
      type,
      jsonLd,
    });
    applySeoTags(tags);
  }, [location.pathname, title, description, noindex, type, jsonLd]);

  return null;
}
