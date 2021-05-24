import React from 'react';
import { Story, Meta } from '@storybook/react';
import { Button, Box } from '@material-ui/core';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { InputField, InputFieldProps } from './';

export default {
  title: 'components/InputField',
  component: InputField,
  argTypes: { onSubmit: { action: 'clicked' } },
} as Meta;

interface StoryArgs {
  defaultValue: string;
  required: boolean;
  onSubmit: (values: any) => {};
}

type AllProps = InputFieldProps & StoryArgs;

const Template: Story<AllProps> = ({
  defaultValue,
  required,
  onSubmit,
  ...args
}) => {
  const field = Yup.string().default(defaultValue);
  const Schema = Yup.object({
    [args.field]: required
      ? field.required(`${args.label} is required`)
      : field,
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
            <InputField {...args} />
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
  type: 'input',
  defaultValue: '',
  required: false,
};
