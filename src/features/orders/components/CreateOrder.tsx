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
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import * as Yup from "yup";
import api from "@/lib/api/api";
import toast from "react-hot-toast";
import type { Customer, CustomerListResponse, Pagination } from "@/types/types";
import { Spinner } from "@/utils/spinner";
import { Select as Style2 } from "antd";

// import { useOrders } from "@/hooks/useOrders"; // custom hook

const OrderValidationSchema = Yup.object().shape({
  customerId: Yup.string().required("Customer is required"),
  receiverName: Yup.string().required("Receiver name is required"),
  receiverEmail: Yup.string()
    .email("Invalid email")
    .required("Receiver email is required"),
  receiverPhone: Yup.string().required("Receiver phone is required"),
  receiverAddress: Yup.string().required("Delivery address is required"),
  pickupAddress: Yup.string().required("Pickup address is required"),
  serviceType: Yup.string().required("Service type is required"),
  fulfillmentType: Yup.string().required("Fulfillment type is required"),
  weight: Yup.number()
    .min(0.1, "Weight must be greater than 0")
    .required("Weight is required"),
  destination: Yup.string().required("Destination is required"),
});

interface ConvertedShipment {
  customerId: any;
  receiverName: any;
  receiverEmail: any;
  receiverPhone: any;
  serviceType: any;
  fulfillmentType: any;
  weight: any;
  category: any[];
  isFragile: any;
  shipmentType: any;
  shippingScope: any;

  pickupAddress: {
    lat: any;
    long: any;
  };

  deliveryAddress: {
    lat: any;
    long: any;
  };

  isUnusual: any;
  unusualReason: any;
  quantity: any;
  cost: any;

  width?: any;
  height?: any;
  length?: any;
}


