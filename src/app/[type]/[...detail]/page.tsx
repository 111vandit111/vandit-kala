import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Carousel from '../../../../lib/Carosel'
import DetailsHero, { type DetailsHeroProps } from '../../../../lib/DetailsHeroSection/DetailsHero'
import { safeHttpUrl } from '../../../../lib/safeUrl'
import { isProfileType } from '../../../../constants'
import { NotFoundError } from '../../../../lib/server/errors'
import { getPublicBySlug, getTextMap, type ContentDoc } from '../../../../lib/server/contentService'
import { getCards, getRelatedProjects, type CardProps } from '../../../../lib/server/cardMapper'
import { RESOURCES, type Resource } from '../../../../lib/server/limits'

export const dynamic = 'force-dynamic'

const DETAIL_SEGMENT_COUNT = 2
const DETAIL_RESOURCES = RESOURCES.filter((resource) => resource !== 'texts')
const RELATED_CAROUSEL_ID = 1
const SAME_RESOURCE_CAROUSEL_ID = 2

const isDetailResource = (value: string): value is Resource => DETAIL_RESOURCES.some((resource) => resource === value)

const text = (value: unknown): string => (typeof value === 'string' ? value : '')

const textList = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : []

const textSection = (heading: string, value: unknown) => {
  const body = text(value)
  return body ? [{ heading, body }] : []
}

const AVAILABLE_LABEL = 'Available to hire'
const countLabel = (count: number, noun: string, plural = `${noun}s`) => `${count} ${count === 1 ? noun : plural}`

const compact = (items: string[]) => items.filter(Boolean)

function projectHeroProps(doc: ContentDoc, rank: number): DetailsHeroProps {
  const tags = textList(doc.tags)
  const liveUrl = safeHttpUrl(text(doc.liveUrl))
  const repoUrl = safeHttpUrl(text(doc.repoUrl))
  return {
    kicker: doc.isFeatured === true && rank > 0 ? `#${rank} Featured project` : 'Project',
    title: text(doc.name),
    meta: compact([text(doc.year), tags.length > 0 ? countLabel(tags.length, 'technology', 'technologies') : '']),
    availabilityLabel: AVAILABLE_LABEL,
    description: text(doc.description),
    descriptors: compact([liveUrl ? 'Live demo' : '', repoUrl ? 'Source on GitHub' : '']),
    image: text(doc.image),
    badges: tags,
    liveUrl,
    sourceUrl: repoUrl,
    sections: [
      ...textSection('Problem', doc.problem),
      ...textSection('My role', doc.role),
      ...textSection('Approach', doc.approach),
      ...textSection('Impact', doc.impact),
    ],
  }
}

function skillHeroProps(doc: ContentDoc): DetailsHeroProps {
  const years = typeof doc.years === 'number' ? doc.years : 0
  const related = textList(doc.relatedProjects).length
  return {
    kicker: `Skill · ${text(doc.category) || 'Expertise'}`,
    title: text(doc.name),
    meta: [years > 0 ? countLabel(years, 'year') : 'Skill'],
    availabilityLabel: AVAILABLE_LABEL,
    description: text(doc.description),
    descriptors: compact([text(doc.category), related > 0 ? `Used in ${countLabel(related, 'project')}` : '']),
    image: text(doc.image),
    sections: textSection('In detail', doc.detail),
  }
}

function experienceHeroProps(doc: ContentDoc): DetailsHeroProps {
  const bullets = textList(doc.bullets)
  return {
    kicker: 'Experience',
    title: text(doc.role),
    meta: compact([text(doc.company), text(doc.period)]),
    availabilityLabel: AVAILABLE_LABEL,
    description: text(doc.summary),
    descriptors: compact([text(doc.location), bullets.length > 0 ? countLabel(bullets.length, 'highlight') : '']),
    badges: textList(doc.tags),
    image: text(doc.image),
    bullets,
    sections: textSection('Impact', doc.impact),
  }
}

function educationHeroProps(doc: ContentDoc): DetailsHeroProps {
  return {
    kicker: 'Education',
    title: text(doc.institution),
    meta: compact([text(doc.period)]),
    availabilityLabel: AVAILABLE_LABEL,
    description: text(doc.degree),
    image: text(doc.image),
    descriptors: ['Education'],
    sections: textSection('About', doc.description),
  }
}

