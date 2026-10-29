/**
 * ⚠️ DEMO / TEMPORARY CONTENT ⚠️
 * Every creator, story, quote and image here is fictional placeholder content
 * for design review. Replace with Payload CMS data (see ../api/index.ts).
 */
import type { Creator, LatestPost, MediaItem } from '../types';

const asset = (file: string) => `/young-creators/${file}`;

const writer = asset('writer.jpg');
const musician = asset('musician.jpg');
const artist = asset('artist.jpg');
const photographer = asset('photographer.jpg');
const dancer = asset('dancer.jpg');
const digital = asset('digital.jpg');
const tech = asset('tech.jpg');
const poet = asset('poet.jpg');
const workshop = asset('workshop.jpeg');
const painting = asset('work-painting.jpg');
const stage = asset('work-stage.jpg');
const hero = asset('hero.jpg');

const img = (src: string, alt: string, caption?: string): MediaItem => ({ src, alt, caption });

const sharedGallery = (portrait: string, name: string) => [
  img(portrait, `${name} portrait`, 'Portrait session, TUYDEF studio'),
  img(workshop, 'Young creators workshop', 'Creative workshop day'),
  img(stage, 'Showcase stage', 'Annual showcase evening'),
  img(hero, 'Creators together', 'Network meet-up'),
  img(painting, 'Artwork on display', 'Exhibition wall'),
];

