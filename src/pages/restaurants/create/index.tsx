import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import { createRestaurant } from 'apiSdk/restaurants';
import { Error } from 'components/error';
import { RestaurantInterface } from 'interfaces/restaurant';
import { restaurantValidationSchema } from 'validationSchema/restaurants';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function RestaurantCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: RestaurantInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createRestaurant(values);
      resetForm();
      router.push('/restaurants');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<RestaurantInterface>({
    initialValues: {
      name: '',
      owner_id: null,
      employee: [],
      inventory: [],
      menu_item: [],
      order: [],
      promotion: [],
      reservation: [],
    },
    validationSchema: restaurantValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <AppLayout>
      <Text as="h1" fontSize="2xl" fontWeight="bold">
        Create Restaurant
      </Text>
      <Box bg="white" p={4} rounded="md" shadow="md">
        {error && <Error error={error} />}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="name" mb="4" isInvalid={!!formik.errors.name}>
            <FormLabel>Restaurant Name</FormLabel>
            <Input type="text" name="name" value={formik.values.name} onChange={formik.handleChange} />
            {formik.errors.name && <FormErrorMessage>{formik.errors.name}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'owner_id'}
            label={'Owner'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record.id}
              </option>
            )}
          />

          <ArrayFormField
            values={formik.values.employee}
            errors={formik.errors.employee}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'role', label: 'role' },
              { fieldName: 'permissions', label: 'permissions' },
              { fieldName: 'user_id', label: 'user' },
            ]}
            title={'Employees'}
            name="employee"
            rowInitialValues={{ role: '', permissions: '', user_id: null }}
            renderRowField={({ fieldName, value, name, error, label }) => (
              <>
                {fieldName === 'role' && (
                  <FormControl id="role" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'permissions' && (
                  <FormControl id="permissions" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'user_id' && (
                  <AsyncSelect<UserInterface>
                    formik={formik}
                    name={name}
                    label={label}
                    placeholder={'Select User'}
                    fetcher={getUsers}
                    renderOption={(record) => (
                      <option key={record.id} value={record.id}>
                        {record.id}
                      </option>
                    )}
                  />
                )}
              </>
            )}
          />

          <ArrayFormField
            values={formik.values.inventory}
            errors={formik.errors.inventory}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'ingredient_name', label: 'ingredient_name' },
              { fieldName: 'quantity', label: 'quantity' },
              { fieldName: 'unit', label: 'unit' },
            ]}
            title={'Inventory'}
            name="inventory"
            rowInitialValues={{ ingredient_name: '', quantity: 0, unit: '' }}
            renderRowField={({ fieldName, value, name, error, label }) => (
              <>
                {fieldName === 'ingredient_name' && (
                  <FormControl id="ingredient_name" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'quantity' && (
                  <FormControl id="quantity" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <NumberInput
                      name={name}
                      value={value}
                      onChange={(valueString, valueNumber) =>
                        formik.setFieldValue(name, Number.isNaN(valueNumber) ? 0 : valueNumber)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'unit' && (
                  <FormControl id="unit" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
              </>
            )}
          />

          <ArrayFormField
            values={formik.values.menu_item}
            errors={formik.errors.menu_item}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'name', label: 'name' },
              { fieldName: 'description', label: 'description' },
              { fieldName: 'price', label: 'price' },
              { fieldName: 'image_url', label: 'image_url' },
            ]}
            title={'Menu Items'}
            name="menu_item"
            rowInitialValues={{ name: '', description: '', price: 0, image_url: '' }}
            renderRowField={({ fieldName, value, name, error, label }) => (
              <>
                {fieldName === 'name' && (
                  <FormControl id="name" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'description' && (
                  <FormControl id="description" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'price' && (
                  <FormControl id="price" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <NumberInput
                      name={name}
                      value={value}
                      onChange={(valueString, valueNumber) =>
                        formik.setFieldValue(name, Number.isNaN(valueNumber) ? 0 : valueNumber)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'image_url' && (
                  <FormControl id="image_url" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
              </>
            )}
          />

          <ArrayFormField
            values={formik.values.order}
            errors={formik.errors.order}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'status', label: 'status' },
              { fieldName: 'total_price', label: 'total_price' },
              { fieldName: 'created_at', label: 'created_at' },
              { fieldName: 'customer_id', label: 'user' },
            ]}
            title={'Orders'}
            name="order"
            rowInitialValues={{
              status: '',
              total_price: 0,
              created_at: new Date(new Date().toDateString()),
              customer_id: null,
            }}
            renderRowField={({ fieldName, value, name, error, label }) => (
              <>
                {fieldName === 'status' && (
                  <FormControl id="status" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'total_price' && (
                  <FormControl id="total_price" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <NumberInput
                      name={name}
                      value={value}
                      onChange={(valueString, valueNumber) =>
                        formik.setFieldValue(name, Number.isNaN(valueNumber) ? 0 : valueNumber)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'created_at' && (
                  <FormControl id="created_at" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'customer_id' && (
                  <AsyncSelect<UserInterface>
                    formik={formik}
                    name={name}
                    label={label}
                    placeholder={'Select User'}
                    fetcher={getUsers}
                    renderOption={(record) => (
                      <option key={record.id} value={record.id}>
                        {record.id}
                      </option>
                    )}
                  />
                )}
              </>
            )}
          />

          <ArrayFormField
            values={formik.values.promotion}
            errors={formik.errors.promotion}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'title', label: 'title' },
              { fieldName: 'description', label: 'description' },
              { fieldName: 'start_date', label: 'start_date' },
              { fieldName: 'end_date', label: 'end_date' },
              { fieldName: 'discount_amount', label: 'discount_amount' },
            ]}
            title={'Promotions'}
            name="promotion"
            rowInitialValues={{
              title: '',
              description: '',
              start_date: new Date(new Date().toDateString()),
              end_date: new Date(new Date().toDateString()),
              discount_amount: 0,
            }}
            renderRowField={({ fieldName, value, name, error, label }) => (
              <>
                {fieldName === 'title' && (
                  <FormControl id="title" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'description' && (
                  <FormControl id="description" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <Input type="text" name={name} value={value} onChange={formik.handleChange} />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'start_date' && (
                  <FormControl id="start_date" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'end_date' && (
                  <FormControl id="end_date" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'discount_amount' && (
                  <FormControl id="discount_amount" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <NumberInput
                      name={name}
                      value={value}
                      onChange={(valueString, valueNumber) =>
                        formik.setFieldValue(name, Number.isNaN(valueNumber) ? 0 : valueNumber)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
              </>
            )}
          />

          <ArrayFormField
            values={formik.values.reservation}
            errors={formik.errors.reservation}
            setFieldValue={formik.setFieldValue}
            properties={[
              { fieldName: 'date', label: 'date' },
              { fieldName: 'time', label: 'time' },
              { fieldName: 'party_size', label: 'party_size' },
              { fieldName: 'customer_id', label: 'user' },
            ]}
            title={'Reservations'}
            name="reservation"
            rowInitialValues={{
              date: new Date(new Date().toDateString()),
              time: new Date(new Date().toDateString()),
              party_size: 0,
              customer_id: null,
            }}
            renderRowField={({ fieldName, value, name, error, label }) => (
              <>
                {fieldName === 'date' && (
                  <FormControl id="date" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'time' && (
                  <FormControl id="time" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <DatePicker
                      dateFormat={'dd/MM/yyyy'}
                      selected={value}
                      onChange={(value: Date) => formik.setFieldValue(name, value)}
                    />
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'party_size' && (
                  <FormControl id="party_size" isInvalid={Boolean(error)}>
                    <FormLabel>{label}</FormLabel>
                    <NumberInput
                      name={name}
                      value={value}
                      onChange={(valueString, valueNumber) =>
                        formik.setFieldValue(name, Number.isNaN(valueNumber) ? 0 : valueNumber)
                      }
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {error && <FormErrorMessage>{error}</FormErrorMessage>}
                  </FormControl>
                )}
                {fieldName === 'customer_id' && (
                  <AsyncSelect<UserInterface>
                    formik={formik}
                    name={name}
                    label={label}
                    placeholder={'Select User'}
                    fetcher={getUsers}
                    renderOption={(record) => (
                      <option key={record.id} value={record.id}>
                        {record.id}
                      </option>
                    )}
                  />
                )}
              </>
            )}
          />

          <Button isDisabled={!formik.isValid || formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default RestaurantCreatePage;
