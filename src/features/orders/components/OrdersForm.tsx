"use client";

import { Formik, Form, Field } from "formik";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Button from "@/components/common/Button";
import { IoArrowBack, IoLogoDropbox } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
// import { useOrders } from "@/hooks/useOrders"; // custom hook

export default function OrderForm() {
  //   const { createOrder, isCreatingOrder } = useOrders();

  const initialValues = {
    serviceType: "",
    fulfillmentType: "",
    name: "",
    email: "",
    phone: "",
    weight: 0,
    category: "",
    isFragile: false,
    shipmentType: "",
    shippingScope: "",
    length: 0,
    width: 0,
    height: 0,
    pickupAddress: "",
    pickupDate: "",
    deliveryAddress: "",
    deliveryDate: "",
    cost: 0,
  };
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        onSubmit={() => {
          //   createOrder(values);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex gap-5 items-center">
                <Button
                  type="button"
                  className="!text-white !size-[40px] bg-blue-500 hover:bg-blue-400 !rounded-full !p-0 !py-0 flex items-center justify-center !cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  <IoArrowBack className="text-white text-lg" />
                </Button>
                <div className="flex gap-2 items-center">
                  <IoLogoDropbox className="text-xl text-blue-500" />
                  <h1 className="text-2xl font-medium text-gray-700">
                    Place New Order
                  </h1>
                </div>
              </div>
              <Button
                type="submit"
                className="!cursor-pointer !bg-blue-500 hover:!bg-blue-400 !w-fit"
              >
                Submit Order
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Customer Info</h2>
                <div>
                  <Label className="mb-1">Name</Label>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Customer name"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Email</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Phone</Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    className={`py-7`}
                  />
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Service Info</h2>

                <div>
                  <Label className="mb-1">Service Type</Label>
                  <Select
                    value={values.serviceType}
                    onValueChange={(val) => setFieldValue("serviceType", val)}
                  >
                    <SelectTrigger className="bg-gray-100 border-0 py-7">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EXPRESS">EXPRESS</SelectItem>
                      <SelectItem value="STANDARD">STANDARD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1">Fulfillment Type</Label>
                  <Select
                    value={values.fulfillmentType}
                    onValueChange={(val) =>
                      setFieldValue("fulfillmentType", val)
                    }
                  >
                    <SelectTrigger className="bg-gray-100 border-0 py-7">
                      <SelectValue placeholder="Select fulfillment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PICKUP">PICKUP</SelectItem>
                      <SelectItem value="DROPOFF">DROPOFF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Shipment Info */}
            <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">Shipment Info</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1">Weight (kg)</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="0.1"
                    name="weight"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Category</Label>
                  <Field
                    as={Input}
                    name="category"
                    placeholder="FOOD / PARCEL"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Fragile</Label>
                  <Select
                    value={String(values.isFragile)}
                    onValueChange={(val) => setFieldValue("isFragile", val)}
                  >
                    <SelectTrigger className="bg-gray-100 border-0 py-7">
                      <SelectValue placeholder="Fragile ?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">YES</SelectItem>
                      <SelectItem value="false">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1">Shipment Type</Label>
                  <Field
                    as={Input}
                    name="shipmentType"
                    placeholder="PARCEL"
                    className={"py-7"}
                  />
                </div>
                <div>
                  <Label className="mb-1">Scope</Label>
                  <Field
                    as={Input}
                    name="shippingScope"
                    placeholder="TOWN / REGIONAL"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Cost</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="0.01"
                    name="cost"
                    className={`py-7`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1">Length</Label>
                  <Field
                    as={Input}
                    type="number"
                    name="length"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Width</Label>
                  <Field
                    as={Input}
                    type="number"
                    name="width"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Height</Label>
                  <Field
                    as={Input}
                    type="number"
                    name="height"
                    className={`py-7`}
                  />
                </div>
              </div>
            </div>

            {/* Conditional Fields */}
            {values.fulfillmentType === "PICKUP" && (
              <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
                <h2 className="text-lg font-medium mb-4">Pickup & Delivery</h2>
                <div>
                  <Label className="mb-1">Pickup Address</Label>
                  <Field
                    as={Textarea}
                    name="pickupAddress"
                    placeholder="Pickup location"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Pickup Date</Label>
                  <Field
                    as={Input}
                    type="datetime-local"
                    name="pickupDate"
                    className="py-7"
                  />
                </div>
                <div>
                  <Label className="mb-1">Delivery Address</Label>
                  <Field
                    as={Textarea}
                    name="deliveryAddress"
                    placeholder="Delivery location"
                    className={`py-7`}
                  />
                </div>
              </div>
            )}

            {values.fulfillmentType === "DROPOFF" && (
              <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
                <h2 className="text-lg font-medium mb-4">
                  Drop-off & Delivery
                </h2>
                <div>
                  <Label>Delivery Address</Label>
                  <Field
                    as={Textarea}
                    name="deliveryAddress"
                    placeholder="Delivery location"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label>Delivery Date</Label>
                  <Field
                    as={Input}
                    type="datetime-local"
                    name="deliveryDate"
                    className={`py-7`}
                  />
                </div>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
