import React from 'react';
import { Story, Meta } from '@storybook/react';
import { ConfirmAccountForm, ConfirmAccountFormProps } from './';

export default {
  title: 'components/ConfirmAccountForm',
  component: ConfirmAccountForm,
} as Meta;

const Template: Story<ConfirmAccountFormProps> = (args) => (
  <ConfirmAccountForm {...args} />
);

export const Default = Template.bind({});
Default.args = {
  email: 'sample@sample.com',
};
