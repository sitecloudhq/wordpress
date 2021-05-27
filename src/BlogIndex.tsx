import React from 'react';
import { Component, EditorTypes, PropTypes } from '@sitecloud/components';
import styled from 'styled-components';
import { Wordpress as Icon } from '@styled-icons/simple-icons/Wordpress';

const Container = styled.div`
  color: ${(props) => props.color || 'black'};
  width: 100%;
  max-width: 1150px;
  text-align: center;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media (max-width: 1160px) {
    justify-content: center;
  }
`;

const Title = styled.h3`
  font-weight: 600;
  font-size: 1rem;
  color: #1e1e1e;
  margin-bottom: 0.5rem;
  transition: 0.2s ease-in-out;
`;

const SubTitle = styled.div`
  font-weight: 300;
  font-size: 0.9rem;
  line-height: 1.4rem;
  color: #737373;
`;

const Picture = styled.picture`
  display: inline-block;
  height: 250px;
  width: 100%;
  border-radius: 5px;
  overflow: hidden;
`;

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.2s ease-in-out;
`;

const PostLink = styled.a`
  display: inline-block;
  width: 350px;
  margin: 1rem;
  cursor: pointer;
  line-height: 1.2rem;
  text-decoration: none;
  text-align: left;
  outline: none;

  &:hover {
    ${Title} {
      color: #af21ff;
    }

    ${Image} {
      transform: scale(1.1);
    }
  }
`;

const BlogIndex: Component<{ data: any }> = ({ data, ...props }) => (
  <Container {...props}>
    {data &&
      data.map(
        ({
          slug,
          title,
          excerpt,
          featured
        }: {
          slug: string;
          title: any;
          excerpt: any;
          featured: any;
        }) => (
          <PostLink href={`/blog/${slug}`}>
            <Picture>
              {featured && (
                <Image
                  src={featured.media_details.sizes.medium_large.source_url}
                />
              )}
            </Picture>
            <Title dangerouslySetInnerHTML={{ __html: title.rendered }}></Title>
            <SubTitle dangerouslySetInnerHTML={{ __html: excerpt.rendered }} />
          </PostLink>
        )
      )}
  </Container>
);

BlogIndex.props = {
  basePage: {
    type: PropTypes.String,
    default: '/blog'
  },
  aspect: {
    color: {
      type: PropTypes.Color,
      default: 'blue',
      editor: EditorTypes.Color,
      required: false,
      enabled: false
    }
  }
};

BlogIndex.icon = <Icon size="1rem" />;

BlogIndex.asyncProps = async () => {
  const WP_API_URL = 'https://yourwordpress.com/';

  const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/posts`);
  let data = await res.json();
  data = await Promise.all(
    data.map(async (entry: any) => {
      if (
        entry._links['wp:featuredmedia'] &&
        entry._links['wp:featuredmedia'][0]
      ) {
        const mediaData = await fetch(entry._links['wp:featuredmedia'][0].href);
        entry.featured = await mediaData.json();
      }

      return entry;
    })
  );

  return { data };
};

export default BlogIndex;
