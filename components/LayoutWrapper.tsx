import { useState, useEffect, useRef } from 'react'

import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import SectionContainer from './SectionContainer'
import Footer from './Footer'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const LayoutWrapper = ({ children }: Props) => {
  const [stuck, setStuck] = useState(false)
  const ref = useRef()

  const stuckClasses =
    'flex items-center justify-between py-2 sticky top-n-1 z-50 transition-all backdrop isSticky px-4 mx-auto sm:px-6 md:px-[10%] border-b border-slate-900/10 dark:border-slate-300/10 mb-16 w-full'
  const unstuckClasses =
    'flex items-center justify-between py-8 sticky top-n-1 z-50 transition-all backdrop px-4 mx-auto sm:px-6 md:px-[10%] border-b border-b-0 border-slate-900/10 dark:border-slate-300/10 mb-16 w-full'

  const classes = stuck ? stuckClasses : unstuckClasses

  useEffect(() => {
    const cachedRef = ref.current
    const observer = new IntersectionObserver(
      ([e]) => {
        setStuck(e.intersectionRatio < 1)
      },
      { threshold: [1.0] }
    )
    observer.observe(cachedRef)
    return () => observer.unobserve(cachedRef)
  }, [ref])

  return (
    <>
      <div className="flex flex-col justify-between">
        <header className={classes} ref={ref}>
          <div>
            <Link href="/" aria-label="Tailwind CSS Blog">
              <div className="flex items-center justify-between">
                <div className="mr-3">
                  <Logo />
                </div>
                {typeof siteMetadata.headerTitle === 'string' ? (
                  <div className="hidden h-6 text-2xl font-semibold sm:block title">
                    {siteMetadata.headerTitle}
                  </div>
                ) : (
                  siteMetadata.headerTitle
                )}
              </div>
            </Link>
          </div>
          <div className="flex items-center text-base leading-5">
            <div className="hidden sm:block">
              {headerNavLinks.map((link) => (
                <Link
                  key={link.title}
                  href={link.href}
                  className="p-1 font-medium text-gray-900 sm:p-4 dark:text-gray-100 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {link.title}
                </Link>
              ))}
            </div>
            <ThemeSwitch />
            <MobileNav />
          </div>
        </header>
        <SectionContainer>
          <main className="mb-auto">{children}</main>
          <Footer />
        </SectionContainer>
      </div>
    </>
  )
}

export default LayoutWrapper
