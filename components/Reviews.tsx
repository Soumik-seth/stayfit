import { Star } from "lucide-react";

const reviews = [
  {
    name: "Ananya Sharma",
    role: "Working Professional",
    review:
      "The personalized plan made healthy eating much easier for me. I finally feel more consistent with my daily routine.",
  },
  {
    name: "Rahul Das",
    role: "Student",
    review:
      "I loved how simple the guidance was. The plan fits around my studies and helps me stay active without feeling overwhelmed.",
  },
  {
    name: "Priya Sen",
    role: "Fitness Enthusiast",
    review:
      "StayFit helped me understand that small daily changes can make a big difference. The progress tracking keeps me motivated.",
  },
];

export default function Reviews() {
  return (
    <section className="bg-[#f8fafb] py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <div className="text-center">

          <span className="text-sm font-bold uppercase tracking-widest text-[#CAA035]">
            Client Stories
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#0C4372] sm:text-4xl">
            What People Say
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Real journeys start with small choices. Here is what our clients
            say about their StayFit experience.
          </p>

        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">

          {reviews.map((review) => (
            <div
              key={review.name}
              className="rounded-2xl bg-white p-7 shadow-sm"
            >

              <div className="flex gap-1 text-[#CAA035]">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={17}
                    fill="currentColor"
                  />
                ))}
              </div>

              <p className="mt-5 text-sm leading-7 text-gray-600">
                &quot;{review.review}&quot;
              </p>

              <div className="mt-6">
                <h3 className="font-bold text-[#0C4372]">
                  {review.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {review.role}
                </p>
              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}