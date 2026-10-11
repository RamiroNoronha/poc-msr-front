import type { PropsWithChildren } from 'react'
import styled from '@emotion/styled'

const Page = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(60rem 32rem at 15% -10%, rgba(124, 92, 255, 0.28), transparent 60%),
    radial-gradient(50rem 30rem at 95% 5%, rgba(34, 211, 238, 0.16), transparent 60%),
    var(--bg);

  &::before {
    position: absolute;
    inset: 0;
    content: '';
    background-image: radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px);
    background-size: 28px 28px;
    mask-image: linear-gradient(to bottom, #000 0%, transparent 70%);
    pointer-events: none;
  }
`

const Container = styled.div`
  position: relative;
  width: min(100% - 2rem, 72rem);
  margin: 0 auto;
  padding: 2rem 0 4rem;
`

export function PageContainer({ children }: PropsWithChildren) {
  return (
    <Page>
      <Container>{children}</Container>
    </Page>
  )
}
