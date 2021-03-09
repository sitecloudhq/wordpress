import React from 'react';

import { action } from '@storybook/addon-actions';
import BlogPost from '../src/BlogPost';

export default {
  title: 'BlogPost',
  component: BlogPost
};

export const example = () => <BlogPost />;

example.story = {
  name: 'default'
};
