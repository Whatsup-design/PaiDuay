import { Suspense } from "react";

import {
  SessionRefreshBridge,
  SessionRefreshLoading
} from "@/components/auth/session-refresh-bridge";

export default function AuthRefreshPage() {
  return (
    <Suspense fallback={<SessionRefreshLoading />}>
      <SessionRefreshBridge />
    </Suspense>
  );
}
