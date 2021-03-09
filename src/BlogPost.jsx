import React from 'react';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { Wordpress as Icon } from '@styled-icons/simple-icons/Wordpress';

const Container = styled.div`
  color: ${(props) => props.color || 'black'};
  font-family: Helvetica;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: 3rem;
  color: #1e1e1e;
  margin-bottom: 0.5rem;
  transition: 0.2s ease-in-out;
`;

const Intro = styled.section`
  width: 100%;
  max-width: 1000px;

  padding-bottom: 2rem;
`;

const Image = styled.img`
  max-width: 1000px;
  width: 100%;
  height: 450px;
  object-fit: cover;
  border-radius: 5px;
`;

const Header = styled.div`
  text-align: center;
  width: 100%;
`;

const bodyWidth = '40rem';

const Body = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  & h2 {
    font-weight: 800;
    line-height: 2.5rem;
    max-width: ${bodyWidth};
    font-size: 2rem;
  }

  & h3,
  & h4 {
    font-size: 1.6rem;
  }

  & ul,
  & li,
  & p {
    font-weight: 300;
    line-height: 1.7rem;
    max-width: ${bodyWidth};
    font-size: 1.2rem;
  }
  & a {
    font-weight: bold;
    text-decoration: none;
  }
  & img {
    max-width: ${bodyWidth};
  }
`;

const Detail = styled.div`
  margin-top: 2rem;
  font-size: 1.2rem;
  opacity: 0.5;
`;

const BlogPost = ({ data, ...props }) => {
  const createdAt = data && data.date && new Date(data.date);
  return (
    <Container {...props}>
      {data && (
        <>
          <Helmet>
            <title>{data.title.rendered}</title>
            <meta property="og:title" content={data.title.rendered} />
            <meta property="og:type" content="article" />
            {data.featured && (
              <meta
                property="og:image"
                content={data.featured.media_details.sizes.medium.source_url}
              />
            )}

            <meta name="twitter:card" content="summary_large_image" />
            {data.featured && (
              <meta
                property="twitter:image"
                content={data.featured.media_details.sizes.medium.source_url}
              />
            )}
            <meta name="twitter:title" content={data.title.rendered} />
          </Helmet>

          <Header>
            {data.featured && (
              <Image
                src={data.featured.media_details.sizes.medium_large.source_url}
              />
            )}
          </Header>
          <Intro>
            <Title dangerouslySetInnerHTML={{ __html: data.title.rendered }} />
            <Detail>
              {createdAt && (
                <time dateTime={createdAt.toLocaleDateString()}>
                  {createdAt.toDateString()}
                </time>
              )}
            </Detail>
          </Intro>
          <Body dangerouslySetInnerHTML={{ __html: data.content.rendered }} />
        </>
      )}
    </Container>
  );
};

BlogPost.icon = <Icon size="1rem" />;

BlogPost.asyncProps = async ({ location, devMode }) => {
  const WP_API_URL = 'https://yourwordpress.com/';

  const slug = !devMode ? location.split('/')[2] : 'example-post';
  const res = await fetch(`${WP_API_URL}/wp-json/wp/v2/posts?slug=${slug}`);

  let data = await res.json();
  if (data && data.length) {
    data = await Promise.all(
      data.map(async (entry) => {
        if (
          entry._links['wp:featuredmedia'] &&
          entry._links['wp:featuredmedia'][0]
        ) {
          const mediaData = await fetch(
            entry._links['wp:featuredmedia'][0].href
          );
          entry.featured = await mediaData.json();
        }

        return entry;
      })
    );

    return { data: data[0] };
  } else {
    return { data: null };
  }
};

export default BlogPost;
