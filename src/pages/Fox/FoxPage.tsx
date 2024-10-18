import { useTranslate } from 'react-polyglot'
import { Main } from 'components/Layout/Main'
import { SEO } from 'components/Layout/Seo'

import { FoxFarming } from './components/FoxFarming'
import { FoxHeader } from './components/FoxHeader'
import { FoxToken } from './components/FoxToken'
import { RFOXSection } from './components/RFOXSection'
import { FoxPageProvider } from './hooks/useFoxPageContext'

const headerComponent = <FoxHeader />

export const FoxPage = () => {
  const translate = useTranslate()

  return (
    <FoxPageProvider>
      <SEO title={translate('navBar.foxBenefits')} />
      <Main headerComponent={headerComponent} isSubPage>
        <FoxToken />
        <RFOXSection />
        <FoxFarming />
      </Main>
    </FoxPageProvider>
  )
}
