import {
  Apple,
  BarChart3,
  FileText,
  Heart,
  PersonStanding,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Apple,
    title: "Balanced Diet Plan",
    description:
      "Practical and balanced meal plans created to fit your nutritional needs and lifestyle.",
  },
  {
    icon: PersonStanding,
    title: "Lifestyle Guidance",
    description:
      "Simple guidance to help you build healthier daily habits and maintain an active lifestyle.",
  },
  {
    icon: BarChart3,
    title: "Progress Tracking",
    description:
      "Keep track of your daily progress and understand how your habits are changing over time.",
  },
  {
    icon: Heart,
    title: "Expert Dietitian",
    description:
      "Receive professional guidance and support throughout your personalized wellness journey.",
  },
  {
    icon: FileText,
    title: "Easy Reports",
    description:
      "Access your diet plans, progress information, and reports in a simple and organized way.",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure",
    description:
      "Your account, personal information, progress, and diet documents are handled securely.",
  },
];

export default function WhyChoose() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">

          <span className="text-sm font-bold uppercase tracking-widest text-[#CAA035]">
            Why Choose StayFit
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#0C4372] sm:text-4xl">
            Small Steps.
            <span className="text-[#CAA035]"> Big Changes.</span>
          </h2>

          <p className="mt-4 text-gray-600">
            Your health journey does not need to be complicated. StayFit
            helps you take simple, consistent steps toward a healthier life.
          </p>

        </div>

        {/* Benefits */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

          {benefits.map((benefit) => {
            const Icon = benefit.icon;

            return (
              <div
                key={benefit.title}
                className="group rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >

                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#0C4372]/10 text-[#0C4372] transition group-hover:bg-[#CAA035] group-hover:text-white">
                  <Icon size={27} strokeWidth={1.8} />
                </div>

                <h3 className="mt-6 text-xl font-bold text-[#0C4372]">
                  {benefit.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {benefit.description}
                </p>

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}