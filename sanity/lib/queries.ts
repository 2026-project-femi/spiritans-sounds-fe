// Home page
export const HOME_QUERY = `
*[_type == "home"][0]{
  title,
  heroText,
  "carouselImages": carouselImages[].asset->url,
  ctaSection,
  seo,
  "latestPosts": *[_type == "article"] | order(publishedAt desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      "date": coalesce(date, publishedAt),
      scripture,
      category,
      author,
      "imageUrl": featuredImage.asset->url,
      excerpt,
      "type": _type
  },
  "latestHomilies": *[_type == "homily"] | order(date desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      date,
      scripture,
      category,
      "imageUrl": featuredImage.asset->url,
      excerpt
  },
  "latestPrayers": *[_type == "prayer"] | order(_createdAt desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      category,
      "imageUrl": featuredImage.asset->url,
      excerpt
  }
}
`;
// About / Generic Pages
// Used for: About the Ministry
// Any static page
export const PAGE_QUERY = `
*[_type == "page" && slug.current == $slug][0]{
  title,
  content,
  image{
    asset->{url}
  },
  seo
}
`;

// Homilies List Page with Pagination
export const HOMILIES_QUERY = `
*[_type == "homily"] | order(publishedAt desc)[$start...$end]{
  _id,
  title,
  "slug": slug.current,
  date,
  scripture,
  category,
  "imageUrl": featuredImage.asset->url,
  excerpt
}
`;

// Count of all Homilies
export const HOMILIES_COUNT_QUERY = `
count(*[_type == "homily"])
`;

// Single Homily Page
export const HOMILY_QUERY = `
*[_type == "homily" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  date,
  scripture,
  audio,
  content,
  category,
  seo,
  "imageUrl": featuredImage.asset->url,
  publishedAt
}
`;

// Articles List Page with Pagination
export const ARTICLES_QUERY = `
*[_type == "article"] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  "slug": slug.current,
  author,
  "imageUrl": featuredImage.asset->url,
  publishedAt,
  excerpt
}
`;

// Count of all Articles
export const ARTICLES_COUNT_QUERY = `
count(*[_type == "article"])
`;

// Single Article Page
export const ARTICLE_QUERY = `
*[_type == "article" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  author,
  "imageUrl": featuredImage.asset->url,
  publishedAt,
  content
}
`;

// Prayers List Page with Pagination
export const PRAYERS_QUERY = `
*[_type == "prayer"] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  "slug": slug.current,
  category,
  "imageUrl": featuredImage.asset->url,
  excerpt,
  content
}
`;

// Count of all Prayers
export const PRAYERS_COUNT_QUERY = `
count(*[_type == "prayer"])
`;

// Single Prayer Page
export const PRAYER_QUERY = `
*[_type == "prayer" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  category,
  "imageUrl": featuredImage.asset->url,
  content
}
`;

// Music List Page with Pagination
export const MUSIC_QUERY = `
*[_type == "music"] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  "slug": slug.current,
  artist,
  audioUrl,
  lyrics,
  "imageUrl": featuredImage.asset->url,
  excerpt
}
`;

// Count of all Music items
export const MUSIC_COUNT_QUERY = `
count(*[_type == "music"])
`;

// Single Music Page
export const SINGLE_MUSIC_QUERY = `
*[_type == "music" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  artist,
  audioUrl,
  lyrics,
  "imageUrl": featuredImage.asset->url,
  content // Assuming content field for full lyrics/details
}
`;

// Events List Page with Pagination
export const EVENTS_QUERY = `
*[_type == "event"] | order(date desc)[$start...$end] {
  _id,
  title,
  "slug": slug.current,
  date,
  location,
  description, // Using description as excerpt
  "imageUrl": featuredImage.asset->url
}
`;

// Count of all Events
export const EVENTS_COUNT_QUERY = `
count(*[_type == "event"])
`;

// Single Event Page
export const EVENT_QUERY = `
*[_type == "event" && slug.current == $slug][0] {
  _id,
  title,
  "slug": slug.current,
  date,
  location,
  description,
  "imageUrl": featuredImage.asset->url
}
`;

// All Categories for Sidebar
export const ALL_CATEGORIES_QUERY = `
array::unique(*[_type == "homily"].category)
`;

// Latest combined Homilies and Articles for Sidebar
export const LATEST_SIDEBAR_POSTS_QUERY = `
{
  "homilies": *[_type == "homily"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    "publishedAt": date, // Map date to publishedAt
    "imageUrl": featuredImage.asset->url,
    "type": "homily"
  },
  "articles": *[_type == "article"] | order(publishedAt desc)[0...3] {
    _id,
    title,
    "slug": slug.current,
    publishedAt,
    "imageUrl": featuredImage.asset->url, // Assuming article schema has featuredImage
    "type": "article"
  }
}
`;

// Online Radio
export const RADIO_QUERY = `
*[_type == "radio"][0]{
  streamUrl,
  schedule,
  currentProgram
}
`;

// eBooks and Publications
export const PUBLICATIONS_QUERY = `
*[_type == "publication"]{
  title,
  description,
  price,
  cover{
    asset->{url}
  },
  file{
    asset->{url}
  }
}
`;

//Donation page
export const DONATION_QUERY = `
*[_type == "donationPage"][0]{
  message,
  bankDetails,
  paymentLink
}
`;

// Newsletter Section
export const NEWSLETTER_QUERY = `
*[_type == "newsletter"][0]{
  headline,
  description
}
`;

// 📞 Contact Page
export const CONTACT_QUERY = `
*[_type == "contactPage"][0]{
  address,
  email,
  phone,
  socialLinks
}
`;

// SEO Fragment (Optional Reuse)
export const SEO_FIELDS = `
seo{
  metaTitle,
  metaDescription,
  ogImage{
    asset->{url}
  }
}
`;

// Magazine Landing page - Removed as per user request
// export const MAGAZINE_LANDING_QUERY = `
// *[_type == "magazineLanding"][0]{
//   title,
//   subtitle,
//   heroImage{
//     asset->{url}
//   },
//   aboutMagazine,
//   mission,
//   editorNote,
//   seo
// }
// `;

// 📚 Magazine Issues List - Removed as per user request
// export const MAGAZINE_ISSUES_QUERY = `
// *[_type == "magazineIssue"] | order(publishDate desc){
//   issueNumber,
//   slug,
//   publishDate,
//   cover{
//     asset->{url}
//   }
// }
// `;

// 📝 Single Magazine Article Page - Removed as per user request
// export const MAGAZINE_ISSUE_QUERY = `
// *[_type == "magazineIssue" && slug.current == $slug][0]{
//   issueNumber,
//   publishDate,
//   cover{
//     asset->{url}
//   },
//   articles[]->{
//     title,
//     slug,
//     author,
//     image{
//       asset->{url}
//     }
//   }
// }
// `;