export const DEMO_CREATORS: Creator[] = [
  {
    id: 'c1',
    slug: 'adaeze-okafor',
    publicDisplayName: 'Adaeze Okafor',
    nameVisibility: 'full-name',
    isMinor: false,
    classYear: 2025,
    primaryCategory: 'writing',
    talents: ['Short fiction', 'Essays', 'Editing'],
    location: 'Enugu',
    tagline: 'Writing stories about the quiet courage of ordinary girls.',
    portrait: img(writer, 'Adaeze holding a notebook'),
    bio: [
      'Adaeze began filling exercise books with stories at nine. By secondary school her classmates were queuing to read the next chapter.',
      'Through the Network she has completed her first collection of short stories and now leads a monthly reading circle for younger writers.',
    ],
    giftsAndTalents:
      "A rare ear for dialogue and an instinct for emotional truth. Her mentors describe her prose as 'patient and piercing'.",
    discoveryStory:
      'Her English teacher submitted one of her stories to the TUYDEF Treasures Unveiled essay prize in 2024. She won, and joined the Class of 2025.',
    interview: [
      {
        question: 'What made you start writing?',
        answer:
          'I wanted to read stories about girls who looked like me and lived where I lived. So I wrote them.',
      },
      {
        question: 'What has the Network given you?',
        answer:
          'A mentor who reads every draft, and the confidence to call myself a writer out loud.',
      },
      {
        question: "What's next?",
        answer:
          'Finishing my collection and helping two younger writers in my reading circle finish theirs.',
      },
    ],
    videoPoster: img(writer, 'Interview still'),
    works: [
      {
        id: 'w1',
        title: 'The Market Girl',
        type: 'Writing',
        year: 2025,
        description: 'Short story shortlisted for a national youth prize.',
        image: img(writer, 'Manuscript'),
      },
      {
        id: 'w2',
        title: 'Letters to My Younger Self',
        type: 'Writing',
        year: 2024,
        description: 'Essay series published in the TUYDEF annual.',
      },
    ],
    achievements: [
      { year: 2024, title: 'Winner, Treasures Unveiled Essay Prize' },
      { year: 2025, title: 'Recognised, Young Creators Class of 2025' },
      { year: 2025, title: 'Reading-circle lead', detail: 'Mentors 6 younger writers monthly' },
    ],
    gallery: sharedGallery(writer, 'Adaeze'),
    featured: true,
    isDemo: true,
  },
  {
    id: 'c2',
    slug: 'tobi-adeyemi',
    publicDisplayName: 'Tobi Adeyemi',
    nameVisibility: 'full-name',
    isMinor: false,
    classYear: 2025,
    primaryCategory: 'music',
    talents: ['Guitar', 'Songwriting', 'Vocals'],
    location: 'Lagos',
    tagline: 'Afro-soul songwriter blending highlife guitar with gospel harmony.',
    portrait: img(musician, 'Tobi with guitar'),
    bio: [
      'Self-taught on a borrowed guitar, Tobi played in his church choir before writing his own songs.',
      'The Network connected him to a producer mentor and studio time for his first EP.',
    ],
    giftsAndTalents: 'Melodic songwriting, fingerstyle highlife guitar and warm, honest vocals.',
    discoveryStory: 'Spotted performing at a Spiritans Sound Outreach community concert in 2024.',
    interview: [
      {
        question: 'Who inspires you?',
        answer: "My grandfather's highlife records and the choir I grew up in.",
      },
      {
        question: 'What did mentoring change?',
        answer: 'I learned to finish songs, not just start them.',
      },
    ],
    videoPoster: img(stage, 'Performance still'),
    works: [
      {
        id: 'w3',
        title: 'Morning Light (EP)',
        type: 'Music',
        year: 2025,
        description: 'Four-track debut EP recorded with Network support.',
        image: img(stage, 'Live performance'),
      },
      {
        id: 'w4',
        title: 'Live at the Showcase',
        type: 'Performance',
        year: 2025,
        description: 'Headline slot at the YCN annual showcase.',
        image: img(stage, 'Stage'),
      },
    ],
    achievements: [
      { year: 2024, title: 'Discovered at community concert' },
      { year: 2025, title: 'Debut EP released' },
    ],
    gallery: sharedGallery(musician, 'Tobi'),
    featured: true,
    isDemo: true,
  },
  {
    id: 'c3',
    slug: 'chioma-e',
    publicDisplayName: 'Chioma E.',
    isMinor: true,
    classYear: 2026,
    primaryCategory: 'visual-art',
    talents: ['Acrylic painting', 'Portraiture', 'Murals'],
    location: 'Owerri',
    tagline: 'Bold colour portraits celebrating African womanhood.',
    portrait: img(artist, 'Chioma in her studio'),
    bio: [
      'Chioma paints large, colour-saturated portraits inspired by traditional textiles.',
      'She is currently preparing work for her first group exhibition.',
    ],
    giftsAndTalents: 'Fearless use of colour and a striking sense of composition.',
    discoveryStory: 'Nominated by her school art club for the 2025 TUYDEF talent search.',
    interview: [
      { question: 'What does your art say?', answer: 'That we are beautiful, and we are here.' },
    ],
    works: [
      {
        id: 'w5',
        title: 'Queen of Colour',
        type: 'Artwork',
        year: 2025,
        description: 'Acrylic on canvas, 90 × 120cm.',
        image: img(painting, 'Painting'),
      },
    ],
    achievements: [
      { year: 2025, title: 'Nominated, TUYDEF Talent Search' },
      { year: 2026, title: 'Young Creators Class of 2026' },
    ],
    gallery: sharedGallery(artist, 'Chioma'),
    featured: true,
    isDemo: true,
  },
  {
    id: 'c4',
    slug: 'emeka-n',
    publicDisplayName: 'Emeka N.',
    isMinor: false,
    classYear: 2025,
    primaryCategory: 'photography',
    talents: ['Street photography', 'Portraits', 'Photo editing'],
    location: 'Lagos',
    tagline: 'Documenting the golden-hour poetry of Lagos streets.',
    portrait: img(photographer, 'Emeka with camera'),
    bio: [
      'Emeka started with a phone camera and now shoots with equipment donated through the Network.',
    ],
    giftsAndTalents: 'An eye for light, and the patience to wait for the perfect frame.',
    discoveryStory:
      'His photo series went viral locally and a TUYDEF volunteer reached out through his school.',
    interview: [
      { question: 'Favourite time to shoot?', answer: 'Six in the evening. Lagos glows.' },
    ],
    works: [
      {
        id: 'w6',
        title: 'Golden Lagos',
        type: 'Photo series',
        year: 2025,
        description: '12-image series exhibited at the showcase.',
        image: img(photographer, 'Photo series'),
      },
    ],
    achievements: [
      { year: 2025, title: 'Camera equipment grant' },
      { year: 2025, title: 'Showcase exhibitor' },
    ],
    gallery: sharedGallery(photographer, 'Emeka'),
    isDemo: true,
  },
  {
    id: 'c5',
    slug: 'funke-b',
    publicDisplayName: 'Funke B.',
    isMinor: false,
    classYear: 2026,
    primaryCategory: 'dance',
    talents: ['Contemporary', 'Traditional Yoruba dance', 'Choreography'],
    tagline: 'Fusing contemporary movement with Yoruba tradition.',
    portrait: img(dancer, 'Funke dancing'),
    bio: ['Funke trains daily and choreographs pieces for her community dance group.'],
    giftsAndTalents: 'Expressive storytelling through movement and natural leadership.',
    discoveryStory: 'Performed at a TUYDEF cultural festival in 2025.',
    interview: [
      { question: 'What does dance give you?', answer: 'A language when words are not enough.' },
    ],
    works: [
      {
        id: 'w7',
        title: 'Roots & Wings',
        type: 'Performance',
        year: 2025,
        description: 'Original choreography for eight dancers.',
        image: img(stage, 'Performance'),
      },
    ],
    achievements: [
      { year: 2025, title: 'Festival performer' },
      { year: 2026, title: 'Young Creators Class of 2026' },
    ],
    gallery: sharedGallery(dancer, 'Funke'),
    isDemo: true,
  },
  {
    id: 'c6',
    slug: 'david-k',
    publicDisplayName: 'David K.',
    isMinor: false,
    classYear: 2026,
    primaryCategory: 'digital',
    talents: ['Video content', 'Storytelling', 'Editing'],
    location: 'Abuja',
    tagline: 'Short-form videos that make young people proud of home.',
    portrait: img(digital, 'David at his desk'),
    bio: ['David creates short documentaries and social content about Nigerian youth culture.'],
    giftsAndTalents: 'Sharp editing, a natural on-camera presence and big ideas.',
    discoveryStory: "Applied directly through the Network's open call in 2025.",
    interview: [
      {
        question: "Best advice you've had?",
        answer: 'Post the work. Perfect is the enemy of finished.',
      },
    ],
    works: [
      {
        id: 'w8',
        title: 'Made in Naija',
        type: 'Video',
        year: 2026,
        description: 'Mini-documentary series on young makers.',
      },
    ],
    achievements: [{ year: 2026, title: 'Young Creators Class of 2026' }],
    gallery: sharedGallery(digital, 'David'),
    isDemo: true,
  },
  {
    id: 'c7',
    slug: 'zainab-m',
    publicDisplayName: 'Zainab M.',
    isMinor: true,
    classYear: 2026,
    primaryCategory: 'technology',
    talents: ['Robotics', 'Coding', 'Problem solving'],
    location: 'Lagos',
    tagline: 'Building low-cost robots to solve everyday problems.',
    portrait: img(tech, 'Zainab with a robot'),
    bio: ['Zainab builds small robots from recycled parts and teaches coding to her classmates.'],
    giftsAndTalents: 'Inventive thinking and the determination to make things work.',
    discoveryStory: 'Her school science fair project was noticed by a TUYDEF mentor judge.',
    interview: [
      {
        question: 'What would you build with unlimited resources?',
        answer: 'Robots that help farmers water crops automatically.',
      },
    ],
    works: [
      {
        id: 'w9',
        title: 'AquaBot',
        type: 'Project',
        year: 2026,
        description: 'Prototype irrigation robot made from recycled parts.',
        image: img(tech, 'Robot'),
      },
    ],
    achievements: [
      { year: 2025, title: '1st place, school science fair' },
      { year: 2026, title: 'Young Creators Class of 2026' },
    ],
    gallery: sharedGallery(tech, 'Zainab'),
    featured: true,
    isDemo: true,
  },
  {
    id: 'c8',
    slug: 'ibrahim-s',
    publicDisplayName: 'Ibrahim S.',
    isMinor: true,
    classYear: 2025,
    primaryCategory: 'writing',
    talents: ['Spoken word', 'Poetry', 'Performance'],
    location: 'Kaduna',
    tagline: 'Spoken-word poet with a voice for unity.',
    portrait: img(poet, 'Ibrahim performing'),
    bio: ['Ibrahim performs poetry about faith, family and belonging.'],
    giftsAndTalents: 'Commanding stage presence and lyrical, rhythmic writing.',
    discoveryStory: 'Won a youth poetry slam supported by Spiritans Sound Outreach.',
    interview: [
      { question: 'Why poetry?', answer: 'Because a poem can make a whole room breathe together.' },
    ],
    works: [
      {
        id: 'w10',
        title: 'One Nation, Many Voices',
        type: 'Performance',
        year: 2025,
        description: 'Spoken-word piece performed at the showcase.',
      },
    ],
    achievements: [
      { year: 2024, title: 'Youth poetry slam winner' },
      { year: 2025, title: 'Young Creators Class of 2025' },
    ],
    gallery: sharedGallery(poet, 'Ibrahim'),
    isDemo: true,
  },
];

export const DEMO_LATEST: LatestPost[] = [
  {
    id: 'p1',
    creatorSlug: 'tobi-adeyemi',
    title: "Tobi releases debut EP 'Morning Light'",
    kind: 'New work',
    date: '2026-09-12',
    excerpt: 'Four tracks of Afro-soul recorded with Network studio support.',
    image: img(stage, 'Tobi performing'),
  },
  {
    id: 'p2',
    creatorSlug: 'chioma-e',
    title: 'Chioma prepares for first group exhibition',
    kind: 'Milestone',
    date: '2026-09-02',
    excerpt: 'Three new large-scale portraits are underway.',
    image: img(painting, "Chioma's painting"),
  },
  {
    id: 'p3',
    creatorSlug: 'zainab-m',
    title: "Zainab's AquaBot prototype takes shape",
    kind: 'Feature',
    date: '2026-08-20',
    excerpt: 'A low-cost irrigation robot built from recycled parts.',
    image: img(tech, "Zainab's robot"),
  },
];

export const workshopImage = workshop;
export const heroImage = hero;
