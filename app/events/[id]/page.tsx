import { Suspense } from "react";
import EventClient from "./EventClient";

export default function Page() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <EventClient />
    </Suspense>
  );
}
