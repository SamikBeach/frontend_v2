import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * HTML 엔티티를 디코딩하는 함수
 * &lt; &gt; &amp; &quot; &#39; 등의 HTML 엔티티를 실제 문자로 변환
 */
export function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  const htmlEntities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#39;': "'",
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '=',
  };

  return text.replace(/&[#\w]+;/g, entity => {
    return htmlEntities[entity] || entity;
  });
}
