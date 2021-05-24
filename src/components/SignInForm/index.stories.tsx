import React from 'react';
import { Story, Meta } from '@storybook/react';
import { SignInForm, SignInFormProps } from './';

export default {
  title: 'components/SignInForm',
  component: SignInForm,
} as Meta;

const Template: Story<SignInFormProps> = (args) => <SignInForm {...args} />;

export const Default = Template.bind({});
Default.args = {};
