import type { PropsWithChildren } from 'react'
import { Container, Page } from '../styles/PageContainer.styled'

export function PageContainer({ children }: PropsWithChildren) {
  return (
    <Page>
      <Container>{children}</Container>
    </Page>
  )
}
