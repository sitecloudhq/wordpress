import React from 'react';
import styled from 'styled-components';
import { Heading as Icon } from 'styled-icons/fa-solid';
import { PropTypes, EditorTypes } from 'sitecloud-components';

const Container = styled.div`
  color: ${(props) => props.color || 'black'};
`;

const Example = ({ children, ...props }) => (
  <Container {...props}>{children}</Container>
);

Example.props = {
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

Example.icon = <Icon size="1rem" />;

export default Example;
