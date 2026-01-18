import PlausibleProvider from 'next-plausible'
import HomeLink from './HomeLink'
import Link from './Link'
import { serif } from './fonts'
import './global.css'

export const metadata = {
  metadataBase: new URL('https://sulhadin.com'),
}

const Activity: any = Symbol.for('react.activity')

export default function RootLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <html lang="en" className={serif.className}>
      <body className="mx-auto max-w-2xl bg-[--bg] px-5 py-12 text-[--text]">
        <PlausibleProvider domain="sulhadin.com">
          <header className="mb-14 flex flex-row place-content-between">
            <HomeLink />
            <span className="relative top-[4px] italic">
              by{' '}
              <Link href="https://github.com/sulhadin" target="_blank">
                <img
                  alt="Sulhadin Öney"
                  src="/avi.jpg"
                  className="relative -top-1 mx-1 inline h-8 w-8 rounded-full"
                />
              </Link>
            </span>
          </header>
          <main>
            <Activity mode="visible">{children}</Activity>
          </main>
        </PlausibleProvider>
      </body>
    </html>
  )
}
