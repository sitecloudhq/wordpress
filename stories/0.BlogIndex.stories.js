import React from 'react';

import { action } from '@storybook/addon-actions';
import BlogIndex from '../src/BlogIndex';

export default {
  title: 'BlogIndex',
  component: BlogIndex
};

export const example = () => <BlogIndex />;

example.story = {
  name: 'default'
};
