// Home page
export const HOME_QUERY = `
*[_type == "home"][0]{
  title,
  heroText,
  heroImage{
    asset->{url}
  },
  ctaText,
  aboutText,
  aboutImage{
    asset->{url}
  },
  ctaSection,
  seo,
  "latestHomilies": *[_type == "homily"] | order(publishedAt desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      date,
      scripture,
      category,
      "imageUrl": featuredImage.asset->url,
      excerpt
  },
  "latestArticles": *[_type == "article"] | order(publishedAt desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      author,
      "imageUrl": featuredImage.asset->url,
      publishedAt,
      excerpt
  },
  "latestEvents": *[_type == "event"] | order(date desc)[0...3]{
      _id,
      title,
      "slug": slug.current,
      date,
      location,
      "imageUrl": featuredImage.asset->url,
      excerpt // Use description as excerpt for events
  },
  "latestPrayers": *[_type == "prayer"] | order(publishedAt desc)[0...3]{
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


// Homilies List Page
export const HOMILIES_QUERY = `
*[_type == "homily"] | order(publishedAt desc){
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

// Articles List Page
export const ARTICLES_QUERY = `
*[_type == "article"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  author,
  "imageUrl": featuredImage.asset->url,
  publishedAt,
  excerpt
}
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

// Prayers List Page
export const PRAYERS_QUERY = `
*[_type == "prayer"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "imageUrl": featuredImage.asset->url,
  excerpt,
  content
}
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

// Music List Page
export const MUSIC_QUERY = `
*[_type == "music"] | order(publishedAt desc) {
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

// Events List Page
export const EVENTS_QUERY = `
*[_type == "event"] | order(date desc) {
  _id,
  title,
  "slug": slug.current,
  date,
  location,
  description, // Using description as excerpt
  "imageUrl": featuredImage.asset->url
}
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
