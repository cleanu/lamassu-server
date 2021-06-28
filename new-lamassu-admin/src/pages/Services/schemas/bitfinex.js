import * as Yup from 'yup'

import SecretInputFormik from 'src/components/inputs/formik/SecretInput'
import TextInputFormik from 'src/components/inputs/formik/TextInput'

import secretTest from './helper'

export default {
  code: 'bitfinex',
  name: 'Bitfinex',
  title: 'Bitfinex (Exchange)',
  elements: [
    {
      code: 'apiKey',
      display: 'API Key',
      component: TextInputFormik,
      face: true,
      long: true
    },
    {
      code: 'apiSecret',
      display: 'API Secret',
      component: SecretInputFormik
    }
  ],
  getValidationSchema: account => {
    return Yup.object().shape({
      apiKey: Yup.string()
        .max(100, 'Too long')
        .required(),
      apiSecret: Yup.string()
        .max(100, 'Too long')
        .test(secretTest(account?.apiSecret))
    })
  }
}
