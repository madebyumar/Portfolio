import type { Metadata } from 'next'
import {
  getLiveProjects,
  getLiveBlogs,
  getLiveProfile,
  getLiveSkills,
  getLiveExperiences,
  getLiveTestimonials,
  getLiveServices,
} from '@/lib/data/portfolio'
import { Navbar } from '@/components/portfolio/shared/Navbar'
import { Hero } from '@/components/portfolio/sections/Hero'
import { Ticker } from '@/components/portfolio/sections/Ticker'
import { StatsStrip } from '@/components/portfolio/sections/StatsStrip'
import { AboutStrip } from '@/components/portfolio/sections/AboutStrip'
import { ServicesSection } from '@/components/portfolio/sections/ServicesSection'
import { SelectedWork } from '@/components/portfolio/sections/SelectedWork'
import { CapabilitiesSection } from '@/components/portfolio/sections/CapabilitiesSection'
import { ExperienceSection } from '@/components/portfolio/sections/ExperienceSection'
import { TestimonialsSection } from '@/components/portfolio/sections/TestimonialsSection'
import { WritingSection } from '@/components/portfolio/sections/WritingSection'
import { ContactSection } from '@/components/portfolio/sections/ContactSection'
import { SeoHireStrip } from '@/components/portfolio/sections/SeoHireStrip'
import { Footer } from '@/components/portfolio/shared/Footer'
import { SplashScreen } from '@/components/portfolio/effects/SplashScreen'
import { SEO_DESCRIPTION, SEO_KEYWORDS, SEO_TITLE } from '@/lib/seo/keywords'

export const revalidate = 60

export const metadata: Metadata = {
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  alternates: { canonical: '/' },
}

export default async function HomePage() {
  const [
    liveProjects,
    liveBlogs,
    liveProfile,
    liveSkills,
    liveExperiences,
    liveTestimonials,
    liveServices,
  ] = await Promise.all([
    getLiveProjects(),
    getLiveBlogs(),
    getLiveProfile(),
    getLiveSkills(),
    getLiveExperiences(),
    getLiveTestimonials(),
    getLiveServices(),
  ])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--ink)' }}>
      <SplashScreen />
      <Navbar name={liveProfile?.name} timezone={liveProfile?.timezone} ianaTimezone={liveProfile?.ianaTimezone} />
      <main id="main-content">
        <Hero
          name={liveProfile?.name}
          role={liveProfile?.role}
          status={liveProfile?.status}
          bio={liveProfile?.bio}
          email={liveProfile?.email}
          github={liveProfile?.github}
          linkedin={liveProfile?.linkedin}
        />
        <Ticker />
        <StatsStrip stats={liveProfile?.stats} />
        <AboutStrip
          headline={liveProfile?.headline}
          bio={liveProfile?.bio}
          timezone={liveProfile?.timezone}
          location={liveProfile?.location}
          status={liveProfile?.status}
        />
        <ServicesSection services={liveServices || undefined} />
        <SelectedWork projects={liveProjects || []} />
        <CapabilitiesSection skills={liveSkills || undefined} />
        <ExperienceSection experiences={liveExperiences || undefined} />
        <TestimonialsSection testimonials={liveTestimonials || undefined} />
        <WritingSection blogs={liveBlogs || []} />
        <SeoHireStrip />
        <ContactSection email={liveProfile?.email} whatsapp={liveProfile?.whatsapp} />
      </main>
      <Footer
        name={liveProfile?.name}
        bio={liveProfile?.bio}
        status={liveProfile?.status}
        email={liveProfile?.email}
        github={liveProfile?.github}
        linkedin={liveProfile?.linkedin}
        whatsapp={liveProfile?.whatsapp}
        location={liveProfile?.location}
        timezone={liveProfile?.timezone}
        ianaTimezone={liveProfile?.ianaTimezone}
      />
    </div>
  )
}
