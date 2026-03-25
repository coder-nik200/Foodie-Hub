import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    id: 1,
    name: "Graig W",
    role: "Food Lover",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5,
    message:
      "Amazing quality and taste! The food was fresh and delivered on time. Highly recommended.",
  },
  {
    id: 2,
    name: "Kaitlin Olson",
    role: "Regular Customer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4,
    message:
      "Loved the variety and flavors. Packaging was neat and hygienic. Will order again!",
  },
  {
    id: 3,
    name: "Rahul Mehta",
    role: "Chef",
    image: "https://randomuser.me/api/portraits/men/65.jpg",
    rating: 5,
    message:
      "Premium quality ingredients and authentic taste. Perfect for quick meals.",
  },
  {
    id: 4,
    name: "Jennifer M",
    role: "Working Professional",
    image: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 5,
    message:
      "Super convenient and delicious. Makes my busy weekdays so much easier!",
  },
  {
    id: 5,
    name: "Carol D",
    role: "Fitness Enthusiast",
    image: "https://randomuser.me/api/portraits/men/41.jpg",
    rating: 4,
    message:
      "Healthy options with great taste. Portion size and freshness are impressive.",
  },
  {
    id: 6,
    name: "Ananya Joshi",
    role: "College Student",
    image: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 5,
    message:
      "Affordable, tasty, and quick delivery. Perfect for late-night cravings!",
  },
];

const Testimonials = () => {
  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-12 sm:py-14">
      {/* Heading */}
      <div className="mb-10 text-center sm:text-left">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold">
          What Our Customers Say
        </h2>
        <p className="text-gray-600 mt-2 text-sm sm:text-base">
          Trusted by thousands of happy food lovers
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {testimonials.map((item) => (
          <div
            key={item.id}
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-md hover:shadow-xl transition"
          >
            {/* User */}
            <div className="flex items-center gap-4">
              <img
                src={item.image}
                alt={item.name}
                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
              />
              <div>
                <h4 className="font-semibold text-sm sm:text-base">
                  {item.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-500">{item.role}</p>
              </div>
            </div>

            {/* Rating */}
            <div className="flex gap-1 mt-3">
              {[...Array(item.rating)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 text-sm" />
              ))}
            </div>

            {/* Message */}
            <p className="text-gray-600 mt-4 text-sm leading-relaxed line-clamp-4">
              “{item.message}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