export default function OrderForm() {
  //   const { createOrder, isCreatingOrder } = useOrders();

  const initialValues = {
    serviceType: "",
    fulfillmentType: "",
    // name: "",
    // email: "",
    // phone: "",
    customerId: "",
    weight: 0,
    quantity: 0,
    category: [],
    isFragile: false,
    shipmentType: "",
    shippingScope: "",
    length: 0,
    width: 0,
    height: 0,
    pickupAddress: "",
    pickupLatitude: 0,
    pickupLongitude: 0,
    cost: 0,
    senderEntity: "",
    isUnusual: false,
    destination: "",
    unusualReason: "",
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
  const [loading, setLoading] = useState(false);

  const [managerSearch, setManagerSearch] = useState("");
  const [branchSearch, setBranchSearch] = useState("");
  const [showManagerDropdown, setShowManagerDropdown] = useState(false);
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchText, setSearchText] = useState("");
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [custoemr, setCustomer] = useState<Customer[]>([]);
const [priceLoading,setPriceLoading] = useState(false)
// const [priceLoading,setPriceLoad] = useState(false)

  const featchStaffs = async (page = 1, limit = 10) => {
    try {
      setLoadingStaff(true);

      const staffs = await api.get<CustomerListResponse>(
        `/users/customers?search=all:${managerSearch}&page=${1}&pageSize=${20}`
      );
      setCustomer(staffs.data.data);
      setPagination(staffs.data.pagination);
      // toast.success(staffs.data.message);
      setLoadingStaff(false);
    } catch (error: any) {
      setLoadingStaff(false);

      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
      console.error(error); // optional: log the full error
    }
  };

  useEffect(() => {
    featchStaffs();
  }, [managerSearch]);
  const onEstimate =async (_values:any) => {
    setPriceLoading(true)
    const converted :ConvertedShipment= {
      // name:_values.name,
      // email:_values.email,
      // phone:_values.phone,

      customerId: _values.customerId,
      // receiver info
      receiverName: _values.receiverName,
      receiverEmail: _values.receiverEmail,
      receiverPhone: _values.receiverPhone,

      // service
      serviceType: _values.serviceType,
      fulfillmentType: _values.fulfillmentType,

      // package details
      weight: _values.weight,
      category: _values.category,
      isFragile: _values.isFragile,
      shipmentType: _values.shipmentType,
      shippingScope: _values.destination,
      // length: _values.length,
      // width: _values.width,
      // height: _values.height,

      // locations (converted to template structure)
      pickupAddress: {
        lat: String(_values.pickupLatitude),
        long: String(_values.pickupLongitude),
      },

      deliveryAddress: {
        lat: String(_values.receiverLatitude),
        long: String(_values.receiverLongitude),
      },

      // unusual item fields
      isUnusual: _values.isUnusual,
      unusualReason: _values.unusualReason,

      // extra from your input (since they exist)
      quantity: _values.quantity,
      // pickupAddressText: _values.pickupAddress,
      // deliveryAddressText: _values.receiverAddress,
      // senderName: _values.name,
      // senderPhone: _values.phone,
      // senderEntity: _values.senderEntity,
      // shippingScope: _values.destination,
      cost: _values.cost,
    };
    if(_values.shipmentType=="PARCEL"){
      converted.width= _values?.width
      converted.height= _values?.height
      converted.length= _values?.length

    }
    try {

      const res = await api.post("/pricing/order/summary", converted);
      console.log("res of create order: ", res.data);
      toast.success(res.data?.message);
      console.log("priceeeeeee: ",res.data)
      setEstimatePrice(
        Intl.NumberFormat("en-us", {
          style: "currency",
          currency: res?.data?.data?.result?.currency,
          minimumIntegerDigits: 2,
        }).format(res.data.data?.result?.finalPrice)
      );
      // const tracking = generateTrackingNumber();
      // setTrackingNumber(tracking);
      // setIsSuccessModalOpen(true);
      // resetForm();
      // setEstimatePrice("");
      setPriceLoading(false)
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error?.response?.data?.message || "Somethign went wrong!");
    } finally {
      setPriceLoading(false)
    }
   
  };

  const generateTrackingNumber = () => {
    
    const prefix = "ETB";
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    return `${prefix}${timestamp}${random}`;
  };

  const handleSubmit = async (
    _values: any,
    { resetForm }: { resetForm: () => void }
  ) => {
    console.log(
      "-----------------------------------------: ========: ",
      _values
    );
    const converted :ConvertedShipment= {
      // name:_values.name,
      // email:_values.email,
      // phone:_values.phone,

      customerId: _values.customerId,
      // receiver info
      receiverName: _values.receiverName,
      receiverEmail: _values.receiverEmail,
      receiverPhone: _values.receiverPhone,

      // service
      serviceType: _values.serviceType,
      fulfillmentType: _values.fulfillmentType,

      // package details
      weight: _values.weight,
      category: _values.category,
      isFragile: _values.isFragile,
      shipmentType: _values.shipmentType,
      shippingScope: _values.destination,
      // length: _values.length,
      // width: _values.width,
      // height: _values.height,

      // locations (converted to template structure)
      pickupAddress: {
        lat: String(_values.pickupLatitude),
        long: String(_values.pickupLongitude),
      },

      deliveryAddress: {
        lat: String(_values.receiverLatitude),
        long: String(_values.receiverLongitude),
      },

      // unusual item fields
      isUnusual: _values.isUnusual,
      unusualReason: _values.unusualReason,

      // extra from your input (since they exist)
      quantity: _values.quantity,
      // pickupAddressText: _values.pickupAddress,
      // deliveryAddressText: _values.receiverAddress,
      // senderName: _values.name,
      // senderPhone: _values.phone,
      // senderEntity: _values.senderEntity,
      // shippingScope: _values.destination,
      cost: _values.cost,
    };
    console.log("values: ", converted);
    if(_values.shipmentType=="PARCEL"){
      converted.width= _values?.width
      converted.height= _values?.height
      converted.length= _values?.length

    }
    try {
      setLoading(true);

      const res = await api.post("/order", converted);
      console.log("res of create order: ", res.data);
      toast.success(res.data?.message);
      // const tracking = generateTrackingNumber();
      setTrackingNumber(res.data.data?.trackingCode);
      setIsSuccessModalOpen(true);
      resetForm();
      setEstimatePrice("");
      
      setManagerSearch("");
      
    } catch (error: any) {
      console.log(error.response?.data);
      toast.error(error?.response?.data?.message || "Somethign went wrong!");
    } finally {
      setLoading(false);
    }
    // Generate tracking number

    // Show success modal

    // Reset form after a short delay
    // setTimeout(() => {

    // }, 1000);
  };

  const handleCloseModal = () => {
    setIsSuccessModalOpen(false);
    setTrackingNumber("");
  };

  const clearManager = (
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue("customerId", "");
    setFieldValue("managerName", "");
    setManagerSearch("");
  };

  const selectManager = (
    manager: { id: string; name: string; email: string },
    setFieldValue: (field: string, value: string) => void
  ) => {
    setFieldValue("customerId", manager.id);
    setFieldValue("managerName", manager.name);
    setManagerSearch(`${manager.name} (${manager.id})`);
    setShowManagerDropdown(false);
  };

  return (
    <div className="max-w-4xl p-6 bg-white">
      <Formik
        initialValues={initialValues}
        validationSchema={OrderValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue, errors, touched }) => (
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
                <div className="bg-gray-50  rounded-lg space-y-4">
                  <div className="relative">
                    <Label className="mb-2">Customer *</Label>
                    <div className="relative">
                      <Input
                        // type="text"
                        placeholder="Search customer "
                        value={managerSearch}
                        onChange={(e) => {
                          console.log(e.target.value);
                          setManagerSearch(e.target.value);
                          setShowManagerDropdown(true);
                          if (!e.target.value) {
                            clearManager(setFieldValue);
                          }
                        }}
                        onFocus={() => setShowManagerDropdown(true)}
                        onBlur={() =>
                          setTimeout(() => setShowManagerDropdown(false), 200)
                        }
                        className="py-7"
                      />
                      {values.customerId && (
                        <button
                          type="button"
                          onClick={() => clearManager(setFieldValue)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {showManagerDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {loadingStaff && (
                          <div className="flex justify-center items-center py-8">
                            <Spinner className="h-6 w-6 text-blue-600 mr-2" />
                          </div>
                        )}
                        {custoemr.length > 0 ? (
                          custoemr.map((manager) => (
                            <div
                              key={manager.id}
                              onClick={() =>
                                selectManager(manager, setFieldValue)
                              }
                              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                            >
                              <div className="font-medium text-gray-900">
                                {manager.name}
                              </div>
                              <div className="text-sm text-gray-600">
                                ID: {manager.id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {manager.email}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-gray-500 text-center">
                            No managers found
                          </div>
                        )}
                      </div>
                    )}
                    {errors.customerId && touched.customerId && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.customerId}
                      </div>
                    )}
                  </div>
                </div>
                {/* <div>
                  <Label className="mb-1">Name</Label>
                  <Field
                    as={Input}
                    name="name"
                    placeholder="Customer name"
                    className={`py-7 ${
                      errors.name && touched.name ? "border-red-500" : ""
                    }`}
                  />
                  {errors.name && touched.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Email</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="email"
                    placeholder="Email"
                    className={`py-7 ${
                      errors.email && touched.email ? "border-red-500" : ""
                    }`}
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
                <div> */}

                {/* <Label className="mb-1">Phone</Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    className={`py-7 ${
                      errors.phone && touched.phone ? "border-red-500" : ""
                    }`}
                  />
                  {errors.phone && touched.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div> */}
                <div>
                  <Label className="mb-1">Pickup Address</Label>
                  <MapAddressSelector
                    onAddressSelect={(addressData) => {
                      setFieldValue("pickupAddress", addressData.address);
                      setFieldValue("pickupLatitude", addressData.latitude);
                      setFieldValue("pickupLongitude", addressData.longitude);
                    }}
                    initialAddress={values.pickupAddress}
                    initialLat={values.pickupLatitude}
                    initialLng={values.pickupLongitude}
                    height="300px"
                  />
                  {errors.pickupAddress && touched.pickupAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.pickupAddress}
                    </p>
                  )}
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
                    className={`py-7 ${
                      errors.receiverName && touched.receiverName
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.receiverName && touched.receiverName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverName}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Email</Label>
                  <Field
                    as={Input}
                    type="email"
                    name="receiverEmail"
                    placeholder="Receiver email"
                    className={`py-7 ${
                      errors.receiverEmail && touched.receiverEmail
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.receiverEmail && touched.receiverEmail && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverEmail}
                    </p>
                  )}
                </div>
                <div>
                  <Label className="mb-1">Phone</Label>
                  <Field
                    as={Input}
                    type="tel"
                    name="receiverPhone"
                    placeholder="Receiver phone"
                    className={`py-7 ${
                      errors.receiverPhone && touched.receiverPhone
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors.receiverPhone && touched.receiverPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverPhone}
                    </p>
                  )}
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
                  {errors.receiverAddress && touched.receiverAddress && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.receiverAddress}
                    </p>
                  )}
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
                  <SelectTrigger
                    className={`py-7 !w-full bg-none border ${
                      errors.serviceType && touched.serviceType
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STANDARD">STANDARD</SelectItem>
                    <SelectItem value="EXPRESS">EXPRESS</SelectItem>
                    <SelectItem value="SAME_DAY">SAME DAY</SelectItem>
                    <SelectItem value="OVERNIGHT">OVERNIGHT</SelectItem>
                  </SelectContent>
                </Select>
                {errors.serviceType && touched.serviceType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.serviceType}
                  </p>
                )}
              </div>

              <div>
                <Label className="mb-1">Courier Collection Type</Label>
                <Select
                  value={values.fulfillmentType}
                  onValueChange={(val) => setFieldValue("fulfillmentType", val)}
                >
                  <SelectTrigger
                    className={`bg-none py-7 !w-full ${
                      errors.fulfillmentType && touched.fulfillmentType
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Select fulfillment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PICKUP">PICKUP</SelectItem>
                    <SelectItem value="DROPOFF">DROPOFF</SelectItem>
                  </SelectContent>
                </Select>
                {errors.fulfillmentType && touched.fulfillmentType && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.fulfillmentType}
                  </p>
                )}
              </div>
              {/* <div>
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
              </div> */}
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
                      <SelectItem value="PARCEL">PARCEL</SelectItem>
                      <SelectItem value="CARRIER">CARRIER</SelectItem>
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
                    className={`py-7 ${
                      errors.weight && touched.weight ? "border-red-500" : ""
                    }`}
                  />
                  {errors.weight && touched.weight && (
                    <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                  )}
                </div>
                {values.shipmentType === "PARCEL" ? (
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

                  <Style2
                    mode="multiple"
                    placeholder="Select category"
                    value={values.category} // Make sure this is an array
                    onChange={(val) => setFieldValue("category", val)}
                    style={{
                      width: "100%",
                      height: 56, // similar to py-7
                    }}
                  >
                    <Style2.Option value="courier">Courier</Style2.Option>
                    <Style2.Option value="food">Food</Style2.Option>
                    <Style2.Option value="chemical">Chemical</Style2.Option>
                  </Style2>
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
                    value={String(values.isUnusual)}
                    onValueChange={(val) =>
                      setFieldValue(
                        "isUnusual",
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
                {values.unusualReason ? (
                  <div className="col-span-2">
                    <Label className="mb-1">Unusuality Reason</Label>
                    <Field
                      as={Textarea}
                      cols={15}
                      name="unusualReason"
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
                    <SelectTrigger
                      className={`!w-full py-7 ${
                        errors.destination && touched.destination
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <SelectValue placeholder="Select destination" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TOWN">TOWN</SelectItem>
                      <SelectItem value="REGIONAL">REGIONAL</SelectItem>
                      <SelectItem value="INTERNATIONAL">
                        INTERNATIONAL
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.destination && touched.destination && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.destination}
                    </p>
                  )}
                </div>
              </div>
            </div>
            {/* Action buttons */}

            <div className="bg-gray-50 p-6 rounded-lg mt-6 space-y-4">
              <h2 className="text-lg font-medium mb-4">Complete order</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Label
                    className="mb-1 text-lg font-medium"
                    htmlFor="requirement"
                  >
                    Requirement Checklist
                  </Label>
                  <Checkbox className="border-gray-300 ml-2" />
                </div>
                <div className="col-span-2 grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    className="mb-1 flex flex-row justify-center items-center cursor-pointer hover:bg-blue-700"
                    onClick={() => onEstimate(values)}
                    >
                    {priceLoading?
                            <Spinner className="h-6 w-6 text-center text-white mr-2" />
                    :
                    "Generate Estimate price"}
                  </Button>

                  <Input
                    className="py-7 font-bold !text-2xl border-gray-300"
                    disabled={true}
                    value={estimatePrice}
                  />
                </div>

                <div className="col-span-2 grid grid-cols-2 gap-4 ">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="mb-1 lex flex-row justify-center items-center cursor-pointer hover:bg-blue-700"
                  >  {loading?
                    <Spinner className="h-6 w-6 text-center text-white mr-2" />
            :
            "Submit order"}
                   
                  </Button>
                  <Button
                    disabled={loading}

                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 cursor-pointer !text-black border border-gray-300 !w-full"
                  >
                    Cancel
                  </Button>
                </div>
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
