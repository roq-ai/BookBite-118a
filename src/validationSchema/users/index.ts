import * as yup from 'yup';
import { employeeValidationSchema } from 'validationSchema/employees';
import { orderValidationSchema } from 'validationSchema/orders';
import { reservationValidationSchema } from 'validationSchema/reservations';
import { restaurantValidationSchema } from 'validationSchema/restaurants';

export const userValidationSchema = yup.object().shape({
  roq_user_id: yup.string().required(),
  tenant_id: yup.string().required(),
  employee: yup.array().of(employeeValidationSchema),
  order: yup.array().of(orderValidationSchema),
  reservation: yup.array().of(reservationValidationSchema),
  restaurant: yup.array().of(restaurantValidationSchema),
});
