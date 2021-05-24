import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ResetPasswordForm, ResetPasswordFormProps } from './';

export default {
  title: 'components/ResetPasswordForm',
  component: ResetPasswordForm,
} as Meta;

const Template: Story<ResetPasswordFormProps> = (args) => (
  <ResetPasswordForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  email: 'sample@sample.com',
};
