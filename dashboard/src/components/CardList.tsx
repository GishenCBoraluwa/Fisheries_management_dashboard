import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import Image from "next/image";

const popularContent = [
  {
    id: 1,
    title: "Subscription renewal",
    Badge: "Michael johnson",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 1300,
  },
  {
    id: 2,
    title: "New order",
    Badge: "Jane Smith",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 2500,
  },
  {
    id: 3,
    title: "Refund issued",
    Badge: "John Doe",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 500,
  },
  {
    id: 4,
    title: "Payment received",
    Badge: "Alice Johnson",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 1800,
  },
  {
    id: 5,
    title: "Subscription renewal",
    Badge: "Bob Smith",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 1200,
  },
];

const latestTransactions = [
  {
    id: 1,
    title: "Order #12345",
    Badge: "Completed",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 150,
  },
  {
    id: 2,
    title: "Order #12346",
    Badge: "Pending",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 75,
  },
  {
    id: 3,
    title: "Order #12347",
    Badge: "Cancelled",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 30,
  },
  {
    id: 4,
    title: "Order #12348",
    Badge: "Completed",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 200,
  },
  {
    id: 5,
    title: "Order #12349",
    Badge: "Pending",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGLRAlpUwgnA01Ksosn99mzvGi1dZEeLS0Mw&s",
    count: 90,
  },
];

const CardList = ({ title }: { title: string }) => {
  const list =
    title === "Popular Content" ? popularContent : latestTransactions;

  return (
    <div>
      <h1 className="text-lg font-medium mb-6">{title}</h1>
      <div className="flex flex-col gap-2">
        {list.map((item) => (
          <Card
            key={item.id}
            className="flex-row items-center justify-between gap-4 p-4"
          >
            <div className="w-12 h-12 rounded-sm relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="flex-1 p-0">
              <CardTitle className="text-sm font-medium">
                {item.title}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                {item.Badge}
              </Badge>
            </CardContent>
            <CardFooter className="p=0">{item.count / 1000}K</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CardList;
