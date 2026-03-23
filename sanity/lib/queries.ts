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
  },
  "latestMusic": *[_type == "music"] | order(publishedAt desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      artist,
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
  youtubeUrl,
  content,
  category,
  seo,
  "imageUrl": featuredImage.asset->url,
  publishedAt,
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt desc){
      _id,
      name,
      comment,
      _createdAt
  }
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
  youtubeUrl,
  content,
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt desc){
      _id,
      name,
      comment,
      _createdAt
  }
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
  content,
  "comments": *[_type == "comment" && post._ref == ^._id && approved == true] | order(_createdAt desc){
      _id,
      name,
      comment,
      _createdAt
  }
}
`;

// Music List Page with Pagination
export const MUSIC_QUERY = `
*[_type == "music"] | order(publishedAt desc)[$start...$end] {
  _id,
  title,
  "slug": slug.current,
  artist,
  "audioUrl": audio.asset->url,
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
  "audioUrl": audio.asset->url,
  lyrics,
  "imageUrl": featuredImage.asset->url,
  content
}
`;

// Events List Page with Pagination
export const EVENTS_QUERY = `
*[_type == "event"] | order(isFeatured desc, date asc)[$start...$end] {
  _id,
  title,
  "slug": slug.current,
  date,
  publishedAt,
  location,
  description,
  excerpt,
  eventType,
  isFeatured,
  isPopular,
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
  publishedAt,
  location,
  description,
  body,
  youtubeUrl,
  excerpt,
  eventType,
  isFeatured,
  isPopular,
  "imageUrl": featuredImage.asset->url
}
`;

// Featured event for hero (editor-pinned)
export const FEATURED_EVENT_QUERY = `
*[_type == "event" && isFeatured == true] | order(date asc)[0] {
  _id,
  title,
  "slug": slug.current,
  date,
  location,
  excerpt,
  description,
  eventType,
  "imageUrl": featuredImage.asset->url
}
`;

// Popular events for sidebar
export const POPULAR_EVENTS_QUERY = `
*[_type == "event" && isPopular == true] | order(date desc)[0...5] {
  _id,
  title,
  "slug": slug.current,
  date,
  location,
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

export const RADIO_QUERY = `
*[_type == "radio"][0]{
  tagline,
  streamUrl,
  schedule[]{
    ...,
    "audioUrl": audio.asset->url
  },
  currentProgram
}
`;

// eBooks and Publications
export const PUBLICATIONS_QUERY = `
*[_type == "publication"] | order(publishedAt desc){
  _id,
  title,
  description,
  price,
  priceAmount,
  "slug": slug.current,
  "imageUrl": cover.asset->url,
  "fileUrl": file.asset->url,
  publishedAt
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

// 📚 Magazine Issues List
export const MAGAZINE_ISSUES_QUERY = `
*[_type == "magazineIssue"] | order(publishedAt desc){
  _id,
  title,
  description,
  price,
  priceAmount,
  "slug": slug.current,
  "imageUrl": cover.asset->url,
  "fileUrl": file.asset->url,
  publishedAt
}
`;

// 📝 Single Magazine Issue Page
export const MAGAZINE_ISSUE_QUERY = `
*[_type == "magazineIssue" && slug.current == $slug][0]{
  _id,
  title,
  description,
  price,
  priceAmount,
  "slug": slug.current,
  "imageUrl": cover.asset->url,
  "fileUrl": file.asset->url,
  publishedAt,
  excerpt
}
`;
