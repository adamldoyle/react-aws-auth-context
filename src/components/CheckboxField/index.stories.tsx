import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button, Box } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { CheckboxField, CheckboxFieldProps } from './';

export default {
  title: 'components/CheckboxField',
  component: CheckboxField,
  argTypes: { onSubmit: { action: 'clicked' } },
} as Meta;

interface StoryArgs {
  defaultValue: boolean;
  required: boolean;
  onSubmit: (values: any) => {};
}

type AllProps = CheckboxFieldProps & StoryArgs;

const Template: Story<AllProps> = ({
  defaultValue,
  required,
  onSubmit,
  ...args
}) => {
  const Schema = Yup.object({
    [args.field]: Yup.boolean()
      .default(defaultValue)
      .oneOf(required ? [true] : [true, false], `${args.label} is required`),
  });

  const formDefaults = Schema.getDefault();
  return (
    <Formik
      initialValues={formDefaults}
      validationSchema={Schema}
      onSubmit={((values) => onSubmit(values)) as any}
    >
      {() => (
        <Form>
          <Box>
            <CheckboxField {...args} />
          </Box>
          <Box>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export const Default = Template.bind({});
Default.args = {
  label: 'Test field',
  field: 'testField',
  defaultValue: false,
  required: false,
};
