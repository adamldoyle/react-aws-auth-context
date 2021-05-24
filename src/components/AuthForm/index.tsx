import React from 'react';
import {
  Avatar,
  Button,
  Grid,
  FormHelperText,
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { Formik, Form } from 'formik';
import { useDelayedFormValidation } from '../../hooks';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export interface AuthFormProps<Values> {
  title: string;
  Schema: unknown;
  formDefaults: Values;
  validate?: (values: Values) => void | Record<string, unknown>;
  formDescription?: string;
  submitLabel: string;
  onSubmit: (values: Values) => Promise<void>;
  actions?: (values: Values) => React.ReactNode;
  formBody: React.ReactNode;
}

export function AuthForm<Values>({
  title,
  Schema,
  formDefaults,
  validate,
  formDescription,
  submitLabel,
  onSubmit,
  actions,
  formBody,
}: AuthFormProps<Values>): JSX.Element {
  const classes = useStyles();

  const { formikValidationProps, onSubmit: onFormSubmit } =
    useDelayedFormValidation<Values>();

  return (
    <Grid container justify="center" alignItems="center">
      <Grid item xs={12} sm={6} md={4}>
        <Box className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {title}
          </Typography>
          <Formik
            {...formikValidationProps}
            initialValues={formDefaults}
            validationSchema={Schema}
            validate={validate}
            onSubmit={async (values, actions) => {
              actions.setFieldError('_root', '');
              try {
                await onSubmit(values);
              } catch (err) {
                actions.setFieldError('_root', err.message);
              }
            }}
          >
            {(formProps) => (
              <Form className={classes.form} onSubmit={onFormSubmit(formProps)}>
                <Grid container spacing={2}>
                  {formDescription && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2">
                        {formDescription}
                      </Typography>
                    </Grid>
                  )}
                  {formProps.errors['_root'] && (
                    <Grid item xs={12}>
                      <FormHelperText error={true}>
                        {formProps.errors['_root']}
                      </FormHelperText>
                    </Grid>
                  )}
                  {formBody}
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                  disabled={formProps.isSubmitting}
                >
                  {submitLabel}
                </Button>
                {actions ? actions(formProps.values) : null}
              </Form>
            )}
          </Formik>
        </Box>
      </Grid>
    </Grid>
  );
}
