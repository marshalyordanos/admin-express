"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoClose, IoCheckmarkCircle, IoAdd } from "react-icons/io5";
import { Form, message, Upload } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { toast } from "react-hot-toast";
import api from "@/lib/api/api";

interface CreateDriverModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (driverData: any) => void;
}

export default function CreateDriverModal({
  isOpen,
  onClose,
  onSave,
}: CreateDriverModalProps) {
  const [form] = Form.useForm();
  const [techCertList, setTechCertList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const dummyRequest = ({ onSuccess }: any) => setTimeout(() => onSuccess("ok"), 0);

  const beforeUpload = (file: File, pdf = false) => {
    if (file.type.startsWith("image/")) return true;
    if (pdf && file.type === "application/pdf") return true;
    message.error(
      pdf ? "You can only upload image or PDF files!" : "You can only upload image files!"
    );
    return Upload.LIST_IGNORE;
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("emergencyContactName", values.emergencyContactName);
      formData.append("emergencyContactPhone", values.emergencyContactPhone);
      formData.append("role", "cmgivhwrm0000jv3sl14i5ctz");

      if (techCertList[0]?.originFileObj) {
        formData.append("licenseImages", techCertList[0].originFileObj as File);
      }

      const res = await api.post("/staff/driver", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res?.data?.message || "Driver created successfully");
      onSave(res.data);
      form.resetFields();
      setTechCertList([]);
      onClose();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <Card className="w-full max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900">Add New Driver</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
              <IoClose className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: "Full name is required" }]}
                >
                  <div>
                    <Label className="mb-2">Full Name *</Label>
                    <Input placeholder="Enter driver's full name" />
                  </div>
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Email is required" },
                    { type: "email", message: "Invalid email" },
                  ]}
                >
                  <div>
                    <Label className="mb-2">Email *</Label>
                    <Input placeholder="driver@example.com" />
                  </div>
                </Form.Item>

                <Form.Item
                  name="phone"
                  rules={[{ required: true, message: "Phone is required" }]}
                >
                  <div>
                    <Label className="mb-2">Phone Number *</Label>
                    <Input placeholder="+251 9xxxxxxxx" />
                  </div>
                </Form.Item>
              </div>
            </div>

            {/* Emergency Information */}
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-medium text-gray-900">Emergency Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  name="emergencyContactName"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <div>
                    <Label className="mb-2">Emergency Contact Name *</Label>
                    <Input placeholder="Enter contact name" />
                  </div>
                </Form.Item>

                <Form.Item
                  name="emergencyContactPhone"
                  rules={[{ required: true, message: "Required" }]}
                >
                  <div>
                    <Label className="mb-2">Emergency Contact Phone *</Label>
                    <Input placeholder="+251 9xxxxxxxx" />
                  </div>
                </Form.Item>
              </div>
            </div>

            {/* File Upload */}
            <div className="mt-6">
              <Form.Item label="Driver License" name="driverLicense">
                <Upload
                  customRequest={dummyRequest}
                  listType="picture"
                  maxCount={1}
                  fileList={techCertList}
                  onChange={({ fileList }) => setTechCertList(fileList)}
                  beforeUpload={(file) => beforeUpload(file as File, true)}
                >
                  <div className="flex gap-2 items-center cursor-pointer">
                    <IoAdd />
                    <span>Upload Driver License</span>
                  </div>
                </Upload>
              </Form.Item>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Driver...
                  </>
                ) : (
                  <>
                    <IoCheckmarkCircle className="h-4 w-4 mr-2" />
                    Create Driver
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
