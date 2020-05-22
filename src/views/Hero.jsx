import React from 'react'
import PropTypes from 'prop-types'
import Image from 'gatsby-image'
import styled from 'styled-components'
import tw from 'tailwind.macro'
// Components
import { FluidContainer } from '../components/Container'


const Wrapper = styled.div`
  ${tw`relative w-full mt-0 overflow-hidden`}
  height: 60vh;
`

const HeroImage = styled(Image)`
  ${tw`w-full`}
  height: 60vh;
  > div {
    padding-bottom: 28% !important;
  }
`

const Hero = ({ background, factor, offset, speed }) => (
  <FluidContainer factor={factor} offset={offset} speed={speed}>
    <Wrapper>
      <HeroImage fluid={background.childImageSharp.fluid} alt='Painting' />
    </Wrapper>
  </FluidContainer>
)
Hero.propTypes = {
  background: PropTypes.any.isRequired,
  factor: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  speed: PropTypes.number.isRequired,
}
Hero.defaultProps = {
  factor: 0.8,
  offset: 0.5,
  speed: 0.4,
}

export default Hero