"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { toast } from "sonner";

export default function Newsletter({
  title = "Get notified when new stuff drops.",
}: {
  title?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const email = formData.get("email") as string;

      await subscribeToNewsletter(email);
      toast.success("Successfully subscribed to Our newsletter!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Oops, something went wrong!",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-xl bg-zinc-900 px-8 py-8">
          <BackgroundEffect />
          <div className="flex items-center gap-8">
            <h2 className="text-2xl font-bold whitespace-nowrap">{title}</h2>
            <form onSubmit={handleSubmit} className="flex-1">
              <div className="flex gap-2">
                <Input
                  id="subscribe-form"
                  name="email"
                  className="flex-1 border-zinc-600/65 bg-zinc-700/30 text-zinc-100 placeholder:text-zinc-500 [&:-webkit-autofill]:bg-zinc-700/30 [&:-webkit-autofill]:[-webkit-text-fill-color:#fff] [&:-webkit-autofill]:[transition:background-color_5000000s_ease-in-out_0s]"
                  placeholder="Your email"
                  type="email"
                  disabled={isLoading}
                  aria-label="Subscribe to the newsletter"
                  required
                />
                <Button
                  type="submit"
                  className="group relative"
                  disabled={isLoading}
                  data-loading={isLoading}
                >
                  <span
                    className={cn(
                      "inline-flex items-center",
                      isLoading && "text-transparent",
                    )}
                  >
                    Subscribe
                    <ArrowRight
                      className="-me-1 ms-2 h-4 w-4 opacity-60 transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </span>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LoaderCircle
                        className="animate-spin"
                        size={16}
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function BackgroundEffect() {
  return (
    <div
      className="pointer-events-none absolute -right-64 -top-48"
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="856"
        height="745"
        fill="none"
      >
        <g filter="url(#ill-a)">
          <path
            fill="url(#ill-b)"
            fillRule="evenodd"
            d="m56 88 344 212-166 188L56 88Z"
            clipRule="evenodd"
          />
        </g>
        <g filter="url(#ill-c)">
          <path
            fill="url(#ill-d)"
            fillRule="evenodd"
            d="m424 257 344 212-166 188-178-400Z"
            clipRule="evenodd"
          />
        </g>
        <defs>
          <linearGradient
            id="ill-b"
            x1="210.5"
            x2="210.5"
            y1="88"
            y2="467"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.64" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient
            id="ill-d"
            x1="578.5"
            x2="578.5"
            y1="257"
            y2="636"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#fff" stopOpacity="0.64" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <filter
            id="ill-a"
            width="520"
            height="576"
            x="-32"
            y="0"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_244_5"
              stdDeviation="44"
            />
          </filter>
          <filter
            id="ill-c"
            width="520"
            height="576"
            x="336"
            y="169"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feGaussianBlur
              result="effect1_foregroundBlur_244_5"
              stdDeviation="44"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
