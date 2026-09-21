import {
  Heart,
  Leaf,
  PersonStanding,
  TrendingUp,
} from "lucide-react";

const features = [
  {
    icon: PersonStanding,
    title: "For Everyone",
    description:
      "Whether you are a student, professional, sports person, or anyone looking for a healthier lifestyle.",
  },
  {
    icon: Leaf,
    title: "Personalized Plans",
    description:
      "Plans designed around your goals, food preferences, lifestyle, and everyday routine.",
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description:
      "Track your progress and see real results day by day as you build healthier habits.",
  },
  {
    icon: Heart,
    title: "Expert Support",
    description:
      "Get guidance and support to help you stay consistent throughout your wellness journey.",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="border-y border-gray-100 bg-[#f8fafb] py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">

        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.title}
              className="text-center"
            >
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0C4372]/10 text-[#0C4372]">
                <Icon size={30} strokeWidth={1.8} />
              </div>

              <h3 className="text-lg font-bold text-[#0C4372]">
                {feature.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {feature.description}
              </p>
            </div>
          );
        })}

      </div>
    </section>
  );
}