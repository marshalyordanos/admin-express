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
import MapAddressSelector from "@/components/common/MapAddressSelector";
import SuccessModal from "@/components/common/SuccessModal";
import { IoArrowBack, IoLogoDropbox } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
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
    quantity: 0,
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
    senderEntity: "",
    unUsualItem: false,
    destination: "",
    unUsualityReason: "",
    // Receiver fields
    receiverName: "",
    receiverEmail: "",
    receiverPhone: "",
    receiverAddress: "",
    receiverLatitude: 0,
    receiverLongitude: 0,
  };
  const navigate = useNavigate();
  const [estimatePrice, setEstimatePrice] = useState(""); // sample estimate
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  const onEstimate = () => {
    const price = Math.ceil(Math.random() * 6000 + 1000);
    setEstimatePrice(
      Intl.NumberFormat("en-us", {
        style: "currency",
        currency: "ETB",
        minimumIntegerDigits: 2,
      }).format(price)
    );
  };

  const generateTrackingNumber = () => {
    const prefix = "ETB";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  };

  const handleSubmit = (
    _values: unknown,
    { resetForm }: { resetForm: () => void }
  ) => {
    // Generate tracking number
    const tracking = generateTrackingNumber();
    setTrackingNumber(tracking);

    // Show success modal
    setIsSuccessModalOpen(true);

    // Reset form after a short delay
    setTimeout(() => {
      resetForm();
      setEstimatePrice("");
    }, 1000);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    setTrackingNumber("");
  };

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ values, setFieldValue }) => (
          <Form>
            {/* Header */}
            <header className="relative">
              <div className="absolute h-full top-0 left-0 flex items-center">
                <Button
                  type="button"
                  className="!text-white !size-[40px] bg-blue-500 hover:bg-blue-400 !rounded-full !p-0 !py-0 flex items-center justify-center !cursor-pointer"
                  onClick={() => navigate(-1)}
                >
                  <IoArrowBack className="text-white text-lg" />
                </Button>
              </div>
              <div className="flex gap-5 items-center justify-center mb-6">
                <div className="flex gap-4 items-center">
                  <IoLogoDropbox className="text-4xl text-blue-500" />
                  <h1 className="text-3xl font-medium text-gray-700">
                    Place New Order
                  </h1>
                </div>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Customer Info */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Sender Info</h2>
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

              {/* Receiver Info */}
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <h2 className="text-lg font-medium mb-4">Receiver Info</h2>
                <div>
                  <Label className="mb-1">Name</Label>
                  <Field
                    as={Input}
                    name="receiverName"
                    placeholder="Receiver name"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Email</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="receiverEmail"
                    placeholder="Receiver email"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Phone</Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="receiverPhone"
                    placeholder="Receiver phone"
                    className={`py-7`}
                  />
                </div>
                <div>
                  <Label className="mb-1">Delivery Address</Label>
                  <MapAddressSelector
                    onAddressSelect={(addressData) => {
                      setFieldValue("receiverAddress", addressData.address);
                      setFieldValue("receiverLatitude", addressData.latitude);
                      setFieldValue("receiverLongitude", addressData.longitude);
                    }}
                    initialAddress={values.receiverAddress}
                    initialLat={values.receiverLatitude}
                    initialLng={values.receiverLongitude}
                    height="300px"
                  />
                </div>
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
                  <SelectTrigger className="py-7 !w-full bg-none border">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="sameday">Same-day</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="mb-1">Courier Collection Type</Label>
                <Select
                  value={values.fulfillmentType}
                  onValueChange={(val) => setFieldValue("fulfillmentType", val)}
                >
                  <SelectTrigger className="bg-none py-7 !w-full">
                    <SelectValue placeholder="Select fulfillment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PICKUP">PICKUP</SelectItem>
                    <SelectItem value="DROPOFF">DROPOFF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="mb-1">Sender Entity</Label>
                <Select
                  value={String(values.senderEntity)}
                  onValueChange={(val) => setFieldValue("senderEntity", val)}
                >
                  <SelectTrigger className="py-7 !w-full">
                    <SelectValue placeholder="Indvidual/Company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Indvidual</SelectItem>
                    <SelectItem value="false">Company</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Shipment Info */}
            <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">Shipment Info</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label className="mb-1">Shipment Type</Label>
                  <Select
                    value={String(values.shipmentType)}
                    onValueChange={(val) => setFieldValue("shipmentType", val)}
                  >
                    <SelectTrigger className="py-7 !w-full">
                      <SelectValue placeholder="Select shipment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parcel">Parcel</SelectItem>
                      <SelectItem value="courier">Courier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1">Quantity</Label>
                  <Field
                    as={Input}
                    type="number"
                    step="0.1"
                    name="quantity"
                    className={`py-7`}
                  />
                </div>

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
                {values.shipmentType === "courier" ? (
                  <>
                    <div>
                      <Label className="mb-1">Length</Label>
                      <Field
                        as={Input}
                        type="number"
                        step="0.1"
                        name="length"
                        className={`py-7`}
                      />
                    </div>
                    <div>
                      <Label className="mb-1">Width</Label>
                      <Field
                        as={Input}
                        type="number"
                        step="0.1"
                        name="width"
                        className={`py-7`}
                      />
                    </div>
                    <div>
                      <Label className="mb-1">Height</Label>
                      <Field
                        as={Input}
                        type="number"
                        step="0.1"
                        name="height"
                        className={`py-7`}
                      />
                    </div>
                  </>
                ) : (
                  <></>
                )}
                <div>
                  <Label className="mb-1">Category</Label>
                  <Select
                    value={String(values.shipmentType)}
                    onValueChange={(val) => setFieldValue("category", val)}
                  >
                    <SelectTrigger className="py-7 !w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="courier">Courier</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="chemical">Chemical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1">Fragile</Label>
                  <Select
                    value={String(values.isFragile)}
                    onValueChange={(val) =>
                      setFieldValue("isFragile", val === "true" ? true : false)
                    }
                  >
                    <SelectTrigger className="!w-full py-7">
                      <SelectValue placeholder="Fragile ?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">YES</SelectItem>
                      <SelectItem value="false">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1">Unusual Item</Label>
                  <Select
                    value={String(values.unUsualItem)}
                    onValueChange={(val) =>
                      setFieldValue(
                        "unUsualItem",
                        val === "true" ? true : false
                      )
                    }
                  >
                    <SelectTrigger className="!w-full py-7">
                      <SelectValue placeholder="Is Unusual ?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">YES</SelectItem>
                      <SelectItem value="false">NO</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {values.unUsualItem ? (
                  <div className="col-span-2">
                    <Label className="mb-1">Unusuality Reason</Label>
                    <Field
                      as={Textarea}
                      cols={15}
                      name="unUsualityReason"
                      placeholder="Reason for being unusual"
                      className={`py-4 min-h-[80px]`}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div>
                  <Label className="mb-1">Destination</Label>
                  <Select
                    value={String(values.destination)}
                    onValueChange={(val) => setFieldValue("destination", val)}
                  >
                    <SelectTrigger className="!w-full py-7">
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="town">Town</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      <SelectItem value="international">
                        International
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Action buttons */}

            <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">Complete order</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  type="button"
                  className="mb-1 !w-[180px] cursor-pointer hover:bg-blue-700"
                  onClick={onEstimate}
                >
                  Generate Estimate price
                </Button>

                <Input
                  className="py-7 font-bold !text-lg"
                  disabled={true}
                  value={estimatePrice}
                />

                <Button
                  type="submit"
                  className="mb-1 !w-[180px] col-span-2 cursor-pointer hover:bg-blue-700"
                >
                  Submit order
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        trackingNumber={trackingNumber}
      />
    </div>
  );
}
