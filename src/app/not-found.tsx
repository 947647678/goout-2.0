import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-semibold text-secondary">404</h1>
      <p className="mt-4 text-text-muted">页面不存在，或许它也需要一次焕活。</p>
      <Link href="/" className="mt-8">
        <Button>返回首页</Button>
      </Link>
    </div>
  );
}
