import React, { cloneElement, useState, useEffect } from 'react';
import { addDecorator } from '@storybook/react';
import styled from 'styled-components';

const AsyncProps = ({ children }) => {
  const [asyncProps, setAsyncProps] = useState();

  useEffect(() => {
    if (!children.type.asyncProps) return;

    const fetchAsyncProps = async () => {
      const data = await children.type.asyncProps({
        location: '/',
        devMode: true
      });
      setAsyncProps(data);
    };
    fetchAsyncProps();
  }, [children]);

  return cloneElement(children, { ...asyncProps });
};
addDecorator((storyFn) => <AsyncProps>{storyFn()}</AsyncProps>);
