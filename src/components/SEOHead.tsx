import React, { useEffect } from 'react';
import { Article } from '../types/news.ts';

interface SEOHeadProps {
  title?: string;
  description?: string;
  article?: Article | null;
  category?: string | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ title, description, article, category }) => {
  useEffect(() => {
    const siteTitle = 'DailyPulse News – Truth, Depth & Clarity';
    const defaultDesc = 'Authoritative daily reporting, regional India and Maharashtra coverage, and verified AI-synthesized journalism.';

    const pageTitle = article
      ? `${article.title} – DailyPulse News`
      : category
      ? `${category.charAt(0).toUpperCase() + category.slice(1)} News – DailyPulse News`
      : title
      ? `${title} – DailyPulse News`
      : siteTitle;

    const pageDesc = article ? article.description : description || defaultDesc;

    document.title = pageTitle;

    // Update meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('description', pageDesc);
    updateMeta('og:title', pageTitle, true);
    updateMeta('og:description', pageDesc, true);
    updateMeta('twitter:title', pageTitle);
    updateMeta('twitter:description', pageDesc);

    if (article) {
      updateMeta('og:type', 'article', true);
      if (article.image_url) {
        const fullImageUrl = article.image_url.startsWith('http')
          ? article.image_url
          : `${window.location.origin}${article.image_url}`;
        updateMeta('og:image', fullImageUrl, true);
        updateMeta('twitter:image', fullImageUrl);
      }
    } else {
      updateMeta('og:type', 'website', true);
    }

    // Inject Schema.org JSON-LD structured data
    const existingScript = document.getElementById('json-ld-schema');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'json-ld-schema';
    script.type = 'application/ld+json';

    if (article) {
      const fullImageUrl = article.image_url.startsWith('http')
        ? article.image_url
        : `${window.location.origin}${article.image_url}`;

      const schema = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        'headline': article.title,
        'description': article.description,
        'image': [fullImageUrl],
        'datePublished': article.published_at,
        'dateModified': article.updated_at || article.published_at,
        'author': {
          '@type': 'Organization',
          'name': article.author_label
        },
        'publisher': {
          '@type': 'NewsMediaOrganization',
          'name': 'DailyPulse News',
          'url': window.location.origin
        },
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': `${window.location.origin}/article/${article.slug}`
        }
      };
      script.text = JSON.stringify(schema);
    } else {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'NewsMediaOrganization',
        'name': 'DailyPulse News',
        'url': window.location.origin,
        'description': defaultDesc,
        'publishingPrinciples': `${window.location.origin}#ethics`
      };
      script.text = JSON.stringify(schema);
    }

    document.head.appendChild(script);

    return () => {
      const s = document.getElementById('json-ld-schema');
      if (s) s.remove();
    };
  }, [title, description, article, category]);

  return null;
};