function buildHeroProps(resource: Resource, doc: ContentDoc, rank: number): DetailsHeroProps {
  switch (resource) {
    case 'projects':
      return projectHeroProps(doc, rank)
    case 'skills':
      return skillHeroProps(doc)
    case 'experience':
      return experienceHeroProps(doc)
    default:
      return educationHeroProps(doc)
  }
}

async function loadSocials(): Promise<{ resumeUrl?: string; githubUrl?: string }> {
  try {
    const texts = await getTextMap()
    return {
      resumeUrl: safeHttpUrl(texts['resume.url']),
      githubUrl: safeHttpUrl(texts['social.github']),
    }
  } catch {
    return {}
  }
}

const ErrorState = () => (
  <div role="alert" className="bg-prime-night px-10 py-32 text-center sm:px-5">
    <h1 className="text-3xl font-bold">We could not load this page</h1>
    <p className="mt-4 text-secondary-400">Please refresh in a moment.</p>
  </div>
)

interface RelatedContent {
  projects: CardProps[]
  more: CardProps[]
  current?: CardProps
  rank: number
}

const EMPTY_RELATED: RelatedContent = { projects: [], more: [], rank: 0 }

const relatedCards = async (resource: Resource, slug: string, doc: ContentDoc): Promise<RelatedContent> => {
  const [projects, sameResource] = await Promise.all([
    resource === 'skills' ? getRelatedProjects(textList(doc.relatedProjects)) : Promise.resolve([]),
    getCards(resource),
  ])
  const currentPath = `/${resource}/${slug}`
  const currentIndex = sameResource.findIndex((card) => card.path === currentPath)
  return {
    projects,
    more: sameResource.filter((card) => card.path !== currentPath),
    current: sameResource[currentIndex],
    rank: currentIndex + 1,
  }
}

const CANONICAL_PROFILE = 'recruiter'

export async function generateMetadata({ params }: { params: Promise<{ type: string; detail: string[] }> }): Promise<Metadata> {
  const { type, detail } = await params
  if (!isProfileType(type) || detail.length !== DETAIL_SEGMENT_COUNT) return {}
  const [resource, slug] = detail
  if (!isDetailResource(resource)) return {}
  const robots = type === CANONICAL_PROFILE ? undefined : { index: false, follow: true }
  try {
    const doc = await getPublicBySlug(resource, slug)
    const title = text(doc.name) || text(doc.role) || text(doc.institution)
    const description = text(doc.description) || text(doc.summary) || text(doc.degree)
    return {
      title,
      description: description || undefined,
      alternates: { canonical: `/${CANONICAL_PROFILE}/${resource}/${slug}` },
      robots,
    }
  } catch {
    return { robots }
  }
}

const page = async ({ params }: { params: Promise<{ type: string; detail: string[] }> }) => {
  const { type, detail } = await params
  if (!isProfileType(type) || detail.length !== DETAIL_SEGMENT_COUNT) notFound()
  const [resource, slug] = detail
  if (!isDetailResource(resource)) notFound()

  let doc: ContentDoc
  try {
    doc = await getPublicBySlug(resource, slug)
  } catch (error) {
    if (error instanceof NotFoundError) notFound()
    console.error('Detail page failed to load:', error instanceof Error ? error.message : error)
    return <ErrorState />
  }

  const [socials, related] = await Promise.all([
    loadSocials(),
    relatedCards(resource, slug, doc).catch(() => EMPTY_RELATED),
  ])

  const hero = buildHeroProps(resource, doc, related.rank)

  return (
    <div className='bg-prime-night pb-24'>
      <DetailsHero
        {...hero}
        resumeUrl={socials.resumeUrl}
        sourceUrl={hero.sourceUrl || socials.githubUrl}
        sourceLabel={hero.sourceUrl ? 'Source code' : 'GitHub'}
        saveCard={related.current}
      />
      <div className='px-[calc(6%-1.5rem)] sm:px-0'>
        {related.projects.length > 0 && (
          <Carousel name='Related Projects' carouselData={related.projects} id={RELATED_CAROUSEL_ID} listof='projects' />
        )}
        {related.more.length > 0 && (
          <Carousel name='More Related' carouselData={related.more} id={SAME_RESOURCE_CAROUSEL_ID} listof={resource} />
        )}
      </div>
      <div className='px-[6%] py-10 sm:px-5'>
        <Link
          href={`/${type}#contact`}
          className='inline-flex min-h-14 items-center justify-center rounded-xl bg-white px-8 py-3 text-xl font-bold text-black hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-prime outline-none sm:w-full'
        >
          Contact Vandit
        </Link>
      </div>
    </div>
  )
}

export default page
