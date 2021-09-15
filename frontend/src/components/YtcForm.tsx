import { Formik, Form } from 'formik';
import {
  NumberInputControl,
  SelectControl,
  SubmitButton,
} from "formik-chakra-ui";
import * as Yup from "yup";

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// TODO this looks like junk, why whould we use an alert
const onSubmit = (values: any, actions: any): void => {
  sleep(300).then(() => {
    window.alert(JSON.stringify(values, null, 2));
    actions.setSubmitting(false)
  });
};

interface Values {
  trancheAddress: string;
  numCompounds: number;
  numTokens: number;
}

const initialValues: Values = {
  trancheAddress: 'option0',
  numCompounds: 1,
  numTokens: 1
}

const validationSchema = Yup.object({
  trancheAddress: Yup.string().required(),
  numCompounds: Yup.number().required().min(0),
  numTokens: Yup.number().required().min(0),
});

const YtcForm = () => {

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(props) => (
        <Form>
          {/** TODO this should not be hardcoded to 0,1,2,3 */}
          <SelectControl name="trancheAddress" label="Tranche Address">
            {[0,1,2,3].map(i => <option value={i} key={i}>{`0x${i}`}</option>)}
          </SelectControl>
          <NumberInputControl name="numTokens" label="Number of tokens" numberInputProps={{ min: 0 }} />
          <NumberInputControl name="numCompounds" label="Number of compounds" numberInputProps={{ min: 0 }} />
          <SubmitButton
            mt={4}
            colorScheme="teal"
          >
            Approve
          </SubmitButton>
        </Form>
      )}
    </Formik>
  )
}

export default YtcForm;