/**
 * BEHIND THE VEIL — single source of editable content & configuration.
 *
 * All editable copy, dates, images, format options, and launch information.
 */

export const assetBaseUrl = "";

export type LaunchMode = "auto" | "pre-launch" | "post-launch";

export interface BookFormat {
  id: "ebook" | "paperback" | "audiobook";
  name: string;
  /** Only formats with available: true are rendered. */
  available: boolean;
  price: string;
  priceNote?: string;
  description: string;
  details: string[];
  /** Checkout URL or action handler. */
  checkoutUrl: string;
  featured?: boolean;
}

export const btvConfig = {
  /* ----------------------------------------------------------------- brand */
  brand: {
    siteName: "Spiritans Sound",
    shortTitle: "Behind the Veil",
    bookSlug: "behind-the-veil",
    footerNote: "Congregation of the Holy Spirit (Spiritans) · Spiritans Sound",
  },

  /* ------------------------------------------------------ button label text */
  cta: {
    register: "Register for the Online Launch",
    registerShort: "Register",
    registerFinal: "Register for the Launch",
    buy: "Get Your Copy",
    buyNow: "Buy Now",
    buyFullBook: "Get the Full Book",
    watchReplay: "Watch the Launch Replay",
    otherPublications: "Other publications by the author",
    badgePreLaunch: "Online Book Launch",
    badgePostLaunch: "Now Available",
  },

  /* ------------------------------------------- section headings & intro text */
  sections: {
    book: {
      eyebrow: "The Book",
      title: "What is Behind the Veil?",
      publicationHeading: "Publication Information",
      themesHeading: "Key Themes",
      excerptCaption: "Selected excerpt",
      availableInLabel: "Available in",
    },
    discover: {
      eyebrow: "Inside the Book",
      title: "What readers will discover",
      intro:
        "Six movements — from noticing what is wrong, to knowing exactly what to do about it.",
    },
    why: { eyebrow: "The Author's Story" },
    author: { eyebrow: "Meet the Author" },
    launch: {
      eyebrow: "Online Event",
      titleLine1: "Join the",
      titleLine2: "Online Launch",
      countdownLabel: "Countdown to launch",
      heroCountdownLabel: "Launching in",
      registerHeading: "Register to attend",
      registerIntro:
        "Free to attend. Reserve your place and we'll send the joining link.",
      postLaunchHeading: "Now available",
      postLaunchIntro: "The launch has taken place. Get your copy below",
      postLaunchNote: "The book is now available.",
      postLaunchThanks: "Thank you to everyone who joined the launch.",
    },
    purchase: {
      eyebrow: "Purchase",
      title: "Get Your Copy",
      intro:
        "Choose the edition that suits you. Every purchase is handled by Spiritans Sound.",
      featuredBadge: "Most popular",
    },
    bookshops: { eyebrow: "In-Person in Nigeria" },
    testimonials: { eyebrow: "Testimonials", title: "What readers are saying" },
    excerpt: { eyebrow: "Preview", title: "Read a preview" },
    videos: { eyebrow: "Watch & Listen" },
    audio: { eyebrow: "Audiobook" },
    gallery: {
      eyebrow: "Gallery",
      title: "Promotional Images",
      intro:
        "Launch posters, flyers and photographs. Paste an image URL into each slot; empty slots stay hidden.",
    },
    faq: { eyebrow: "Questions", title: "Frequently asked questions" },
  },

  /* ---------------------------------------------------- promotional images */
  gallery: [
    { src: "", alt: "Launch poster", caption: "Launch poster" },
    { src: "", alt: "Promotional flyer", caption: "Promotional flyer" },
    { src: "", alt: "Quote card", caption: "Quote card" },
    { src: "", alt: "Author photograph", caption: "Author photograph" },
  ],

  /* ---------------------------------------------------------- social links */
  social: {
    heading: "Follow Spiritans Sound",
    links: [
      { label: "WhatsApp", url: "" },
      { label: "Facebook", url: "" },
      { label: "Instagram", url: "" },
      { label: "YouTube", url: "" },
      { label: "TikTok", url: "" },
      { label: "Website", url: "https://www.spiritanssound.com" },
    ],
  },

  /* ---------------------------------------------------------------- launch */
  launch: {
    dateISO: "2026-11-21T17:00:00+01:00",
    dateLabel: "21 November 2026",
    timeLabel: "TIME TO BE CONFIRMED",
    platformLabel: "ONLINE PLATFORM TO BE CONFIRMED",
    mode: "auto" as LaunchMode,
    replayUrl: "",
    registrationUrl: "",
  },

  /* ------------------------------------------------------------------ book */
  book: {
    title: "Behind the Veil",
    subtitle: "How to Detect Deception and Deal with Liars",
    author: "Fr. Oluwafemi Victor Orilua, CSSp",
    heroTitleTop: "Behind",
    heroTitleAccent: "the Veil",
    heroHeadline: "Can you recognise deception before it costs you?",
    heroIntro:
      "A pastoral and psychological guide to seeing clearly — for anyone who has ever sensed that something was wrong long before they could name it.",
    coverImage: "/images/behind-the-veil/behind-the-veil-front-cover.jpg",
    coverAlt: "Behind the Veil: How to Detect Deception and Deal with Liars by Oluwafemi Victor Orilua CSSp",
    coverIsPlaceholder: false,
    description: [
      "Behind the Veil is a careful, unhurried look at one of the oldest wounds in human relationship: being lied to by someone you trusted.",
      "Drawing on years of pastoral counselling and the psychology of deception, Fr. Oluwafemi Victor Orilua, CSSp examines how lies are built, why they hold, and how they quietly reshape the person who believes them. The book moves beyond suspicion into discernment — teaching the reader to read patterns rather than moments, to ask questions that surface truth, and to respond to dishonesty with both clarity and charity.",
      "It is written for the confused rather than the cynical: a guide to recovering your own judgement, protecting your peace, and deciding — wisely, and without bitterness — what to do next.",
    ],
    themes: [
      "The anatomy of a lie",
      "Discernment as a spiritual discipline",
      "Patterns, not moments",
      "Manipulation and the erosion of self-trust",
      "Confrontation with charity",
      "Trust: repairing, rebuilding, releasing",
    ],
    excerptTitle: "From Chapter One — The Veil",
    excerpt:
      "A lie rarely arrives as a lie. It arrives as an explanation — reasonable, well-timed, and delivered by someone whose face you know better than your own. That is what makes deception so difficult to detect: it does not contradict the truth so much as stand comfortably in its place.\n\nAnd so we do not begin by asking, \"Is this person lying?\" We begin by asking a gentler and far more useful question: \"What keeps repeating?\" Deception can survive a single conversation. It cannot survive a pattern honestly examined.",
    publication: {
      publisher: "Spiritans Sound",
      imprint: "Treasures Unveiler",
      language: "English",
      pages: "TBC",
      isbn: "TBC",
      publicationDate: "21 November 2026",
      category: "Christian Living · Relationships · Psychology",
    },
  },

  /* --------------------------------------------------------------- formats */
  formats: [
    {
      id: "ebook",
      name: "eBook",
      available: true,
      price: "Price TBC",
      priceNote: "Instant download · PDF & ePub",
      description: "Read it tonight. Delivered to your inbox the moment the book launches.",
      details: ["Instant delivery", "PDF & ePub", "Read on any device"],
      checkoutUrl: "#purchase",
      featured: true,
    },
    {
      id: "paperback",
      name: "Paperback",
      available: true,
      price: "Price TBC",
      priceNote: "UK postage included · posted within the UK on purchase",
      description:
        "A book to underline, revisit and pass on to someone who needs it. Posted to UK addresses on purchase.",
      details: ["Print edition", "Posted within the UK", "Signed copies on request"],
      checkoutUrl: "#purchase",
    },
    {
      id: "audiobook",
      name: "Audiobook",
      available: false,
      price: "Coming soon",
      priceNote: "Audio file to be uploaded",
      description:
        "A narrated edition of Behind the Veil. The audio file will be uploaded and available here when ready.",
      details: ["Narrated edition", "Listen on any device", "Uploaded when ready"],
      checkoutUrl: "#purchase",
    },
  ] as BookFormat[],

  /* ------------------------------------------------- audiobook audio slots */
  audio: {
    heading: "Listen to a Preview",
    intro:
      "Sample clips from the audiobook edition. Audio files will be uploaded here when the narration is ready.",
    items: [
      {
        title: "Introduction",
        description: "Opening of the audiobook.",
        src: "",
      },
      {
        title: "Chapter One — The Veil",
        description: "The first chapter, narrated.",
        src: "",
      },
      {
        title: "How to spot a pattern of deception",
        description: "A short narrated extract.",
        src: "",
      },
    ],
  },

  /* -------------------------- Nigerian physical bookshop address slots */
  nigeriaBookshops: {
    heading: "Buy in Person in Nigeria",
    intro:
      "Prefer to buy from a physical shop? Behind the Veil is stocked at the following Nigerian bookshops. Visit any of these to pick up your copy directly.",
    items: [
      {
        name: "Paulines Media Centre",
        address: "St. Agnes Catholic Church Compound, Maryland",
        city: "Lagos",
        phone: "+234 803 000 0000",
      },
      {
        name: "Catholic Book Centre",
        address: "Holy Cross Cathedral Premises, Catholic Mission Street",
        city: "Lagos Island, Lagos",
        phone: "+234 802 000 0000",
      },
      {
        name: "Spiritans Outreach Bookshop",
        address: "Spiritan House, Nsukka Road",
        city: "Enugu",
        phone: "+234 805 000 0000",
      },
      {
        name: "Dominican Media Centre",
        address: "Dominican Institute, Samonda",
        city: "Ibadan, Oyo State",
        phone: "+234 806 000 0000",
      },
      {
        name: "St. Paul Book Centre",
        address: "Wuse Zone 2",
        city: "Abuja",
        phone: "+234 807 000 0000",
      },
    ],
  },

  /* -------------------------------------------------------------- discover */
  discover: [
    {
      icon: "eye",
      title: "Recognising Deception",
      body: "The quiet signals that appear long before the evidence does — and how to read them without becoming suspicious of everyone.",
    },
    {
      icon: "search",
      title: "Understanding Lies",
      body: "Why people lie, how different kinds of liars behave, and what each type reveals under honest, unhurried questioning.",
    },
    {
      icon: "heart",
      title: "Reading Relationships Wisely",
      body: "How to weigh patterns rather than moments, so trust is given deliberately instead of anxiously.",
    },
    {
      icon: "shield-alert",
      title: "Dealing With Dishonesty",
      body: "Practical, dignified ways to confront a lie — language that opens the truth instead of starting a war.",
    },
    {
      icon: "handshake",
      title: "Rebuilding Trust",
      body: "What genuine repair actually requires, how to tell repentance from performance, and when rebuilding is wise.",
    },
    {
      icon: "shield-check",
      title: "Protecting Your Peace",
      body: "Boundaries, inner practices and spiritual grounding that keep your heart soft while your judgement stays sharp.",
    },
  ],

  /* ---------------------------------------------------------------- author */
  author: {
    name: "Fr. Oluwafemi Victor Orilua, CSSp",
    role: "Spiritan Priest · Pastoral Counsellor · Composer · Singer · Author",
    photo: "/images/behind-the-veil/author-portrait.jpg",
    photoAlt: "Fr. Oluwafemi Victor Orilua, CSSp",
    photoIsPlaceholder: false,
    whyTitle: "Why I Wrote This Book",
    whyBody: [
      "I have sat with people at the moment the veil finally lifts — in parish ministry, in marriage preparation, in spiritual direction and counselling. Almost none of them were naive. Almost all of them said the same sentence: \"I knew something was wrong. I just could not prove it, so I talked myself out of it.\"",
      "I know that sentence from the inside. I have suffered the brunt of deception myself. I have known the confusion of being told one thing while watching another, the slow erosion of self-trust that comes when you start to doubt what you saw with your own eyes. That is why this book is not written from a distance, as a theory — it is written from within the wound.",
      "What I lacked in those moments was not intelligence or faith — it was language. A way to name what I was seeing, to test it honestly, and to act on it without cruelty or self-betrayal. That is the language I want to give back through Behind the Veil. Not to make anyone suspicious, but to make them wise: able to trust deliberately, to confront charitably, and to protect the peace God intends for them.",
    ],
    bio: [
      "Fr. Oluwafemi Victor Orilua is a Catholic priest of the Congregation of the Holy Spirit (the Spiritans), a pastoral counsellor, a composer and singer, and a writer. His ministry has consistently brought him into the quiet, complicated interior of people's relationships.",
      "He is the founder of Spiritans Sound Outreach, a youth ministry dedicated to talent discovery and development in the young — nurturing the gifts of a new generation through faith, creativity and formation. Across parish ministry, marriage preparation, spiritual direction and counselling, he has accompanied individuals and couples through betrayal, manipulation, reconciliation and recovery, and has seen how rarely the problem is a lack of love, and how often it is a lack of clarity.",
      "He writes at the meeting point of faith and psychology: pastoral in tone, practical in method, and unwilling to trade honesty for comfort.",
    ],
    otherPublicationsUrl: "/unveiler/books",
    contactEmail: "",
  },

  /* ---------------------------------------------------- testimonials */
  testimonials: {
    isPlaceholder: false,
    items: [
      {
        quote:
          "Behind the Veil brings a rare balance of pastoral gentleness and clinical sharpness. It gave me the clarity I desperately needed during a deeply confusing period in my life.",
        name: "Dr. Sarah Adebayo",
        detail: "Family Medicine & Counselling, Lagos",
      },
      {
        quote:
          "Fr. Oluwafemi has written something deeply healing. It doesn't teach you to distrust people; it teaches you how to trust your own senses and walk in peace.",
        name: "Michael E. Okon",
        detail: "Youth Mentor & Educator, London",
      },
      {
        quote:
          "A masterpiece on human relationships. Every couple, leader, and counsellor should have this within arm's reach.",
        name: "Sister Claire Nwachukwu",
        detail: "Spiritual Director, Abuja",
      },
    ],
  },

  /* ------------------------------------------------------------------- faq */
  faq: [
    {
      q: "What is Behind the Veil about?",
      a: "It is a pastoral and psychological guide to recognising deception in relationships — how lies are built, how patterns reveal them, and how to respond to dishonesty with clarity, charity and self-respect.",
    },
    {
      q: "Who is the book for?",
      a: "Anyone navigating a relationship where something does not add up: spouses, engaged couples, families, friends, and those who counsel them. It is written for the confused rather than the cynical.",
    },
    {
      q: "When is the online launch?",
      a: "Saturday 21 November 2026. The exact time and platform will be confirmed to everyone who registers.",
    },
    {
      q: "How can I attend?",
      a: "Register using the form on this page. You will receive a joining link and a reminder before the event.",
    },
    {
      q: "Where can I buy the book?",
      a: "Directly from Spiritans Sound using the Get Your Copy section on this page or from participating physical bookshops in Nigeria.",
    },
    {
      q: "What formats are available?",
      a: "eBook and paperback at launch. An audiobook edition is planned and will be announced here when ready.",
    },
    {
      q: "Can I buy it after the launch?",
      a: "Yes. The book remains available on this page and in the Spiritans Sound book store after the launch event.",
    },
    {
      q: "How can I contact the author?",
      a: "Use the contact page on Spiritans Sound and mark your message for the attention of Fr. Oluwafemi Victor Orilua, CSSp.",
    },
  ],

  /* ----------------------------------------------------------------- videos */
  videos: {
    heading: "Watch & Listen",
    intro:
      "Short films, conversations and readings around Behind the Veil.",
    items: [
      {
        title: "Book trailer",
        description: "A one-minute introduction to Behind the Veil.",
        src: "",
      },
      {
        title: "Why I wrote this book",
        description: "Fr. Oluwafemi on the story behind the book.",
        src: "",
      },
      {
        title: "How to spot a pattern of deception",
        description: "A short teaching drawn from the book.",
        src: "",
      },
      {
        title: "Launch event replay",
        description: "The full online launch, once it has aired.",
        src: "",
      },
    ],
  },

  /* -------------------------------------------------------------- final cta */
  finalCta: {
    heading: "Don't let deception remain behind the veil.",
    body: "Discover a wiser way to recognise deception, navigate difficult relationships and respond to dishonesty.",
  },

  /* ------------------------------------------------------------------- seo */
  seo: {
    title:
      "Behind the Veil: How to Detect Deception and Deal with Liars | Spiritans Sound",
    description:
      "Discover Behind the Veil by Fr. Oluwafemi Victor Orilua, CSSp — a thought-provoking book exploring deception, dishonesty, relationships, trust and discernment.",
    canonical: "https://www.spiritanssound.com/unveiler/books/behind-the-veil",
    ogImage: "/images/behind-the-veil/behind-the-veil-front-cover.jpg",
    siteName: "Spiritans Sound",
  },
} as const;

export type BtvConfig = typeof btvConfig;
