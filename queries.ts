import groq from 'groq';

// These queries are the contract between the studio's schema and the portfolio site.
// Editing them regenerates the portfolio's result types via `pnpm typegen`.

export const RESUME_QUERY: string = groq`*[_type == "resume" && slug.current == $slug][0] {
  ...,
  logo->{
    "svgUrl": svg.asset->url,
    "pngUrl": png.asset->url
  },
  "contactInfo": contactInfo->{
    ...,
    "socials": *[_type == "social"]
  },
  "experience": experience[]->{...},
  "education": education[]->{...},
  "skills": skills[]->{...},
  educationEnabled
}`;

export const COVER_LETTER_QUERY: string = groq`*[_type == "coverLetter" && _id == $id][0] {
  ...,
  logo->{
    "svgUrl": svg.asset->url,
    "pngUrl": png.asset->url
  },
  "contactInfo": contactInfo->{
    ...,
    "socials": *[_type == "social"]
  }
}`;

export const PORTFOLIO_GALLERY_QUERY: string = groq`*[_type == "portfolioGallery" && slug.current == $slug][0]{
  "slug": slug.current,
  title,
  intro,
  showTagsFilter,
  "pieces": pieces[]->{
    title,
    description,
    "featuredImageUrl": featuredImage.asset->url,
    slug,
    tags[]->{
      title,
      slug
    },
    sections[]{
      heading,
      description,
      "imageUrl": image.asset->url
    },
    launchUrl,
    repoUrl
  }
}`;
