import { useEffect } from "react";
import { useRouter } from "next/router";

// This is a placeholder file to support the App Router version
// It redirects any requests to /product/[id] from Pages Router to the App Router implementation
export default function ProductPageRedirect() {
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    // Only redirect if id is available
    if (id) {
      // Redirect to the App Router page with the same ID
      window.location.href = `/product/${id}`;
    }
  }, [id]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        color: "#5e35b1",
      }}
    >
      Loading product...
    </div>
  );
}
