import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ForgotPasswordForm, ForgotPasswordFormProps } from './';

export default {
  title: 'components/ForgotPasswordForm',
  component: ForgotPasswordForm,
} as Meta;

const Template: Story<ForgotPasswordFormProps> = (args) => (
  <ForgotPasswordForm {...args} />
);

export const Default = Template.bind({});
Default.args = {};
