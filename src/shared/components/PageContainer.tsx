import type { PropsWithChildren } from 'react'
import styled from '@emotion/styled'

const Container = styled.div`
  width: min(100% - 2rem, 72rem);
  min-height: 100vh;
  margin: 0 auto;
  padding: 3rem 0;
`

export function PageContainer({ children }: PropsWithChildren) {
  return <Container>{children}</Container>
}
