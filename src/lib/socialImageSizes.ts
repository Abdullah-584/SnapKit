/**
 * Social media image dimension data.
 *
 * Every entry records where the number came from:
 * - `official`  : documented by the platform itself (help center / docs)
 * - `ad-spec`   : documented by the platform, but in advertising specs
 * - `convention`: widely used by practitioners; the platform does not publish
 *                 an exact pixel size for this placement
 *
 * `verifiedOn` is the date these sources were last fetched and checked.
 */

export type SpecStatus = 'official' | 'ad-spec' | 'convention';

export interface SocialSpec {
  id: string;
  platform: string;
  placement: string;
  /** Coarse grouping for filtering. */
  group: 'Posts' | 'Profile pictures' | 'Covers & banners' | 'Stories & vertical' | 'Video';
  width: number;
  height: number;
  ratio: string;
  formats?: string;
  maxSize?: string;
  status: SpecStatus;
  note: string;
  sourceLabel: string;
  sourceUrl: string;
}

export const SPEC_VERIFIED_ON = '2026-10-12';

export const STATUS_LABELS: Record<SpecStatus, string> = {
  official: 'Official platform documentation',
  'ad-spec': 'Official (ad specs)',
  convention: 'Widely used convention — not officially published',
};

export const SOCIAL_SPECS: SocialSpec[] = [
  // Facebook
  {
    id: 'fb-profile',
    platform: 'Facebook',
    placement: 'Page profile picture',
    group: 'Profile pictures',
    width: 320,
    height: 320,
    ratio: '1:1',
    status: 'official',
    note: 'Facebook states 320 × 320 for best quality; it is displayed as a circle and re-cropped by device.',
    sourceLabel: 'Facebook Help Center',
    sourceUrl: 'https://www.facebook.com/help/125379114252045',
  },
  {
    id: 'fb-cover',
    platform: 'Facebook',
    placement: 'Page cover photo',
    group: 'Covers & banners',
    width: 851,
    height: 315,
    ratio: '2.70:1',
    formats: 'JPG (sRGB); PNG for logos/text',
    maxSize: '< 100 KB loads fastest (official note)',
    status: 'official',
    note: 'Facebook calls 851 × 315 the fastest-loading size. Desktop and mobile display different crops of the uploaded image.',
    sourceLabel: 'Facebook Help Center',
    sourceUrl: 'https://www.facebook.com/help/125379114252045',
  },
  {
    id: 'fb-post',
    platform: 'Facebook',
    placement: 'Feed post image (portrait)',
    group: 'Posts',
    width: 1080,
    height: 1350,
    ratio: '4:5',
    status: 'convention',
    note: '4:5 is the tallest ratio Facebook shows in-feed. 1080 × 1080 (1:1) also works. Meta documents exact sizes for ads, not organic posts.',
    sourceLabel: 'Meta ads image guidance (official, ads)',
    sourceUrl: 'https://www.facebook.com/business/help/469767027114079',
  },
  {
    id: 'fb-story',
    platform: 'Facebook',
    placement: 'Story',
    group: 'Stories & vertical',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    status: 'convention',
    note: 'Meta documents 9:16 for Story ads (30 MB limit) but no organic pixel size; 1080 × 1920 is the standard practice.',
    sourceLabel: 'Meta Stories ad specs (official, ads)',
    sourceUrl: 'https://www.facebook.com/business/ads-guide/update/image/instagram-story',
  },

  // Instagram
  {
    id: 'ig-post-square',
    platform: 'Instagram',
    placement: 'Feed post (square)',
    group: 'Posts',
    width: 1080,
    height: 1080,
    ratio: '1:1',
    status: 'convention',
    note: 'Instagram supports a range of ratios and recommends a minimum width of 1080 px; the square 1080 × 1080 is standard practice.',
    sourceLabel: 'Instagram image resolution help',
    sourceUrl: 'https://help.instagram.com/1631821640426723/',
  },
  {
    id: 'ig-post-portrait',
    platform: 'Instagram',
    placement: 'Feed post (portrait)',
    group: 'Posts',
    width: 1080,
    height: 1350,
    ratio: '4:5',
    status: 'convention',
    note: '4:5 fits Instagram’s supported ratio range (1.91:1 – 3:4) and uses the most feed space.',
    sourceLabel: 'Instagram image resolution help',
    sourceUrl: 'https://help.instagram.com/1631821640426723/',
  },
  {
    id: 'ig-post-landscape',
    platform: 'Instagram',
    placement: 'Feed post (landscape)',
    group: 'Posts',
    width: 1080,
    height: 566,
    ratio: '1.91:1',
    status: 'convention',
    note: '1.91:1 is the wide end of Instagram’s officially supported ratio range.',
    sourceLabel: 'Instagram image resolution help',
    sourceUrl: 'https://help.instagram.com/1631821640426723/',
  },
  {
    id: 'ig-story',
    platform: 'Instagram',
    placement: 'Story / Reel',
    group: 'Stories & vertical',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    status: 'convention',
    note: 'Full-screen vertical canvas used across Stories and Reels. Meta’s published 9:16 spec is for ads.',
    sourceLabel: 'Meta Stories ad specs (official, ads)',
    sourceUrl: 'https://www.facebook.com/business/ads-guide/update/image/instagram-story',
  },
  {
    id: 'ig-profile',
    platform: 'Instagram',
    placement: 'Profile picture',
    group: 'Profile pictures',
    width: 320,
    height: 320,
    ratio: '1:1',
    status: 'convention',
    note: 'Instagram publishes no pixel size; 320 × 320 square is the common practice. Displayed as a circle.',
    sourceLabel: 'Instagram profile photo help',
    sourceUrl: 'https://help.instagram.com/557544397610546/',
  },
  {
    id: 'ig-reel-cover',
    platform: 'Instagram',
    placement: 'Reel cover (feed crop)',
    group: 'Video',
    width: 420,
    height: 654,
    ratio: '≈1:1.55',
    status: 'official',
    note: 'Instagram Help Center names 420 × 654 as the recommended Reel cover size; the cover may be cropped elsewhere.',
    sourceLabel: 'Instagram Reel cover help',
    sourceUrl: 'https://help.instagram.com/1038071743007909',
  },

  // X
  {
    id: 'x-header',
    platform: 'X',
    placement: 'Header (profile banner)',
    group: 'Covers & banners',
    width: 1500,
    height: 500,
    ratio: '3:1',
    formats: 'JPG, GIF, PNG',
    status: 'official',
    note: 'Official recommended dimensions. X warns that about 60 px can be cropped at the top and bottom on some devices.',
    sourceLabel: 'X Help Center',
    sourceUrl: 'https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo',
  },
  {
    id: 'x-profile',
    platform: 'X',
    placement: 'Profile picture',
    group: 'Profile pictures',
    width: 400,
    height: 400,
    ratio: '1:1',
    formats: 'JPG, GIF, PNG',
    maxSize: '2 MB',
    status: 'official',
    note: 'Official recommended dimensions and maximum file size. Displayed as a circle.',
    sourceLabel: 'X Help Center',
    sourceUrl: 'https://help.x.com/en/managing-your-account/common-issues-when-uploading-profile-photo',
  },
  {
    id: 'x-post',
    platform: 'X',
    placement: 'Post image (landscape)',
    group: 'Posts',
    width: 1280,
    height: 720,
    ratio: '16:9',
    formats: 'JPG, PNG, GIF',
    maxSize: '5 MB mobile / 15 MB web (secondary sources)',
    status: 'convention',
    note: 'X supports landscape, portrait and square images and crops to fit; 1280 × 720 is the common landscape reference. X’s photo-help page blocked automated access, so this row is not from an official source.',
    sourceLabel: 'Hootsuite guide (secondary)',
    sourceUrl: 'https://blog.hootsuite.com/social-media-image-sizes-guide/',
  },

  // LinkedIn
  {
    id: 'li-profile',
    platform: 'LinkedIn',
    placement: 'Profile picture',
    group: 'Profile pictures',
    width: 400,
    height: 400,
    ratio: '1:1',
    formats: 'PNG, JPG',
    maxSize: '8 MB',
    status: 'official',
    note: 'LinkedIn accepts uploads from 400 × 400 up to 7680 × 4320; 400 × 400 square is the documented minimum that stays sharp.',
    sourceLabel: 'LinkedIn profile photo help',
    sourceUrl: 'https://www.linkedin.com/help/linkedin/answer/a549049',
  },
  {
    id: 'li-banner',
    platform: 'LinkedIn',
    placement: 'Personal profile banner',
    group: 'Covers & banners',
    width: 1584,
    height: 396,
    ratio: '4:1',
    formats: 'JPG, PNG',
    maxSize: '8 MB',
    status: 'official',
    note: 'Official recommended size for personal profile covers; display varies with screen and browser.',
    sourceLabel: 'LinkedIn cover image help',
    sourceUrl: 'https://www.linkedin.com/help/linkedin/answer/a568217',
  },
  {
    id: 'li-post',
    platform: 'LinkedIn',
    placement: 'Post image',
    group: 'Posts',
    width: 1080,
    height: 1080,
    ratio: '1:1',
    formats: 'JPEG, PNG',
    maxSize: '100 MB upload limit (official)',
    status: 'convention',
    note: 'LinkedIn does not publish organic post pixels. 1200 × 627 (1.91:1) is official for link-preview images in page posts.',
    sourceLabel: 'LinkedIn Page image specs',
    sourceUrl: 'https://www.linkedin.com/help/linkedin/answer/a563309',
  },

  // YouTube
  {
    id: 'yt-thumbnail',
    platform: 'YouTube',
    placement: 'Video thumbnail',
    group: 'Video',
    width: 3840,
    height: 2160,
    ratio: '16:9',
    formats: 'JPG, PNG',
    maxSize: '50 MB desktop / 2 MB mobile',
    status: 'official',
    note: 'YouTube’s current recommendation is “as large as possible”, giving 3840 × 2160; the minimum width is 640 px. Keep important text clear of the duration badge (bottom right).',
    sourceLabel: 'YouTube custom thumbnail help',
    sourceUrl: 'https://support.google.com/youtube/answer/72431',
  },
  {
    id: 'yt-banner',
    platform: 'YouTube',
    placement: 'Channel banner',
    group: 'Covers & banners',
    width: 2560,
    height: 1440,
    ratio: '16:9',
    maxSize: '6 MB',
    status: 'official',
    note: 'Official recommended size; minimum upload is 2048 × 1152. Keep text and logos inside the 1235 × 338 safe area or they are cut on some devices.',
    sourceLabel: 'YouTube channel branding help',
    sourceUrl: 'https://support.google.com/youtube/answer/10456525',
  },
  {
    id: 'yt-profile',
    platform: 'YouTube',
    placement: 'Channel profile picture',
    group: 'Profile pictures',
    width: 98,
    height: 98,
    ratio: '1:1',
    formats: 'JPG, GIF, BMP, PNG (no animated GIF)',
    maxSize: '15 MB',
    status: 'official',
    note: '98 × 98 is the official rendered size; upload a square image (YouTube suggests 800 × 800 in Studio) so it is not cropped unexpectedly.',
    sourceLabel: 'YouTube channel branding help',
    sourceUrl: 'https://support.google.com/youtube/answer/10456525',
  },

  // Pinterest
  {
    id: 'pin-standard',
    platform: 'Pinterest',
    placement: 'Standard image pin',
    group: 'Posts',
    width: 1000,
    height: 1500,
    ratio: '2:3',
    formats: 'BMP, JPEG, PNG, TIFF, WebP',
    maxSize: '20 MB (web)',
    status: 'ad-spec',
    note: 'Pinterest publishes 1000 × 1500 / 2:3 in its ad specs and warns taller ratios may be cropped; its organic Pin page lists formats and size limits but no pixels.',
    sourceLabel: 'Pinterest ad specs',
    sourceUrl: 'https://help.pinterest.com/en/business/article/pinterest-product-specs',
  },
  {
    id: 'pin-profile',
    platform: 'Pinterest',
    placement: 'Profile picture',
    group: 'Profile pictures',
    width: 280,
    height: 280,
    ratio: '1:1',
    status: 'convention',
    note: 'No official pixel size found; practitioner guides disagree (165 × 165 vs 280 × 280). A square upload at least 280 px wide is safe and displays as a circle.',
    sourceLabel: 'Hootsuite guide (secondary)',
    sourceUrl: 'https://blog.hootsuite.com/social-media-image-sizes-guide/',
  },

  // TikTok
  {
    id: 'tt-cover',
    platform: 'TikTok',
    placement: 'Video cover / post',
    group: 'Stories & vertical',
    width: 1080,
    height: 1920,
    ratio: '9:16',
    status: 'convention',
    note: 'TikTok documents ad video specs (minimum 540 × 960, 9:16) but no organic cover pixels; 1080 × 1920 is the standard design canvas.',
    sourceLabel: 'TikTok In-Feed Ad specs (official, ads)',
    sourceUrl: 'https://ads.tiktok.com/resources/help/article/tiktok-auction-in-feed-ads',
  },
  {
    id: 'tt-profile',
    platform: 'TikTok',
    placement: 'Profile picture',
    group: 'Profile pictures',
    width: 200,
    height: 200,
    ratio: '1:1',
    status: 'convention',
    note: 'TikTok documents only a 20 × 20 minimum; 200 × 200 square is the common practice.',
    sourceLabel: 'TikTok profile photo help',
    sourceUrl: 'https://support.tiktok.com/en/getting-started/setting-up-your-profile/adding-a-profile-photo-or-video',
  },
];

export const SOCIAL_PLATFORMS: string[] = Array.from(new Set(SOCIAL_SPECS.map((s) => s.platform)));
export const SOCIAL_GROUPS = [
  'Posts',
  'Profile pictures',
  'Covers & banners',
  'Stories & vertical',
  'Video',
] as const;

export function searchSocialSpecs(
  specs: SocialSpec[],
  query: string,
  platform: string,
  group: string,
): SocialSpec[] {
  const q = query.trim().toLowerCase();
  return specs.filter((spec) => {
    if (platform !== 'All platforms' && spec.platform !== platform) return false;
    if (group !== 'All types' && spec.group !== group) return false;
    if (!q) return true;
    const haystack = `${spec.platform} ${spec.placement} ${spec.group} ${spec.width}x${spec.height} ${spec.ratio}`.toLowerCase();
    return q.split(/\s+/).every((term) => haystack.includes(term));
  });
}
