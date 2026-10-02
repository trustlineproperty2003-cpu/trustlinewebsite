"use client";

import { SqueezeCarousel, type SqueezeSlide } from "@/components/ui/carousel-squeeze";

export const settings = {
    height: 380,
    gap: 16,
    slatGap: 8,
    slatWidth: 8,
    radius: 12,
    duration: 1000,
    hoverGrow: true,
    autoplay: true,
    interval: 6000,
    controls: true,
};

type DemoProps = Partial<typeof settings>;

/** A wordmark for the corner of the open panel. */
const mark = (text: string) => (
    <span className="text-sm font-semibold tracking-wide text-white uppercase bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/20">
        {text}
    </span>
);

const slides: SqueezeSlide[] = [
    {
        id: "commercial-land",
        title: "Commercial Land in Prayagraj.",
        description:
            "High-density commercial corridors with direct highway connectivity and maximum appreciation potential.",
        action: "Explore Plots",
        href: "blogs.html#commercial-land",
        overlay: mark("Commercial"),
        image: "/images/location1.jpg",
        imageAlt: "Commercial Land in Prayagraj",
    },
    {
        id: "shankargarh",
        title: "Shankargarh Investment Plots.",
        description:
            "Fast-developing industrial & residential hub with clear title deeds and exponential value growth.",
        action: "View Details",
        href: "blogs.html#shankargarh",
        overlay: mark("Shankargarh"),
        image: "/images/location2.jpeg",
        imageAlt: "Shankargarh Plots Prayagraj",
    },
    {
        id: "chitrakoot",
        title: "Chitrakoot Growth Corridor.",
        description:
            "Strategic tourism, highway, and residential land opportunities on major connectivity routes.",
        action: "Learn More",
        href: "blogs.html#chitrakoot",
        overlay: mark("Chitrakoot"),
        image: "/images/location3.webp",
        imageAlt: "Chitrakoot Corridor",
    },
    {
        id: "agricultural-land",
        title: "Verified Agricultural Land.",
        description:
            "Fertile, verified farmland plots with complete registry, mutation, and legal verification in UP.",
        action: "Check Farmland",
        href: "blogs.html#agricultural-land",
        overlay: mark("Agriculture"),
        image: "/images/Location4.avif",
        imageAlt: "Agricultural Land Prayagraj",
    },
    {
        id: "commercial-highway",
        title: "Commercial Highway Front Land.",
        description:
            "Prime highway frontage land suitable for petrol pumps, warehouses, resorts, and commercial plazas.",
        action: "Inspect Land",
        href: "blogs.html#commercial-highway",
        overlay: mark("Highway Front"),
        image: "/images/location5.png",
        imageAlt: "Commercial Highway Front Land",
    },
];

export default function SqueezeCarouselDemo(props: DemoProps) {
    const options = { ...settings, ...props };

    return (
        <div className="bg-background w-full px-4 py-8">
            <SqueezeCarousel 
                slides={slides} 
                label="Prime Locations Across Prayagraj" 
                accent="#EBBD6D" 
                accentForeground="#171B1F" 
                {...options} 
            />
        </div>
    );
}
