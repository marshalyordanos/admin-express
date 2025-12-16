"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IoCheckmarkCircle, IoClose, IoCopy, IoQrCode } from "react-icons/io5";
import QRCode from "qrcode";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingNumber: string;
  title?: string;
  description?: string;
  trackingLabel?: string;
  qrCodeLabel?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  trackingNumber,
  title = "Order Submitted Successfully!",
  description = "Your order has been processed and is ready for pickup.",
  trackingLabel = "Tracking Number",
  qrCodeLabel = "Scan this QR code to track your order",
}: SuccessModalProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && trackingNumber) {
      // Generate QR code for the tracking number
      QRCode.toDataURL(trackingNumber, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
        .then((url) => {
          setQrCodeDataUrl(url);
        })
        .catch((err) => {
          console.error("Error generating QR code:", err);
        });
    }
  }, [isOpen, trackingNumber]);

  const handleCopyTrackingNumber = async () => {
    try {
      await navigator.clipboard.writeText(trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy tracking number:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <Card className="w-full max-w-md bg-white">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <IoClose className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <IoCheckmarkCircle className="h-10 w-10 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                {title}
              </CardTitle>
              <p className="text-gray-600 mt-2">
                {description}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tracking Number */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{trackingLabel}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyTrackingNumber}
                className="flex items-center gap-2"
              >
                <IoCopy className="h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <div className="bg-white p-3 rounded border font-mono text-lg font-bold text-center text-blue-600">
              {trackingNumber}
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center justify-center gap-2">
              <IoQrCode className="h-5 w-5" />
              QR Code
            </h3>
            <div className="bg-white p-4 rounded-lg border-2 border-dashed border-gray-200 inline-block">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="QR Code"
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 bg-gray-100 rounded flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {qrCodeLabel}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                // You can add functionality to print or share the tracking info
                window.print();
              }}
              className="flex-1"
            >
              Print Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
