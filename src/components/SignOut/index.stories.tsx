import React from 'react';
import { Story, Meta } from '@storybook/react';
import { SignOut, SignOutProps } from './';

export default {
  title: 'components/SignOut',
  component: SignOut,
} as Meta;

const Template: Story<SignOutProps> = (args) => <SignOut {...args} />;

export const Default = Template.bind({});
Default.args = {};
