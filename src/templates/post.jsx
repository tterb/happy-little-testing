import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Image from 'gatsby-image'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { Disqus, CommentCount } from '../../plugins/gatsby-plugin-disqus'
import { animated, useSpring, config } from 'react-spring'
import styled from 'styled-components'
import tw from 'tailwind.macro'
import { darken, rgba } from 'polished'
// Components
import Layout from '../components/Layout'
import Wrapper from '../components/Wrapper'
import SEO from '../components/SEO'
import PostHero from '../components/PostHero'
import PostImage from '../components/PostImage'
// Config
import site from '../../config/website'

const HeaderContent = styled(Wrapper)`
  ${tw`absolute w-4/5 pin-l pin-r pin-b mx-auto pt-8 pb-4 z-5`}
  color: rgba(0,0,0,0.8);
`

const ContentBody = styled(Wrapper)`
  ${tw`w-4/5 mx-auto mb-12`}
  color: rgba(0,0,0,0.75);
`

const Title = styled(animated.h1)`
  ${tw`text-5xl md:text-6xl font-black leading-tighter w-9/10 my-0`}
  @media screen and (max-width: 560px) {
    font-size: 4.5rem;
  }
`

const PostDetail = styled(animated.div)`
  ${tw`flex flex-row flex-wrap items-center justify-start mx-0 mt-2 mb-1 pt-2 pl-2`}
  span::after {
    position: relative;
    content: '•';
    color: ${props => props.color};
    font-size: 0.7rem;
    top: -2px;
    padding: 0 4px;
  }
  span:last-child {
    &::after {
      content: '';
    }
  }
  .disqus-comment-count {
    ${tw`block relative text-lg md:text-xl text-right leading-normal h-full pin-t m-0`}
  }
`

const PostDate = styled.span`
  ${tw`block relative text-lg md:text-xl text-right leading-normal pin-t m-0`}
  right: 4px;
  strong {
    ${tw`font-black py-0 px-1`}
  }
`

const PostBody = styled(animated.div)`
  ${tw`m-auto mb-16`}
  a {
    ${tw`no-underline`}
    color: ${props => darken(0.1, props.color)} !important;
    transition: color 250ms ease-in-out;
    &:hover {
      color: ${props => darken(0.25, props.color)} !important;
    }
  }
`

const CommentThread = styled(Disqus)`
  ${tw`w-full mx-auto`}
`

const Post = ({ data: { mdx: node }, location }) => {
  const post = node.frontmatter
  const titleProps = useSpring({
    config: config.slow,
    from: { opacity: 0, transform: 'translate3d(0, -30px, 0)' },
    to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
  })
  const infoProps = useSpring({ config: config.slow, delay: 500, from: { opacity: 0 }, to: { opacity: 1 } })
  const contentProps = useSpring({ config: config.slow, delay: 1000, from: { opacity: 0 }, to: { opacity: 1 } })

  let disqusConfig = {
    url: `${site.siteUrl+location.pathname}`,
    identifier: post.id,
    title: post.title,
  }

  return (
    <Layout pathname={location.pathname} color={post.color} customSEO>
      <SEO pathname={location.pathname} node={node} article />
      <PostHero>
        <PostImage customcolor={post.color}>
          <Image fluid={post.cover.childImageSharp.fluid} alt={post.title} />
        </PostImage>
        <HeaderContent type="text">
          <Title data-testid="post-title" style={titleProps}>
            {post.title}
          </Title>
          <PostDetail color={post.color} style={infoProps}>
            <PostDate>
              {post.date.split(' ').map((item, i) => (
                (i !== 1) ? <strong key={i}>{item}</strong> : item
              ))}
            </PostDate>
            <CommentCount config={disqusConfig} placeholder={'...'} />
          </PostDetail>
        </HeaderContent>
      </PostHero>
      <ContentBody type="text" className="post-content">
        <PostBody style={contentProps} color={post.color}>
          <MDXRenderer>{node.body}</MDXRenderer>
        </PostBody>
        <CommentThread config={disqusConfig} />
      </ContentBody>
    </Layout>
  )
}

export default Post

Post.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.object.isRequired,
  }).isRequired,
  location: PropTypes.object.isRequired,
}

export const pageQuery = graphql`
  query($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt
      fields {
        slug
      }
      parent {
        ... on File {
          mtime
          birthtime
        }
      }
      frontmatter {
        title
        date(formatString: "DD MMM YYYY")
        desc
        color
        cover {
          childImageSharp {
            fluid(maxWidth: 1920, quality: 90) {
              ...GatsbyImageSharpFluid_withWebp
            }
            resize(width: 800) {
              src
            }
          }
        }
      }
    }
  }
`
