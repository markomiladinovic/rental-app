export type Testimonial = {
  id: string;
  name: string;
  text: string;
  rating: number;
  activity: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Marko N.",
    text: "Fantastično iskustvo! SUP board je bio u odličnom stanju, a proces rezervacije je bio brz i jednostavan.",
    rating: 5,
    activity: "SUP Board",
  },
  {
    id: "2",
    name: "Ana J.",
    text: "Kajak za dvoje je bio savršen za naš vikend na jezeru. Sve je bilo organizovano i profesionalno.",
    rating: 5,
    activity: "Kajak",
  },
  {
    id: "3",
    name: "Stefan P.",
    text: "MTB bicikl je bio u top stanju. Staze su bile neverovatne, definitivno se vraćam!",
    rating: 5,
    activity: "MTB Bike",
  },
  {
    id: "4",
    name: "Milica S.",
    text: "Električnim biciklom smo obišli ceo grad za par sati. Preporučujem svima!",
    rating: 4,
    activity: "City Bike",
  },
];
