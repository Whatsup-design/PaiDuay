"use client";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function ToastDemo() {
  return (
    <Button
      type="button"
      onClick={() =>
        toast.success("Sonner พร้อมใช้งานแล้ว", {
          description: "เรียก toast ได้จาก Client Component ผ่าน sonner",
        })
      }
    >
      ทดสอบ Toast
    </Button>
  );
}
